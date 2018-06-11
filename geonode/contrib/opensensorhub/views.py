from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView

# Form Imports
from forms import ObservationForm
from forms import TestForm


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
    # form = TestForm()

    # def get(self, request, *args, **kwargs):
    def get(self, request):
        form = TestForm()

        return render(request, self.template_name, dict({'html_body': 'wizards/wizard_add_observation.html',
                                                         'form': form}))

    def post(self):
        pass