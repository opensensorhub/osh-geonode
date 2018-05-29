
# OSH_INTEG

from django.conf.urls import patterns, url

from views import *

app_name = 'opensensorhub'

urlpatterns = patterns('.views',
                       url(r'^get_capabilities$', get_capabilities, name='get_capabilities'),
                       url(r'^layers/create$', create_sensor_layer, name='create_sensor_layer'),
                       )
