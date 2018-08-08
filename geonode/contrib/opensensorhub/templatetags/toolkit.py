from django import template
import json
import re

register = template.Library()


# -----------------------------------------------------------------------------
# OSH.DataReceiver.JSON
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
# Example:
# var androidPhoneGpsDataSource = new OSH.DataReceiver.JSON("android-GPS", {
#         protocol: "ws",
#         service: "SOS",
#         endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
#         offeringID: "urn:android:device:060693280a28e015-sos",
#         observedProperty: "http://sensorml.com/ont/swe/property/Location",
#         startTime: "2015-02-16T07:58:00Z",
#         endTime: "2015-02-16T08:09:00Z",
#         replaySpeed: replayFactor+"",
#         syncMasterTime: true,
#         bufferingTime: 1000,
#         timeShift: -16000
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def data_receiver(**kwargs):

    script = "\n"
    script += "//---------- DATASOURCE ------------//\n"
    script += "var replayFactor = " + kwargs['replay_factor'] + ";\n"
    script += "var " + kwargs['data_source_name'] + "DataSource = new OSH.DataReceiver.JSON(\"" + kwargs['data_source_friendly_name'] + "\","
    script += "    {\n"
    script += "        protocol: \"" + kwargs['protocol'] + "\",\n"
    script += "        service: \"" + kwargs['service'] + "\",\n"
    script += "        endpointUrl: \"" + kwargs['endpoint'] + "\",\n"
    script += "        offeringID: \"" + kwargs['offering'] + "\",\n"
    script += "        observedProperty: \"" + kwargs['observed_property'] + "\",\n"
    script += "        startTime: \"" + kwargs['start_time'] + "\",\n"
    script += "        endTime: \"" + kwargs['end_time'] + "\",\n"
    script += "        replaySpeed: replayFactor + \"\",\n"
    script += "        syncMasterTime: " + kwargs['sync_master_time'] + ",\n"
    script += "        bufferingTime: " + kwargs['buffering_time'] + ",\n"
    script += "        timeShift: " + kwargs['time_shift'] + "\n"
    script += "    });\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.Styler.PointMarker
