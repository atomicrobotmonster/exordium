from django.test import TestCase
from models import validate_attribute, UserProfile, Character
from django.core.exceptions import ValidationError


class AttributeValidatorTest(TestCase):

    """Attribute validator should only permit values of -1 to 5 inclusive."""

    def test_validate_attribute_below_range(self):
        with self.assertRaises(ValidationError):
            validate_attribute(-2)

    def test_attribute_above_range(self):
        with self.assertRaises(ValidationError):
            validate_attribute(6)

    def test_attribute_lower_threshold(self):
        validate_attribute(-1)

    def test_attribute_upper_threshold(self):
        validate_attribute(5)


class UserProfileTest(TestCase):

    def setUp(self):
        user_1 = UserProfile.objects.create(
            username='testuser1', password='letmein', email='tes1t@example.org', first_name='Testy One', last_name='de User')
        user_1.characters.create(name='Kegan')
        user_1.characters.create(name='Torquil')
        user_1.characters.create(name='Princess Lyssa')

        user_2 = UserProfile.objects.create(
            username='testuser2', password='1234', email='test2@example.org', first_name='Testy Two', last_name='de User')
        user_2.characters.create(name='Princess Aura')
        user_2.characters.create(name='Ming the Merciless')

        user_3 = UserProfile.objects.create(
            username='testuser3', password='birthday', email='test3@example.org', first_name='Testy Three', last_name='de User')
        user_3.characters.create(name='Valerian')
        user_3.characters.create(name='Galen')

        self.user_count = 3

    def test_naive_user_profile_and_character_retrieve(self):

        with self.assertNumQueries(1):
            found_users = list(
                UserProfile.objects.order_by('user__username').all())

        # found_user_profile.user will cause related User to be lazy-loaded
        with self.assertNumQueries(1):
            self.assertEquals('testuser1', found_users[0].user.username)

        # found_user_profile.characters will also be lazy loaded at this point
        with self.assertNumQueries(self.user_count):
            for found_user in found_users:
                list(found_user.characters.all())

    def test_optimized_user_profile_and_character_retrieve(self):

        # using select related to ensure user is joined with user_profile
        with self.assertNumQueries(2):
            found_users = list(UserProfile.objects.select_related(
                'user').prefetch_related('characters').order_by('user__username').all())

        # found_user_profile.user is already loaded by select_related('user')
        with self.assertNumQueries(0):
            self.assertEquals('testuser1', found_users[0].user.username)

        # found_user_profile.characters is already loaded thanks to
        # prefetch_related('characters')
        with self.assertNumQueries(0):
            for found_user in found_users:
                list(found_user.characters.all())
