from django.test import TestCase
from models import validate_attribute
from django.core.exceptions import ValidationError

class AttributeValidatorTests(TestCase):
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