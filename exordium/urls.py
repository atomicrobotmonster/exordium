from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'exordium.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'', include('chargen.urls', namespace="chargen")),
    url(r'^admin/', include(admin.site.urls)),
)
