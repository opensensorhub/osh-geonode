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

import json
import urllib2
import xml.etree.ElementTree as ElementTree
import dateutil.parser

from datetime import datetime

from django.http import HttpResponse, HttpResponseServerError

from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def get_sensor_description(request):
    response = "Malformed Request: "
    request_data = json.loads(request.body)

    try:
        get_sensor_description_req = \
            '{}/sos?service=SOS&version=2.0' \
            '&request=DescribeSensor' \
            '&procedure={}' \
            '&procedureDescriptionFormat=http://www.opengis.net/sensorml-json/2.0'. \
            format(request_data['hubAddress'], request_data['procedure'])

        # Get capabilities from selected hub
        response = urllib2.urlopen(get_sensor_description_req).read()

    except:
        # Error has occurred in reading request, send default response
        HttpResponseServerError(response)

    # Send
    return HttpResponse(response)


@csrf_exempt
def get_result_template(request):
    response = "Malformed Request: "
    request_data = json.loads(request.body)

    try:
        get_result_template_req = \
            '{}/sos?service=SOS&version=2.0' \
            '&request=GetResultTemplate' \
            '&offering={}' \
            '&observedProperty={}' \
            '&responseFormat=application/json'. \
            format(request_data['hubAddress'], request_data['offering'], request_data['observed_property'])

        # Get capabilities from selected hub
        response = urllib2.urlopen(get_result_template_req).read()

    except:
        # Error has occurred in reading request, send default response
        HttpResponseServerError(response)

    # Send
    return HttpResponse(response)


# Processes request to retrieve capabilities from a Hub
@csrf_exempt
def get_capabilities(request):
    response = "Malformed Request: Expecting URL of Open Sensor Hub - e.g. http://botts-geo.com:8181/sensorhub"
    request_data = json.loads(request.body)

    try:
        # Append "sos?service=SOS&version=2.0&request=GetCapabilities" to get capabilities from OSH hub
        get_capabilities_req = \
            '{}/sos?service=SOS&version=2.0' \
            '&request=GetCapabilities'. \
            format(request_data['hubAddress'])

        # Get capabilities from selected hub
        capabilities = urllib2.urlopen(get_capabilities_req).read()

        # Parse the capabilities
        response = parse_capabilities(get_capabilities_req, capabilities)

    except:
        # Error has occurred in reading request, send default response
        HttpResponseServerError(response)

    # Send
    return HttpResponse(response)


# Parses the capabilities XML document provided by a Hub
def parse_capabilities(server_url, capabilities_xml):
    capabilities = {'serverUrl': server_url, 'offerings': []}

    root = ElementTree.fromstring(capabilities_xml)

    # Namespace dictionary to help make iterating over elements less verbose below
    ns = {'swes': 'http://www.opengis.net/swes/2.0',
          'sos': 'http://www.opengis.net/sos/2.0',
          'gml': 'http://www.opengis.net/gml/3.2'}

    # Retrieve the list of offerings
    offering_list = root.findall('*//sos:ObservationOffering', ns)

    # Iterate through each offering in the list
    for offering in offering_list:
        name = offering.find('swes:name', ns)
        procedure_id = offering.find('swes:procedure', ns)
        offering_id = offering.find('swes:identifier', ns)
        desc = offering.find('swes:description', ns)

        # get all the info we need for the offering (name, desc, time range, etc.)
        offering_info = {}

        # Parse the begin time fields
        for begin_time in offering.iterfind('*//gml:beginPosition', ns):
            if begin_time.text is None:
                offering_info['start_time'] = 'now'
                offering_info['user_start_time'] = datetime.now()
            else:
                offering_info['start_time'] = begin_time.text.replace('T', ' ').replace('Z', '')
                offering_info['user_start_time'] = dateutil.parser.parse(begin_time.text)

        # Parse the end time fields
        for end_time in offering.iterfind('*//gml:endPosition', ns):
            if end_time.text is None:
                offering_info['end_time'] = 'now'
                offering_info['user_end_time'] = datetime.now()
            else:
                offering_info['end_time'] = end_time.text.replace('T', ' ').replace('Z', '')
                offering_info['user_end_time'] = dateutil.parser.parse(end_time.text)

        # Store the offering information
        offering_info['name'] = name.text
        offering_info['procedure_id'] = procedure_id.text
        offering_info['offering_id'] = offering_id.text
        offering_info['description'] = desc.text
        offering_info['observable_props'] = []
        # offering_info['selected_observable_props'] = ""
        # offering_info['config_name'] = ""
        offering_info['temp_enabled'] = False

        # Place each observable property into the offering
        for observable_property in offering.findall('swes:observableProperty', ns):
            offering_info['observable_props'].append(observable_property.text)

        # Add the offering into the list of offerings
        capabilities['offerings'].append(offering_info)

    # Return a JSON structure representation of the dictionary, default=str is a brute force approach to serialize
    # all elements as strings to avoid JSON serialization problems for objects in the structure
    return json.dumps(capabilities, indent=4, sort_keys=True, default=str)
