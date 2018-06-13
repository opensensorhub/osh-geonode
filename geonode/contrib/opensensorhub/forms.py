from django import forms


class TestForm(forms.Form):
    username = forms.CharField(max_length=30)
    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        extra = kwargs.pop('extra')
        super(TestForm, self).__init__(*args, **kwargs)

        for i, question in enumerate(extra):
            self.fields['custom_%s' % i] = forms.CharField(label=question)

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1", "")
        password2 = self.cleaned_data["password2"]
        if password1 != password2:
            raise forms.ValidationError("The two password fields didn't match.")
        return password2

    def extra_answers(self):
        for name, value in self.cleaned_data.items():
            if name.startswith('custom_'):
                yield (self.fields[name].label, value)

    def save_answer(self, request, question, answer):
        print("Data Saved!")
        return

    def get_questions(self):
        print("Hi")
        return 1


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

    def do_stuff(self):
        pass
