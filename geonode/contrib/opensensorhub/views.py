from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import redirect, render_to_response

import forms as TestForm

def index(request):
    my_dict = {'insert_me': "Hello, I am from views.py"}
    return render(request, 'components/wizard_add_hub.html', context=my_dict)


# TODO: Remove after demonstration
def create_user(request):
    extra_questions = get_questions(request)
    form = TestForm(request.POST or None, extra=extra_questions)
    if form.is_valid():
        for (question, answer) in form.extra_answers():
            TestForm.save_answer(request, question, answer)
        return redirect("create_user_success")

    return render_to_response("form.html", {'form': form})
