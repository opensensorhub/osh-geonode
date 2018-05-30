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
from tastypie.resources import ModelResource
from models import *


class HubResource(ModelResource):
    class Meta:
        queryset = Hub.objects.all()
        resource_name = 'hub'
        # Note: These are fields to exclude from being exposed by the API
        excludes = []


class ObservationResource(ModelResource):
    class Meta:
        queryset = Observation.objects.all()
        resource_name = 'observation'
        # Note: These are fields to exclude from being exposed by the API
        excludes = []


class OshLayerResource(ModelResource):
    class Meta:
        queryset = OSHLayer.objects.all()
        resource_name = 'osh_layer'
        # Note: These are fields to exclude from being exposed by the API
        excludes = []


class VideoViewResource(ModelResource):
    class Meta:
        queryset = VideoView.objects.all()
        resource_name = 'video_view'
        # Note: These are fields to exclude from being exposed by the API
        excludes = []


class ChartStylerResource(ModelResource):
    class Meta:
        queryset = ChartStyler.objects.all()
        resource_name = 'chart_styler'
        # Note: These are fields to exclude from being exposed by the API
        excludes = []


class LocationIndicatorResource(ModelResource):
    class Meta:
        queryset = LocationIndicator.objects.all()
        resource_name = 'location_indicator'
        # Note: These are fields to exclude from being exposed by the API
        excludes = []


class TextStylerResource(ModelResource):
    class Meta:
        queryset = TextStyler.objects.all()
        resource_name = 'text_styler'
        # Note: These are fields to exclude from being exposed by the API
        excludes = []


class ViewResource(ModelResource):
    class Meta:
        queryset = View.objects.all()
        resource_name = 'view'
        # Note: These are fields to exclude from being exposed by the API
        excludes = []

