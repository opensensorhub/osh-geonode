from django import template
import json

register = template.Library()


# -----------------------------------------------------------------------------
# Builds a data receiver
# -----------------------------------------------------------------------------
# KWARGS
# 'replay_factor' - the time compression/dilation factor for data
# 'data_source_name' - used to create the data receiver variable name
# 'data_source_friendly_name' - a print/human friendly string
# 'protocol' - the protocol used
# 'service' - the type of sensor-ml service associated
# 'endpoint' - the hub and service url identifying source of data
# 'offering' - the identifier of the specific offering to plumb to
# 'observed_property' - URL defining the offering/observation
# 'start_time' - the start time of the stream
# 'end_time' - the end time of the stream
# 'sync_master_time' - defines if the datasource is synchronize with the others one
# 'buffering_time' - defines the time during the data has to be buffered
# 'time_shift' - fix problems with some android devices with some timestamp shift to 16 sec
# -----------------------------------------------------------------------------
@register.simple_tag()
def data_receiver(**kwargs):

    script = "//---------- DATASOURCE ------------//\n" \
             "var replayFactor = " + kwargs['replay_factor'] + ";\n" \
             "var " + kwargs['data_source_name'] + "DataSource = new OSH.DataReceiver.JSON(\"" + kwargs['data_source_friendly_name'] + "\", {\n" \
             "    protocol: \"" + kwargs['protocol'] + "\",\n" \
             "    service: \"" + kwargs['service'] + "\",\n" \
             "    endpointUrl: \"" + kwargs['endpoint'] + "\",\n" \
             "    offeringID: \"" + kwargs['offering'] + "\",\n" \
             "    observedProperty: \"" + kwargs['observed_property'] + "\",\n" \
             "    startTime: \"" + kwargs['start_time'] + "\",\n" \
             "    endTime: \"" + kwargs['end_time'] + "\",\n" \
             "    replaySpeed: replayFactor + \"\",\n" \
             "    syncMasterTime: " + kwargs['sync_master_time'] + ",\n" \
             "    bufferingTime: " + kwargs['buffering_time'] + ",\n" \
             "    timeShift: " + kwargs['time_shift'] + "\n" \
             "});\n"

    return script


# -----------------------------------------------------------------------------
# Creates a point marker styler
# -----------------------------------------------------------------------------
# KWARGS
# 'styler_name' - Name of the styler variable
# 'x_component' - The x component of the coordinate system marker
# 'y_component' - The y component of the coordinate system marker
# 'z_component' - The z component of the coordinate system marker
# 'data_source_name' - used to identify the data receiver to use with the styler
# 'location_handler' - a function mapping data source attributes to styler attributes
# 'image_name' - The name of the image/icon to display as the point marker
# 'image_handler' - a function mapping a data source attribute to the image attribute of the styler
# -----------------------------------------------------------------------------
@register.simple_tag()
def point_marker_styler(**kwargs):

    script = "//------------- STYLER ---------//\n" \
             "var " + kwargs['styler_name'] + " = new OSH.UI.Styler.PointMarker({\n" \
             "    location: {\n" \
             "        x: " + kwargs['x_component'] + ",\n" \
             "        y: " + kwargs['y_component'] + ",\n" \
             "        z: " + kwargs['z_component'] + "\n" \
             "    },\n" \
             "    locationFunc: {\n" \
             "        dataSourceIds: [" + kwargs['data_source_name'] + "DataSource.getId()],\n" \
             "        handler: " + kwargs['location_handler'] + "\n"\
             "    },\n" \
             "    icon: '" + kwargs['image_name'] + "',\n" \
             "    iconFunc: {\n" \
             "        dataSourceIds: [" + kwargs['data_source_name'] + "DataSource.getId()],\n" \
             "        handler: " + kwargs['image_handler'] + "\n" \
             "    }\n" \
             "});\n"

    return script


