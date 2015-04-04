from rest_framework import serializers
from models import UserProfile, Character
from django.conf import settings
from django.contrib.auth import get_user_model

CHARACTER_GENERATION_ATTRIBUTE_POINTS = 4

#TODO having two serializers for UserProfile violates the DRY-principle
class UserProfileUpsertSerializer(serializers.Serializer):
    """Upsert specific serialier to ensure Users and UserProfile are created together."""

    username = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=200)
    first_name = serializers.CharField(max_length=200)
    last_name = serializers.CharField(max_length=200)

    
    def create(self, validated_data):
        """
        Atomically create User and UserProfile.

        TODO this could be re-written using a Manager per http://www.django-rest-framework.org/api-guide/serializers/#modelserializer
        see "Handling saving related instances in model manager classes"
        """
        user = get_user_model()()
        user.username = validated_data['username']
        user.set_password(validated_data['password'])
        user.email = validated_data['email']
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.save()

        user_profile = UserProfile()
        user_profile.user = user
        #user_profile.name = user.first_name + ' ' + user.last_name
        user_profile.save()

        return user_profile

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for User Profile.

    TODO can this be merged with the UserProfileUpsert serializer?
    """
    characters = serializers.PrimaryKeyRelatedField(many=True, queryset=Character.objects.all())

    class Meta:
        model = UserProfile
        fields = ('name', 'characters')

class CharacterSummarySerializer(serializers.ModelSerializer):
    """Serializer for summaries of Characters"""
    class Meta:
        model = Character
        fields = ('id', 'name', )

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ('id', 'name', 'user_profile', 'unassigned_attribute_points', 'strength', 'agility', 'mind', 'appeal')

    def validate(self,data):
        """
        Check the user isn't adding extra attributes points.
        """
        total_points = data['unassigned_attribute_points'] + data['strength'] + data['agility'] + data['appeal'] + data['mind']
        if total_points != CHARACTER_GENERATION_ATTRIBUTE_POINTS:
            raise serializers.ValidationError("Character Generation Attriube Points must equal {0} ".format(CHARACTER_GENERATION_ATTRIBUTE_POINTS))
        return data