from rest_framework import serializers
from models import UserProfile, Character
from django.conf import settings
from django.contrib.auth import get_user_model

#TODO having two serializers for UserProfile violates the DRY-principle
class UserProfileUpsertSerializer(serializers.Serializer):
    """Upsert specific serialier to ensure Users and UserProfile are created together."""

    username = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=200)
    first_name = serializers.CharField(max_length=200)
    last_name = serializers.CharField(max_length=200)

    #TODO this could be re-written using a Manager per http://www.django-rest-framework.org/api-guide/serializers/#modelserializer
    #see "Handling saving related instances in model manager classes"
    def create(self, validated_data):
        user = get_user_model()()
        user.username = validated_data['username']
        user.set_password(validated_data['password'])
        user.email = validated_data['email']
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.save()

        user_profile = UserProfile()
        user_profile.user = user
        user_profile.name = user.first_name + ' ' + user.last_name
        user_profile.save()

        return user_profile

#TODO can this be merged with the UserProfileUpsert serializer?
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
        fields = ('name', 'user_profile', 'unassigned_attribute_points', 'strength', 'agility', 'mind', 'appeal')