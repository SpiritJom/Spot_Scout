# Generated by Django 4.2.13 on 2024-09-16 11:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_alter_onetimepassword_expires_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='onetimepassword',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 16, 11, 16, 40, 124630, tzinfo=datetime.timezone.utc)),
        ),
    ]
