# -*- coding: utf-8 -*-
#########################################################################
#
# Copyright (C) 2018 OpenSensorHub.org - www.opensensorhub.org
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################

from django.contrib import admin

# Register your models here.

from models import TextStyler, LocationIndicator, ChartStyler
from models import View, VideoView
from models import Hub, Observation, OSHLayer


class OshModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    fields = ('name', 'description', 'keywords')


class StylerAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + \
             ('timeout', 'styler_type', 'view')


class TextStylerAdmin(StylerAdmin):
    fields = StylerAdmin.fields + \
             ('data_source', 'location', 'color_mode',
              'color_rgb', 'thresholds')

class LocationIndicatorAdmin(StylerAdmin):
    fields = StylerAdmin.fields + \
             ('data_source_lat', 'data_source_lon',
              'data_source_alt', 'view_icon', 'render_mode')



class ChartStylerAdmin(StylerAdmin):
    fields = StylerAdmin.fields + \
             ('data_source_x', 'data_source_y', 'label_x', 'label_y',
              'color_mode', 'range_mode', 'range_x', 'range_y',
              'max_points', 'color_rgb', 'thresholds')


class ViewAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + ('sensor_archetype', )


class VideoViewAdmin(StylerAdmin):
    fields = StylerAdmin.fields + \
             ('data_source', 'draggable', 'show',
              'dockable', 'closeable', 'keep_ratio')


class HubAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + ('url', 'protocol')


class ObservationAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + \
             ('hub', 'layer', 'view', 'endpoint', 'offering',
              'observed_property', 'start_time', 'end_time',
              'sync_master_time', 'buffering_time', 'time_shift',
              'source_type', 'replay_speed', 'protocol')


class OSHLayerAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + ('url', 'protocol')


admin.site.register(TextStyler, TextStylerAdmin)
admin.site.register(LocationIndicator, LocationIndicatorAdmin)
admin.site.register(ChartStyler, ChartStylerAdmin)
admin.site.register(View, ViewAdmin)
admin.site.register(VideoView, VideoViewAdmin)
admin.site.register(Hub, HubAdmin)
admin.site.register(Observation, ObservationAdmin)
admin.site.register(OSHLayer, OSHLayerAdmin)