# -----------------------------------------------------------------------------
# KWARGS
# 'styler_name' - Name of the styler variable
# 'x_component' - The x component of the coordinate system marker
# 'y_component' - The y component of the coordinate system marker
# 'z_component' - The z component of the coordinate system marker
# 'location_data_sources' - used to identify the data receiver to use with the styler
# 'location_handler' - a function mapping data source attributes to styler attributes
# 'image_name' - The name of the image/icon to display as the point marker
# 'image_data_sources' - used to identify the data receiver to use with the styler
# 'image_handler' - a function mapping a data source attribute to the image attribute of the styler
# 'orientation_data_sources' - used to identify the data receiver to use with the styler
# 'orientation_handler' - a function mapping a data source attribute to the image attribute of the styler
# -----------------------------------------------------------------------------
# Example:
# var pointMarker = new OSH.UI.Styler.PointMarker({
#         location : {
#             x : 1.42376557,
#             y : 43.61758626,
#             z : 100
#         },
#         locationFunc : {
#             dataSourceIds : [androidPhoneGpsDataSource.getId()],
#             handler : function(rec) {
#                 return {
#                     x : rec.lon,
#                     y : rec.lat,
#                     z : rec.alt
#                 };
#             }
#         },
#         orientationFunc : {
#             dataSourceIds : [androidPhoneOrientationDataSource.getId()],
#             handler : function(rec) {
#                 return {
#                     heading : rec.heading
#                 };
#             }
#         },
#         icon : 'images/cameralook.png',
#         iconFunc : {
#             dataSourceIds: [androidPhoneGpsDataSource.getId()],
#             handler : function(rec,timeStamp,options) {
#                 if(options.selected) {
#                     return 'images/cameralook-selected.png'
#                 } else {
#                     return 'images/cameralook.png';
#                 };
#             }
#         }
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def point_marker_styler(**kwargs):

    script = "\n"
    script += "//------------- STYLER ---------//\n"
    script += "var " + kwargs['styler_name'] + " = new OSH.UI.Styler.PointMarker({\n"
    script += "    location: {\n"
    script += "        x: " + kwargs['x_component'] + ",\n"
    script += "        y: " + kwargs['y_component'] + ",\n"
    script += "        z: " + kwargs['z_component'] + "\n"
    script += "    },\n"
    script += "    locationFunc: {\n"
    script += "            dataSourceIds: [\n"
    for data_source in re.split(',', kwargs['location_data_sources']):
        if data_source:
            script += "                " + data_source + "DataSource.getId(),\n"
    script += "            ],\n"
    script += "        handler: " + kwargs['location_handler'] + "\n"
    script += "    },\n"
    if 'orientation_handler' in kwargs:
        script += "    orientationFunc: {\n"
        script += "            dataSourceIds: [\n"
        for data_source in re.split(',', kwargs['orientation_data_sources']):
            if data_source:
                script += "                " + data_source + "DataSource.getId(),\n"
        script += "            ],\n"
        script += "        handler: " + kwargs['orientation_handler'] + "\n"
        script += "    },\n"
    script += "    icon: '" + kwargs['image_name'] + "',\n"
    script += "    iconFunc: {\n"
    script += "            dataSourceIds: [\n"
    for data_source in re.split(',', kwargs['image_data_sources']):
        if data_source:
            script += "                " + data_source + "DataSource.getId(),\n"
    script += "            ],\n"
    script += "        handler: " + kwargs['image_handler'] + "\n"
    script += "    }\n"
    script += "});\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.Styler.Polyline
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
# Example:
# var polylineStyler = new OSH.UI.Styler.Polyline({
#         locationFunc : {
#             dataSourceIds: [datasource.getId()],
#             handler: function(rec) {
#                 return {
#                     x: rec.lon,
#                     y: rec.lat,
#                     z: rec.alt
#                 };
#             }
#         },
#         color: 'rgba(0,0,255,0.5)',
#         weight: 10,
#         opacity: .5,
#         smoothFactor: 1,
#         maxPoints: 200
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def polyline_styler(**kwargs):

    script = "\n"
    script += "//------------- STYLER ---------//\n"
    script += "var " + kwargs['styler_name'] + " =  new OSH.UI.Styler.Polyline({\n"
    script += "        locationFunc: {\n"
    script += "            dataSourceIds: [\n"
    for data_source in re.split(',', kwargs['data_sources']):
        if data_source:
            script += "                " + data_source + "DataSource.getId(),\n"
    script += "            ],\n"
    script += "            handler: " + kwargs['location_handler'] + "\n"
    script += "        },\n"
    script += "        color: 'rgba(" + kwargs['color_rgba'] + ")',\n"
    script += "        weight: " + kwargs['weight'] + ",\n"
    script += "        opacity: " + kwargs['opacity'] + ",\n"
    script += "        smoothFactor: " + kwargs['smooth_factor'] + ",\n"
    script += "        maxPoints: " + kwargs['max_points'] + ",\n"
    script += "    });\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.Styler.Curve
# -----------------------------------------------------------------------------
# KWARGS
# 'styler_name' - Name of the styler variable
# 'data_sources' - used to identify the data receivers to use with the styler
# 'handler' - a function mapping data source attributes to styler attributes
# -----------------------------------------------------------------------------
# Example:
# var curveStyler =  new OSH.UI.Styler.Curve({
#     valuesFunc: {
#         dataSourceIds: [weatherDataSource.getId()],
#         handler: function(rec, timeStamp) {
#             return {
#                 x: timeStamp,
#                 y: parseFloat(rec[2])
#             };
#          }
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def curve_styler(**kwargs):

    script = "\n"
    script += "//------------- STYLER ---------//\n"
    script += "var " + kwargs['styler_name'] + " =  new OSH.UI.Styler.Curve({\n"
    script += "        valuesFunc: {\n"
    script += "            dataSourceIds: ["
    for data_source in re.split(',', kwargs['data_sources']):
        if data_source:
            script += "                " + data_source + "DataSource.getId(),\n"
    script += "            ],\n"
    script += "            handler: " + kwargs['handler'] + "\n"
    script += "        },\n"
    script += "    });\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.RangeSlider
