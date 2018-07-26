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

from models import Category
from models import TextStyler, PointMarkerStyler, ChartStyler
from models import View, VideoStyler
from models import Hub, Observation, Layer


class OshModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'category', 'keywords')
    fields = ('name', 'description', 'keywords', 'category')


class StylerAdmin(OshModelAdmin):
    readonly_fields = ('type',)
    fields = OshModelAdmin.fields + ('view', 'type')


class TextStylerAdmin(StylerAdmin):
    fields = StylerAdmin.fields + \
             ('screen_position', 'color_mode',
              'color_rgb', 'thresholds')


class PointMarkerStylerAdmin(StylerAdmin):
    fields = StylerAdmin.fields + \
             ('view_icon', 'render_mode')


class ChartStylerAdmin(StylerAdmin):
    fields = StylerAdmin.fields + \
             ('label_x', 'label_y',
              'color_mode', 'range_mode', 'range_x', 'range_y',
              'max_points', 'color_rgb', 'thresholds')


class VideoStylerAdmin(StylerAdmin):
    fields = StylerAdmin.fields + \
             ('keep_ratio',)


class ViewAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + ('observations', 'draggable', 'show',
                                     'dockable', 'closeable')


class HubAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + ('url', 'protocol')


class ObservationAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + \
             ('hub', 'endpoint', 'offering',
              'observed_property', 'start_time', 'end_time',
              'sync_master_time', 'buffering_time', 'time_shift',
              'source_type', 'replay_speed', 'protocol')


class LayerAdmin(OshModelAdmin):
    fields = OshModelAdmin.fields + ('views',)


admin.site.register(TextStyler, TextStylerAdmin)
admin.site.register(PointMarkerStyler, PointMarkerStylerAdmin)
admin.site.register(ChartStyler, ChartStylerAdmin)
admin.site.register(View, ViewAdmin)
admin.site.register(VideoStyler, VideoStylerAdmin)
admin.site.register(Hub, HubAdmin)
admin.site.register(Observation, ObservationAdmin)
admin.site.register(Layer, LayerAdmin)
admin.site.register(Category)
