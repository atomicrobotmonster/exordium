from django.conf.urls import patterns, url

from chargen import views

urlpatterns = patterns('',
    #url(r'^$', views.index, name='index'),
    url(r'^userprofile/(?P<user_profile_id>[0-9]+)$', views.UserProfileDetailView.as_view()),
    url(r'^userprofile/(?P<user_profile_id>[0-9]+)/character$', views.CharacterListView.as_view()),
    url(r'^character/(?P<pk>[0-9]+)$', views.CharacterDetailView.as_view()),
  
)