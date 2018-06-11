from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView

# Form Imports
from components.wizards.wizard_observation_forms import ObservationForm


def index(request):
    my_dict = {'insert_me': "Hello, I am from views.py"}
    return render(request, 'wizards/wizard_add_hub.html', context=my_dict)


class BaseWizard(TemplateView):
    template_name = 'wizards/wizard_add_hub.html'


# class ObservationWizard(TemplateView):
#     template_name = 'wizards/wizard_add_observation.html'
#     form = ObservationForm

# def add_obs(request):



class ObservationWizard(TemplateView):

    template_name = 'component_base.html'


    # def get(self, request, *args, **kwargs):
    def get(self, request):
        form = ObservationForm()

        # hubs = HubResource()
        #
        # hubs_bundle = hubs.build_bundle(request=request)
        # hubs_json = hubs.serialize(None, hubs.full_hydrate(hubs_bundle), "application/json")

        # return render(request, self.template_name, dict({'html_body': 'explorer/explorer.html', 'hubs': hubs_json}))
        return render(request, self.template_name, dict({'html_body': 'wizards/wizard_add_observation.html',
                                                         'form': form}))

    def post(self):
        pass