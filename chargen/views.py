from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from models import UserProfile, Character
from serializers import UserProfileSerializer, CharacterSummarySerializer

def get_user_profile(user_profile_id):
    try:
        return UserProfile.objects.get(id=user_profile_id)
    except UserProfile.DoesNotExist:
        raise Http404

class UserProfileDetailView(APIView):
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
