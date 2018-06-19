from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView




def index(request):
    my_dict = {'insert_me': "Hello, I am from views.py"}
    return render(request, 'wizards/wizard_add_hub.html', context=my_dict)


class BaseWizard(TemplateView):
    template_name = 'wizards/wizard_add_hub.html'