# -----------------------------------------------------------------------------
# KWARGS
# 'containerId' - TODO
# 'startTime' - TODO
# 'endTime' - TODO
# 'refreshRate' - TODO
# 'data_sources' - TODO
# -----------------------------------------------------------------------------
# Example:
# var rangeSlider = new OSH.UI.RangeSlider("rangeSlider-container",{
#         startTime: "2015-02-16T07:58:00Z",
#         endTime: "2015-02-16T08:09:00Z",
#         refreshRate:1,
#         dataSourcesId: [someDataSource.id],
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def range_slider(**kwargs):

    script = "\n"
    script += "var rangeSlider = new OSH.UI.RangeSlider(" + kwargs['containerId'] + ",{\n"
    script += "        startTime: \"" + kwargs['startTime'] + "\",\n"
    script += "        endTime: \"" + kwargs['endTime'] + "\",\n"
    script += "        refreshRate: \"" + kwargs['refreshRate'] + "\",\n"
    script += "        dataSourcesId: ["
    for data_source in re.split(',', kwargs['data_sources']):
        if data_source:
            script += "            " + data_source + "DataSource.getId(),\n"
    script += "        ],\n"
    script += "    });\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.ContextMenu.StackMenu
# -----------------------------------------------------------------------------
# KWARGS
# 'items' - A json string definition containing 1 or more menu items
#       ['name'] - TODO
#       ['viewId'] - TODO
#       ['css'] - TODO
# 'randomId' - TODO
# 'randomGroupId' - TODO
# -----------------------------------------------------------------------------
# Example:
# var menuItems = [{
#         name: "Item 1",
#         viewId: viewId,
#         css: "someCssClass"
#     },{
#         name: "Item 2",
#         viewId: viewId2,
#         css: "someCssClass"
#     }];
#
# var contextCircularMenu = new OSH.UI.ContextMenu.StackMenu({id : randomId,groupId: randomGroupId,items : menuItems});
# -----------------------------------------------------------------------------
@register.simple_tag()
def stack_menu(**kwargs):

    items = json.loads(kwargs['items'])

    script = "\n"
    script += "var menuItems = ["

    for current_item in items:
        script += "        {\n"
        script += "            name: " + current_item['name'] + ",\n"
        script += "            viewId: \"" + current_item['viewId'] + "\"\n"
        script += "            css: " + current_item['css'] + ",\n"
        script += "        },\n"

    script += "    ];\n"

    script += "var contextStackMenu = new OSH.UI.ContextMenu.StackMenu(\n"
    script += "        {\n"
    script += "            id: " + kwargs['randomId'] + ",\n"
    script += "            groupId: " + kwargs['randomGroupId'] + ",\n"
    script += "            items: menuItems\n"
    script += "        });\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.ContextMenu.CircularMenu
# -----------------------------------------------------------------------------
# KWARGS
# 'items' - A json string definition containing 1 or more menu items
#       ['name'] - TODO
#       ['viewId'] - TODO
#       ['css'] - TODO
# 'randomId' - TODO
# 'randomGroupId' - TODO
# -----------------------------------------------------------------------------
# Example:
# var menuItems = [{
#         name: "Item 1",
#         viewId: viewId,
#         css: "someCssClass"
#     },{
#         name: "Item 2",
#         viewId: viewId2,
#         css: "someCssClass"
#     }];
#
# var contextCircularMenu = new OSH.UI.ContextMenu.CircularMenu(
#     {
#         id : randomId,
#         groupId: randomGroupId,
#         items : menuItems
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def circular_menu(**kwargs):

    items = json.loads(kwargs['items'])

    script = "\n"
    script += "var menuItems = ["

    for current_item in items:
        script += "        {\n"
        script += "            name: " + current_item['name'] + ",\n"
        script += "            viewId: \"" + current_item['viewId'] + "\"\n"
        script += "            css: " + current_item['css'] + ",\n"
        script += "        },\n"

    script += "    ];\n"

    script += "var contextCircularMenu = new OSH.UI.ContextMenu.CircularMenu(\n"
    script += "        {\n"
    script += "            id: " + kwargs['randomId'] + ",\n"
    script += "            groupId: " + kwargs['randomGroupId'] + ",\n"
    script += "            items: menuItems\n"
    script += "        });\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.Nvd3CurveChartView
