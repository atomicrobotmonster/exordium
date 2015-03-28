from rest_framework import serializers
from models import UserProfile, Character


class UserProfileSerializer(serializers.ModelSerializer):
    characters = serializers.PrimaryKeyRelatedField(many=True, queryset=Character.objects.all())

    class Meta:
        model = UserProfile
        fields = ('name', 'characters')

class CharacterSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ('name')

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ('name', 'unassigned_attribute_points', 'strength', 'agility', 'mind', 'appeal')