# -----------------------------------------------------------------------------
# Creates a polyline styler
# -----------------------------------------------------------------------------
# KWARGS
# 'styler_name' - Name of the styler variable
# 'data_source_name' - used to identify the data receiver to use with the styler
# 'location_handler' - a function mapping data source attributes to styler attributes
# 'color_rgba' - color definition to apply in RGB + A (alpha - transparency)
# 'weight' - TODO
# 'opacity' - TODO
# 'smooth_factor' - TODO
# 'max_points' - TODO
# -----------------------------------------------------------------------------
@register.simple_tag()
def polyline_styler(**kwargs):

    script = "//------------- STYLER ---------//\n" \
             "var " + kwargs['styler_name'] + " =  new OSH.UI.Styler.Polyline({\n" \
             "    locationFunc: {\n" \
             "        dataSourceIds: [" + kwargs['data_source_name'] + "DataSource.getId()],\n" \
             "        handler: " + kwargs['location_handler'] + "\n"\
             "    },\n" \
             "    color: 'rgba(" + kwargs['color_rgba'] + ")',\n" \
             "    weight: " + kwargs['weight'] + ",\n" \
             "    opacity: " + kwargs['opacity'] + ",\n" \
             "    smoothFactor: " + kwargs['smooth_factor'] + ",\n" \
             "    maxPoints: " + kwargs['max_points'] + ",\n" \
             "});\n"

    return script


# -----------------------------------------------------------------------------
# Creates a view containing a leaflet map
# -----------------------------------------------------------------------------
# KWARGS
# 'stylers' - A json string definition containing 1 or more sylers in the view
#       ['styler'] - the variable name of the styler to associate with the view
#       ['friendly_name'] - a print/human friendly string
# 'view_name' - the id of the <div> within which the view is contained
# -----------------------------------------------------------------------------
@register.simple_tag()
def leaflet_map_view(**kwargs):

    stylers = json.loads(kwargs['stylers'])

    script = "//------------ VIEW -----------------//\n" \
             "var leafletMapView = new OSH.UI.View.LeafletView(\"" + kwargs['view_name'] + "\",\n" \
             "    ["

    for current_styler in stylers:
        script = script + \
             "        {\n" \
             "            styler: " + current_styler['styler'] + ",\n" \
             "            name: \"" + current_styler['friendly_name'] + "\"\n"\
             "        },\n"

    script = script + "    ]);\n"

    return script


# -----------------------------------------------------------------------------
# Creates data provider controller for a specified data source.
# -----------------------------------------------------------------------------
# KWARGS:
# 'replay_factor' - The playback speed of the data
# 'data_source_name' - The data source for which the controller is being created
# -----------------------------------------------------------------------------
@register.simple_tag()
def data_provider_controller(**kwargs):

    script = "//---------------------------------------------------------------//\n" \
             "//--------------------- Creates DataProvider --------------------//\n" \
             "//---------------------------------------------------------------//\n" \
             "var dataProviderController = new OSH.DataReceiver.DataReceiverController({\n" \
             "    replayFactor: " + kwargs['replay_factor'] + "});\n" \
             "// We can add a group of dataSources and set the options\n" \
             "dataProviderController.addDataSource(" + kwargs['data_source_name'] + "DataSource);\n"

    return script


# -----------------------------------------------------------------------------
# Embeds JS command to connect data provider controllers with data sources.
# Begins the data feeds from the hub and offering to the client
# -----------------------------------------------------------------------------
# KWARGS:
# -----------------------------------------------------------------------------
@register.simple_tag()
def connect_controllers():

    script = "//---------------------------------------------------------------//\n" \
             "//---------------------------- Starts ---------------------------//\n" \
             "//---------------------------------------------------------------//\n" \
             "dataProviderController.connectAll();\n"

    return script

# -----------------------------------------------------------------------------
# Embeds opening tag for a script embedded in HTML dynamically
# -----------------------------------------------------------------------------
# KWARGS:
# -----------------------------------------------------------------------------
@register.simple_tag()
def begin_script():
    return "<script>\n"


# -----------------------------------------------------------------------------
# Embeds closing tag for a script embedded in HTML dynamically
# -----------------------------------------------------------------------------
# KWARGS:
# -----------------------------------------------------------------------------
@register.simple_tag()
def end_script():
    return "</script>\n"