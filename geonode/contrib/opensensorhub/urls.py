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

from api import CategoryResource
from api import HubResource
from api import ObservationResource
from api import LayerResource
from api import VideoStylerResource
from api import ChartStylerResource
from api import PointMarkerStylerResource
from api import TextStylerResource
from api import ViewResource

from components.explorer.explorer_view import ExplorerView

import components.wizards.wizard_views

from django.views.generic import TemplateView

from geonode.contrib.opensensorhub.utilities.hubutils import get_capabilities
from geonode.contrib.opensensorhub.utilities.hubutils import get_result_template
from geonode.contrib.opensensorhub.utilities.hubutils import get_sensor_description

app_name = 'opensensorhub'

core_resources = [CategoryResource(), HubResource(), ObservationResource(), LayerResource()]
view_resources = [ViewResource()]
styler_resources = [ChartStylerResource(), TextStylerResource(), PointMarkerStylerResource(), VideoStylerResource()]

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

    # Hub operations - Testing purposes
    url(r'^describe', TemplateView.as_view(template_name='test3.html'), name='offerings'),
    url(r'^capabilities', TemplateView.as_view(template_name='test.html'), name='offerings'),
    url(r'^result', TemplateView.as_view(template_name='test2.html'), name='offerings'),
    url(r'^get_sensor_description', get_sensor_description, name='result'),
    url(r'^get_result_template', get_result_template, name='result'),
    url(r'^get_capabilities', get_capabilities, name='offerings'),

    # Explorer URLS - Content Search Page
    url(r'^search', ExplorerView.as_view(), name='explore_sensors'),

    url(r'^', include(osh_api.urls), name='api'),
    url(r'^api/', include(core_api.urls), name='core'),
    url(r'^api/', include(views_api.urls), name='views'),
    url(r'^api/', include(stylers_api.urls), name='stylers'),

    url(r'^add-hub', components.wizards.wizard_views.HubWizard.as_view(), name='hub-wiz'),
    url(r'^add-obs', components.wizards.wizard_views.ObservationWizard.as_view(), name='obs-wiz'),
    url(r'^add-layer', components.wizards.wizard_views.LayerFormView.as_view(), name='layer-wiz'),
    # url(r'^test', views.create_user),
    # Test link to view all resources as cards
    url(r'^explore', ExplorerView.as_view(), name='explore'),

    # To allow for an easy to follow test link, delete when composite forms are working
    # url(r'^test', components.wizards.wizard_views.CompositeFormView.as_view(), name='test'),
    # Test Template inclusion this way
    url(r'^wizards/test-1', components.wizards.wizard_views.TestTemplateFormView.as_view()),
    url(r'^wizards/chart', components.wizards.wizard_views.ChartStylerFormView.as_view()),
    url(r'^wizards/video', components.wizards.wizard_views.VideoStylerFormView.as_view()),
    url(r'^wizards/text', components.wizards.wizard_views.TextStylerFormView.as_view()),
    url(r'^wizards/locationmarker', components.wizards.wizard_views.LocationMarkerStylerFormView.as_view()),
    url(r'^wizards/map', components.wizards.wizard_views.MapTemplateFormView.as_view()),
    url(r'^osh-wizard/', components.wizards.wizard_views.WizardMainView.as_view()),
    url(r'^view-selection', components.wizards.wizard_views.ViewSelectionWidget.as_view()),
    url(r'^add-view', components.wizards.wizard_views.ViewToAView.as_view()),
]
