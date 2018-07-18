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
# from tastypie.authentication import OAuthAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.serializers import Serializer
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie import fields

from models import *


class HubResource(ModelResource):
    class Meta:
        queryset = Hub.objects.all()
        resource_name = 'hub'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category', 'url']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete', 'update']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {
            'name': ALL,
            'description': ALL,
            'keywords': ALL,
            'category': ALL,
            'url': ALL
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class ObservationResource(ModelResource):
    hub = fields.ForeignKey(HubResource, 'hub')

    class Meta:
        queryset = Observation.objects.all()
        resource_name = 'observation'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'service', 'endpoint_url', 'offering',
                  'observed_property', 'start_time', 'end_time',
                  'sync_master_time', 'buffering_time', 'time_shift',
                  'source_type', 'replay_speed', 'protocol']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete', 'update']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {
            'name': ALL,
            'description': ALL,
            'keywords': ALL,
            'category' : ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class ViewResource(ModelResource):
    class Meta:
        queryset = View.objects.all()
        resource_name = 'view'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'observations']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete', 'update']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {
            'name': ALL,
            'description': ALL,
            'keywords': ALL,
            'category' : ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class LayerResource(ModelResource):
    class Meta:
        queryset = Layer.objects.all()
        resource_name = 'layer'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'views']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete', 'update']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {
            'name': ALL,
            'description': ALL,
            'keywords': ALL,
            'category' : ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class TextStylerResource(ModelResource):

    class Meta:
        queryset = TextStyler.objects.all()
        resource_name = 'text'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'screen_position', 'color_mode',
                  'color_rgb', 'thresholds', 'type']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete', 'update']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {
            'name': ALL,
            'description': ALL,
            'keywords': ALL,
            'category' : ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class PointMarkerStylerResource(ModelResource):

    class Meta:
        queryset = PointMarkerStyler.objects.all()
        resource_name = 'point'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'view_icon', 'render_mode', 'type']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete', 'update']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {
            'name': ALL,
            'description': ALL,
            'keywords': ALL,
            'category' : ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class ChartStylerResource(ModelResource):

    class Meta:
        queryset = ChartStyler.objects.all()
        resource_name = 'chart'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'label_x', 'label_y', 'color_mode',
                  'range_mode', 'range_x', 'range_y',
                  'max_points', 'color_rgb', 'thresholds',
                  'type']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete', 'update']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {
            'name': ALL,
            'description': ALL,
            'keywords': ALL,
            'category' : ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class VideoStylerResource(ModelResource):

    class Meta:
        queryset = VideoStyler.objects.all()
        resource_name = 'video'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'draggable', 'show', 'dockable',
                  'closeable', 'keep_ratio', 'type']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete', 'update']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {
            'name': ALL,
            'description': ALL,
            'keywords': ALL,
            'category' : ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle

