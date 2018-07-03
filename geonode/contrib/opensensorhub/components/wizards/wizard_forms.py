from django import forms

# Model Imports
from geonode.contrib.opensensorhub.models import Hub, Observation, OSHLayer, VideoView, \
    ChartStyler, LocationIndicator, TextStyler, View, SweService

import geonode.contrib.opensensorhub.models as models


# Custom Fields
class HubSelectionField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return str(obj.name)


class ObservationForm(forms.ModelForm):
    # name = forms.CharField(label='Observation Name', max_length=100)
    # source_type = forms.CharField(label='Source Type', max_length=100)
    # endpoint = forms.URLField(label='Endpoint URL')
    # protocol = forms.ChoiceField(label='Protocol')
    # offering = forms.CharField(label='Offering ID', max_length=100)
    # service = forms.ChoiceField(label='Offering Service')
    # observed_property = forms.URLField(label='Observed Property')
    # start_time = forms.DateTimeField(label='Start Time')
    # end_time = forms.DateTimeField(label='End Time')
    # sync_master_time = forms.BooleanField(label='Sync Master Time')
    # buffering_time = forms.IntegerField(label='Buffering Time')
    # time_shift = forms.IntegerField(label='Time Shift(in ms)')
    # replay_speed = forms.ChoiceField(label='Replay Speed')
    hubs = Hub.objects.all()
    # HUBS = hubs.values()
    # HUBS = ((h['id'], h['name']) for h in hubs)
    # for h in hubs:
    #     print('Hub ID: ', Hub.objects.get(h['id']))
    # HUBS = ((h['id'], h['name']) for h in hubs)
    # HUBS = tuple(HUBS)
    # # targetHub = Hub.objects.filter(id='1')
    # print(HUBS)
    # print('Hubs:^')
    # print(targetHub)
    # HUBS = [hub.name for hub in models.Hub.objects.all()]
    # hub = HubSelectionField(label='Hub', choices=HUBS)
    source_hub = HubSelectionField(label='Hub', queryset=hubs)

    class Meta:
        model = Observation
        fields = ('name', 'description', 'keywords', 'source_hub', 'source_type', 'endpoint', 'protocol', 'offering',
                  'service', 'observed_property', 'start_time', 'end_time', 'sync_master_time', 'buffering_time',
                  'time_shift', 'replay_speed',)


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


class ViewForm(forms.ModelForm):
    class Meta:
        view_model = View
        styler_models = {'Chart': ChartStyler, 'Text': TextStyler, 'Location': LocationIndicator, 'Video': VideoView}
        fields = ('name',)

    def magic(self):
        pass


class ChartStylerForm(forms.ModelForm):
    COLOR_MODE_CHOICES = models.COLOR_MODE_CHOICES
    RANGE_CHOICES = ChartStyler.RANGE_MODE_CHOICES
    # DATASOURCES = [(observation.id, observation.name)for observation in Observation.objects.all()]

    # data_source_x = forms.ChoiceField(label='Data Source X:', choices=DATASOURCES)
    data_source_y = forms.ChoiceField(label='Data Source Y:')
    range_x = forms.FloatField(label='Range X:')
    range_y = forms.FloatField(label='Range Y:')
    label_x = forms.CharField(label='Label X:')
    label_y = forms.CharField(label='Label Y:')
    color_mode = forms.ChoiceField(label='Color Mode:', widget=forms.Select, choices=COLOR_MODE_CHOICES)
    range_mode = forms.ChoiceField(label='Range Mode', widget=forms.Select, choices=RANGE_CHOICES)
    max_points = forms.IntegerField(label='Max Points', initial=30)

    class Meta:
        model = ChartStyler
        fields = ('name', 'description', 'keywords', 'data_source_x', 'label_x', 'data_source_y', 'label_y',
                  'range_mode', 'range_x', 'range_y', 'color_mode', 'color_rgb', 'max_points',)


class LocationIndicatorForm(forms.ModelForm):
    class Meta:
        model = LocationIndicator
        fields = ('name', 'description', 'keywords', 'data_source_lat', 'data_source_lon', 'data_source_alt',
                  'view_icon', 'render_mode',)


class TextStylerForm(forms.ModelForm):
    class Meta:
        model = TextStyler
        fields = ('name', 'description', 'keywords', 'data_source', 'color_mode', 'color_rgb', 'thresholds',)


class VideoViewForm(forms.ModelForm):
    class Meta:
        model = VideoView
        fields = ('name', 'description', 'keywords', 'data_source', 'show', 'draggable', 'dockable', 'keep_ratio',
                  'closeable',)


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
