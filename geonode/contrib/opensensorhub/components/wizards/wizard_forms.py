from django import forms
from django.utils.translation import gettext_lazy as _

# Model Imports
from geonode.contrib.opensensorhub.models import Hub, Observation, Layer, VideoStyler, \
    ChartStyler, PointMarkerStyler, TextStyler, View, SweService, Category

import geonode.contrib.opensensorhub.models as models


# ----------------------------------------------------------------------------------------------------------------------
# Custom Fields
# ----------------------------------------------------------------------------------------------------------------------
class HubSelectionField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return str(obj.name)


class ObservationSelectField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return str(obj.name)


class MultiObsSelectField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return str(obj.name)


class ViewSelectionField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return str(obj.name)


# ----------------------------------------------------------------------------------------------------------------------
# Model Forms
# ----------------------------------------------------------------------------------------------------------------------
class ObservationForm(forms.ModelForm):
    hubs = Hub.objects.all()
    hub = HubSelectionField(label='Hub', queryset=hubs)
    categories = Category.objects.all()
    initial = categories.get(name__contains='Observation')
    category = forms.ModelChoiceField(label='Category', queryset=categories, initial=initial.id,
                                      widget=forms.HiddenInput())

    class Meta:
        model = Observation
        fields = ('name', 'description', 'keywords', 'source_type', 'endpoint', 'protocol', 'offering',
                  'observed_property', 'start_time', 'end_time', 'sync_master_time',
                  'buffering_time', 'time_shift', 'replay_speed', 'hub', 'category', 'get_result_json')
        labels = {
            'observed_property': _('Observed Property:'),
            'source_type': _('Source Type:'),
            'start_time': _('Start Time:'),
            'end_time': _('End Time:'),
            'sync_master_time': _('Sync Master Time:'),
            'buffering_time': _('Buffering Time:'),
            'time_shift': _('Time Shift:'),
            'replay_speed': _('Replay Speed:'),
            'get_result_json': _('Get Result JSON:'),
        }


class HubForm(forms.ModelForm):
    name = forms.CharField()
    url = forms.URLField(label='URL')
    description = forms.CharField(max_length=500)
    keywords = forms.CharField(max_length=500)

    class Meta:
        model = Hub
        fields = ('name', 'url', 'protocol', 'description', 'keywords',)

    def do_stuff(self):
        pass


class ChartStylerForm(forms.ModelForm):
    COLOR_MODE_CHOICES = models.COLOR_MODE_CHOICES
    RANGE_CHOICES = ChartStyler.RANGE_MODE_CHOICES

    color_mode = forms.ChoiceField(label='Color Mode:', widget=forms.Select, choices=COLOR_MODE_CHOICES)
    range_mode = forms.ChoiceField(label='Range Mode', widget=forms.Select, choices=RANGE_CHOICES)
    max_points = forms.IntegerField(label='Max Points', initial=30)
    categories = Category.objects.all()
    initial = categories.get(name__exact='Styler or Widget')
    category = forms.ModelChoiceField(label='Category', queryset=categories, initial=initial.id,
                                      widget=forms.HiddenInput())

    # TODO: Add upper and lower range fields
    class Meta:
        model = ChartStyler
        fields = ('name', 'description', 'keywords', 'label_x', 'label_y',
                  'range_mode', 'range_x', 'range_y', 'color_mode', 'color_rgb', 'max_points', 'view', 'category',)
        labels = {
            'range_x': _('Range X:'),
            'range_y': _('Range Y:'),
            'label_x': _('Label X:'),
            'label_y': _('Label Y:'),
            'color_rgb': _('Color RGB'),
        }


class LocationIndicatorForm(forms.ModelForm):
    categories = Category.objects.all()
    initial = categories.get(name__exact='Styler or Widget')
    category = forms.ModelChoiceField(label='Category', queryset=categories, initial=initial.id,
                                      widget=forms.HiddenInput())

    class Meta:
        model = PointMarkerStyler
        fields = ('name', 'description', 'keywords', 'view_icon', 'render_mode', 'view', 'category',)
        labels = {
            'view_icon': _('Icon:'),
            'render_mode': _('Render Mode:'),
        }


class TextStylerForm(forms.ModelForm):
    categories = Category.objects.all()
    initial = categories.get(name__exact='Styler or Widget')
    category = forms.ModelChoiceField(label='Category', queryset=categories, initial=initial.id,
                                      widget=forms.HiddenInput())

    class Meta:
        model = TextStyler
        # TODO: Rework the color and threshold form options
        # The add HTML sheet may be useful for this (uncertain)
        fields = ('name', 'description', 'keywords', 'color_mode', 'color_rgb', 'thresholds', 'view',)
        labels = {
            'color_mode': _('Color Mode:'),
            'color_rgb': _('Color RGB:'),
        }


class VideoStylerForm(forms.ModelForm):
    # observations = Observation.objects.all()
    # data_source = ObservationSelectField(label='Data Source:', queryset=observations)
    categories = Category.objects.all()
    initial = categories.get(name__exact='Styler or Widget')
    category = forms.ModelChoiceField(label='Category', queryset=categories, initial=initial.id,
                                      widget=forms.HiddenInput())

    class Meta:
        model = VideoStyler
        fields = ('name', 'description', 'keywords', 'show', 'draggable', 'dockable', 'keep_ratio',
                  'closeable', 'view',)
        labels = {
            'keep_ratio': _('Keep Ratio:')
        }


class MapTemplateForm(forms.Form):
    name = forms.CharField()
    description = forms.CharField(max_length=500)
    keywords = forms.CharField(max_length=500)


class ViewForm(forms.ModelForm):
    observation_list = Observation.objects.all()
    observations = MultiObsSelectField(label='Data Source', queryset=observation_list)

    class Meta:
        model = View
        fields = ('name', 'description', 'keywords', 'observations')


class LayerForm(forms.ModelForm):
    # Do we want to have the ability to limit observations and view based on selections in this form?
    view_list = View.objects.all()
    views = MultiObsSelectField(label='Views', queryset=view_list)
    categories = Category.objects.all()
    initial = categories.get(name__exact='Styler or Widget')
    category = forms.ModelChoiceField(label='Category', queryset=categories, initial=initial.id,
                                      widget=forms.HiddenInput())

    class Meta:
        model = Layer
        fields = ('name', 'description', 'keywords', 'views')