# -----------------------------------------------------------------------------
# KWARGS
# 'containerId' - TODO
# 'name' - TODO
# 'yLabel' - TODO
# 'xLabel' - TODO
# 'css' - TODO
# 'cssSelected' - TODO
# 'maxPoints' - TODO
# -----------------------------------------------------------------------------
# Example:
# var windSpeedChartView = new OSH.UI.Nvd3CurveChartView(chartDialog.popContentDiv.id,
#       [{
#           styler: new OSH.UI.Styler.Curve({
#               valuesFunc: {
#                   dataSourceIds: [weatherDataSource.getId()],
#                   handler: function(rec, timeStamp) {
#                       return {
#                           x: timeStamp,
#                           y: parseFloat(rec[2])
#                       };
#                   }
#               }
#           })
#       }],
#       {
#           name: "WindSpeed chart",
#           yLabel: 'Wind Speed (m/s)',
#           xLabel: 'Time',
#           css: "chart-view",
#           cssSelected: "video-selected",
#           maxPoints: 30
#       });
# -----------------------------------------------------------------------------
@register.simple_tag()
def Nvd3CurveChartView(**kwargs):

    script = "var windSpeedChartView = new OSH.UI.Nvd3CurveChartView(" + kwargs['containerId'] + ",\n"
    script += "        views: ["

    for current_styler in re.split(',', kwargs['stylers']):
        if current_styler:
            script += "        {\n"
            script += "            styler: '" + current_styler + "'\n"
            script += "        },\n"

    script += "        ],\n"
    script += "        name: " + kwargs['name'] + ",\n"
    script += "        yLabel: " + kwargs['yLabel'] + ",\n"
    script += "        xLabel: " + kwargs['xLabel'] + ",\n"
    script += "        css: " + kwargs['css'] + ",\n"
    script += "        cssSelected: " + kwargs['cssSelected'] + ",\n"
    script += "        maxPoints: " + kwargs['maxPoints'] + ",\n"
    script += "    });"

    return script

# -----------------------------------------------------------------------------
# OSH.UI.Mp4View
# -----------------------------------------------------------------------------
# KWARGS
# 'containerId' - TODO
# 'dataSourceId' - TODO
# 'css' - TODO
# 'cssSelected' - TODO
# 'name' - TODO
# -----------------------------------------------------------------------------
# Example:
# var videoView = new OSH.UI.Mp4View("containerId", {
#         dataSourceId: datasource.id,
#         css: "video",
#         cssSelected: "video-selected",
#         name: "Video"
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def entity_mp4_view(**kwargs):

    script = "\n"
    script += "var videoView = new OSH.UI.Mp4View(" + kwargs['containerId'] + ",\n"
    script += "        {\n"
    script += "            dataSourceId: \"" + kwargs['dataSourceId'] + "\"\n"
    script += "            css: \"" + kwargs['css'] + "\"\n"
    script += "            cssSelected: \"" + kwargs['cssSelected'] + "\"\n"
    script += "            name: \"" + kwargs['name'] + "\"\n"
    script += "        }\n"
    script += "    );"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.MjpegView
