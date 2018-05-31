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
from django.conf.urls import url, include
from tastypie.api import Api

from api import HubResource
from api import ObservationResource
from api import OshLayerResource
from api import VideoViewResource
from api import ChartStylerResource
from api import LocationIndicatorResource
from api import TextStylerResource
from api import ViewResource

import views

app_name = 'opensensorhub'
osh_api = Api(api_name='OpenSensorHub')
osh_api.register(HubResource())
osh_api.register(ObservationResource())
osh_api.register(OshLayerResource())
osh_api.register(VideoViewResource())
osh_api.register(ChartStylerResource())
osh_api.register(LocationIndicatorResource())
osh_api.register(TextStylerResource())
osh_api.register(ViewResource())

urlpatterns = [
        url(r'^api/', include(osh_api.urls), name='osh'),
    # To allow for an easy to follow test link, delete when api is implemented
        url(r'^add-hub', views.index,name='index'),
    ]
