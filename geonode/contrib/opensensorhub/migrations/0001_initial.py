# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ChartStyler',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('keywords', models.CharField(max_length=200)),
                ('timeout', models.IntegerField()),
                ('styler_type', models.CharField(max_length=200)),
                ('data_source_x', models.CharField(max_length=200)),
                ('data_source_y', models.CharField(max_length=200)),
                ('label_x', models.CharField(max_length=200)),
                ('label_y', models.CharField(max_length=200)),
                ('color_mode', models.CharField(default=b'0', max_length=1, choices=[(b'0', b'FIXED'), (b'1', b'THRESHOLD'), (b'2', b'COLORMAP')])),
                ('range_mode', models.CharField(default=b'0', max_length=1, choices=[(b'0', b'ALL_FIXED'), (b'1', b'X_DYNAMIC'), (b'2', b'Y_DYNAMIC'), (b'3', b'ALL_DYNAMIC')])),
                ('range_x', models.FloatField()),
                ('range_y', models.FloatField()),
                ('max_points', models.IntegerField()),
                ('color_rgb', models.CharField(max_length=200)),
                ('thresholds', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Hub',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('keywords', models.CharField(max_length=200)),
                ('url', models.URLField()),
                ('protocol', models.CharField(default=b'2', max_length=1, choices=[(b'0', b'HTTP'), (b'1', b'HTTPS'), (b'2', b'WS'), (b'3', b'WSS')])),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LocationIndicator',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('keywords', models.CharField(max_length=200)),
                ('timeout', models.IntegerField()),
                ('styler_type', models.CharField(max_length=200)),
                ('data_source_lat', models.CharField(max_length=200)),
                ('data_source_lon', models.CharField(max_length=200)),
                ('data_source_alt', models.CharField(max_length=200)),
                ('view_icon', models.URLField()),
                ('render_mode', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Observation',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('keywords', models.CharField(max_length=200)),
                ('endpoint', models.URLField()),
                ('offering', models.CharField(max_length=200)),
                ('observed_property', models.URLField()),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('sync_master_time', models.BooleanField(default=False)),
                ('buffering_time', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('time_shift', models.IntegerField()),
                ('source_type', models.CharField(max_length=200)),
                ('replay_speed', models.CharField(default=b'2', max_length=1, choices=[(b'0', b'QUARTER'), (b'1', b'HALF'), (b'2', b'NORMAL'), (b'3', b'DOUBLE'), (b'4', b'QUAD')])),
                ('service', models.IntegerField(default=(0,), validators=[django.core.validators.MinValueValidator((0,)), django.core.validators.MaxValueValidator((0,))])),
                ('protocol', models.CharField(default=b'2', max_length=1, choices=[(b'0', b'HTTP'), (b'1', b'HTTPS'), (b'2', b'WS'), (b'3', b'WSS')])),
                ('hub', models.ForeignKey(to='opensensorhub.Hub')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OSHLayer',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('keywords', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TextStyler',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('keywords', models.CharField(max_length=200)),
                ('timeout', models.IntegerField()),
                ('styler_type', models.CharField(max_length=200)),
                ('location', models.CharField(max_length=200)),
                ('color_mode', models.CharField(default=b'0', max_length=1, choices=[(b'0', b'FIXED'), (b'1', b'THRESHOLD'), (b'2', b'COLORMAP')])),
                ('color_rgb', models.CharField(max_length=200)),
                ('thresholds', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='VideoView',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('keywords', models.CharField(max_length=200)),
                ('timeout', models.IntegerField()),
                ('styler_type', models.CharField(max_length=200)),
                ('draggable', models.BooleanField(default=False)),
                ('show', models.BooleanField(default=False)),
                ('dockable', models.BooleanField(default=False)),
                ('closeable', models.BooleanField(default=False)),
                ('keepRatio', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='View',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('keywords', models.CharField(max_length=200)),
                ('sensor_archetype', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='videoview',
            name='view',
            field=models.ForeignKey(blank=True, to='opensensorhub.View', null=True),
        ),
        migrations.AddField(
            model_name='textstyler',
            name='view',
            field=models.ForeignKey(blank=True, to='opensensorhub.View', null=True),
        ),
        migrations.AddField(
            model_name='observation',
            name='layer',
            field=models.ForeignKey(to='opensensorhub.OSHLayer'),
        ),
        migrations.AddField(
            model_name='observation',
            name='view',
            field=models.ForeignKey(blank=True, to='opensensorhub.View', null=True),
        ),
        migrations.AddField(
            model_name='locationindicator',
            name='view',
            field=models.ForeignKey(blank=True, to='opensensorhub.View', null=True),
        ),
        migrations.AddField(
            model_name='chartstyler',
            name='view',
            field=models.ForeignKey(blank=True, to='opensensorhub.View', null=True),
        ),
    ]
