from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, mixins, status
from django.http import Http404
from django.db import transaction, IntegrityError
from models import UserProfile, Character
from serializers import UserProfileSerializer, UserProfileUpsertSerializer, CharacterSummarySerializer, CharacterSerializer


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

def get_user_profile(user_profile_id):
    """Utility function for retrieving a user profile or raising an HTTP 404.

    user_profile_id -- PK of UserProfile to retrieve
    """
    try:
        return UserProfile.objects.get(id=user_profile_id)
    except UserProfile.DoesNotExist:
        raise Http404

class UserProfileDetailView(APIView):
    """Custom view for retrieving user details"""
   
    permission_classes = (IsAuthenticated,)

    def get(self, request, user_profile_id):
        user_profile = get_user_profile(user_profile_id)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

class UserProfileCharacterListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, user_profile_id):
        user_profile = get_user_profile(user_profile_id)
        serializer = CharacterSummarySerializer(user_profile.characters, many=True)
        return Response(serializer.data)

class CharacterDetailView(mixins.CreateModelMixin, 
                          mixins.UpdateModelMixin,
                          mixins.RetrieveModelMixin,
                          generics.GenericAPIView):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class CharacterListView(mixins.CreateModelMixin,
                        generics.GenericAPIView):

    queryset = Character.objects.all()
    serializer_class = CharacterSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
