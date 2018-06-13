from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView

# Form Imports
from geonode.contrib.opensensorhub.components.wizards.wizard_observation_forms import ObservationForm


def index(request):
    my_dict = {'insert_me': "Hello, I am from views.py"}
    return render(request, 'wizards/wizard_add_hub.html', context=my_dict)


class BaseWizard(TemplateView):
    template_name = 'wizards/wizard_add_hub.html'


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
