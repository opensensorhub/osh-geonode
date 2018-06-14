from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic import TemplateView, FormView

# Form Imports
from geonode.contrib.opensensorhub.components.wizards.wizard_observation_forms import ObservationForm, HubForm

# Resource Imports
from geonode.contrib.opensensorhub.api import HubResource, ObservationResource, OshLayerResource, VideoViewResource, \
    ChartStylerResource, LocationIndicatorResource, TextStylerResource, ViewResource

class GenericWizard(FormView):
    osh_resources = {HubResource(), ObservationResource(), OshLayerResource(), VideoViewResource(),
                     ChartStylerResource(), LocationIndicatorResource(), TextStylerResource(), ViewResource()}

    def get_available_hubs(self, request, resource):
        hubs = 0
        return hubs


class ObservationWizard(TemplateView):
    template_name = 'component_base.html'
    form = ObservationForm()

    # def get(self, request, *args, **kwargs):
    def get(self, request):
        form = self.form

        return render(request, self.template_name, dict({'html_body': 'wizards/wizard_add_observation.html',
                                                         'form': form}))

    def post(self):
        pass


class HubWizard(FormView):
    template_name = 'component_base.html'
    form = HubForm()

    def get(self, request):
        form = self.form
        return render(request, self.template_name, dict({'html_body': 'wizards/wizard_add_hub.html', 'form': form}))

    def post(self, request):
        form = HubForm(request.POST)
        if form.is_valid():
            form.save()
            # TODO: Determine if we need cleaned data for other forms
            # text = form.cleaned_data['post']
            form = HubForm()
            return redirect('hubs/')

        args = {'form': form, 'html_body': 'wizards/wizard_add_hub.html'}
        return render(request, self.template_name, args)
