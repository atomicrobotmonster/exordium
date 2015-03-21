from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django import forms

class LoginCredentialsForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(max_length=100)

def index(request):
    form = LoginCredentialsForm() 
    return render(request, "chargen/index.html", { 'form': form } )


def login_user(request):
    form = LoginCredentialsForm(request.POST)

    if form.is_valid():
        print form.cleaned_data
        user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'])
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect("/user")
            else:
                form.add_error(None, 'Account disabled.')
                return render(request, "chargen/index.html", { 'form': form } )
        else:
            form.add_error(None, 'Unable to login with this username and password.')
            return render(request, "chargen/index.html", { 'form': form } )
    else:
        return render(request, "chargen/index.html", { 'form': form } )


def show_user(request):
    return render(request,"chargen/user.html")