# -----------------------------------------------------------------------------
# KWARGS
# 'containerId' - TODO
# 'dataSourceId' - TODO
# 'entityId' - TODO
# 'css' - TODO
# 'cssSelected' - TODO
# 'name' - TODO
# -----------------------------------------------------------------------------
# Example:
# var videoView = new OSH.UI.MjpegView("containerId", {
#         dataSourceId: datasource.id,
#         entityId : entity.id,
#         css: "video",
#         cssSelected: "video-selected",
#         name: "Video"
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def entity_mjpeg_view(**kwargs):

    script = "\n"
    script += "var videoView = new OSH.UI.MjpegView(" + kwargs['containerId'] + ",\n"
    script += "        {\n"
    script += "            dataSourceId: \"" + kwargs['dataSourceId'] + "\"\n"
    script += "            entityId: " + kwargs['entityId'] + "\n"
    script += "            css: \"" + kwargs['css'] + "\"\n"
    script += "            cssSelected: \"" + kwargs['cssSelected'] + "\"\n"
    script += "            name: \"" + kwargs['name'] + "\"\n"
    script += "        }\n"
    script += "    );"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.FFMPEGView
# -----------------------------------------------------------------------------
# KWARGS
# 'containerId' - TODO
# 'dataSourceId' - TODO
# 'css' - TODO
# 'cssSelected' - TODO
# 'name' - TODO
# 'useWorker' - TODO
# 'useWebWorkerTransferableData' - TODO
# -----------------------------------------------------------------------------
# Example:
# var videoView = new OSH.UI.FFMPEGView("videoContainer-id",
#     {
#         dataSourceId: videoDataSource.id,
#         css: "video",
#         cssSelected: "video-selected",
#         name: "Video",
#         useWorker:true,
#         useWebWorkerTransferableData: false
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def entity_ffmpeg_view(**kwargs):

    script = "\n"
    script += "var videoView = new OSH.UI.FFMPEGView(" + kwargs['containerId'] + ",\n"
    script += "        {\n"
    script += "            dataSourceId: \"" + kwargs['dataSourceId'] + "\"\n"
    script += "            css: \"" + kwargs['css'] + "\"\n"
    script += "            cssSelected: \"" + kwargs['cssSelected'] + "\"\n"
    script += "            name: \"" + kwargs['name'] + "\"\n"
    script += "            useWorker: " + kwargs['useWorker'] + "\n"
    script += "            useWebWorkerTransferableData: " + kwargs['useWebWorkerTransferableData'] + "\n"
    script += "        }\n"
    script += "    );"

    return script

# -----------------------------------------------------------------------------
# OSH.UI.EntityTreeView
# -----------------------------------------------------------------------------
# KWARGS
# 'containerId' - TODO
# 'entity' - TODO
# 'path' - TODO
# 'treeIcon' - TODO
# 'contextMenuId' - TODO
# 'css' - TODO
# -----------------------------------------------------------------------------
# Example:
# var entityTreeView = new OSH.UI.EntityTreeView(entityTreeDialog.popContentDiv.id,
#     [
#         {
#             entity : androidEntity,
#             path: "Sensors/Toulouse",
#             treeIcon : "images/android_icon.png",
#             contextMenuId: stackContextMenuId
#         }
#     ],
#     {
#         css: "tree-container"
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def entity_tree_view(**kwargs):

    items = json.loads(kwargs['items'])

    script = "\n"
    script += "var entityTreeView = new OSH.UI.EntityTreeView(" + kwargs['containerId'] + ",\n"
    script += "        [\n"

    for current_item in items:
        script += "            {\n"
        script += "                entity: " + current_item['entity'] + ",\n"
        script += "                path: \"" + current_item['path'] + "\",\n"
        script += "                treeIcon: \"" + current_item['treeIcon'] + "\",\n"
        script += "                contextMenuId: " + current_item['contextMenuId'] + "\n"
        script += "            },\n"
    script += "        ],\n"
    script += "        {\n"
    script += "            css: \"" + kwargs['css'] + "\"\n"
    script += "        });"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.DiscoveryView
