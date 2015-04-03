from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.conf import settings

class UserProfile(models.Model):
    """Uses this character generator; has characters"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

def validate_attribute(value):
    """Validator for attribute value range"""
    if value < -1 or value > 5:
        raise ValidationError(u'%s is outside range of valid attribute values (-1 to 5)' % value)

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

