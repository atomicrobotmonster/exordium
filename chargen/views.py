from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django import forms
from django.http import HttpResponseForbidden
from models import UserProfile

class LoginCredentialsForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(max_length=100)

def index(request):
    form = LoginCredentialsForm() 
    return render(request, "chargen/index.html", { 'form': form } )


def login_user(request):
    form = LoginCredentialsForm(request.POST)

    if form.is_valid():
        user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'])
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect("/user/%s" % user.id)
            else:
                form.add_error(None, 'Account disabled.')
                return render(request, "chargen/index.html", { 'form': form } )
        else:
            form.add_error(None, 'Unable to login with this username and password.')
            return render(request, "chargen/index.html", { 'form': form } )
    else:
        return render(request, "chargen/index.html", { 'form': form } )


@login_required
def show_user(request,user_id):
    if request.user.id != int(user_id):
        return HttpResponseForbidden()
                
    user_profile = get_object_or_404(UserProfile, user_id=user_id)
    return render(request,"chargen/user.html", { 'userProfile': user_profile })