# -----------------------------------------------------------------------------
# KWARGS
# 'services' - TODO
# 'css' - TODO
# 'dataProviderController'
# 'swapId' - TODO
# 'entities' - TODO
# 'views' - TODO
# 'friendly_name' - TODO
# 'type' - TODO
# 'viewId' - TODO
# -----------------------------------------------------------------------------
# Example:
# var discoveryView = new OSH.UI.DiscoveryView("",{
#         services: ["http://sensiasoft.net:8181/"],
#         css: "discovery-view",
#         dataReceiverController:dataProviderController,
#         swapId: "main-container",
#         entities: [androidEntity],
#         views: [{
#             name: 'Leaflet 2D Map',
#             viewId: leafletMainView.id,
#             type : OSH.UI.DiscoveryView.Type.MARKER_GPS
#         }, {
#             name: 'Cesium 3D Globe',
#             viewId: cesiumMainMapView.id,
#             type : OSH.UI.DiscoveryView.Type.MARKER_GPS
#         }, {
#             name: 'Video dialog(H264)',
#             type : OSH.UI.DiscoveryView.Type.DIALOG_VIDEO_H264
#         }, {
#             name: 'Video dialog(MJPEG)',
#             type : OSH.UI.DiscoveryView.Type.DIALOG_VIDEO_MJPEG
#         }, {
#             name: 'Chart dialog',
#             type : OSH.UI.DiscoveryView.Type.DIALOG_CHART
#         }]
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def discovery_view(**kwargs):

    views = json.loads(kwargs['views'])

    script = "\n"
    script += "var discoveryView = new OSH.UI.DialogView(\"\", {\n"

    script += "        services: ["
    for current_service in re.split(',', kwargs['services']):
        if current_service:
            script += "\"" + current_service + "\","
    script += "],\n"

    if 'css' in kwargs:
        script += "        css: \"" + kwargs['css'] + "\",\n"

    if 'dataProviderController' in kwargs:
        script += "        dataReceiverController: " + kwargs['dataProviderController'] + ",\n"

    if 'swapId' in kwargs:
        script += "        swapId: \"" + kwargs['swapId'] + "\",\n"

    if 'entities' in kwargs:
        script += "        entities: ["
        for current_entity in re.split(',', kwargs['entities']):
            if current_entity:
                script += current_entity + ","
        script += "],\n"

    script += "        views: ["

    for current_view in views:
        script += "        {\n"
        script += "            name: '" + current_view['friendly_name'] + "'\n"
        script += "            type: " + current_view['type'] + ",\n"
        if 'viewId' in current_view:
            script += "            viewId: " + current_view['viewId'] + ",\n"
        script += "        },\n"

    script += "        ]\n"
    script += "    });\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.DialogView
# -----------------------------------------------------------------------------
# KWARGS
# 'containerId' - TODO
# 'draggable' - TODO
# 'css' - TODO
# 'title' - TODO
# 'show' - TODO
# 'dockable' - TODO
# 'closeable' - TODO
# 'dataSources' - TODO
# 'swapId' - TODO
# -----------------------------------------------------------------------------
# Example:
# var dialogView new OSH.UI.DialogView(containerDivId, {
#         draggable: false,
#         css: "dialog",
#         name: title,
#         show:false,
#         dockable: true,
#         closeable: true,
#         connectionIds : dataSources ,
#         swapId: "main-container"
#     });
# -----------------------------------------------------------------------------
@register.simple_tag()
def dialog_view(**kwargs):

    script = "\n"
    script += "var dialogView = new OSH.UI.DialogView(" + kwargs['containerId'] + ", {\n"
    script += "        draggable: " + kwargs['draggable'] + ",\n"
    script += "        css: \"" + kwargs['css'] + "\",\n"
    script += "        name: " + kwargs['title'] + ",\n"
    script += "        show: " + kwargs['show'] + ",\n"
    script += "        dockable: " + kwargs['dockable'] + ",\n"
    script += "        closeable: " + kwargs['closeable'] + ",\n"
    script += "        connectionIds: " + kwargs['dataSources'] + ",\n"
    script += "        swapId: \"" + kwargs['swapId'] + "\"\n"
    script += "    });\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.LeafletView
