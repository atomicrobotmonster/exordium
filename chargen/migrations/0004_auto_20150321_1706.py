# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('chargen', '0003_auto_20150321_1651'),
    ]

    operations = [
        migrations.AddField(
            model_name='character',
            name='unassigned_attribute_points',
            field=models.PositiveIntegerField(default=4),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='character',
            name='last_changed',
            field=models.DateTimeField(default=datetime.datetime(2015, 3, 21, 17, 6, 21, 700692, tzinfo=utc)),
            preserve_default=True,
        ),
    ]
