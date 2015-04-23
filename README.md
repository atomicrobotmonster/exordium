# Exordium
A character generator for the pen and paper RPG "Barbarians of Lemuria".

Server built using Django (1.7) and Django REST Framework (3.1.1) on Python 2.7.5.
Client built using Angular.js (1.3.15) and Bootstrap 3. The client application is
currently buried in [cotapaxi/static/angular-app](cotapaxi/static/angular-app) pending being moved out into
a separate github repo. In this directory, you will find a gruntfile configured to run jshint.

## Installation
1. pip install django
2. pip install djangorestframework

## Running
1. clone this repo
2. cd to top level of repo 
3. python manage.py runserver
4. point your browser at http://localhost:8000
5. enjoy! 

## TODO
Angular cleanup:

* overflow: scroll on character selector
* handle HTTP errors
* grunt based build

API improvements:

* upgrade authentication to token based (OAuth2 or JWT)

Character creation features:

* Profession selection
* Equipment selection
* Character portrait upload with resize/clipping as necessary
