from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core.files.base import ContentFile
from datetime import datetime
import uuid

from django.views.generic import TemplateView, FormView

# Form Imports
from geonode.contrib.opensensorhub.components.wizards.wizard_forms import ObservationForm, HubForm, \
    ChartStylerForm, TextStylerForm, VideoStylerForm, LocationIndicatorForm, MapTemplateForm, ViewForm, LayerForm, \
    OfferingForm

# Resource Imports
from geonode.contrib.opensensorhub.api import HubResource, ObservationResource, LayerResource, VideoStylerResource, \
    ChartStylerResource, PointMarkerStylerResource, TextStylerResource, ViewResource


class GenericWizard(FormView):
    osh_resources = {HubResource(), ObservationResource(), LayerResource(), VideoStylerResource(),
                     ChartStylerResource(), PointMarkerStylerResource(), TextStylerResource(), ViewResource()}

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

    # TODO: Clean this function up to remove unused code
    def post(self, request):
        # convert value of json_content to a ContentField and insert into get_result_json
        # TODO: sanitize this if it's ever user input
        newFile = ContentFile(request.POST['json_content'])
        file_name = request.POST['name'].replace(" ", "") + str(uuid.uuid4()) + ".json"
        newFile.name = file_name
        data = request.POST.dict()
        data['get_result_json'] = newFile
        new_form = ObservationForm(data)

        if new_form.is_valid():
            new_form.save()
            return redirect('/osh/add-view/')

        args = {'form': new_form, 'html_body': 'wizards/wizard_add_observation.html'}
        return render(request, self.template_name, args)


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
            return redirect('add-obs/')

        args = {'form': form, 'html_body': 'wizards/wizard_add_hub.html'}
        return render(request, self.template_name, args)


class WizardMainView(TemplateView):
    template_name = 'component_base.html'

    def get(self, request):
        return render(request, self.template_name, dict({'html_body': 'wizards/wizard_main.html'}))


# Form Templates for HTML inclusions
class TestTemplateFormView(TemplateView):
    template_name = 'wizards/wizard_include_test_template.html'

    def get(self, request):
        return render(request, self.template_name)


class ChartStylerFormView(FormView):
    # template_name = 'wizards/wizard_add_chartview_form.html'
    template_name = 'component_base.html'
    form = ChartStylerForm()
    wizard_type = 'chart-styler'

    def get(self, request):
        form = self.form
        return render(request, self.template_name,
                      dict({'html_body': 'wizards/wizard_add_styler.html', 'form': form,
                            'wizard_type': self.wizard_type}))

    def post(self, request):
        form = ChartStylerForm(request.POST)
        if form.is_valid():
            form.save()
            # TODO: Determine if we need cleaned data for other forms
            form = ChartStylerForm()
            # return redirect('observations/')
            return redirect('/osh/view-selection/')

        args = {'form': form, 'html_body': 'wizards/wizard_add_styler.html', 'wizard_type': self.wizard_type}
        return render(request, self.template_name, args)


class VideoStylerFormView(FormView):
    template_name = 'component_base.html'
    form = VideoStylerForm()
    wizard_type = 'video-styler'

    def get(self, request):
        form = self.form
        return render(request, self.template_name,
                      dict({'html_body': 'wizards/wizard_add_styler.html', 'form': form,
                            'wizard_type': self.wizard_type}))

    def post(self, request):
        form = VideoStylerForm(request.POST)
        if form.is_valid():
            form.save()
            form = VideoStylerForm()
            return redirect('/osh/view-selection/')

        args = {'form': form, 'html_body': 'wizards/wizard_add_styler.html', 'wizard_type': self.wizard_type}
        return render(request, self.template_name, args)


