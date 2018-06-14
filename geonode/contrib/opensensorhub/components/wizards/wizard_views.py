from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView, FormView

# Form Imports
from geonode.contrib.opensensorhub.components.wizards.wizard_observation_forms import ObservationForm, HubForm


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
