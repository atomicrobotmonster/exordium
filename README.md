# Exordium
A character generator for the pen and paper RPG "Barbarians of Lemuria".

Server built using Django 1.7 and Django REST Framework on Python 2.7.5.
Client built using Angular.js 1.3.15 and Bootstrap 3.


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
Lots of angular cleanup:

* use HTTP Interceptors to handle auth instead of universally setting headers
* dirty checking on character editor form
* build selector widgets using angular directives
* using resolve in route to prevent access to routes requiring auth
* overflow: scroll on character selector
* better angular source organization
* grunt based build

API improvements:

* upgrade authentication to token based (OAuth2 or JWT)

Character creation features:

* Profession selection
* Equipment selection