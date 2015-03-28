from rest_framework import serializers
from models import UserProfile, Character


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'name')

class CharacterSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ('id', 'name')