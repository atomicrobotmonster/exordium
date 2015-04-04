from django.conf.urls import patterns, url

from chargen import views

urlpatterns = patterns('',
    url(r'^api/userprofile$', views.UserProfileCreateView.as_view()),
    url(r'^api/userprofile/(?P<user_profile_id>[0-9]+)$', views.UserProfileDetailView.as_view()),
    url(r'^api/userprofile/(?P<user_profile_id>[0-9]+)/character$', views.UserProfileCharacterListView.as_view()),
    url(r'^api/character$', views.CharacterListView.as_view()),
    url(r'^api/character/(?P<pk>[0-9]+)$', views.CharacterDetailView.as_view()),
  
)