class TextStylerFormView(TemplateView):
    template_name = 'component_base.html'
    form = TextStylerForm()
    wizard_type = 'text-styler'

    def get(self, request):
        form = self.form
        return render(request, self.template_name,
                      dict({'html_body': 'wizards/wizard_add_styler.html', 'form': form,
                            'wizard_type': self.wizard_type}))

    def post(self, request):
        form = TextStylerForm(request.POST)
        if form.is_valid():
            form.save()
            form = TextStylerForm()
            return redirect('/osh/view-selection/')

        args = {'form': form, 'html_body': 'wizards/wizard_add_styler.html', 'wizard_type': self.wizard_type}
        return render(request, self.template_name, args)


class LocationMarkerStylerFormView(TemplateView):
    template_name = 'component_base.html'
    form = LocationIndicatorForm()
    wizard_type = 'location-marker'

    def get(self, request):
        form = self.form
        return render(request, self.template_name,
                      dict({'html_body': 'wizards/wizard_add_styler.html', 'form': form,
                            'wizard_type': self.wizard_type}))

    def post(self, request):
        form = LocationIndicatorForm(request.POST)
        if form.is_valid():
            form.save()
            form = LocationIndicatorForm()
            return redirect('/osh/view-selection/')

        args = {'form': form, 'html_body': 'wizards/wizard_add_styler.html', 'wizard_type': self.wizard_type}
        return render(request, self.template_name, args)


class MapTemplateFormView(TemplateView):
    template_name = 'component_base.html'
    form = MapTemplateForm()
    wizard_type = 'map'

    def get(self, request):
        form = self.form
        return render(request, self.template_name,
                      dict({'html_body': 'wizards/wizard_add_mapview_form.html', 'form': form,
                            'wizard_type': self.wizard_type}))

    def post(self, request):
        form = MapTemplateForm(request.POST)
        if form.is_valid():
            form.save()
            form = MapTemplateForm()
            return redirect('/osh/view-selection/')

        args = {'form': form, 'html_body': 'wizards/wizard_add_mapview_form.html', 'wizard_type': self.wizard_type}
        return render(request, self.template_name, args)


class ViewSelectionWidget(TemplateView):
    template_name = 'component_base.html'

    def get(self, request):
        return render(request, self.template_name, dict({'html_body': 'wizards/wizard_type_selection.html'}))


class ViewToAView(FormView):
    template_name = 'component_base.html'
    html_path = 'wizards/wizard_add_view.html'
    form = ViewForm

    def get(self, request):
        form = self.form
        return render(request, self.template_name, dict({'html_body': self.html_path, 'form': form}))

    def post(self, request):
        form = ViewForm(request.POST)
        if form.is_valid():
            form.save()
            form = ViewForm()
            return redirect('/osh/view-selection')

        args = {'form': form, 'html_body': self.html_path}
        return render(request, self.template_name, args)


class LayerFormView(FormView):
    template_name = 'component_base.html'
    html_path = 'wizards/wizard_add_layer.html'
    form = LayerForm

    def get(self, request):
        form = self.form
        return render(request, self.template_name, dict({'html_body': self.html_path, 'form': form}))

    def post(self, request):
        form = ViewForm(request.POST)
        if form.is_valid():
            form.save()
            form = LayerForm()
            return redirect('/osh/view-selection')

        args = {'form': form, 'html_body': self.html_path}
        return render(request, self.template_name, args)


class OfferingFormView(FormView):
    template_name = 'component_base.html'
    html_path = 'wizards/wizard_add_offering.html'
    form = OfferingForm()

    # def get(self, request, *args, **kwargs):
    def get(self, request):
        form = self.form

        return render(request, self.template_name, dict({'html_body': self.html_path, 'form': form}))

    # TODO: Clean this function up to remove unused code
    def post(self, request):
        new_form = ObservationForm(request.POST)

        if new_form.is_valid():
            new_form.save()
            return redirect('/osh/add-view/')

        args = {'form': new_form, 'html_body': self.html_path}
        return render(request, self.template_name, args)


class TestView(TemplateView):
    template_name = 'component_base.html'
    html_path = 'test_http_reqs.html'

    def get(self, request):
        return render(request, self.template_name, dict({'html_body': self.html_path}))
