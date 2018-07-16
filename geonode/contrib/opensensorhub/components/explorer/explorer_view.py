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
from django.views.generic import View
from django.shortcuts import render

from geonode.contrib.opensensorhub.api import HubResource
from geonode.contrib.opensensorhub.api import ObservationResource
from geonode.contrib.opensensorhub.api import OshLayerResource
from geonode.contrib.opensensorhub.api import VideoStylerResource
from geonode.contrib.opensensorhub.api import ChartStylerResource
from geonode.contrib.opensensorhub.api import LocationIndicatorResource
from geonode.contrib.opensensorhub.api import TextStylerResource
from geonode.contrib.opensensorhub.api import ViewResource


class ExplorerView(View):

    template_name = 'component_base.html'

    # def get(self, request, *args, **kwargs):
    def get(self, request):

        # Initialize the data dictionary to pass to the HTML template for rendering
        data = dict({'html_body': 'explorer/explorer.html'})

        # Setup filter data to populate filters
        resources = {HubResource.Meta.resource_name,
                     ObservationResource.Meta.resource_name,
                     OshLayerResource.Meta.resource_name,
                     VideoStylerResource.Meta.resource_name,
                     ChartStylerResource.Meta.resource_name,
                     LocationIndicatorResource.Meta.resource_name,
                     TextStylerResource.Meta.resource_name,
                     ViewResource.Meta.resource_name}

        data["resources"] = resources

        elements = [HubResource(), ObservationResource(),
                    OshLayerResource(), VideoStylerResource(),
                    ChartStylerResource(), LocationIndicatorResource(),
                    TextStylerResource(), ViewResource()]

        bundles = []

        for element in elements:
            request_bundle = element.build_bundle(request=request)
            queryset = element.obj_get_list(request_bundle)

            for obj in queryset:
                bundle = element.build_bundle(obj=obj, request=request)
                bundles.append(element.full_dehydrate(bundle, for_list=True))

        data["cards"] = [item.data for item in bundles]

        return render(request, self.template_name, data)

    def post(self):
        pass
