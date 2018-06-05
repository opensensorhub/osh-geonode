#Wizards
The Wizards are to be used for the creation orf certain elements 
common in the use of OpenSensorHub

###Questions to Answer Moving Forward:
1. How do layers present themselves when not associated with a map?
1. Are we still supporting saving generic stylers for certain sensor types
or is the wizard going to handle that based on sensor type to provide contextual
choices for useful formats?
1. Is the Hub to Sensor wizard really just allowing for sensors or are there 
going to be browsable hubs and sensors?

Hub to Sensor Wizard
--
Used for the addition of an OpenSensorHub Node to the GeoNode site.
####Hub Properties

---
1. URL - Endpoint the Address the Hub can be reached at

***Note**:* We are not storing the information of sensors associated with a hub in 
GeoNode. The node can be queried for this data. Sensors do keep track of their 
parent node.

####Observation/Sensor Creation

---
Used for addition of data observations to GeoNode.
#### Observation Properties
1. Hub -  the OSH node the sensor is attached to (???)
1. Name - the name assigned to this observation
1. Protocol - The method the sensor uses to transmit its data
1. EndpointURL - URL used to access the sensor observation on an OSH node 
(ex: http://bottsgeo:8181/sensorhub/sos)
1. OfferingID - The unique ID for the observation on this hub 
(all IDs don't need to be unique among all hubs)
1. ObservedProperty - 
1. StartTime - 
1. EndTime - 
1. SyncMasterTime -
1. BufferingTime -
1. TimeShift - 
1. SourceType - 

###Workflow Steps:
1. Add or Select Existing Hub
    * Check that new Hub is valid before continuing
1. Fill out sensor data
1. Save
 
Sensor to View Creation Wizard
-
Used for the creation of reusable stylers/views associated with a specific
Sensor (Observation??? - Get clarification)
####View Properties

---
1. Name - Name of the view
1. Observation - The specific sensor observation the view is associated with
1. Styler - How the data from the observation is to be styled 
(This happens in a sub-wizard for style creation)
1. SensorArchetype - _*Note:* this might not be necessary due to the change from MapStory._ 
The original idea was that views were totally reusable and modular and that a view need 
not have an associated sensor but a type of sensor it was related to.

###Workflow Steps:
1. Select a Type of Sensor
1. Choose from list of presented sensors
1. Choose type of styling

Views to Layer Wizard
-
Used to aggregate several views into a cohesive data presentation format
1. ViewList - list of included views
1. Layout - **How does the layer know how to display itself on a map?**








































