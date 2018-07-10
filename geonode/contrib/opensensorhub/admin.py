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

admin.site.register(TextStyler)
admin.site.register(LocationIndicator)
admin.site.register(ChartStyler)
admin.site.register(View)
admin.site.register(VideoView)
admin.site.register(Hub)
admin.site.register(Observation)
admin.site.register(OSHLayer)
