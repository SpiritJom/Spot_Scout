# Generated by Django 5.0.6 on 2024-09-16 09:36

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_alter_onetimepassword_expires_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='onetimepassword',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 16, 9, 37, 59, 291422, tzinfo=datetime.timezone.utc)),
        ),
    ]
