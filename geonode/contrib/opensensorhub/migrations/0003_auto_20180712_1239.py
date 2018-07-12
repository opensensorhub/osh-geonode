# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('opensensorhub', '0002_auto_20180703_1946'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('parent', models.ForeignKey(related_name='children', blank=True, to='opensensorhub.Category', null=True)),
            ],
            options={
                'verbose_name_plural': 'categories',
            },
        ),
        migrations.RemoveField(
            model_name='textstyler',
            name='location',
        ),
        migrations.AddField(
            model_name='textstyler',
            name='screen_position',
            field=models.CharField(default=b'4', max_length=1, choices=[(b'0', b'TOP_LEFT'), (b'1', b'TOP_CENTER'), (b'2', b'TOP_RIGHT'), (b'3', b'LEFT'), (b'4', b'CENTER'), (b'5', b'RIGHT'), (b'6', b'BOTTOM_LEFT'), (b'7', b'BOTTOM_CENTER'), (b'8', b'BOTTOM_RIGHT')]),
        ),
        migrations.AddField(
            model_name='chartstyler',
            name='category',
            field=models.ForeignKey(blank=True, to='opensensorhub.Category', null=True),
        ),
        migrations.AddField(
            model_name='hub',
            name='category',
            field=models.ForeignKey(blank=True, to='opensensorhub.Category', null=True),
        ),
        migrations.AddField(
            model_name='locationindicator',
            name='category',
            field=models.ForeignKey(blank=True, to='opensensorhub.Category', null=True),
        ),
        migrations.AddField(
            model_name='observation',
            name='category',
            field=models.ForeignKey(blank=True, to='opensensorhub.Category', null=True),
        ),
        migrations.AddField(
            model_name='oshlayer',
            name='category',
            field=models.ForeignKey(blank=True, to='opensensorhub.Category', null=True),
        ),
        migrations.AddField(
            model_name='textstyler',
            name='category',
            field=models.ForeignKey(blank=True, to='opensensorhub.Category', null=True),
        ),
        migrations.AddField(
            model_name='videoview',
            name='category',
            field=models.ForeignKey(blank=True, to='opensensorhub.Category', null=True),
        ),
        migrations.AddField(
            model_name='view',
            name='category',
            field=models.ForeignKey(blank=True, to='opensensorhub.Category', null=True),
        ),
        migrations.AlterUniqueTogether(
            name='category',
            unique_together=set([('name', 'parent')]),
        ),
    ]
