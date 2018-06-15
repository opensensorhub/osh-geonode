from django import forms


class ObservationForm(forms.Form):
    name = forms.CharField
    source_type = forms.CharField(label='Source Type', max_length=100)
    endpoint_url = forms.URLField(label='Endpoint URL', max_length=100)
    protocol = forms.ChoiceField(label='Protocol')
    offering_id = forms.CharField(label='Offering ID')
    offering_service = forms.ChoiceField(label='Offering Service')
    observed_property = forms.URLField(label='Observed Property')
    start_time = forms.DateTimeField(label='Start Time')
    end_time = forms.DateTimeField(label='End Time')
    sync_master_time = forms.BooleanField(label='Sync Master Time')
    buffering_time = forms.IntegerField(label='Buffering Time')
    time_shift = forms.IntegerField(label='Time Shift')
    replay_speed = forms.ChoiceField(label='Replay Speed')

    def do_stuff(self):
        pass


class HubForm(forms.Form):
    name = forms.CharField()
    url = forms.URLField()