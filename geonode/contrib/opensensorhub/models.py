# -*- coding: utf-8 -*-
#########################################################################
#
# Copyright (C) 2018 OpenSensorHub.org - www.opensensorhub.org
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################
from django.db import models
from django.core import validators

from colorful.fields import RGBColorField

COLOR_MODE_CHOICES = (
    ('0', 'FIXED'),
    ('1', 'THRESHOLD'),
    ('2', 'COLORMAP'),
)

PROTOCOL_TYPE_CHOICES = (
    ('0', 'HTTP'),
    ('1', 'HTTPS'),
    ('2', 'WS'),
    ('3', 'WSS'),
)


# ------------------------------------------------------------------------------
# Category
#
# Model representing recursive ontology of OSH model objects
# ------------------------------------------------------------------------------
class Category(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('self', blank=True, null=True, related_name='children')

    class Meta:
        unique_together = ('name', 'parent')
        verbose_name_plural = 'categories'

    def __str__(self):
        full_path = [self.name]

        k = self.parent

        while k is not None:
            full_path.append(k.name)
            k = k.parent

        return ' -> '.join(full_path[::-1])


# ------------------------------------------------------------------------------
# OshModel
#
# Model representing an OSH the base OSH Model
# ------------------------------------------------------------------------------
class OshModel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    keywords = models.CharField(max_length=200)
    category = models.ForeignKey(Category, blank=True, null=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


# ------------------------------------------------------------------------------
# Hub
#
# Model representation for an OpenSensorHub Instance
# ------------------------------------------------------------------------------
class Hub(OshModel):

    url = models.URLField(max_length=200)
    protocol = models.CharField(max_length=1, choices=PROTOCOL_TYPE_CHOICES, default='2')


# ------------------------------------------------------------------------------
# SweService
#
# Model representation for Sensor Web Enablement Service
# ------------------------------------------------------------------------------
class SweService(models.Model):
    SERVICE_CHOICES = (
        ('0', 'SOS'),
        ('1', 'SPS'),
    )

    service = models.CharField(max_length=1, default='0', choices=SERVICE_CHOICES)

    class Meta:
        abstract = True


# ------------------------------------------------------------------------------
# Observation
#
# Model representation for OSH Observations
# ------------------------------------------------------------------------------
class Observation(OshModel, SweService):

    REPLAY_SPEED_CHOICES = (
        ('0', 'QUARTER'),
        ('1', 'HALF'),
        ('2', 'NORMAL'),
        ('3', 'DOUBLE'),
        ('4', 'QUAD'),
    )

    hub = models.ForeignKey(Hub, on_delete=models.CASCADE)
    # TODO: If we upgrade to django 1.9 or newer we can use JSONFields
    get_result_json = models.FileField(max_length=200, default="")
    endpoint = models.URLField(max_length=200)
    offering = models.CharField(max_length=200)
    observed_property = models.URLField(max_length=200)
    start_time = models.CharField(max_length=200)
    end_time = models.CharField(max_length=200)
    sync_master_time = models.BooleanField(default=False)
    buffering_time = models.IntegerField(validators=[validators.MinValueValidator(0)], null=False, default=500)
    time_shift = models.IntegerField(null=False, default=0)
    source_type = models.CharField(max_length=200)
    replay_speed = models.CharField(max_length=1, choices=REPLAY_SPEED_CHOICES, default='2')
    protocol = models.CharField(max_length=1, choices=PROTOCOL_TYPE_CHOICES, default='2')


# ------------------------------------------------------------------------------
# Offering
#
# Model representing an OSH Offering
# ------------------------------------------------------------------------------
class Offering(OshModel):

    OFFERING_TYPE_CHOICES = (
        ('0', 'Observation'),
        ('1', 'Command')
    )

    # Hub - points to the hub/node of origin
    hub = models.ForeignKey(Hub, on_delete=models.CASCADE)

    # Endpoint describes the target for requesting the offering on the hub/node
    endpoint = models.URLField(max_length=200)

    # The unique id of the procedure
    procedure = models.CharField(max_length=200)

    # The type of offering, see above.
    offering_type = models.CharField(max_length=1, choices=OFFERING_TYPE_CHOICES, default='0')


# ------------------------------------------------------------------------------
# View
#
# Model representing an OSH View
# ------------------------------------------------------------------------------
class View(OshModel):
    observations = models.ManyToManyField(Observation, blank=True)
    draggable = models.BooleanField(default=False)
    show = models.BooleanField(default=False)
    dockable = models.BooleanField(default=False)
    closeable = models.BooleanField(default=False)
    can_disconnect = models.BooleanField(default=False)
    swap_id = models.CharField(max_length=200, default='')
    container_id = models.CharField(max_length=200, default='')


# ------------------------------------------------------------------------------
# Layer
#
# Model representing an OSH Layer
# ------------------------------------------------------------------------------
class Layer(OshModel):
    views = models.ManyToManyField(View)


# ------------------------------------------------------------------------------
# Styler
#
# Model representing an OSH Styler
# ------------------------------------------------------------------------------
class Styler(OshModel):
    STYLER_TYPE_CHOICES = (
        ('0', 'UNDEFINED'),
        ('1', 'TEXT STYLER'),
        ('2', 'POINT MARKER STYLER'),
        ('3', 'CHART STYLER'),
        ('4', 'VIDEO STYLER')
    )

    view = models.OneToOneField(View, on_delete=models.SET_NULL, null=True, blank=True)
    binding = models.FileField(upload_to='opensensorhub', max_length=200, blank=True)

    class Meta:
        abstract = True


# ------------------------------------------------------------------------------
# TextStyler
#
# Model representing an OSH Text Styler
# ------------------------------------------------------------------------------
class TextStyler(Styler):
    SCREEN_POSITION_CHOICES = (
        ('0', 'TOP LEFT'),
        ('1', 'TOP CENTER'),
        ('2', 'TOP RIGHT'),
        ('3', 'LEFT'),
        ('4', 'CENTER'),
        ('5', 'RIGHT'),
        ('6', 'BOTTOM LEFT'),
        ('7', 'BOTTOM CENTER'),
        ('8', 'BOTTOM RIGHT')
    )

    screen_position = models.CharField(max_length=1, choices=SCREEN_POSITION_CHOICES, default='4')
    color_mode = models.CharField(max_length=1, choices=COLOR_MODE_CHOICES, default='0')
    # Treat these strings as arrays of integers, will need to be converted to arrays when read
    # and strings when stored
    color_rgb = RGBColorField(colors=['#FF0000', '#00FF00', '#0000FF'], default='#000000')
    thresholds = models.CharField(max_length=200, blank=True)
    type = models.CharField(max_length=1, choices=Styler.STYLER_TYPE_CHOICES, default='1')


# ------------------------------------------------------------------------------
# PointMarkerStyler
#
# Model representing an OSH Location Indicator Styler
# ------------------------------------------------------------------------------
class PointMarkerStyler(Styler):
    view_icon = models.FileField(upload_to='opensensorhub', max_length=200, blank=True, default="marker_icon.png")
    render_mode = models.CharField(max_length=200, blank=True)
    type = models.CharField(max_length=1, choices=Styler.STYLER_TYPE_CHOICES, default='2')


# ------------------------------------------------------------------------------
# ChartStyler
#
# Model representing an OSH Location Chart Styler
# ------------------------------------------------------------------------------
class ChartStyler(Styler):
    RANGE_MODE_CHOICES = (
        ('0', 'Fixed Ranges'),
        ('1', 'X-Axis Dynamic'),
        ('2', 'Y-Axis Dynamic'),
        ('3', 'All Axes Dynamic')
    )

    label_x = models.CharField(max_length=200)
    label_y = models.CharField(max_length=200)
    color_mode = models.CharField(max_length=1, choices=COLOR_MODE_CHOICES, default='0')
    range_mode = models.CharField(max_length=1, choices=RANGE_MODE_CHOICES, default='0')
    range_x = models.FloatField(blank=True, null=True)
    range_y = models.FloatField(blank=True, null=True)
    max_points = models.IntegerField()
    # Treat these strings as arrays of integers, will need to be converted to arrays when read
    # and strings when stored
    color_rgb = RGBColorField(colors=['#FF0000', '#00FF00', '#0000FF'], default='#000000')
    thresholds = models.CharField(max_length=200, blank=True)
    type = models.CharField(max_length=1, choices=Styler.STYLER_TYPE_CHOICES, default='3')


# ------------------------------------------------------------------------------
# VideoStyler
#
# Model representing an OSH Location Video View Styler
# ------------------------------------------------------------------------------
class VideoStyler(Styler):
    keep_ratio = models.BooleanField(default=False)
    type = models.CharField(max_length=1, choices=Styler.STYLER_TYPE_CHOICES, default='4')

