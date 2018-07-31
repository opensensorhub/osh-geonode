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
from tastypie.authorization import Authorization
#from tastypie.authorization import DjangoAuthorization,
from tastypie.serializers import Serializer
from tastypie.constants import ALL
# from tastypie.constants import ALL_WITH_RELATIONS
from tastypie import fields

from models import Category
from models import Hub
from models import Observation
from models import Layer
from models import VideoStyler
from models import ChartStyler
from models import PointMarkerStyler
from models import TextStyler
from models import View
from models import Offering


class CategoryResource(ModelResource):
    parent = fields.ForeignKey('self', 'parent', null=True)

    class Meta:
        queryset = Category.objects.all()
        resource_name = 'category'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'parent']
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
            'name': ALL
        }

    def __str__(self):
        return self.fields['name']


class HubResource(ModelResource):
    category = fields.ForeignKey(CategoryResource, 'category')

    class Meta:
        queryset = Hub.objects.all()
        resource_name = 'hub'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['id', 'name', 'description', 'keywords', 'category', 'url']
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
    category = fields.ForeignKey(CategoryResource, 'category')

    class Meta:
        queryset = Observation.objects.all()
        resource_name = 'observation'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'service', 'endpoint', 'offering',
                  'observed_property', 'start_time', 'end_time',
                  'sync_master_time', 'buffering_time', 'time_shift',
                  'source_type', 'replay_speed', 'protocol', 'get_result_json']
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
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class ViewResource(ModelResource):
    observations = fields.ToManyField(ObservationResource, 'observations', related_name='view')
    category = fields.ForeignKey(CategoryResource, 'category')

    class Meta:
        queryset = View.objects.all()
        resource_name = 'view'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'observations', 'styler', 'draggable', 'show',
                  'dockable', 'closeable']
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
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class LayerResource(ModelResource):
    views = fields.ToManyField(ViewResource, 'views', related_name='layer')
    category = fields.ForeignKey(CategoryResource, 'category')

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
            'category': ALL,
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class StylerResource(ModelResource):
    view = fields.ToOneField(ViewResource, 'view', related_name='styler')
    category = fields.ForeignKey(CategoryResource, 'category')


class TextStylerResource(StylerResource):

    class Meta:
        queryset = TextStyler.objects.all()
        resource_name = 'text'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'screen_position', 'color_mode',
                  'color_rgb', 'thresholds', 'type', 'view']
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
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class PointMarkerStylerResource(StylerResource):

    class Meta:
        queryset = PointMarkerStyler.objects.all()
        resource_name = 'point'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'view_icon', 'render_mode', 'type', 'view']
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
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class ChartStylerResource(StylerResource):

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
                  'type', 'view']
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
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class VideoStylerResource(StylerResource):

    class Meta:
        queryset = VideoStyler.objects.all()
        resource_name = 'video'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category',
                  'keep_ratio', 'type', 'view']
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
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle


class OfferingResource(ModelResource):
    hub = fields.ForeignKey(HubResource, 'hub')
    category = fields.ForeignKey(CategoryResource, 'category')

    class Meta:
        queryset = Offering.objects.all()
        resource_name = 'offering'
        # BlackList: These are fields to exclude from being exposed by the API
        excludes = []
        # WhiteList: These are fields to include for being exposed by the API
        fields = ['name', 'description', 'keywords', 'category', 'hub', 'endpoint', 'procedure', 'offering_type']
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
        }

    def dehydrate(self, bundle):
        bundle.data['type'] = self.Meta.resource_name
        return bundle
