# Generated by Django 5.2.3 on 2025-01-27 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0007_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='display_name',
            field=models.CharField(blank=True, help_text='Tên hiển thị của người dùng', max_length=100),
        ),
    ]
