from django.conf.urls import patterns, url

from chargen import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^login$', views.login_user, name='my-login'),
    url(r'^user/(\d+)$', views.show_user, name='user'),
)