from rest_framework import permissions
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, viewsets, status
from django.http import Http404
from django.db import transaction, IntegrityError
from models import UserProfile, Character
from serializers import UserProfileSerializer, UserProfileUpsertSerializer, CharacterSummarySerializer, CharacterSerializer
 
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
        print("checking IsAuthenticatedUserForUserProfile permission for {} on {}").format(request.user, obj.user)

        result = obj.user == request.user
        return result

class IsUserForCharacter(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        print("checking IsAuthenticatedUserForCharacter permission for {} on {}").format(request.user, obj.user_profile.user)

        return obj.user_profile.user == request.user        

class UserProfileCreateView(APIView):
    """Custom view for upserting User Profiles"""
   
    permission_classes=(AllowAny, )

    def post(self, request):
        """Register a new user by atomically creating a User and associated UserProfile."""
        
        serializer = UserProfileUpsertSerializer(data=request.data)
        
        try:
            with transaction.atomic():
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_201_CREATED)
        
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response({ 'detail': 'User already exists.'}, status=status.HTTP_409_CONFLICT)


class CurrentUserProfileDetailView(APIView):
    """Custom view retrieving the user profile for the currently authenticated user."""
    
    authentication_classes = (QuietBasicAuthentication, )
    permission_classes=(IsAuthenticated, )
    serializer_class = UserProfileSerializer

    def get(self, request):
        """Gets the user profile for the currently authenticated user."""
       
        user_profile = request.user.userprofile
        return Response(self.serializer_class(user_profile).data)


class UserProfileDetailView(generics.RetrieveAPIView):
    authentication_classes = (QuietBasicAuthentication, )
    permission_classes = (IsAuthenticated, IsUserForUserProfile, )
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()
    lookup_field = 'id'

class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSerializer
    permission_classes = (IsAuthenticated, IsUserForCharacter, )
    authentication_classes = (QuietBasicAuthentication, )

    def get_queryset(self):
        user = self.request.user
        return Character.objects.filter(user_profile = user.userprofile)
