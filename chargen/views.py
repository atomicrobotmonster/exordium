from rest_framework import permissions
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, viewsets, status
from django.db import transaction, IntegrityError
from models import UserProfile, Character
from serializers import UserProfileSerializer, UserProfileUpsertSerializer, CharacterSummarySerializer, CharacterSerializer
import logging

print 'logger: ' + __name__

logger = logging.getLogger(__name__)


class QuietBasicAuthentication(BasicAuthentication):

    """
    We need to replace the standard "Basic ..." header with a custom scheme
    to prevent the browser unhelpfully prompting with a native dialog when
    valid credentials are required and have not been supplied.

    Thanks to http://richardtier.com/2014/03/06/110/ for the solution.
    """

    def authenticate_header(self, request):
        return 'xBasic realm="%s"' % self.www_authenticate_realm


class IsUserForUserProfile(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        logger.debug("checking IsAuthenticatedUserForUserProfile permission for {} on {}".format(
            request.user, obj.user))

        result = obj.user == request.user
        return result


class IsUserForCharacter(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        logger.debug("checking IsAuthenticatedUserForCharacter permission for {} on {}".format(
            request.user, obj.user_profile.user))

        return obj.user_profile.user == request.user


class UserProfileCreateView(generics.CreateAPIView):

    """Custom view for upserting User Profiles"""

    permission_classes = (AllowAny, )
    serializer_class = UserProfileUpsertSerializer

    def create(self, request,  *args, **kwargs):
        """Register a new user by atomically creating a User and associated UserProfile.

        NB: This view is custom because we really don't want to be serializing the password
        back to the caller.
        """

        request_serializer = self.get_serializer(data=request.data)

        with transaction.atomic():
            if request_serializer.is_valid():
                user_profile = request_serializer.save()
                return Response(UserProfileSerializer(user_profile).data, status=status.HTTP_201_CREATED)

            return Response(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserProfileDetailView(generics.RetrieveAPIView):

    """Retrieves the user profile for the currently authenticated user."""

    authentication_classes = (QuietBasicAuthentication, )
    permission_classes = (IsAuthenticated, )
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user.userprofile


class UserProfileDetailView(generics.RetrieveAPIView):
    authentication_classes = (QuietBasicAuthentication, )
    permission_classes = (IsAuthenticated, IsUserForUserProfile, )
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.select_related('user').all()
    lookup_field = 'id'


class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSerializer
    permission_classes = (IsAuthenticated, IsUserForCharacter, )
    authentication_classes = (QuietBasicAuthentication, )

    def get_queryset(self):
        user = self.request.user
        return Character.objects.filter(user_profile=user.userprofile)
