from django import forms
from django.utils.translation import gettext_lazy as _

# Model Imports
from geonode.contrib.opensensorhub.models import Hub, Observation, Layer, VideoStyler, \
    ChartStyler, PointMarkerStyler, TextStyler, View, SweService

import geonode.contrib.opensensorhub.models as models


# Custom Fields
class HubSelectionField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return str(obj.name)


class ObservationSelectField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return str(obj.name)


class ObservationForm(forms.ModelForm):
    hubs = Hub.objects.all()

    hub = HubSelectionField(label='Hub', queryset=hubs)

    class Meta:
        model = Observation
        fields = ('name', 'description', 'keywords', 'hub', 'source_type', 'endpoint', 'protocol', 'offering',
                  'service', 'observed_property', 'start_time', 'end_time', 'sync_master_time', 'buffering_time',
                  'time_shift', 'replay_speed',)
        labels = {
            'observed_property': _('Observed Property:'),
            'source_type': _('Source Type:'),
            'start_time': _('Start Time:'),
            'end_time': _('End Time:'),
            'sync_master_time': _('Sync Master Time:'),
            'buffering_time': _('Buffering Time:'),
            'time_shift': _('Time Shift:'),
            'replay_speed': _('Replay Speed:'),
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


# TODO: Is this needed or can it be removed?
class ViewForm(forms.ModelForm):
    class Meta:
        view_model = View
        styler_models = {'Chart': ChartStyler, 'Text': TextStyler, 'Location': PointMarkerStyler, 'Video': VideoStyler}
        fields = ('name',)

    def magic(self):
        pass


class ChartStylerForm(forms.ModelForm):
    COLOR_MODE_CHOICES = models.COLOR_MODE_CHOICES
    RANGE_CHOICES = ChartStyler.RANGE_MODE_CHOICES

    # TODO: Look into implementing a system-wide time observation
    observations = Observation.objects.all()
    data_source_x = ObservationSelectField(label='Data Source (X-Axis):', queryset=observations)
    data_source_y = ObservationSelectField(label='Data Source (Y-Axis):', queryset=observations)
    color_mode = forms.ChoiceField(label='Color Mode:', widget=forms.Select, choices=COLOR_MODE_CHOICES)
    range_mode = forms.ChoiceField(label='Range Mode', widget=forms.Select, choices=RANGE_CHOICES)
    max_points = forms.IntegerField(label='Max Points', initial=30)

    # TODO: Add upper and lower range fields
    class Meta:
        model = ChartStyler
        fields = ('name', 'description', 'keywords', 'data_source_x', 'label_x', 'data_source_y', 'label_y',
                  'range_mode', 'range_x', 'range_y', 'color_mode', 'color_rgb', 'max_points',)
        labels = {
            'range_x': _('Range X:'),
            'range_y': _('Range Y:'),
            'label_x': _('Label X:'),
            'label_y': _('Label Y:'),
            'color_rgb': _('Color RGB'),
        }


class LocationIndicatorForm(forms.ModelForm):
    observations = Observation.objects.all()
    data_source_lat = ObservationSelectField(label='Data Source (Latitude):', queryset=observations)
    data_source_lon = ObservationSelectField(label='Data Source (Longitude):', queryset=observations)
    data_source_alt = ObservationSelectField(label='Data Source (Altitude):', queryset=observations)

    class Meta:
        model = PointMarkerStyler
        fields = ('name', 'description', 'keywords', 'data_source_lat', 'data_source_lon', 'data_source_alt',
                  'view_icon', 'render_mode',)
        labels = {
            'view_icon': _('Icon:'),
            'render_mode': _('Render Mode:'),
        }


class TextStylerForm(forms.ModelForm):
    observations = Observation.objects.all()
    data_source = ObservationSelectField(label='Data Source:', queryset=observations)

    class Meta:
        model = TextStyler
        # TODO: Rework the color and threshold form options
        # The add HTML sheet may be useful for this (uncertain)
        fields = ('name', 'description', 'keywords', 'data_source', 'color_mode', 'color_rgb', 'thresholds',)
        labels = {
            'color_mode': _('Color Mode:'),
            'color_rgb': _('Color RGB:'),
        }


class VideoViewForm(forms.ModelForm):
    observations = Observation.objects.all()
    data_source = ObservationSelectField(label='Data Source:', queryset=observations)

    class Meta:
        model = VideoStyler
        fields = ('name', 'description', 'keywords', 'data_source', 'show', 'draggable', 'dockable', 'keep_ratio',
                  'closeable',)
        labels = {
            'keep_ratio': _('Keep Ratio:')
        }


class ViewFormset(forms.BaseModelFormSet):
    var = ''


class CompositeForm(forms.ModelForm):
    keyed_field = forms.ChoiceField(
        choices=(('A', 'Choice A'),
                 ('B', 'Choice B'),
                 ('C', 'Choice C')
                 ),
        label='Keyed Field'
    )

    class Meta:
        model = View
        fields = ('name', 'description', 'keywords',)

    def doStuff(self):
        pass


class MapTemplateForm(forms.Form):
    name = forms.CharField()
    description = forms.CharField(max_length=500)
    keywords = forms.CharField(max_length=500)
