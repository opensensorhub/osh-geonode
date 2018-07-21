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
    category = fields.ForeignKey(Category, 'category')

    class Meta:
        queryset = Hub.objects.all()
        resource_name = 'hub'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['id', 'name', 'description', 'keywords', 'url', 'category']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post', 'delete']
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
            'url': ALL
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class ObservationResource(ModelResource):
    hub = fields.ForeignKey(HubResource, 'hub')
    category = fields.ForeignKey(Category, 'category')

    class Meta:
        queryset = Observation.objects.all()
        resource_name = 'observation'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'source_type', 'endpoint', 'protocol', 'offering',
                  'observed_property', 'start_time', 'end_time', 'sync_master_time',
                  'buffering_time', 'time_shift', 'replay_speed', 'hub', 'category']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post']
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
            'url': ALL
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class LayerResource(ModelResource):
    category = fields.ForeignKey(Category, 'category')

    class Meta:
        queryset = Layer.objects.all()
        resource_name = 'layer'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['category']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {}

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class VideoStylerResource(ModelResource):
    category = fields.ForeignKey(Category, 'category')

    class Meta:
        queryset = VideoStyler.objects.all()
        resource_name = 'video'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'draggable', 'dockable', 'closeable', 'keep_ratio',
                  'timeout', 'styler_type', 'category']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {}

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class ChartStylerResource(ModelResource):
    category = fields.ForeignKey(Category, 'category')

    class Meta:
        queryset = ChartStyler.objects.all()
        resource_name = 'chart'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'label_x', 'label_y',
                  'color_mode', 'range_mode', 'range_x', 'range_y', 'max_points', 'color_rgb', 'thresholds',
                  'timeout', 'styler_type', 'category']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {}

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class PointMarkerStylerResource(ModelResource):
    category = fields.ForeignKey(Category, 'category')

    class Meta:
        queryset = PointMarkerStyler.objects.all()
        resource_name = 'point'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'timeout', 'styler_type', 'view_icon', 'render_mode', 'category']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {}

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class TextStylerResource(ModelResource):
    category = fields.ForeignKey(Category, 'category')

    class Meta:
        queryset = TextStyler.objects.all()
        resource_name = 'text'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'color_mode', 'color_rgb', 'thresholds',
                  'timeout', 'styler_type', 'category']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {}

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class ViewResource(ModelResource):
    observations = fields.ForeignKey(ObservationResource, 'observations')
    category = fields.ForeignKey(Category, 'category')

    class Meta:
        queryset = View.objects.all()
        resource_name = 'view'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['observations', 'category']
        # Access: HTTP operations allowed on resource, options are - 'get', 'post', 'put', 'delete'
        #   Empty set denotes inability to access API through HTTP requests
        allowed_methods = ['get', 'post']
        # Authentication
        #        authentication = OAuthAuthentication()
        # Authorization
        # authorization = DjangoAuthorization()
        authorization = Authorization()
        # Serializer: Allow only JSON serialization
        serializer = Serializer(formats=['json'])
        # Filtering
        filtering = {}

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle
