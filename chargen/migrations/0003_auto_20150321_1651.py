# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
import chargen.models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('chargen', '0002_auto_20150321_1613'),
    ]

    operations = [
        migrations.AddField(
            model_name='character',
            name='agility',
            field=models.IntegerField(default=0, validators=[chargen.models.validate_attribute]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='character',
            name='appeal',
            field=models.IntegerField(default=0, validators=[chargen.models.validate_attribute]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='character',
            name='mind',
            field=models.IntegerField(default=0, validators=[chargen.models.validate_attribute]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='character',
            name='strength',
            field=models.IntegerField(default=0, validators=[chargen.models.validate_attribute]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='character',
            name='last_changed',
            field=models.DateTimeField(default=datetime.datetime(2015, 3, 21, 16, 51, 29, 460889, tzinfo=utc)),
            preserve_default=True,
        ),
    ]
