from django.views.generic import View
# from django.shortcuts import render
# from django.template import loader
# from django.http import HttpResponse
from django.shortcuts import render

from geonode.contrib.opensensorhub.api import HubResource
# from api import ObservationResource
# from api import OshLayerResource
# from api import VideoViewResource
# from api import ChartStylerResource
# from api import LocationIndicatorResource
# from api import TextStylerResource
# from api import ViewResource


class ExplorerView(View):

    template_name = 'explorer/explorer.html'

    # def get(self, request, *args, **kwargs):
    def get(self, request):

        hubs = HubResource()

        hubs_bundle = hubs.build_bundle(request=request)
        hubs_json = hubs.serialize(None, hubs.full_hydrate(hubs_bundle), "application/json")

        return render(request, self.template_name, dict({'hubs': hubs_json}))

    def post(self):
        pass
