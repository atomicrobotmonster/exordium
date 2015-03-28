from rest_framework import serializers\
from chargen import UserProfile

class UserProileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'title', 'code', 'linenos', 'language', 'style')