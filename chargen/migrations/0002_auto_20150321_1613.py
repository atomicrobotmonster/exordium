# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('chargen', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='last_changed',
            field=models.DateTimeField(default=datetime.datetime(2015, 3, 21, 16, 13, 6, 498329, tzinfo=utc)),
            preserve_default=True,
        ),
    ]
