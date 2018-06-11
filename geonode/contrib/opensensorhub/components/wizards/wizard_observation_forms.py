from django import forms


class ObservationForm(forms.Form):
    name = forms.CharField
    source_type = forms.CharField
    endpoint_url = forms.URLField
    protocol = forms.Select
    offering_id = forms.CharField
    offering_service = forms.Select
    observed_property = forms.URLField
    start_time = forms.DateTimeField
    end_time = forms.DateTimeField
    sync_master_time = forms.CheckboxInput
    buffering_time = forms.IntegerField
    time_shift = forms.IntegerField
    replay_speed = forms.Select
