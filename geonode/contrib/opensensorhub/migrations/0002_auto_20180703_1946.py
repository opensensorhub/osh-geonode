# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('opensensorhub', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='videoview',
            old_name='keepRatio',
            new_name='keep_ratio',
        ),
        migrations.AddField(
            model_name='textstyler',
            name='data_source',
            field=models.CharField(default=b'', max_length=200),
        ),
        migrations.AddField(
            model_name='videoview',
            name='data_source',
            field=models.CharField(default=b'', max_length=200),
        ),
        migrations.AlterField(
            model_name='chartstyler',
            name='range_mode',
            field=models.CharField(default=b'0', max_length=1, choices=[(b'0', b'Fixed Ranges'), (b'1', b'X-Axis Dynamic'), (b'2', b'Y-Axis Dynamic'), (b'3', b'All Axes Dynamic')]),
        ),
        migrations.AlterField(
            model_name='observation',
            name='buffering_time',
            field=models.IntegerField(default=500, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='observation',
            name='end_time',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='observation',
            name='layer',
            field=models.ForeignKey(blank=True, to='opensensorhub.OSHLayer', null=True),
        ),
        migrations.AlterField(
            model_name='observation',
            name='service',
            field=models.CharField(default=b'0', max_length=1, choices=[(b'0', b'SOS'), (b'1', b'SPS')]),
        ),
        migrations.AlterField(
            model_name='observation',
            name='start_time',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='observation',
            name='time_shift',
            field=models.IntegerField(default=0),
        ),
    ]
