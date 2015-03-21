from django.conf.urls import patterns, url

from chargen import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
)