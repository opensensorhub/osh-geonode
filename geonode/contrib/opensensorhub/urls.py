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
from django.views.generic import TemplateView

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

from components.explorer.explorer_view import ExplorerView

app_name = 'opensensorhub'

core_resources = [HubResource(), ObservationResource(), OshLayerResource()]
view_resources = [ViewResource(), VideoViewResource(), LocationIndicatorResource()]
styler_resources = [ChartStylerResource(), TextStylerResource()]

all_resources = core_resources + view_resources + styler_resources

core_api = Api(api_name='core')
for resource in core_resources:
    core_api.register(resource)

views_api = Api(api_name='views')
for resource in view_resources:
    views_api.register(resource)

stylers_api = Api(api_name='stylers')
for resource in styler_resources:
    stylers_api.register(resource)

osh_api = Api(api_name='api')
for resource in all_resources:
    osh_api.register(resource)

urlpatterns = [
        url(r'^sensors_browse', ExplorerView.as_view(), name='sensors_browse'),
        url(r'^', include(osh_api.urls), name='api'),
        url(r'^api/', include(core_api.urls), name='core'),
        url(r'^api/', include(views_api.urls), name='views'),
        url(r'^api/', include(stylers_api.urls), name='stylers'),

    # To allow for an easy to follow test link, delete when api is implemented
    url(r'^add-hub', views.BaseWizard.as_view(), name='base'),
    url(r'^add-obs', views.ObservationWizard.as_view(), name='obs-wiz'),
    # url(r'^test', views.create_user),
]
