from django import forms
import wizard_forms

WizardFormSet = forms.modelformset_factory(wizard_forms.ViewForm)