# -----------------------------------------------------------------------------
# KWARGS
# 'elements' - A json string definition containing 1 or more sylers in the view
#       ['styler'] - the variable name of the styler to associate with the view
#       ['friendly_name'] - a print/human friendly string
#       ['context_menu_id'] - id of context sensitive menu
#       ['entity_id'] - TODO
# 'view_name' - the id of the <div> within which the view is contained
# -----------------------------------------------------------------------------
# Example:
# var leafletMapView = new OSH.UI.LeafletView("",
#     [
#         {
#             styler :  pointMarker,
#             contextMenuId: circularContextMenuId,
#             name : "Android Phone GPS",
#             entityId : androidEntity.id
#         },
#     ]);
# -----------------------------------------------------------------------------
@register.simple_tag()
def leaflet_view(**kwargs):

    elements = json.loads(kwargs['elements'])

    script = "\n"
    script += "//------------ VIEW -----------------//\n"
    script += "var leafletMapView = new OSH.UI.View.LeafletView(\"" + kwargs['view_name'] + "\",\n"
    script += "    ["

    for current_elements in elements:
        script += "        {\n"
        script += "            styler: " + current_elements['styler'] + ",\n"
        script += "            name: \"" + current_elements['friendly_name'] + "\"\n"
        if 'context_menu_id' in current_elements:
            script += "            contextMenuId: " + current_elements['context_menu_id'] + ",\n"
        if 'entity_id' in current_elements:
            script += "            entityId: " + current_elements['entity_id'] + ",\n"
        script += "        },\n"

    script += "    ]);\n"

    return script


# -----------------------------------------------------------------------------
# OSH.UI.CesiumView
# -----------------------------------------------------------------------------
# KWARGS
# 'elements' - A json string definition containing 1 or more sylers in the view
#       ['styler'] - the variable name of the styler to associate with the view
#       ['friendly_name'] - a print/human friendly string
#       ['context_menu_id'] - id of context sensitive menu
#       ['entity_id'] - TODO
# 'view_name' - the id of the <div> within which the view is contained
# -----------------------------------------------------------------------------
# Example:
# var cesiumMapView = new OSH.UI.CesiumView("",
#     [
#         {
#             styler :  pointMarker,
#             contextMenuId: circularContextMenuId,
#             name : "Android Phone GPS",
#             entityId : androidEntity.id
#         },
#     ]);
# -----------------------------------------------------------------------------
@register.simple_tag()
def cesium_view(**kwargs):

    elements = json.loads(kwargs['elements'])

    script = "\n"
    script += "//------------ VIEW -----------------//\n"
    script += "var cesiumMapView = new OSH.UI.View.CesiumView(\"" + kwargs['view_name'] + "\",\n"
    script += "    ["

    for current_elements in elements:
        script += "        {\n"
        script += "            styler: " + current_elements['styler'] + ",\n"
        script += "            name: \"" + current_elements['friendly_name'] + "\"\n"
        if 'context_menu_id' in current_elements:
            script += "            contextMenuId: " + current_elements['context_menu_id'] + ",\n"
        if 'entity_id' in current_elements:
            script += "            entityId: " + current_elements['entity_id'] + ",\n"
        script += "        },\n"

    script += "    ]);\n"

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

    script = "\n"
    script += "//---------------------------------------------------------------//\n"
    script += "//--------------------- Creates DataProvider --------------------//\n"
    script += "//---------------------------------------------------------------//\n"
    script += "var dataProviderController = new OSH.DataReceiver.DataReceiverController({\n"
    script += "    replayFactor: " + kwargs['replay_factor'] + "});\n"
    script += "// We can add a group of dataSources and set the options\n"
    script += "dataProviderController.addDataSource(" + kwargs['data_source_name'] + "DataSource);\n"

    return script


# -----------------------------------------------------------------------------
# Embeds JS command to connect data provider controllers with data sources.
# Begins the data feeds from the hub and offering to the client
# -----------------------------------------------------------------------------
# KWARGS:
# -----------------------------------------------------------------------------
@register.simple_tag()
def connect_controllers():

    script = "\n"
    script += "//---------------------------------------------------------------//\n"
    script += "//---------------------------- Starts ---------------------------//\n"
    script += "//---------------------------------------------------------------//\n"
    script += "dataProviderController.connectAll();\n"

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