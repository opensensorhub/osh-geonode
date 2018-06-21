from django import forms

# Model Imports
from geonode.contrib.opensensorhub.models import Hub, Observation, OSHLayer, VideoView, \
    ChartStyler, LocationIndicator, TextStyler, View, SweService


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

    class Meta:
        model = Observation
        fields = ('name', 'source_type', 'endpoint', 'protocol', 'offering', 'service',
                  'observed_property', 'start_time', 'end_time', 'sync_master_time', 'buffering_time', 'time_shift',
                  'replay_speed', )


class HubForm(forms.ModelForm):
    name = forms.CharField()
    url = forms.URLField(label='URL')
    description = forms.CharField(max_length=500)
    keywords = forms.CharField(max_length=500)
    
    class Meta:
        model = Hub
        fields = ('name', 'url', 'protocol', 'description', 'keywords', )

    def do_stuff(self):
        pass


class ViewForm(forms.ModelForm):
    class Meta:
        view_model = View
        styler_models = {'Chart': ChartStyler, 'Text': TextStyler, 'Location': LocationIndicator, 'Video': VideoView}
        fields = ('name', )

    def magic(self):
        pass


class ChartStylerForm(forms.ModelForm):
    class Meta:
        model = ChartStyler
        fields = ('name', 'description', 'data_source_x', 'label_x', 'data_source_y', 'label_y', 'keywords',
                  'range_mode', 'range_x', 'range_y','color_mode', 'color_rgb', 'max_points',)


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
