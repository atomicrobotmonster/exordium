from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.conf import settings


class UserProfileManager(models.Manager):

    def create(self, username, password, email, first_name, last_name):
        user = get_user_model()()
        user.username = username
        user.set_password(password)
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        user_profile = UserProfile()
        user_profile.user = user
        user_profile.save()

        return user_profile


class UserProfile(models.Model):

    """Uses this character generator; has characters"""
    objects = UserProfileManager()
    user = models.OneToOneField(settings.AUTH_USER_MODEL)

    def __unicode__(self):
        return self.name()

    def name(self):
        return self.user.first_name + " " + self.user.last_name


def validate_attribute(value):
    """Validator for attribute value range"""
    if value < -1 or value > 5:
        raise ValidationError(
            u'%s is outside range of valid attribute values (-1 to 5)' % value)


def validate_attribute(value):
    """Validator for attribute value range"""
    if value < -1 or value > 5:
        raise ValidationError(
            u'%s is outside range of valid attribute values (-1 to 5)' % value)


class Character(models.Model):

    """Barbarians of Lemuria Character"""
    name = models.CharField(max_length=200)
    user_profile = models.ForeignKey(UserProfile, related_name='characters')
    unassigned_attribute_points = models.PositiveIntegerField(default=4)
    strength = models.IntegerField(validators=[validate_attribute], default=0)
    agility = models.IntegerField(validators=[validate_attribute], default=0)
    mind = models.IntegerField(validators=[validate_attribute], default=0)
    appeal = models.IntegerField(validators=[validate_attribute], default=0)
    last_changed = models.DateTimeField(default=timezone.now())

    def __unicode__(self):
        return self.name
