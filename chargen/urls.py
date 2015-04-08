from django.conf.urls import patterns, url
from rest_framework import routers
from chargen import views

router = routers.SimpleRouter(trailing_slash=False)
router.register(r'^character', views.CharacterViewSet, base_name='character')

urlpatterns = patterns('',
                       url(r'^current-user$',
                           views.CurrentUserProfileDetailView.as_view()),
                       url(r'^userprofile$',
                           views.UserProfileCreateView.as_view()),
                       url(r'^userprofile/(?P<id>[0-9]+)$',
                           views.UserProfileDetailView.as_view()),
                       )

urlpatterns += router.urls
