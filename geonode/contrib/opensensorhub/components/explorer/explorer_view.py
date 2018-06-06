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
# from django.shortcuts import render
# from django.template import loader
# from django.http import HttpResponse
from django.shortcuts import render

from geonode.contrib.opensensorhub.api import HubResource
from geonode.contrib.opensensorhub.api import ObservationResource
from geonode.contrib.opensensorhub.api import OshLayerResource
from geonode.contrib.opensensorhub.api import VideoViewResource
from geonode.contrib.opensensorhub.api import ChartStylerResource
from geonode.contrib.opensensorhub.api import LocationIndicatorResource
from geonode.contrib.opensensorhub.api import TextStylerResource
from geonode.contrib.opensensorhub.api import ViewResource


class ExplorerView(View):

    template_name = 'component_base.html'

    # def get(self, request, *args, **kwargs):
    def get(self, request):

        hubs = HubResource()

        hubs_bundle = hubs.build_bundle(request=request)
        hubs_json = hubs.serialize(None, hubs.full_hydrate(hubs_bundle), "application/json")

        # return render(request, self.template_name, dict({'html_body': 'explorer/explorer.html', 'hubs': hubs_json}))
        return render(request, self.template_name, dict({'html_body': 'wizards/wizard_add_observation.html', 'hubs': hubs_json}))

    def post(self):
        pass
