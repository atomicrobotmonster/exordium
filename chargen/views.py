from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView
from rest_framework import status
from django.http import Http404
from rest_framework.response import Response
from models import UserProfile, Character
from serializers import UserProfileSerializer, UserProfileUpsertSerializer, CharacterSummarySerializer, CharacterSerializer
from rest_framework import generics


class UserProfileCreateView(APIView):
    """Custom view for upserting User Profiles"""
   
    permission_classes=(AllowAny, )

    def post(self, request):
        serializer = UserProfileUpsertSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

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
   
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, user_profile_id):
        user_profile = get_user_profile(user_profile_id)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

class CharacterListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, user_profile_id):
        user_profile = get_user_profile(user_profile_id)
        serializer = CharacterSummarySerializer(user_profile.character_set, many=True)
        return Response(serializer.data)

class CharacterDetailView(generics.RetrieveAPIView):
    """Generic view for retrieving character details"""
   
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer

