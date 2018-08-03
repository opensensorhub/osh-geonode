/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Richard Becker. All Rights Reserved.

 Author: Richard Becker <beckerr@prominentedge.com>

 ******************************* END LICENSE BLOCK ***************************/

/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* MIT Licensed.
*/

(function(){
    var initializing = false;
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base BaseClass implementation (does nothing)
    this.BaseClass = function(){};

    // Create a new BaseClass that inherits from this class
    BaseClass.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don’t run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we’re overwriting an existing function
            if(typeof prop[name] == 'function' && typeof _super[name] == 'function' && fnTest.test(prop[name])) {
                prototype[name] = (function(name, fn){
                                      return function() {
                                          var tmp = this._super;

                                          // Add a new ._super() method that is the same method
                                          // but on the super-class
                                          this._super = _super[name];

                                          // The method only need to be bound temporarily, so we
                                          // remove it when we’re done executing
                                          var ret = fn.apply(this, arguments);
                                          this._super = tmp;

                                          return ret;
                                      };
                                  })(name, prop[name]);
            } else {
               prototype[name] = prop[name];
            }
        }

        // The dummy class constructor
        function BaseClass() {
            // All construction is actually done in the initialize method
            if ( !initializing && this.initialize )
                this.initialize.apply(this, arguments);
        }

        // Populate our constructed prototype object
        BaseClass.prototype = prototype;

        // Enforce the constructor to be what we expect
        BaseClass.prototype.constructor = BaseClass;

        // And make this class extendable
        BaseClass.extend = arguments.callee;

        return BaseClass;
    };
})();
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @namespace {object} OSH
 */
var OSH = {
	version: '1.3'
};

window.OSH = OSH;

/**
 * @namespace {object} OSH.Exception
 * @memberof OSH
 */
window.OSH.Exception = {};

/**
 * @namespace {object} OSH.Video
 * @memberof OSH
 */
window.OSH.Video = {};

/**
 * @namespace {object} OSH.UI
 * @memberof OSH
 */
window.OSH.UI = {};

/**
 * @namespace {object} OSH.UI.View
 * @memberof OSH.UI
 */
window.OSH.UI.View = {};

/**
 * @namespace {object} OSH.UI.Styler
 * @memberof OSH.UI
 */
window.OSH.Styler = {};

/**
 * @namespace {object} OSH.UI.ContextMenu
 * @memberof OSH.UI
 */
window.OSH.ContextMenu = {};

/**
 * @namespace {object} OSH.DataReceiver
 * @memberof OSH
 */
window.OSH.DataReceiver = {};

/**
 * @namespace {object} OSH.DataConnector
 * @memberof OSH
 */
window.OSH.DataConnector = {};

/**
 * @namespace {object} OSH.Utils
 * @memberof OSH
 */
window.OSH.Utils = {};

/**
 * @namespace {object} OSH.Utils
 * @memberof OSH
 */
window.OSH.Helper = {};

/**
 * @namespace {object} OSH.DataSender
 * @memberof OSH
 */
window.OSH.DataSender = {};

window.OSH.BASE_WORKER_URL = "js/workers";

// HELPER FUNCTION
function isUndefined(object) {
	return typeof(object) === "undefined";
}

function isUndefinedOrNull(object) {
	return typeof(object) === "undefined" || object === null ;
}

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

/**
 * This method replaces each substring of this string that matches the given regular expression with the given replacement.
 * @param search the pattern to search
 * @param replacement the string which would replace found expression
 * @return {string} This method returns the resulting String.
 */
String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

Function.prototype.toSource = function() {
    return this.toString().replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'').trim();
};

Element.prototype.insertChildAtIndex = function(child, index) {
    if (!index) index = 0;
    if (index >= this.children.length) {
        this.appendChild(child);
    } else {
        this.insertBefore(child, this.children[index]);
    }
};

/***************************** BEGIN LICENSE BLOCK ***************************

The contents of this file are subject to the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one
at http://mozilla.org/MPL/2.0/.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
for the specific language governing rights and limitations under the License.

Copyright (C) 2015-2017 Richard Becker. All Rights Reserved.

Author: Richard Becker <beckerr@prominentedge.com>

******************************* END LICENSE BLOCK ***************************/
/*
 * @namespace Browser
 * @aka OSH.Browser
 *
 * A namespace with static properties for browser/feature detection used by OSH internally.
 * This code is borrowed from Leaflet
 *
 * @example
 *
 * ```js
 * if (OSH.Browser.ielt9) {
 *   alert('Upgrade your browser, dude!');
 * }
 * ```
 */

(function () {

	var ua = navigator.userAgent.toLowerCase(),
	    doc = document.documentElement,

	    ie = 'ActiveXObject' in window,

	    webkit    = ua.indexOf('webkit') !== -1,
	    phantomjs = ua.indexOf('phantom') !== -1,
	    android23 = ua.search('android [23]') !== -1,
	    chrome    = ua.indexOf('chrome') !== -1,
	    gecko     = ua.indexOf('gecko') !== -1  && !webkit && !window.opera && !ie,

	    win = navigator.platform.indexOf('Win') === 0,

	    mobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1,
	    msPointer = !window.PointerEvent && window.MSPointerEvent,
	    pointer = window.PointerEvent || msPointer,

	    ie3d = ie && ('transition' in doc.style),
	    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
	    gecko3d = 'MozPerspective' in doc.style,
	    opera12 = 'OTransition' in doc.style;


	var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
			(window.DocumentTouch && document instanceof window.DocumentTouch));

	OSH.Browser = {

		// @property ie: Boolean
		// `true` for all Internet Explorer versions (not Edge).
		ie: ie,

		// @property ielt9: Boolean
		// `true` for Internet Explorer versions less than 9.
		ielt9: ie && !document.addEventListener,

		// @property edge: Boolean
		// `true` for the Edge web browser.
		edge: 'msLaunchUri' in navigator && !('documentMode' in document),

		// @property webkit: Boolean
		// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
		webkit: webkit,

		// @property gecko: Boolean
		// `true` for gecko-based browsers like Firefox.
		gecko: gecko,

		// @property android: Boolean
		// `true` for any browser running on an Android platform.
		android: ua.indexOf('android') !== -1,

		// @property android23: Boolean
		// `true` for browsers running on Android 2 or Android 3.
		android23: android23,

		// @property chrome: Boolean
		// `true` for the Chrome browser.
		chrome: chrome,

		// @property safari: Boolean
		// `true` for the Safari browser.
		safari: !chrome && ua.indexOf('safari') !== -1,


		// @property win: Boolean
		// `true` when the browser is running in a Windows platform
		win: win,


		// @property ie3d: Boolean
		// `true` for all Internet Explorer versions supporting CSS transforms.
		ie3d: ie3d,

		// @property webkit3d: Boolean
		// `true` for webkit-based browsers supporting CSS transforms.
		webkit3d: webkit3d,

		// @property gecko3d: Boolean
		// `true` for gecko-based browsers supporting CSS transforms.
		gecko3d: gecko3d,

		// @property opera12: Boolean
		// `true` for the Opera browser supporting CSS transforms (version 12 or later).
		opera12: opera12,

		// @property any3d: Boolean
		// `true` for all browsers supporting CSS transforms.
		any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantomjs,


		// @property mobile: Boolean
		// `true` for all browsers running in a mobile device.
		mobile: mobile,

		// @property mobileWebkit: Boolean
		// `true` for all webkit-based browsers in a mobile device.
		mobileWebkit: mobile && webkit,

		// @property mobileWebkit3d: Boolean
		// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
		mobileWebkit3d: mobile && webkit3d,

		// @property mobileOpera: Boolean
		// `true` for the Opera browser in a mobile device.
		mobileOpera: mobile && window.opera,

		// @property mobileGecko: Boolean
		// `true` for gecko-based browsers running in a mobile device.
		mobileGecko: mobile && gecko,


		// @property touch: Boolean
		// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
		touch: !!touch,

		// @property msPointer: Boolean
		// `true` for browsers implementing the Microsoft touch events model (notably IE10).
		msPointer: !!msPointer,

		// @property pointer: Boolean
		// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
		pointer: !!pointer,


		// @property retina: Boolean
		// `true` for browsers on a high-resolution "retina" screen.
		retina: (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1
	};

}());
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.Exception.Exception = function(msg,errorObj) {
    var error = Error.apply(this, arguments);
    error.name = this.name = 'OSH Exception';

    this.message = error.message;
    this.originalErrorObject = errorObj;
    this.stack = error.stack;

    return this;
};

OSH.Exception.Exception.prototype = Object.create(Error.prototype, {
    constructor: { value: OSH.Exception.Exception }
});


OSH.Exception.Exception.prototype.printStackTrace = function() {
    console.error(this.stack);
};

OSH.Exception.Exception.prototype.getMessage = function() {
    return this.message;
};

OSH.Exception.Exception.prototype.getOriginalError = function() {
    return this.originalErrorObject;
};
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


/**
 *
 * @constructor
 */
OSH.Asserts = function() {};

OSH.Asserts.checkIsDefineOrNotNull = function(object) {

    if(isUndefinedOrNull(object)) {
        throw new OSH.Exception.Exception("the object is undefined or null");
    }
    return object;
};

OSH.Asserts.checkObjectPropertyPath = function(object,path,errorMessage) {

    if(!OSH.Utils.hasOwnNestedProperty(object,path)){
        var message = "The path "+path+" for the object does not exists";
        if(!isUndefinedOrNull(errorMessage)) {
            message = errorMessage;
        }

        throw new OSH.Exception.Exception(message);
    }
    return object;
};

OSH.Asserts.checkArrayIndex = function(array, index) {
    if(array.length === 0) {
        throw new OSH.Exception.Exception("The array length is 0");
    } else if(index > array.length -1 ) {
        throw new OSH.Exception.Exception("The given index of the array is out of range:"+index+" > "+(array.length -1));
    }
};

OSH.Asserts.checkTrue = function(cond,errorMessage) {
  if(!cond) {
      if(!isUndefinedOrNull(errorMessage)) {
          throw new OSH.Exception.Exception(errorMessage);
      } else {
          throw new OSH.Exception.Exception("Assert failed, cond ["+cond+"] is not met");
      }
  }
};
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

var MAX_LONG = Math.pow(2, 53) + 1;

/**
 *
 * @constructor
 */
OSH.Utils = function() {};

/**
 *
 * @returns {string}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.randomUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

/**
 * This function stamps/embeds a UUID into an object and returns the UUID generated for it
 * @returns {string}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.stampUUID = function(obj) {
  obj._osh_id = obj._osh_id || OSH.Utils.randomUUID();
  return obj._osh_id;
};

/**
 *
 * @param xmlStr
 * @returns {*}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.jsonix_XML2JSON = function (xmlStr) {
  var module = SOS_2_0_Module_Factory();
  var context = new Jsonix.Context([XLink_1_0, IC_2_0, SMIL_2_0, SMIL_2_0_Language, GML_3_1_1, SWE_1_0_1, GML_3_2_1, OWS_1_1_0, SWE_2_0, SWES_2_0, WSN_T_1, WS_Addr_1_0_Core, OM_2_0, ISO19139_GMD_20070417, ISO19139_GCO_20070417, ISO19139_GSS_20070417, ISO19139_GTS_20070417, ISO19139_GSR_20070417, Filter_2_0, SensorML_2_0, SOS_2_0]);
  var unmarshaller = context.createUnmarshaller();
  var jsonData = unmarshaller.unmarshalString(xmlStr);
  return jsonData;
};


OSH.Utils.jsonix_JSON2XML = function (jsonStr) {
    var module = SOS_2_0_Module_Factory();
    var context = new Jsonix.Context([XLink_1_0, IC_2_0, SMIL_2_0, SMIL_2_0_Language, GML_3_1_1, SWE_1_0_1, GML_3_2_1, OWS_1_1_0, SWE_2_0, SWES_2_0, WSN_T_1, WS_Addr_1_0_Core, OM_2_0, ISO19139_GMD_20070417, ISO19139_GCO_20070417, ISO19139_GSS_20070417, ISO19139_GTS_20070417, ISO19139_GSR_20070417, Filter_2_0, SensorML_2_0, SOS_2_0]);
    var marshaller = context.createMarshaller();
    var xmlData = marshaller.marshalString(jsonStr);
    return xmlData;
};

//buffer is an ArrayBuffer object, the offset if specified in bytes, and the type is a string
//corresponding to an OGC data type.
//See http://def.seegrid.csiro.au/sissvoc/ogc-def/resource?uri=http://www.opengis.net/def/dataType/OGC/0/
/**
 *
 * @param buffer
 * @param offset
 * @param type
 * @returns {*}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.ParseBytes = function (buffer, offset, type) {
  var view = new DataView(buffer);

  //Note: There exist types not listed in the map below that have OGC definitions, but no appropriate
  //methods or corresponding types available for parsing in javascript. They are float128, float16, signedLong,
  //and unsignedLong
  var typeMap = {
    double: function (offset) {
      return {val: view.getFloat64(offset), bytes: 8};
    },
    float64: function (offset) {
      return {val: view.getFloat64(offset), bytes: 8};
    },
    float32: function (offset) {
      return {val: view.getFloat32(offset), bytes: 4};
    },
    signedByte: function (offset) {
      return {val: view.getInt8(offset), bytes: 1};
    },
    signedInt: function (offset) {
      return {val: view.getInt32(offset), bytes: 4};
    },
    signedShort: function (offset) {
      return {val: view.getInt16(offset), bytes: 2};
    },
    unsignedByte: function (offset) {
      return {val: view.getUint8(offset), bytes: 1};
    },
    unsignedInt: function (offset) {
      return {val: view.getUint32(offset), bytes: 4};
    },
    unsignedShort: function (offset) {
      return {val: view.getUint16(offset), bytes: 2};
    },
    //TODO: string-utf-8:
  };
  return typeMap[type](offset);
};

//This function recursivley iterates over the resultStructure to fill in
//values read from data which should be an ArrayBuffer containing the payload from a websocket
/**
 *
 * @param struct
 * @param data
 * @param offsetBytes
 * @returns {*}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.ReadData = function(struct, data, offsetBytes) {
  var offset = offsetBytes;
  for(var i = 0 ; i < struct.fields.length; i++) {
    var currFieldStruct = struct.fields[i];
    if(typeof currFieldStruct.type != 'undefined' && currFieldStruct.type !== null) {
      var ret = OSH.Utils.ParseBytes(data, offset, currFieldStruct.type);
      currFieldStruct.val = ret.val;
      offset += ret.bytes;
    } else if(typeof currFieldStruct.count != 'undefined' && currFieldStruct.count !== null) {
      //check if count is a reference to another variable
      if(isNaN(currFieldStruct.count))
      {
        var id = currFieldStruct.count;
        var fieldName = struct.id2FieldMap[id];
        currFieldStruct.count = struct.findFieldByName(fieldName).val;
      }
      for(var c = 0; c < currFieldStruct.count; c++) {
        for(var j = 0 ; j < currFieldStruct.fields.length; j++) {
          var field = JSON.parse(JSON.stringify(currFieldStruct.fields[j]));
          offset = OSH.Utils.ReadData(field, data, offset);
          currFieldStruct.val.push(field);
        }
      }
    }
  }
  return offset;
};

/**
 *
 * @param resultStructure
 * @returns {{}}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.GetResultObject = function(resultStructure) {
  //TODO: handle cases for nested arrays / matrix data types
  var result = {};
  for(var i = 0; i < resultStructure.fields.length; i++) {
    if(typeof resultStructure.fields[i].count != 'undefined') {
      result[resultStructure.fields[i].name] = [];
      for(var c = 0; c < resultStructure.fields[i].count; c++) {
        var item = {};
        for(var k = 0; k < resultStructure.fields[i].val[c].fields.length; k++) {
          item[resultStructure.fields[i].val[c].fields[k].name] = resultStructure.fields[i].val[c].fields[k].val;
        }
        result[resultStructure.fields[i].name].push(item);
      }
    } else {
      result[resultStructure.fields[i].name] = resultStructure.fields[i].val;
    }
  }
  return result;
};

/**
 *
 * @returns {boolean}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isOpera = function () {
  return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
};

/**
 *
 * @returns {boolean}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isFirefox = function() {
  return typeof InstallTrigger !== 'undefined';
};

/**
 *
 * @returns {boolean}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isSafari = function() {
  return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
};

/**
 *
 * @returns {boolean}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isIE = function() {
  return /*@cc_on!@*/false || !!document.documentMode;
};

/**
 *
 * @returns {boolean}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isChrome = function() {
  return !!window.chrome && !!window.chrome.webstore;
};

/**
 *
 * @returns {*|boolean}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isBlink = function() {
  return (isChrome || isOpera) && !!window.CSS;
};

//------- GET X,Y absolute cursor position ---//
var absoluteXposition = null;
var absoluteYposition = null;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

function onMouseUpdate(e) {
  absoluteXposition = e.pageX;
  absoluteYposition = e.pageY;
}

/**
 *
 * @returns {*}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.getXCursorPosition = function() {
  return absoluteXposition;
};

/**
 *
 * @returns {*}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.getYCursorPosition = function() {
  return absoluteYposition;
};

/**
 *
 * @param a
 * @param b
 * @returns {boolean}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isArrayIntersect = function(a, b) {
  return a.filter(function(element){
        return b.indexOf(element) > -1;
       }).length > 0;
};


/**
 *
 * @param o
 * @returns {boolean}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isElement = function isElement(o) {
    return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
};

/**
 *
 * @returns {*}
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.isWebWorker = function() {
  if (typeof(Worker) !== "undefined") {
      return true;
  }
  return false;
};

/**
 *
 * @param div
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.takeScreeshot = function(div) {
};

/**
 * Remove a css class from a the div given as argument.
 * @param div the div to remove the class from
 * @param css the css class to remove
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.removeCss = function(div,css) {
  var divCss = div.className;
  css = divCss.replace(css,"");
  div.className = css;
};

/**
 * Check if a div element contains some css class
 * @param div the div element
 * @param className the className to search
 * @return {boolean}
 */
OSH.Utils.containsCss = function(div, className) {
    return div.className.indexOf(className) > -1;
};

/**
 * Replace a css class from a the div given as argument.
 * @param div the div to replace the class from
 * @param css the css class to replace
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.replaceCss = function(div,oldCss,newCss) {
    css = div.className.replace(oldCss,newCss);
    div.className = css;
};

/**
 * Add a css class to a the div given as argument.
 * @param div the div to add the class to
 * @param css the css class to add
 * @instance
 * @memberof OSH.Utils
 */
OSH.Utils.addCss = function(div,css) {
  OSH.Asserts.checkIsDefineOrNotNull(div);
  OSH.Asserts.checkIsDefineOrNotNull(css);

  OSH.Asserts.checkIsDefineOrNotNull(div.className);

  var split = div.className.split(" ");
  if(isUndefinedOrNull(split) ||
      (!isUndefinedOrNull(split) && split.length > 0 && split.indexOf(css)  === -1)) {
      div.setAttribute("class", div.className + " " + css);
  }
};

OSH.Utils.removeLastCharIfExist = function(value,char) {
  if(typeof value === undefined || value === null || value.length === 0 || !value.endsWith("/")) {
    return value;
  }

  return value.substring(0,value.length-1);
};

/**
 * Merge properties from an object to another one.
 * If the property already exists, the function will try to copy children ones.
 *
 * @param from the origin object
 * @param to the object to copy properties into
 * @return {*} the final merged object
 */
OSH.Utils.copyProperties = function(from,to,forceMerge) {
    for (var property in from) {
        if(isUndefinedOrNull(to[property])  || forceMerge || OSH.Utils.isFunction(from[property]) || Array.isArray(from[property])) {
            to[property] = from[property];
        } else {
            // copy children
            if(OSH.Utils.isObject(from[property])) { // test is object
                OSH.Utils.copyProperties(from[property], to[property]);
            }
        }
    }
    return to;
};

OSH.Utils.isFunction = function(object) {
    return object === 'function' || object instanceof Function;
};

OSH.Utils.isObject = function(object) {
    return object === 'object' || object instanceof Object;
};

OSH.Utils.traverse = function(o,func,params) {
    for (var i in o) {
        func.apply(this,[i,o[i],params]);
        if (o[i] !== null && typeof(o[i])==="object") {
            //going one step down in the object tree!!
            params.level = params.level + 1;
            OSH.Utils.traverse(o[i],func,params);
            params.level = params.level - 1;
        }
    }
};

OSH.Utils.clone = function(o) {
    // From clone lib: https://github.com/pvorb/clone
    return clone(o);
};

OSH.Utils.getUOM = function(uomObject) {
    var result;

    var codeMap = {
        "Cel": "&#x2103;",
        "deg": "&#176;"
    };

    if(!isUndefinedOrNull(uomObject) && !isUndefinedOrNull(uomObject.code)) {
        var code =  uomObject.code;

        // check code list
        // https://www.w3schools.com/charsets/ref_utf_letterlike.asp => symbol list
        if(!isUndefinedOrNull(codeMap[uomObject.code])) {
            code = codeMap[uomObject.code];
        }
        result = code;
    }
    return result;
};

OSH.Utils.arrayBufferToImageDataURL = function(arraybuffer) {
    var blob = new Blob([new Uint8Array(arraybuffer)]);
    return URL.createObjectURL(blob);
};

OSH.Utils.getArrayBufferFromHttpImage = function(url,type,callback) {
    var xhr = new XMLHttpRequest();

    xhr.open( "GET", url, true );

    // Ask for the result as an ArrayBuffer.
    xhr.responseType = "arraybuffer";

    xhr.onload = function( e ) {
        callback(new Uint8Array( this.response ));
    };

    xhr.send();
};

OSH.Utils.createJSEditor = function(parentElt,content) {
    return OSH.Helper.HtmlHelper.addHTMLTextArea(parentElt, js_beautify(content));
};

OSH.Utils.hasOwnNestedProperty = function(obj,propertyPath){
    if(!propertyPath)
        return false;

    var properties = propertyPath.split('.');

    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];

        if(!obj || !obj.hasOwnProperty(prop)){
            return false;
        } else {
            obj = obj[prop];
        }
    }

    return true;
};


OSH.Utils.createXDomainRequest = function() {
    var xdr = null;

    if (window.XDomainRequest) {
        xdr = new XDomainRequest();
    } else if (window.XMLHttpRequest) {
        xdr = new XMLHttpRequest();
    } else {
        throw new OSH.Exception.Exception("The browser does not handle cross-domain");
    }

    return xdr;
};

OSH.Utils.checkUrlImage = function(url,callback) {
    /*var xdr = OSH.Utils.createXDomainRequest();
    xdr.onload = function() {
        var contentType = xdr.getResponseHeader('Content-Type');
        if (contentType.slice(0,6) === 'image/') {// URL is valid image
            callback(true,{type: contentType});
        } else {
            callback(false);
        }
    }

    xdr.open("GET", url);
    xdr.send();*/
    callback(url.match(/\.(jpeg|jpg|gif|png)$/i) != null, {
        remote:(url.startsWith("http") || url.startsWith("https"))
    });
};


OSH.Utils.circularJSONStringify = function(object) {
    // From https://github.com/WebReflection/circular-json (credits)
    var CircularJSON=function(e,t){function l(e,t,o){var u=[],f=[e],l=[e],c=[o?n:"[Circular]"],h=e,p=1,d;return function(e,v){return t&&(v=t.call(this,e,v)),e!==""&&(h!==this&&(d=p-a.call(f,this)-1,p-=d,f.splice(p,f.length),u.splice(p-1,u.length),h=this),typeof v=="object"&&v?(a.call(f,v)<0&&f.push(h=v),p=f.length,d=a.call(l,v),d<0?(d=l.push(v)-1,o?(u.push((""+e).replace(s,r)),c[d]=n+u.join(n)):c[d]=c[0]):v=c[d]):typeof v=="string"&&o&&(v=v.replace(r,i).replace(n,r))),v}}function c(e,t){for(var r=0,i=t.length;r<i;e=e[t[r++].replace(o,n)]);return e}function h(e){return function(t,s){var o=typeof s=="string";return o&&s.charAt(0)===n?new f(s.slice(1)):(t===""&&(s=v(s,s,{})),o&&(s=s.replace(u,"$1"+n).replace(i,r)),e?e.call(this,t,s):s)}}function p(e,t,n){for(var r=0,i=t.length;r<i;r++)t[r]=v(e,t[r],n);return t}function d(e,t,n){for(var r in t)t.hasOwnProperty(r)&&(t[r]=v(e,t[r],n));return t}function v(e,t,r){return t instanceof Array?p(e,t,r):t instanceof f?t.length?r.hasOwnProperty(t)?r[t]:r[t]=c(e,t.split(n)):e:t instanceof Object?d(e,t,r):t}function m(t,n,r,i){return e.stringify(t,l(t,n,!i),r)}function g(t,n){return e.parse(t,h(n))}var n="~",r="\\x"+("0"+n.charCodeAt(0).toString(16)).slice(-2),i="\\"+r,s=new t(r,"g"),o=new t(i,"g"),u=new t("(?:^|([^\\\\]))"+i),a=[].indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},f=String;return{stringify:m,parse:g}}(JSON,RegExp);
    return CircularJSON.stringify(object);
};

OSH.Utils.destroyElement = function(element) {
    OSH.Asserts.checkIsDefineOrNotNull(element);
    OSH.Asserts.checkIsDefineOrNotNull(element.parentNode);

    element.parentNode.removeChild(element);
};

OSH.Utils.getChildNumber = function(node) {
    return Array.prototype.indexOf.call(node.parentNode.children, node);
};

OSH.Utils.searchPropertyByValue = function(object, propertyValue, resultArray) {
    var idx;

    for(var property in object) {
        if(!isUndefinedOrNull(object[property])) {
            if(OSH.Utils.isObject(object[property])) {
                OSH.Utils.searchPropertyByValue(object[property],propertyValue,resultArray);
            } else if(Array.isArray(object[property]) && (idx=object[property].indexOf(propertyValue)) > -1) {
                resultArray.push(object);
            } else if(OSH.Utils.isFunction(object[property])) {
                continue; // skip
            } else if(object[property] === propertyValue) {
                resultArray.push(object);
            }
        }
    }
};

OSH.Utils.binaryStringToBlob = function(binaryString) {
    var array = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++){
        array[i] = binaryString.charCodeAt(i);
    }
    var blob = new Blob([array], {type: 'application/octet-stream'});
    return URL.createObjectURL(blob);
};

OSH.Utils.fixSelectable = function(oElement, bGotFocus) {
    var oParent = oElement.parentNode;
    while(oParent !== null && !/\bdraggable\b/.test(oParent.className)) {
        oParent = oParent.parentNode;
    }
    if(oParent !== null) {
        oParent.draggable = !bGotFocus;
    }
};

// returns true if the element or one of its parents has the class classname
OSH.Utils.getSomeParentTheClass = function(element, classname) {
    if (element.className.split(' ').indexOf(classname)>=0) return element;
    return element.parentNode && OSH.Utils.getSomeParentTheClass(element.parentNode, classname);
};

OSH.Utils.getObjectById = function(objectId, callbackFn) {
    OSH.EventManager.observe(OSH.EventManager.EVENT.GET_OBJECT + "-" + objectId, function (event) {
        OSH.EventManager.remove(OSH.EventManager.EVENT.GET_OBJECT + "-" + objectId);
        callbackFn(event);
    });
    OSH.EventManager.fire(OSH.EventManager.EVENT.SEND_OBJECT + "-" + objectId);
};
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 *
 * @constructor
 */
OSH.Helper.HtmlHelper = function() {};

OSH.Helper.HtmlHelper.createHTMLTitledLine = function(title) {
    var div = document.createElement("div");
    div.setAttribute("class","horizontal-titled-line");
    div.innerHTML = title;

    return div;
};

OSH.Helper.HtmlHelper.createHTMLLine = function(title) {
    var div = document.createElement("div");
    div.setAttribute("class","horizontal-line");
    return div;
};

OSH.Helper.HtmlHelper.addHTMLLine = function(parentElt) {
    parentElt.appendChild(OSH.Helper.HtmlHelper.createHTMLLine());
};

OSH.Helper.HtmlHelper.addHTMLTitledLine = function(parentElt,title) {
    parentElt.appendChild(OSH.Helper.HtmlHelper.createHTMLTitledLine(title));
};


OSH.Helper.HtmlHelper.HTMLListBoxSetSelected = function(listboxElt, defaultValue) {

    if(isUndefinedOrNull(defaultValue) || defaultValue === "") {
        return;
    }

    for(var i=0; i < listboxElt.options.length;i++) {
        var currentOption = listboxElt.options[i].value;

        if(currentOption === defaultValue) {
            listboxElt.options[i].setAttribute("selected","");
            break;
        }
    }
};

OSH.Helper.HtmlHelper.addHTMLTextArea = function(parentElt,content) {
    var ulElt = document.createElement("ul");
    ulElt.setAttribute("class","osh-ul");

    var liElt =  document.createElement("li");
    liElt.setAttribute("class","osh-li");

    var textareaId = OSH.Utils.randomUUID();
    var textAreaElt = document.createElement("textarea");
    textAreaElt.setAttribute("class","text-area");
    textAreaElt.setAttribute("id",textareaId);

    textAreaElt.value = content;

    // FIX select input-text instead of dragging the element(when the parent is draggable)
    textAreaElt.onfocus = function (e) {
        OSH.Utils.fixSelectable(this, true);
    };

    textAreaElt.onblur = function (e) {
        OSH.Utils.fixSelectable(this, false);
    };

    // appends textarea
    liElt.appendChild(textAreaElt);

    // appends li to ul
    ulElt.appendChild(liElt);

    parentElt.appendChild(ulElt);

    return textareaId;
};

OSH.Helper.HtmlHelper.onDomReady = function(callback) {
    /*!
     * domready (c) Dustin Diaz 2014 - License MIT
     * https://github.com/ded/domready
     */
    !function (name, definition) {

        if (typeof module != 'undefined') module.exports = definition();
        else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
        else this[name] = definition();

    }('domready', function () {

        var fns = [], listener
            , doc = typeof document === 'object' && document
            , hack = doc && doc.documentElement.doScroll
            , domContentLoaded = 'DOMContentLoaded'
            , loaded = doc && (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);


        if (!loaded && doc)
            doc.addEventListener(domContentLoaded, listener = function () {
                doc.removeEventListener(domContentLoaded, listener);
                loaded = 1;
                while (listener = fns.shift()) listener();
            });

        return function (fn) {
            loaded ? setTimeout(fn, 0) : fns.push(fn);
        }
    });

    // End domready(c)

    domready(callback);
};

OSH.Helper.HtmlHelper.addFileChooser = function(div, createPreview, defaultInputDivId) {
    return OSH.Helper.HtmlHelper.addTitledFileChooser(div,null, createPreview,defaultInputDivId);
};

OSH.Helper.HtmlHelper.addTitledFileChooser = function(div,label, createPreview, defaultInputDivId) {
    var id = OSH.Utils.randomUUID();

    if(!isUndefined(defaultInputDivId)) {
        id = defaultInputDivId;
    }

    var ulElt = document.createElement("ul");
    ulElt.setAttribute("class","osh-ul");

    var liElt =  document.createElement("li");
    liElt.setAttribute("class","osh-li");

    if(!isUndefinedOrNull(label)) {
        var labelElt = document.createElement("label");
        labelElt.innerHTML = label;
    }

    var labelForElt = document.createElement("label");
    labelForElt.setAttribute("class","input-file-label-for");
    labelForElt.setAttribute("for",id);

    var iElt = document.createElement("i");
    iElt.setAttribute("class","fa input-file-i");
    iElt.setAttribute("aria-hidden","true");

    labelForElt.appendChild(iElt);

    var inputTextElt = document.createElement("input");
    inputTextElt.setAttribute("class","input-file-text");
    inputTextElt.setAttribute("id","text-"+id);
    inputTextElt.setAttribute("type","text");
    inputTextElt.setAttribute("name","file-text-"+id);

    // FIX select input-text instead of dragging the element(when the parent is draggable)
    inputTextElt.onfocus = function (e) {
        OSH.Utils.fixSelectable(this, true);
    };

    inputTextElt.onblur = function (e) {
        OSH.Utils.fixSelectable(this, false);
    };

    var inputFileElt = document.createElement("input");
    inputFileElt.setAttribute("class","input-file");
    inputFileElt.setAttribute("id",id);
    inputFileElt.setAttribute("type","file");
    inputFileElt.setAttribute("name","file-"+id);

    if(!isUndefinedOrNull(label)) {
        // appends label
        liElt.appendChild(labelElt);
    }

    // appends label for
    liElt.appendChild(labelForElt);

    // appends input file
    liElt.appendChild(inputFileElt);

    // appends input text
    liElt.appendChild(inputTextElt);

    // appends li to ul
    ulElt.appendChild(liElt);

    // appends preview if any
    if(!isUndefinedOrNull(createPreview) && createPreview) {
        var prevId = OSH.Utils.randomUUID();

        var divPrevElt =  document.createElement("div");
        divPrevElt.setAttribute("class","preview");
        divPrevElt.setAttribute("id",prevId);

        OSH.Utils.addCss(inputFileElt,"preview");
        OSH.Utils.addCss(inputTextElt,"preview");

        liElt.appendChild(divPrevElt);

        (function(inputElt) {
            OSH.Helper.HtmlHelper.onDomReady(function(){
                inputElt.addEventListener('change', function(evt) {
                    var file = evt.target.files[0];
                    var reader = new FileReader();

                    // Closure to capture the file information.
                    var inputElt = this;

                    reader.onload = (function(theFile) {
                        inputElt.nextSibling.text = theFile.name;
                        inputElt.nextSibling.value = theFile.name;
                        return function(e) {
                            var sel = inputElt.parentNode.querySelectorAll("div.preview")[0];
                            sel.innerHTML = ['<img class="thumb" src="', e.target.result,
                                '" title="', escape(e.target.result), '"/>'].join('');
                        };
                    })(file);

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(file);
                }, false);

                inputElt.nextElementSibling.addEventListener("paste",function(evt){
                    OSH.Asserts.checkIsDefineOrNotNull(evt);

                    var clipboardData = evt.clipboardData || window.clipboardData;
                    var pastedData = clipboardData.getData('Text');

                    var sel = this.parentNode.querySelectorAll("div.preview")[0];
                    sel.innerHTML = ['<img class="thumb" src="', pastedData,
                        '" title="', escape(pastedData), '"/>'].join('');
                });
            });
        })(inputFileElt); //passing the variable to freeze, creating a new closure
        div.appendChild(ulElt);
    } else {
        (function(inputElt) {
            OSH.Helper.HtmlHelper.onDomReady(function(){
                inputElt.addEventListener('change', function(evt) {
                    var file = evt.target.files[0];
                    var reader = new FileReader();

                    // Closure to capture the file information.
                    var inputElt = this;

                    reader.onload = (function(theFile) {
                        inputElt.nextSibling.text = theFile.name;
                        inputElt.nextSibling.value = theFile.name;
                    })(file);

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(file);
                }, false);
            });
        })(inputFileElt); //passing the variable to freeze, creating a new closure
        div.appendChild(ulElt);
    }
    return id;
};


OSH.Helper.HtmlHelper.addColorPicker = function(parentElt, label,defaultValue,placeholder) {
    var id = OSH.Utils.randomUUID();

    var ulElt = document.createElement("ul");
    ulElt.setAttribute("class","osh-ul");

    var liElt =  document.createElement("li");
    liElt.setAttribute("class","osh-li");

    var inputElt = document.createElement("input");
    inputElt.setAttribute("id",id+"");
    inputElt.setAttribute("class","input-text");
    inputElt.setAttribute("type","input-text");
    inputElt.setAttribute("name",""+id);

    if(!isUndefinedOrNull(defaultValue) && defaultValue !== "") {
        inputElt.setAttribute("value",defaultValue);
    }

    if(!isUndefinedOrNull(placeholder)) {
        inputElt.setAttribute("placeholder",placeholder);
    }

    if(!isUndefinedOrNull(label)) {
        var labelElt = document.createElement("label");
        labelElt.setAttribute("for",""+id);
        labelElt.innerHTML = label+":";

        liElt.appendChild(labelElt);
    }

    var inputColorElt = document.createElement("input");
    inputColorElt.setAttribute("id","color-"+id);
    inputColorElt.setAttribute("class","input-color");
    inputColorElt.setAttribute("type","color");
    inputColorElt.setAttribute("name","color-"+id);

    OSH.Helper.HtmlHelper.onDomReady(function() {
        if(!isUndefinedOrNull(defaultValue)) {
            inputColorElt.value = defaultValue;
            inputColorElt.select();
        }
    });

    var regex = /^#(?:[0-9a-f]{6})$/i;

    inputElt.addEventListener("keyup", function(event){
        // if matches hexa color
        if(regex.test(this.value)) {
            inputColorElt.value = this.value;
            inputColorElt.select();
        }
    },false);

    inputColorElt.addEventListener("input", function(event){
        inputElt.value = event.target.value;
        inputElt.innerHTML = event.target.value;
    }, false);
    inputColorElt.addEventListener("change", function(event){
        inputElt.value = event.target.value;
        inputElt.innerHTML = event.target.value;
    }, false);

    liElt.appendChild(inputElt);
    liElt.appendChild(inputColorElt);
    ulElt.appendChild(liElt);

    parentElt.appendChild(ulElt);

    // FIX select input-text instead of dragging the element(when the parent is draggable)
    inputElt.onfocus = function (e) {
        OSH.Utils.fixSelectable(this, true);
    };

    inputElt.onblur = function (e) {
        OSH.Utils.fixSelectable(this, false);
    };

    return id;
};

OSH.Helper.HtmlHelper.addInputTextValueWithUOM = function(parentElt, label,placeholder,uom) {
    var id = OSH.Utils.randomUUID();

    var ulElt = document.createElement("ul");
    ulElt.setAttribute("class","osh-ul");

    var liElt =  document.createElement("li");
    liElt.setAttribute("class","osh-li");

    var inputElt = document.createElement("input");
    inputElt.setAttribute("id",id+"");
    inputElt.setAttribute("class","input-text input-uom");
    inputElt.setAttribute("type","input-text");
    inputElt.setAttribute("name",""+id);


    if(!isUndefinedOrNull(placeholder)) {
        inputElt.setAttribute("placeholder",placeholder);
    }

    var uomElt = document.createElement("div");
    uomElt.setAttribute("class","uom");
    uomElt.innerHTML = ""+uom;

    if(!isUndefinedOrNull(label)) {
        var labelElt = document.createElement("label");
        labelElt.setAttribute("for",""+id);
        labelElt.innerHTML = label+":";

        liElt.appendChild(labelElt);
    }

    liElt.appendChild(inputElt);
    liElt.appendChild(uomElt);
    ulElt.appendChild(liElt);

    parentElt.appendChild(ulElt);

    // FIX select input-text instead of dragging the element(when the parent is draggable)
    inputElt.onfocus = function (e) {
        OSH.Utils.fixSelectable(this, true);
    };

    inputElt.onblur = function (e) {
        OSH.Utils.fixSelectable(this, false);
    };

    return id;
};

OSH.Helper.HtmlHelper.addInputText = function(parentElt, label,defaultValue,placeholder) {
    var id = OSH.Utils.randomUUID();

    var ulElt = document.createElement("ul");
    ulElt.setAttribute("class","osh-ul");

    var liElt =  document.createElement("li");
    liElt.setAttribute("class","osh-li");

    var inputElt = document.createElement("input");
    inputElt.setAttribute("id",id+"");
    inputElt.setAttribute("class","input-text");
    inputElt.setAttribute("type","input-text");
    inputElt.setAttribute("name",""+id);

    if(!isUndefinedOrNull(defaultValue) && defaultValue !== "") {
        inputElt.setAttribute("value",defaultValue);
    }

    if(!isUndefinedOrNull(placeholder)) {
        inputElt.setAttribute("placeholder",placeholder);
    }

    if(!isUndefinedOrNull(label)) {
        var labelElt = document.createElement("label");
        labelElt.setAttribute("for",""+id);
        labelElt.innerHTML = label+":";

        liElt.appendChild(labelElt);
    }

    liElt.appendChild(inputElt);
    ulElt.appendChild(liElt);

    parentElt.appendChild(ulElt);

    // FIX select input-text instead of dragging the element(when the parent is draggable)
    inputElt.onfocus = function (e) {
        OSH.Utils.fixSelectable(this, true);
    };

    inputElt.onblur = function (e) {
        OSH.Utils.fixSelectable(this, false);
    };

    return id;
};


OSH.Helper.HtmlHelper.removeAllNodes = function(div) {
    if(!isUndefinedOrNull(div)) {
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }
};

OSH.Helper.HtmlHelper.removeAllFromSelect = function(tagId) {
    var i;
    var selectTag = document.getElementById(tagId);
    for (i = selectTag.options.length - 1; i >= 0; i--) {
        selectTag.remove(i);
    }
};

OSH.Helper.HtmlHelper.addHTMLListBox = function(parentElt,label,values,defaultTitleOption,defaultSelectTagId) {
    var id = OSH.Utils.randomUUID();
    var selectTagId = OSH.Utils.randomUUID();

    var ulElt = document.createElement("ul");
    ulElt.setAttribute("class","osh-ul");

    var liElt =  document.createElement("li");
    liElt.setAttribute("class","osh-li");

    if(!isUndefinedOrNull(defaultSelectTagId)) {
        selectTagId = defaultSelectTagId;
    }


    if(!isUndefinedOrNull(label) && label !== "") {
        var labelElt = document.createElement("label");
        labelElt.innerHTML = label;

        liElt.appendChild(labelElt);
    }

    var divElt = document.createElement("div");
    divElt.setAttribute("id",""+id);
    divElt.setAttribute("class","select-style");

    var selectElt = document.createElement("select");
    selectElt.setAttribute("id",""+selectTagId);

    if(!isUndefinedOrNull(defaultTitleOption)) {
        var optionElt = document.createElement("option");
        optionElt.setAttribute("value","");
        optionElt.setAttribute("disabled","");
        optionElt.setAttribute("selected","");
        optionElt.innerHTML = defaultTitleOption;

        selectElt.appendChild(optionElt);
    }

    if(!isUndefinedOrNull(values)) {
        var first = true;
        var optionElt;

        for(var key in values) {
            optionElt = document.createElement("option");
            optionElt.setAttribute("value",values[key]);
            optionElt.innerHTML = values[key]+"";

            if(first) {
                optionElt.setAttribute("selected","");
                first = false;
            }

            selectElt.appendChild(optionElt);
        }
    }

    divElt.appendChild(selectElt);

    liElt.appendChild(divElt);
    ulElt.appendChild(liElt);

    parentElt.appendChild(ulElt);

    return selectTagId;
};

OSH.Helper.HtmlHelper.addHTMLObjectWithLabelListBox = function(parentElt,label,values,defaultTitleOption,defaultSelectTagId) {
    var id = OSH.Utils.randomUUID();
    var selectTagId = OSH.Utils.randomUUID();

    var ulElt = document.createElement("ul");
    ulElt.setAttribute("class","osh-ul");

    var liElt =  document.createElement("li");
    liElt.setAttribute("class","osh-li");

    if(!isUndefinedOrNull(defaultSelectTagId)) {
        selectTagId = defaultSelectTagId;
    }


    if(!isUndefinedOrNull(label) && label !== "") {
        var labelElt = document.createElement("label");
        labelElt.innerHTML = label;

        liElt.appendChild(labelElt);
    }

    var divElt = document.createElement("div");
    divElt.setAttribute("id",""+id);
    divElt.setAttribute("class","select-style");

    var selectElt = document.createElement("select");
    selectElt.setAttribute("id",""+selectTagId);

    if(!isUndefinedOrNull(defaultTitleOption)) {
        var optionElt = document.createElement("option");
        optionElt.setAttribute("value","");
        optionElt.setAttribute("disabled","");
        optionElt.setAttribute("selected","");
        optionElt.innerHTML = defaultTitleOption;

        selectElt.appendChild(optionElt);
    }

    if(!isUndefinedOrNull(values)) {
        var first = true;
        var optionElt;

        for(var key in values) {
            optionElt = document.createElement("option");
            optionElt.setAttribute("value",values[key].name);
            optionElt.innerHTML = values[key].name+"";
            optionElt.object = values[key];

            if(first) {
                optionElt.setAttribute("selected","");
                first = false;
            }

            selectElt.appendChild(optionElt);
        }
    }

    divElt.appendChild(selectElt);

    liElt.appendChild(divElt);
    ulElt.appendChild(liElt);

    parentElt.appendChild(ulElt);

    return selectTagId;
};

/**
 * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 * @param {String} eventName The name of the event without the "on" (e.g., "focus")
 */
OSH.Helper.HtmlHelper.fireEvent = function(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9){
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

    if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);
        event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        node.dispatchEvent(event, true);
    } else  if (node.fireEvent) {
        // IE-old school style, you can drop this if you don't need to support IE8 and lower
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};

OSH.Helper.HtmlHelper.addCheckbox = function(parentElt, label,defaultValue) {
    var id = OSH.Utils.randomUUID();

    var ulElt = document.createElement("ul");
    ulElt.setAttribute("class","osh-ul");

    var liElt =  document.createElement("li");
    liElt.setAttribute("class","osh-li");

    var checkboxElt = document.createElement("input");
    checkboxElt.setAttribute("id",id+"");
    checkboxElt.setAttribute("class","input-checkbox");
    checkboxElt.setAttribute("type","checkbox");
    checkboxElt.setAttribute("name",""+id);

    if(!isUndefinedOrNull(defaultValue) && defaultValue) {
        checkboxElt.setAttribute("checked","");
    }

    if(!isUndefinedOrNull(label)) {
        var labelElt = document.createElement("label");
        labelElt.setAttribute("for",""+id);
        labelElt.innerHTML = label+":";

        liElt.appendChild(labelElt);
    }

    liElt.appendChild(checkboxElt);
    ulElt.appendChild(liElt);

    parentElt.appendChild(ulElt);

    return id;
};
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.EventMap = BaseClass.extend({

    initialize:function() {
        this.eventMap = {};
    },

    observe:function(eventName, fnCallback) {
        if(isUndefinedOrNull(eventName) || isUndefinedOrNull(fnCallback)) {
            return;
        }
        if(!(eventName in this.eventMap)) {
            this.eventMap[eventName] = [];
        }
        this.eventMap[eventName].push(fnCallback);
    },

    fire: function(eventName, properties) {
        if(isUndefinedOrNull(eventName)) {
            return;
        }
        if(eventName in this.eventMap) {
            var fnCallbackArr = this.eventMap[eventName];
            for(var i = 0; i < fnCallbackArr.length;i++){
                // callback the properties to the current callback
                fnCallbackArr[i](properties);
            }
        }
    },

    remove: function(eventName) {
        if(isUndefinedOrNull(eventName)) {
            return;
        }

        delete this.eventMap[eventName];
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 *
 * @constructor
 */
OSH.EventManager = function() {};

var eventMap = new OSH.EventMap();
/**
 *
 * @param eventName
 * @param properties
 * @instance
 * @memberof OSH.EventManager
 */
OSH.EventManager.fire = function(eventName, properties) {
    if(!isUndefinedOrNull(properties)) {
        properties.name = eventName;
        eventMap.fire('osh:'+eventName,properties);
    } else {
        eventMap.fire('osh:'+eventName,{name:eventName});
    }
};

/**
 *
 * @param eventName
 * @param fnCallback
 * @param id
 * @instance
 * @memberof OSH.EventManager
 */
OSH.EventManager.observe = function(eventName, fnCallback) {
    eventMap.observe('osh:'+eventName,fnCallback);
};

OSH.EventManager.remove = function(eventName) {
    eventMap.remove('osh:'+eventName);
};
/**
 *
 * @param divId
 * @param eventName
 * @param fnCallback
 * @instance
 * @memberof OSH.EventManager
 */
OSH.EventManager.observeDiv = function(divId, eventName, fnCallback) {
   OSH.Asserts.checkIsDefineOrNotNull(divId);

   OSH.Helper.HtmlHelper.onDomReady(function() {
        elem = document.getElementById(divId);
        // use native dom event listener
        elem.addEventListener(eventName, fnCallback);
    });
};

/**
 *
 * @param element
 * @param eventName
 * @param fnCallback
 * @instance
 * @memberof OSH.EventManager
 */
OSH.EventManager.observeElement = function(element, eventName, fnCallback) {
    OSH.Helper.HtmlHelper.onDomReady(function() {
        // use native dom event listener
        element.addEventListener(eventName, fnCallback);
    });
};


/**
 * This part defines the events used INTO the API
 * @const
 * @type {{DATA: string, SYNC_DATA: string, SELECT_VIEW: string, CONTEXT_MENU: string, SHOW_VIEW: string, CONNECT_DATASOURCE: string, DISCONNECT_DATASOURCE: string, DATASOURCE_UPDATE_TIME: string, CURRENT_MASTER_TIME: string, UAV_TAKEOFF: string, UAV_GOTO: string, UAV_LOOKAT: string, UAV_LAND: string, UAV_ORBIT: string, LOADING_START: string, LOADING_STOP: string, ADD_VIEW_ITEM: string}}
 */
OSH.EventManager.EVENT = {
    DATA : "data",
    SYNC_DATA : "syncData",
    SELECT_VIEW : "selectView",
    CONTEXT_MENU : "contextMenu",
    SHOW_VIEW : "showView",
    GET_OBJECT: "getObject",
    SEND_OBJECT: "sendObject",
    CONNECT_DATASOURCE : "connectDataSource",
    DISCONNECT_DATASOURCE : "disconnectDataSource",
    DATASOURCE_UPDATE_TIME: "updateDataSourceTime",
    CURRENT_MASTER_TIME : "currentMasterTime",
    UAV_TAKEOFF : "uav:takeoff",
    UAV_GOTO: "uav:goto",
    UAV_LOOKAT : "uav:lookat",
    UAV_LAND: "uav:land",
    UAV_ORBIT: "uav:orbit",
    LOADING_START: "loading:start",
    LOADING_STOP: "loading:stop",
    ADD_VIEW_ITEM: "addViewItem",
    REMOVE_VIEW_ITEM: "addViewItem",
    RESIZE:"resize",
    PTZ_SEND_REQUEST:"ptzSendRequest",
    EXCEPTION_MESSAGE:"exception_message",
    LOG:"log",
    SHOW:"show"
};

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/** @constant
    @type {number}
    @default
 */
var INITIAL_BUFFERING_TIME = 3000; // ms time

/**
 * This enumeration contains the whole list of available status for a job.
 * @enum
 * @readonly
 * @type {{CANCEL: string, START: string, STOP: string, NOT_START_YET: string}}
 */
var BUFFER_STATUS = {
  CANCEL: 'cancel',
  START: 'start',
  STOP: 'stop',
  NOT_START_YET: 'notStartYet'
};

/**
 * @classdesc Represents the buffer element which is in charge of synchronizing data.
 * @class
 * @param {Object} options The options object
 * @param {Object} options.replayFactor defines the replay speed of the buffer in order to synchronize data
 * @example
 var buffer = new OSH.Buffer({
    replayFactor: 1
 });
 */
OSH.Buffer = BaseClass.extend({
  initialize:function(options) {
    this.buffers = {};

    this.replayFactor = 1;

    // update values from options
    if(typeof options != "undefined") {
      if(typeof options.replayFactor != "undefined") {
        this.replayFactor = options.replayFactor;
      }
    }

    // define buffer variable

    // defines a status to stop the buffer after stop() calling.
    // If start() method is called, this variable should be set to TRUE
    this.stop = false;
    this.isStarted = false;
    this.bufferingState = false;
  },

  /**
   * Starts observing the data stream.
   * @memberof OSH.Buffer
   * @instance
   */
  startObservers: function() {
    this.observeId = OSH.Utils.randomUUID();
    this.boundHandlerMethod = this.push.bind(this);
    OSH.EventManager.observe(OSH.EventManager.EVENT.DATA,this.boundHandlerMethod,this.observeId);
  },

  /**
   * Stops observing the data stream.
   * @memberof OSH.Buffer
   * @instance
   */
  stopObservers: function() {
    if(typeof this.observeId != "undefined" || this.observeId !== null) {
      OSH.EventManager.observe(OSH.EventManager.EVENT.DATA, this.boundHandlerMethod,this.observeId);
      this.observeId = undefined;
    }
  },

  /**
   * Starts the buffer and starts the observers.
   * @memberof OSH.Buffer
   * @instance
   */
  start: function() {
    if(!this.isStarted) {
        this.stop = false;
        this.isStarted = true;
        this.startObservers();
        this.startRealTime = new Date().getTime();
        this.processSyncData();
    }
  },

  /**
   * Stops the buffer and stops the observers.
   * @memberof OSH.Buffer
   * @instance
   */
  stop: function() {
    this.stopObservers();
    this.stop = true;
    this.isStarted = false;
  },

  /**
   * Cancels all current running/pending jobs. This function loop over the
   * datasources and cancel them one by one.
   * @memberof OSH.Buffer
   * @instance
   */
  cancelAll: function() {
    for(var dataSourceId in this.buffers){
      this.cancelDataSource(dataSourceId);
    }
  },

  /**
   * Cancels the dataSource. Cancels means to clear the data contained into the buffer and change the status to CANCEL
   * @param dataSourceId The dataSource to cancel
   * @memberof OSH.Buffer
   * @instance
   */
  cancelDataSource: function(dataSourceId) {
    this.buffers[dataSourceId].buffer = [];
    this.buffers[dataSourceId].status = BUFFER_STATUS.CANCEL;
  },

  /**
   * Starts buffering the dataSource.
   * @param dataSourceId the dataSource to start
   * @memberof OSH.Buffer
   * @instance
   */
  startDataSource: function(dataSourceId) {
    this.start();
    this.buffers[dataSourceId].status = BUFFER_STATUS.NOT_START_YET;
    this.buffers[dataSourceId].lastRecordTime = Date.now();
  },

  /**
   * Starts all dataSources. The method loops over all datasources and
   * calls the {@link OSH.Buffer.startDataSource}.
   * @memberof OSH.Buffer
   * @instance
   */
  startAll: function() {
    for(var dataSourceId in this.buffers){
      this.startDataSource(dataSourceId);
    }
  },

  /**
   * Adds a new dataSource into the buffer.
   * @param dataSourceId The dataSource to add
   * @param options syncMasterTime | bufferingTime | timeOut | name
   * @memberof OSH.Buffer
   * @instance
   */
  addDataSource: function(dataSourceId,options) {
    this.buffers[dataSourceId] = {
        buffer: [],
        syncMasterTime: false,
        bufferingTime: INITIAL_BUFFERING_TIME,
        timeOut: 3000,
        lastRecordTime: Date.now(),
        status: BUFFER_STATUS.NOT_START_YET,
        name: "undefined"
    };

    if(typeof options != "undefined") {
      if(typeof  options.syncMasterTime != "undefined") {
        this.buffers[dataSourceId].syncMasterTime = options.syncMasterTime;
      }

      if(typeof  options.bufferingTime != "undefined") {
        this.buffers[dataSourceId].bufferingTime = options.bufferingTime;
      }
      
      if(typeof  options.timeOut != "undefined") {
          this.buffers[dataSourceId].timeOut = options.timeOut;
        }

      if(typeof  options.name != "undefined") {
        this.buffers[dataSourceId].name = options.name;
      }
    }
  },

  removeDataSource:function(dataSourceId) {
    if(dataSourceId in this.buffers) {
      delete this.buffers[dataSourceId];
    }
  },

  /**
   * Adds an entity which contains one or more dataSources.
   * The dataSources are then added to the buffer using {@link OSH.Buffer.addDataSource}
   * @param entity The entity to add
   * @param options The options object passed to the {@link OSH.Buffer.addDataSource}
   * @memberof OSH.Buffer
   * @instance
   */
  addEntity: function(entity,options) {
    // get dataSources from entity and add them to buffers
    if(typeof  entity.dataSources != "undefined") {
      for(var i =0;i < entity.dataSources.length;i++) {
        this.addDataSource(entity.dataSources[i],options);
      }
    }
  },

  /**
   * Pushes a data into the buffer. This method is used as internal method by the {@link OSH.Buffer.startObservers}.
   * The event contains the necessary elements to process the data.
   * @param event The event object received from the OSH.EventManager
   * @param event.dataSourceId The dataSource id to process
   * @param event.syncMasterTime A boolean used to check if the data has to be synchronized with another data. If the value
   * is FALSE, the data will pass through the buffer and send back immediately.
   * @param event.data The raw data provided by the DataSource
   * @param event.data.timeStamp The timeStamp of the data. It will be used in case of the syncMasterTime is set to TRUE.
   * @memberof OSH.Buffer
   * @instance
   */
  push: function(event) {
    var dataSourceId = event.dataSourceId;
    
    // append the data to the existing corresponding buffer
    var currentBufferObj = this.buffers[dataSourceId];
    
    // discard data if it should be synchronized by was too late
    var sync = currentBufferObj.syncMasterTime;
    if (sync && event.data.timeStamp < this.currentTime)
        return;
    
    // also discard if streamwas canceled
    if (currentBufferObj.status == BUFFER_STATUS.CANCEL)
      return;    

    // define the time of the first data as relative time
    if(currentBufferObj.status == BUFFER_STATUS.NOT_START_YET) {
      currentBufferObj.startRelativeTime = event.data.timeStamp;
      currentBufferObj.startRelativeRealTime = new Date().getTime();
      currentBufferObj.status = BUFFER_STATUS.START;
    }

    currentBufferObj.buffer.push(event.data);
    currentBufferObj.lastRecordTime = Date.now();

    if(!sync) {
      this.processData(currentBufferObj,dataSourceId);
    }

  },

  /**
   * [TODO] This is an internal method.
   * @memberof OSH.Buffer
   * @instance
   */
  processSyncData: function() {
    if(!this.bufferingState) {

      var minTimeStampBufferObj = null;
      var minTimeStampDSId = null;
      var minTimeStamp = MAX_LONG;
      var currentBufferObj = null;

      var mustBuffering = false;
      var maxBufferingTime = -1;

      for (var dataSourceId in this.buffers) {
        currentBufferObj = this.buffers[dataSourceId];
        if((currentBufferObj.status == BUFFER_STATUS.START || currentBufferObj.status == BUFFER_STATUS.NOT_START_YET) && currentBufferObj.syncMasterTime) {
          if(currentBufferObj.buffer.length === 0){
            /*if(maxBufferingTime < currentBufferObj.bufferingTime) {
              maxBufferingTime = currentBufferObj.bufferingTime;
            }*/
            var waitTime = currentBufferObj.timeOut - (Date.now() - currentBufferObj.lastRecordTime);
            if (waitTime > 0) {
                window.setTimeout(function () { // to be replaced by setInterval
                   this.processSyncData();
                }.bind(this), waitTime/10.0);
                return;
            } else {
                //console.log("Timeout of data source " + dataSourceId);
            }
          } else if (currentBufferObj.buffer[0].timeStamp < minTimeStamp) {
              minTimeStampBufferObj = currentBufferObj;
              minTimeStampDSId = dataSourceId;
              minTimeStamp = currentBufferObj.buffer[0].timeStamp;
          }
        }
      }

      // re-buffer because at least one dataSource has no data and its status is START
      /*if(maxBufferingTime > -1) {
        this.buffering(currentBufferObj.name,maxBufferingTime);
      } else*/ if(minTimeStampBufferObj !== null) {
        this.currentTime = minTimeStamp;
        this.processData(minTimeStampBufferObj, minTimeStampDSId, function () {
            this.processSyncData();
        }.bind(this));
      } else {
          window.setTimeout(function () {
              this.processSyncData();
          }.bind(this), 1000);
      }
    }
  },

  /**
   * [TODO] This is an internal method.
   * @memberof OSH.Buffer
   * @instance
   */
  processData: function(bufferObj,dataSourceId,fnEndTimeout) {
    // compute waitTime and dispatch data
    var startRelativeTime = bufferObj.startRelativeTime;
    var elapsedTime = new Date().getTime() - bufferObj.startRelativeRealTime;
    var data = bufferObj.buffer.shift();

    var waitTime = (((data.timeStamp-startRelativeTime) / this.replayFactor) - elapsedTime);
    bufferObj.startRelativeTime = data.timeStamp;
    bufferObj.startRelativeRealTime = new Date().getTime();

    if(waitTime > 0) {
      //callback the data after waiting for a time equals to the difference between the two timeStamps
      window.setTimeout(function () {
        //TODO: check if BUFFER TASK isw
        this.dispatchData(dataSourceId,data);
        if(typeof fnEndTimeout != "undefined") {
          fnEndTimeout();
        }
      }.bind(this), waitTime);
    } else {
      this.dispatchData(dataSourceId,data);
      if(typeof fnEndTimeout != "undefined") {
        fnEndTimeout();
      }
    }
  },

  /**
   * Dispatches the data through the EventManager. If the data to process is synchronized, it will launch a {@link OSH.EventManager.EVENT.CURRENT_MASTER_TIME} event
   * with {timeStamp:xxx} as parameter. In all case, it launches a {@link OSH.EventManager.EVENT.DATA}-dataSourceId event with {data:data} as parameter.
   * @param dataSourceId The dataSourceId of the data. It will be used as concatenated String into the fire method.
   * @param data The data to fire
   * @memberof OSH.Buffer
   * @instance
   */
  dispatchData: function(dataSourceId,data) {
    var bufObj = this.buffers[dataSourceId];
    if (bufObj.status != BUFFER_STATUS.CANCEL) {
        if(bufObj.syncMasterTime) {
          OSH.EventManager.fire(OSH.EventManager.EVENT.CURRENT_MASTER_TIME,
              {
                timeStamp: data.timeStamp,
                dataSourceId: dataSourceId
              });
        }
        OSH.EventManager.fire(OSH.EventManager.EVENT.DATA+"-"+dataSourceId, {data : data});
    }
  },

  /**
   * This method is responsible of buffering data, that is to say it will timeOut the whole process to wait after more data.
   * @param name The name of the current dataSource which needs to be buffered
   * @param bufferingTime The buffering time
   * @memberof OSH.Buffer
   * @instance
   */
  buffering: function(name,bufferingTime) {
    OSH.EventManager.fire(OSH.EventManager.EVENT.LOADING_START,{name:name});
    this.bufferingState = true;
    window.setTimeout(function(){
      this.bufferingState = false;
      OSH.EventManager.fire(OSH.EventManager.EVENT.LOADING_STOP);
      this.processSyncData();
    }.bind(this),bufferingTime);
  }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc The DataConnector is the abstract class used to create different connectors.
 * @constructor
 * @abstract
 * @param {string} url The full url used to connect to the data stream
 */
OSH.DataConnector.DataConnector = BaseClass.extend({
  initialize: function(url) {
    this.url = url;
    this.id = "DataConnector-"+OSH.Utils.randomUUID();
  },

  /**
   * The data connector default id.
   * @returns {string}
   * @memberof OSH.DataConnector.DataConnector
   * @instance
   */
  getId: function() {
    return this.id;
  },

  /**
   * The stream url.
   * @returns {string}
   * @memberof OSH.DataConnector.DataConnector
   * @instance
   */
  getUrl: function() {
    return this.url;
  },

  onClose:function() {

  }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @type {OSH.DataConnector.DataConnector}
 * @classdesc Defines the AjaxConnector to connect to a remote server by making AjaxRequest.
 * @class
 * @augments OSH.DataConnector.DataConnector
 * @example
 * var request = ...;
 * var connector = new OSH.DataConnector.AjaxConnector(url);
 *
 * // handle onSuccess
 * connector.onSuccess = function(event) {
 *  // does something
 * }
 *
 * connector.onError = function(event) {
 *  // does something
 * }
 *
 * // send request
 * connector.sendRequest(request);
 *
 */
OSH.DataConnector.AjaxConnector = OSH.DataConnector.DataConnector.extend({

    initialize: function(url,properties) {
        this._super(url);

        this.method = "POST";
        this.responseType = "arraybuffer";

        if(typeof(properties) !== "undefined") {
            if(properties.method) {
                this.method = properties.method;
            }

            if(properties.responseType) {
                this.responseType = properties.responseType;
            }
        }
    },
    /**
     * Sends the request to the defined server.
     * @param request The Http request (as a String format)
     * @memberof OSH.DataConnector.AjaxConnector
     * @instance
     */
    sendRequest: function (request,extraUrl) {
        var self = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.timeout = 60000;
        if(request === null) {
            if(typeof (extraUrl) !== "undefined") {
                xmlhttp.open("GET", this.getUrl()+"?"+extraUrl, true);
            } else {
                xmlhttp.open("GET", this.getUrl(), true);
            }
            xmlhttp.responseType = this.responseType;
            xmlhttp.onload = function (oEvent) {
                if (xmlhttp.response) {
                    self.onMessage(xmlhttp.response);
                }
            };
            xmlhttp.ontimeout = function (e) {
                console.log("Timeout");
            };

            xmlhttp.send(null);
        } else {
            xmlhttp.open("POST", this.getUrl(), true);
            xmlhttp.setRequestHeader('Content-Type', 'text/xml');

            xmlhttp.send(request);

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState < 4) {
                    // while waiting response from server
                }  else if (xmlhttp.readyState == 4) {                // 4 = Response from server has been completely loaded.
                    if (xmlhttp.status == 200 && xmlhttp.status < 300) { // http status between 200 to 299 are all successful
                        this.onSuccess(xmlhttp.responseText);
                    } else {
                        this.onError("");
                    }
                }
            }.bind(this);
        }


    },

    /**
     * This is the callback method in case of getting error connection.
     * @param event The error details
     * @memberof OSH.DataConnector.AjaxConnector
     * @instance
     */
    onError:function(event){

    },

    /**
     * This is the callback method in case of getting success connection.
     * @param event
     * @memberof OSH.DataConnector.AjaxConnector
     * @instance
     */
    onSuccess:function(event) {

    },

    connect:function(){
        this.sendRequest(null);
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @type {OSH.DataConnector.DataConnector}
 * @classdesc Defines the AjaxConnector to connect to a remote server by making AjaxRequest.
 * @class
 * @augments OSH.DataConnector.DataConnector
 * @example
 * var url = ...;
 * var connector = new OSH.DataConnector.WebSocketDataConnector(url);
 *
 * // connect
 * connector.connect();
 *
 * // disconnect
 * connector.disconnect();
 *
 * // close
 * connector.close();
 *
 */
OSH.DataConnector.WebSocketDataConnector = OSH.DataConnector.DataConnector.extend({
    /**
     * Connect to the webSocket. If the system supports WebWorker, it will automatically creates one otherwise use
     * the main thread.
     * @instance
     * @memberof OSH.DataConnector.WebSocketDataConnector
     */
    connect: function () {
        this.ENABLED = false; // disable webworker

        if (!this.init) {
            //creates Web Socket
            if (OSH.Utils.isWebWorker() && this.ENABLED) {
                var url = this.getUrl();
                var blobURL = URL.createObjectURL(new Blob(['(',

                        function () {
                            var ws = null;

                            self.onmessage = function (e) {
                                if (e.data === "close") {
                                    close();
                                } else {
                                    // is URL
                                    init(e.data);
                                }
                            }

                            function init(url) {
                                ws = new WebSocket(url);
                                ws.binaryType = 'arraybuffer';
                                ws.onmessage = function (event) {
                                    //callback data on message received
                                    if (event.data.byteLength > 0) {
                                        self.postMessage(event.data, [event.data]);
                                    }
                                }

                                ws.onerror = function (event) {
                                    ws.close();
                                    self.onerror(event);
                                };
                            }

                            function close() {
                                ws.close();
                            }
                        }.toString(), ')()'],
                    {type: 'application/javascript'}));

                this.worker = new Worker(blobURL);

                this.worker.postMessage(url);
                this.worker.onmessage = function (e) {
                    this.onMessage(e.data);
                }.bind(this);

                this.worker.onerror = function(error) {
                    this.onError(error);
                }.bind(this);
                // Won't be needing this anymore
                URL.revokeObjectURL(blobURL);
            } else {
                this.ws = new WebSocket(this.getUrl());
                this.ws.binaryType = 'arraybuffer';
                this.ws.onmessage = function (event) {
                    //callback data on message received
                    if (event.data.byteLength > 0) {
                        this.onMessage(event.data);
                    }
                }.bind(this);

                // closes socket if any errors occur
                this.ws.onerror = function (event) {
                    this.close();
                };

                this.ws.onclose = function(e) {
                    var reason = 'Unknown error';
                    switch(e.code) {
                        case 1000:
                            reason = 'Normal closure';
                            break;
                        case 1001:
                            reason = 'An endpoint is going away';
                            break;
                        case 1002:
                            reason = 'An endpoint is terminating the connection due to a protocol error.';
                            break;
                        case 1003:
                            reason = 'An endpoint is terminating the connection because it has received a type of data it cannot accept';
                            break;
                        case 1004:
                            reason = 'Reserved. The specific meaning might be defined in the future.';
                            break;
                        case 1005:
                            reason = 'No status code was actually present';
                            break;
                        case 1006:
                            reason = 'The connection was closed abnormally';
                            break;
                        case 1007:
                            reason = 'The endpoint is terminating the connection because a message was received that contained inconsistent data';
                            break;
                        case 1008:
                            reason = 'The endpoint is terminating the connection because it received a message that violates its policy';
                            break;
                        case 1009:
                            reason = 'The endpoint is terminating the connection because a data frame was received that is too large';
                            break;
                        case 1010:
                            reason = 'The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn\'t.';
                            break;
                        case 1011:
                            reason = 'The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
                            break;
                        case 1012:
                            reason = 'The server is terminating the connection because it is restarting';
                            break;
                        case 1013:
                            reason = 'The server is terminating the connection due to a temporary condition';
                            break;
                        case 1015:
                            reason = 'The connection was closed due to a failure to perform a TLS handshake';
                            break;
                    }
                    if(e.code !== 1000 && e.code !== 1005) {
                        throw new OSH.Exception.Exception("Datasource is now closed[" + reason + "]: " + this.getUrl(), event);
                    } else {
                        //TODO:send log
                        console.log("Datasource has been closed normally");
                    }
                    this.init = false;
                    this.onClose();

                }.bind(this);
            }
            this.init = true;
        }
    },

    /**
     * Disconnects the websocket.
     * @instance
     * @memberof OSH.DataConnector.WebSocketDataConnector
     */
    disconnect: function() {
        if (OSH.Utils.isWebWorker() && !isUndefinedOrNull(this.ws) && this.ENABLED) {
            this.worker.postMessage("close");
            this.worker.terminate();
            this.init = false;
        } else if (!isUndefinedOrNull(this.ws)) {
            if(this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.init = false;
        }
    },

    /**
     * The onMessage method used by the websocket to callback the data
     * @param data the callback data
     * @instance
     * @memberof OSH.DataConnector.WebSocketDataConnector
     */
    onMessage: function (data) {
    },

    onError:function(error) {
        throw new OSH.Exception.Exception("Cannot connect to the datasource "+this.getUrl(), error);
    },

    /**
     * Closes the webSocket.
     * @instance
     * @memberof OSH.DataConnector.WebSocketDataConnector
     */
    close: function() {
        this.disconnect();
    }
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc The DataSource is the abstract class used to create different datasources.
 * @class
 * @abstract
 * @param {string} name the datasource name
 * @param {Object} properties the datasource properties
 * @param {boolean} properties.timeShift fix some problem with some android devices with some timestamp shift to 16 sec
 * @param {boolean} properties.syncMasterTime defines if the datasource is synchronize with the others one
 * @param {number} properties.bufferingTime defines the time during the data has to be buffered
 * @param {number} properties.timeOut defines the limit time before data has to be skipped
 * @param {string} properties.protocol defines the protocol of the datasource. @see {@link OSH.DataConnector.DataConnector}
 *
 */
OSH.DataReceiver.DataSource = BaseClass.extend({
  initialize: function(name,properties) {
    this.id = "DataSource-"+OSH.Utils.randomUUID();
    this.name = name;
    this.properties = properties;

    this.initDataSource(properties);
  },

  /**
   * Inits the datasource with the constructor properties.
   * @param properties
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   */
  initDataSource: function(properties) {
    this.timeShift = 0;
    this.connected = false;

    if(!isUndefinedOrNull(properties.timeShift)) {
        this.timeShift = properties.timeShift;
    }

    if(!isUndefinedOrNull(properties.syncMasterTime)) {
      this.syncMasterTime = properties.syncMasterTime;
    } else {
      this.syncMasterTime = false;
    }

    if(!isUndefinedOrNull(properties.bufferingTime)) {
      this.bufferingTime = properties.bufferingTime;
    }

    if(!isUndefinedOrNull(properties.timeOut)) {
      this.timeOut = properties.timeOut;
    }

    if(!isUndefinedOrNull(properties.replaySpeed)) {
        this.replaySpeed = properties.replaySpeed;
    }

    // checks if type is WebSocket
    if(properties.protocol == "ws") {
      this.connector = new OSH.DataConnector.WebSocketDataConnector(this.buildUrl(properties));
      this.connector.onClose = function() {
        this.connected = false;
      }.bind(this);
      // connects the callback
      this.connector.onMessage = this.onMessage.bind(this);
    } else if(properties.protocol == "http") {
        this.connector = new OSH.DataConnector.AjaxConnector(this.buildUrl(properties));
        this.connector.responseType = "arraybuffer";
        // connects the callback
        this.connector.onMessage = this.onMessage.bind(this);
    }
  },
  /**
   * Disconnect the dataSource then the connector will be closed as well.
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   */
  disconnect : function() {
    this.connector.disconnect();
    this.connected = false;
    
    // send data reset event
    OSH.EventManager.fire(OSH.EventManager.EVENT.DATA+"-"+this.id,{
        dataSourceId: this.id,
        reset: true
    });
  },

  /**
   * Connect the dataSource then the connector will be opened as well.
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   */
  connect: function() {
    if(!this.connected) {
        this.connector.connect();
        this.connected = true;
    }
  },

  /**
   * The callback which receives data.
   * @callback
   * @param data
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   */
  onMessage: function(data) {
    this.onData({
        timeStamp: this.parseTimeStamp(data) + this.timeShift,
        data: this.parseData(data)
    });
  },

  /**
   * The default timestamp parser
   * @param data the full data message returned by the connector
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   * @returns {number} the formatted timestamp
   */
  parseTimeStamp: function(data){
    return new Date().getTime();
  },

  /**
   * The default timestamp parser
   * @param data the full data message returned by the connector
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   * @returns {String|Object|number|ArrayBuffer|*} data the formatted data
   */
  parseData: function(data){
    return data;
  },
  
  /**
   * @param {Object} data the data object
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   * @example
   * data is represented as 
   * data = { 
   *    timeStamp: timeStamp // number
   *    data: data // data to render
   * };
   */ 
  onData:function(data) {},

  /**
   * Gets the datasource id.
   * @returns {string} the datasource id
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   */
  getId: function() {
    return this.id;
  },

  /**
   * Gets the datasource name.
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   * @returns {*}
   */
  getName: function() {
    return this.name;
  },

  /**
   * Builds the full url.
   * @param {object} properties
   * @param {string} properties.protocol the connector protocol
   * @param {string} properties.endpointUrl the endpoint url
   * @param {string} properties.service the service
   * @param {string} properties.offeringID the offeringID
   * @param {string} properties.observedProperty the observed property
   * @param {string} properties.startTime the start time (ISO format)
   * @param {string} properties.endTime the end time (ISO format)
   * @param {number} properties.replaySpeed the replay factor
   * @param {number} properties.responseFormat the response format (e.g video/mp4)
   * @instance
   * @memberof OSH.DataReceiver.DataSource
   * @returns {string} the full url
   */
  buildUrl: function(properties) {
	  var url = "";
	  
	  // adds protocol
	  url += properties.protocol + "://";
	  
	  // adds endpoint url
	  url += properties.endpointUrl+"?";
	  
	  // adds service
	  url += "service="+properties.service+"&";
	  
	  // adds version
	  url += "version=2.0&";
	  
	  // adds request
	  url += "request=GetResult&";
	  
	  // adds offering
	  url += "offering="+properties.offeringID+"&";
	  
	  // adds observedProperty
	  url += "observedProperty="+properties.observedProperty+"&";
	  
	  // adds temporalFilter
	  var startTime = properties.startTime;
	  var endTime = properties.endTime;
	  url += "temporalFilter=phenomenonTime,"+startTime+"/"+endTime+"&";
	  
	  if(properties.replaySpeed && typeof(properties.replaySpeed) !== "undefined") {
		  // adds replaySpeed
		  url += "replaySpeed="+properties.replaySpeed;
	  }
	  
	  // adds responseFormat (optional)
	  if(properties.responseFormat && typeof(properties.responseFormat) !== "undefined" && properties.responseFormat !== "") {
		  url += "&responseFormat="+properties.responseFormat;
	  }

	  return url;
  },

  reset:function() {
    this.initDataSource(this.properties);
  },

  clone:function() {}
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to euler orientation.
 * Data has to be under the format : ISODATE,X,Y,
 * @class OSH.DataReceiver.EulerOrientation
 * @augments OSH.DataReceiver.DataSource
 */
OSH.DataReceiver.EulerOrientation = OSH.DataReceiver.DataSource.extend({

  /**
   * Extracts timestamp from the message. The timestamp is the first token got from split(',')
   * @param {function} $super the parseTimeStamp super method
   * @param {string} data the data to parse
   * @returns {number} the extracted timestamp
   * @memberof OSH.DataReceiver.EulerOrientation
   * @instance
   */
  parseTimeStamp: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var t =  new Date(tokens[0]).getTime();
    return t;
  },

  /**
   * Extract data from the message. The data are got such as:<p><ul><li>yaw: tokens[1]</li><li>pitch: tokens [2]</li><li>roll: tokens[3]</li></ul></p>.
   * @param {function} $super the parseData super method
   * @param {Object} data the data to parse
   * @returns {Object} the parsed data
   * @example
   * {
   *   pitch:10,
   *   roll: 11,
   *   heading:12
   * }
   * @memberof OSH.DataReceiver.EulerOrientation
   * @instance
   */
  parseData: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var yaw = parseFloat(tokens[1]);    
    var pitch = parseFloat(tokens[2]);
    var roll = parseFloat(tokens[3]);
    
    return {
      pitch : pitch,
      roll : roll,
      heading: yaw
    };
  }
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to Lat,Lon,Alt location.
 * Data: ISODATE,LAT,LON,ALT
 * @class OSH.DataReceiver.LatLonAlt
 * @augments OSH.DataReceiver.DataSource
 * @example
 * var androidPhoneGpsDataSource = new OSH.DataReceiver.LatLonAlt("android-GPS", {
    protocol: "ws",
    service: "SOS",
    endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
    offeringID: "urn:android:device:060693280a28e015-sos",
    observedProperty: "http://sensorml.com/ont/swe/property/Location",
    startTime: "2015-02-16T07:58:00Z",
    endTime: "2015-02-16T08:09:00Z",
    replaySpeed: replayFactor+"",
    syncMasterTime: true,
    bufferingTime: 1000,
    timeShift: -16000
  });
 */
OSH.DataReceiver.LatLonAlt = OSH.DataReceiver.DataSource.extend({

  /**
   * Extracts timestamp from the message. The timestamp is the first token got from split(',')
   * @param {function} $super the parseTimeStamp super method
   * @param {string} data the data to parse
   * @returns {number} the extracted timestamp
   * @memberof OSH.DataReceiver.LatLonAlt
   * @instance
   */
  parseTimeStamp: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var t =  new Date(tokens[0]).getTime();
    return t;
  },

  /**
   * Extract data from the message. The data are got such as:<p><ul><li>lat: tokens[1]</li><li>lon: tokens [2]</li><li>alt: tokens[3]</li></ul></p>.
   * @param {function} $super the parseData super method
   * @param {Object} data the data to parse
   * @returns {Object} the parsed data
   * @example
   * {
   *   lat:43.61758626,
   *   lon: 1.42376557,
   *   alt:100
   * }
   * @memberof OSH.DataReceiver.LatLonAlt
   * @instance
   */
  parseData: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var lat = parseFloat(tokens[1]);
    var lon = parseFloat(tokens[2]);
    var alt = parseFloat(tokens[3]);
    
    return {
      lat : lat,
      lon : lon,
      alt : alt
    };
  } 
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2012-2016 Sensia Software LLC. All Rights Reserved.

 Author: Alex Robin <alex.robin@sensiasoftware.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to Nexrad.
 * @class OSH.DataReceiver.Nexrad
 * @augments OSH.DataReceiver.DataSource
 */
OSH.DataReceiver.Nexrad = OSH.DataReceiver.DataSource.extend({

  /**
   * Extracts timestamp from the message. The timestamp is the first token got from split(',')
   * @param {function} $super the parseTimeStamp super method
   * @param {string} data the data to parse
   * @returns {number} the extracted timestamp
   * @memberof OSH.DataReceiver.Nexrad
   * @instance
   */
  parseTimeStamp: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    return new Date(tokens[0]).getTime();
  },

  /**
   * Extract data from the message.
   * @param {function} $super the parseData super method
   * @param {Object} data the data to parse
   * @returns {Object} the parsed data
   * @memberof OSH.DataReceiver.Nexrad
   * @instance
   */
  parseData: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var el = parseFloat(tokens[2]);
    var az = parseFloat(tokens[3]);
    
    var rangeToCenterOfFirstRefGate = parseFloat(tokens[4]);
    var refGateSize = parseFloat(tokens[5]);
    var numRefGates = parseInt(tokens[6]);
    
    var rangeToCenterOfFirstVelGate = parseFloat(tokens[7]);
    var velGateSize = parseFloat(tokens[8]);
    var numVelGates = parseInt(tokens[9]);
    
    var rangeToCenterOfFirstSwGate = parseFloat(tokens[10]);
    var swGateSize = parseFloat(tokens[11]);
    var numSwGates = parseInt(tokens[12]);
    
    var i = 13
    
    var refData = [];
    for (count=0; count<numRefGates; count++)
    	refData.push(parseFloat(tokens[i++]));
    
    var velData = [];
    for (count=0; count<numVelGates; count++)
    	velData.push(parseFloat(tokens[i++]));
    
    var swData = [];
    for (count=0; count<numSwGates; count++)
    	swData.push(parseFloat(tokens[i++]));
    
    return {
      elevation : el,
      azimuth : az,
      rangeToCenterOfFirstRefGate : rangeToCenterOfFirstRefGate,
      refGateSize: refGateSize,
      rangeToCenterOfFirstVelGate: rangeToCenterOfFirstVelGate,
      velGateSize: velGateSize,
      rangeToCenterOfFirstSwGate: rangeToCenterOfFirstSwGate,
      swGateSize: swGateSize,
      reflectivity: refData,
      velocity: velData,
      spectrumWidth: swData
    };
  } 
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2012-2016 Sensia Software LLC. All Rights Reserved.

 Author: Alex Robin <alex.robin@sensiasoftware.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to UAH Weather Station.
 * @class OSH.DataReceiver.UAHWeather
 * @augments OSH.DataReceiver.DataSource
 */
OSH.DataReceiver.DataSourceUAHWeather = OSH.DataReceiver.DataSource.extend({

  /**
   * Extracts timestamp from the message. The timestamp is the first token got from split(',')
   * @param {function} $super the parseTimeStamp super method
   * @param {string} data the data to parse
   * @returns {number} the extracted timestamp
   * @memberof OSH.DataReceiver.DataSourceUAHWeather
   * @instance
   */
  parseTimeStamp: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    return new Date(tokens[0]).getTime();
  },

  /**
   * Extract data from the message.
   * @param {function} $super the parseData super method
   * @param {Object} data the data to parse
   * @returns {Object} the parsed data
   * @memberof OSH.DataReceiver.DataSourceUAHWeather
   * @instance
   */
  parseData: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var airPres = parseFloat(tokens[1]);
    var airTemp = parseFloat(tokens[2]);
    var humidity = parseFloat(tokens[3]);
    var windSpeed = parseFloat(tokens[4]);
    var windDir = parseFloat(tokens[5]);
    var rainCnt = parseFloat(tokens[6]);
    
    return {
      airPres : airPres,
      airTemp : airTemp,
      humidity : humidity,
      windSpeed: windSpeed,
      windDir: windDir,
      rainCnt: rainCnt
    };
  } 
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to Orientation Quaternion.
 * Data: ISODATE,Qx,Qy,Qz,Qw.
 * @class OSH.DataReceiver.OrientationQuaternion
 * @augments OSH.DataReceiver.DataSource
 * @example
 * var androidPhoneOrientationDataSource = new OSH.DataReceiver.OrientationQuaternion("android-Orientation", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
        offeringID: "urn:android:device:060693280a28e015-sos",
        observedProperty: "http://sensorml.com/ont/swe/property/OrientationQuaternion",
        startTime: "2015-02-16T07:58:00Z",
        endTime: "2015-02-16T08:09:00Z",
        replaySpeed: replayFactor+"",
        syncMasterTime: true,
        bufferingTime: 1000
    });
 */
OSH.DataReceiver.OrientationQuaternion = OSH.DataReceiver.DataSource.extend({

  /**
   * Extracts timestamp from the message. The timestamp is the first token got from split(',')
   * @param {function} $super the parseTimeStamp super method
   * @param {string} data the data to parse
   * @returns {number} the extracted timestamp
   * @memberof OSH.DataReceiver.OrientationQuaternion
   * @instance
   */
  parseTimeStamp: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    return new Date(tokens[0]).getTime();
  },

  /**
   * Extract data from the message. The data are got such as:<p><ul><li>qx: tokens[1]</li><li>qy: tokens [2]</li><li>qz: tokens[3]</li><li>qw: tokens[4]</li></ul></p>.
   * @param {function} $super the parseData super method
   * @param {Object} data the data to parse
   * @returns {Object} the parsed data
   * @example
   * {
   *   pitch:10,
   *   roll: 11,
   *   heading:12
   * }
   * @memberof OSH.DataReceiver.OrientationQuaternion
   * @instance
   */
  parseData: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var qx = parseFloat(tokens[1]);
    var qy = parseFloat(tokens[2]);
    var qz = parseFloat(tokens[3]);
    var qw = parseFloat(tokens[4]);

    //var q = new THREE.Quaternion(qx, qy, qz, qw);
    //var look = new THREE.Vector3( 0, 0, -1 );
    //look.applyQuaternion(q);

    // look dir vector
    var x = 0;
    var y = 0;
    var z = -1;

    // calculate quat * vector
    var ix =  qw * x + qy * z - qz * y;
    var iy =  qw * y + qz * x - qx * z;
    var iz =  qw * z + qx * y - qy * x;
    var iw = - qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    xp = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    yp = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    zp = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    var yaw = 90 - (180/Math.PI*Math.atan2(yp, xp));
    
    //TODO: computes roll & pitch values
    return { heading: yaw, roll: null, pitch:null};
  } 
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to H264 raw data.
 * Data: ArrayBuffer
 * @class OSH.DataReceiver.VideoH264
 * @augments OSH.DataReceiver.DataSource
 * @example
 * var videoDataSource = new OSH.DataReceiver.VideoH264("H264 video ", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
        offeringID: "urn:android:device:a0e0eac2fea3f614-sos",
        observedProperty: "http://sensorml.com/ont/swe/property/VideoFrame",
        startTime: "2016-08-11T20:17:30.402Z",
        endTime: "2016-08-11T20:18:05.451Z",
        replaySpeed: 1,
        syncMasterTime: false,
        bufferingTime: 1000
  });
 */
OSH.DataReceiver.VideoH264 = OSH.DataReceiver.DataSource.extend({
    initialize: function (name, properties, options) {
        this._super(name, properties, options);
    },

    /**
     * Extracts timestamp from the message. The timestamp is corresponding to the first 64bits of the binary message.
     * @param {function} $super the parseTimeStamp super method
     * @param {ArrayBuffer} data the data to parse
     * @returns {number} the extracted timestamp
     * @memberof OSH.DataReceiver.VideoH264
     * @instance
     */
    parseTimeStamp: function (data) {
        // read double time stamp as big endian
        return new DataView(data).getFloat64(0, false) * 1000;
    },

    /**
     * Extract data from the message. The H264 NAL unit starts at offset 12 after 8-bytes time stamp and 4-bytes frame length.
     * @param {function} $super the parseData super method
     * @param {ArrayBuffer} data the data to parse
     * @returns {Uint8Array} the parsed data
     * @memberof OSH.DataReceiver.VideoH264
     * @instance
     */
    parseData: function (data) {
        return new Uint8Array(data, 12, data.byteLength - 12); // H264 NAL unit starts at offset 12 after 8-bytes time stamp and 4-bytes frame length
    },

    clone:function() {
        var cloneProperties = {};
        OSH.Utils.copyProperties(this.properties,cloneProperties);
        return new OSH.DataReceiver.VideoH264(this.name, cloneProperties);
    }
});


/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to MJPEG raw data.
 * Data: ArrayBuffer
 * @class OSH.DataReceiver.VideoMjpeg
 * @augments OSH.DataReceiver.DataSource
 * @example
  var androidPhoneVideoDataSource = new OSH.DataReceiver.VideoMjpeg("android-Video", {
    protocol: "ws",
    service: "SOS",
    endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
    offeringID: "urn:android:device:060693280a28e015-sos",
    observedProperty: "http://sensorml.com/ont/swe/property/VideoFrame",
    startTime: "2015-02-16T07:58:00Z",
    endTime: "2015-02-16T08:09:00Z",
    replaySpeed: 1,
    syncMasterTime: true,
    bufferingTime: 1000
  });
 */
OSH.DataReceiver.VideoMjpeg = OSH.DataReceiver.DataSource.extend({
  initialize: function(name,properties,options) {
    this._super(name,properties,options);
  },

  /**
   * Extracts timestamp from the message. The timestamp is corresponding to the first 64 bits of the binary message.
   * @param {function} $super the parseTimeStamp super method
   * @param {ArrayBuffer} data the data to parse
   * @returns {number} the extracted timestamp
   * @memberof OSH.DataReceiver.VideoMjpeg
   * @instance
   */
  parseTimeStamp: function(data){
    return new DataView(data).getFloat64(0, false) * 1000; // read double time stamp as big endian
  },

  /**
   * Extract data from the message. Creates a Blob object starting at byte 12. (after the 64 bits of the timestamp).
   * @param {function} $super the parseData super method
   * @param {ArrayBuffer} data the data to parse
   * @returns {Blob} the parsed data
   * @memberof OSH.DataReceiver.VideoMjpeg
   * @instance
   */
  parseData: function(data){
    var imgBlob = new Blob([data]);
    var blobURL = window.URL.createObjectURL(imgBlob.slice(12));
    return blobURL;
  } 
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to fragmented mp4 raw data. The data is encapsulated into mp4 fragment.
 * Data: ArrayBuffer
 * @class OSH.DataReceiver.VideoMp4
 * @augments OSH.DataReceiver.DataSource
 * @example
 * var videoDataSource = new OSH.DataReceiver.VideoMp4("MP4 video ", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
        offeringID: "urn:android:device:a0e0eac2fea3f614-sos",
        observedProperty: "http://sensorml.com/ont/swe/property/VideoFrame",
        startTime: "2016-08-11T20:17:30.402Z",
        endTime: "2016-08-11T20:18:05.451Z",
        replaySpeed: 1,
        syncMasterTime: false,
        bufferingTime: 1000,
        responseFormat: "video/mp4
  });
 */
OSH.DataReceiver.VideoMp4 = OSH.DataReceiver.DataSource.extend({
    initialize: function (name, properties, options) {
        this._super(name, properties, options);
        this.absoluteTime = -1;
    },

    /**
     * Extracts timestamp from the message. The timestamp is located at the 60th bytes and is 8 bytes length.
     * @param {function} $super the parseTimeStamp super method
     * @param {ArrayBuffer} data the data to parse
     * @returns {number} the extracted timestamp
     * @memberof OSH.DataReceiver.VideoMp4
     * @instance
     */
    parseTimeStamp: function (data) {
        // got the first box => MVDH
        if (this.absoluteTime == -1) {
            var infos = readMP4Info(data);

            //console.log("PTS : "+infos.pts);
            //console.log("timeScale : "+infos.timeScale);
            //console.log("duration : "+infos.duration);
            //console.log("rate : "+infos.rate);

            this.absoluteTime = infos.absoluteTime;
            this.timeScale = infos.timeScale;

            return this.absoluteTime;
        } else {
            // for debug only --> MVDH has already been calculated
            // got the first box
            var infos = readMP4Info(data);
            //console.log("PTS : "+infos.pts);
            //console.log("timeScale : "+infos.timeScale);
            //console.log("duration : "+infos.duration);
            //console.log("rate : "+infos.rate);
            // end debug
            return ((infos.pts * 1000) * this.timeScale) + this.absoluteTime; // FPS to FPMS
        }
    }
});

function readMP4Info(data) {
    var infos = {
        absoluteTime: 0,
        pts: 0,
        timeScale: 0,
        duration: 0,
        rate: 0
    };

    var pos = 60; // 60 bytes
    // starts at 60 bytes length
    //console.log(data.byteLength);
    infos.absoluteTime = new DataView(data, pos, pos + 8).getUint32(0); //8 bytes length but takes the  last four
    infos.absoluteTime = (infos.absoluteTime - 2082844800) * 1000;
    //console.log(new Date(infos.absoluteTime).toISOString());
    pos += 8;

    //modification time// 32 bits
    infos.pts = new DataView(data, pos, pos + 4).getUint32(0); //4 bytes length
    pos += 4;

    //time scale // 32 bits
    infos.timeScale = new DataView(data, pos, pos + 4).getUint32(0); //4 bytes length
    infos.timeScale = 1 / (infos.timeScale); // FPS
    pos += 4;

    //duration // 32 bits
    infos.duration = new DataView(data, pos, pos + 4).getUint32(0); //4 bytes length
    pos += 4;

    //rate  // 32 bits / 65536
    infos.rate = (new DataView(data, pos, pos + 4).getUint32(0));

    return infos;
};

function readNCC(bytes, n) {
    var res = "";
    for (var i = 0; i < n; i++) {
        res += String.fromCharCode(bytes[i]);
    }
    return res;
};

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides generic parsing for JSON response.
 *
 * @class OSH.DataReceiver.JSON
 * @augments OSH.DataReceiver.DataSource
 * @example
 * var androidPhoneGpsDataSource = new OSH.DataReceiver.JSON("android-GPS", {
    protocol: "ws",
    service: "SOS",
    endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
    offeringID: "urn:android:device:060693280a28e015-sos",
    observedProperty: "http://sensorml.com/ont/swe/property/Location",
    startTime: "2015-02-16T07:58:00Z",
    endTime: "2015-02-16T08:09:00Z",
    replaySpeed: replayFactor+"",
    syncMasterTime: true,
    bufferingTime: 1000,
    timeShift: -16000
  });
 */
OSH.DataReceiver.JSON = OSH.DataReceiver.DataSource.extend({

  /**
   * Extracts timestamp from the message. The timestamp corresponds to the 'time' attribute of the JSON object.
   * @param {function} $super the parseTimeStamp super method
   * @param {string} data the data to parse
   * @returns {number} the extracted timestamp
   * @memberof OSH.DataReceiver.JSON
   * @instance
   */
  parseTimeStamp: function(data){
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    return new Date(JSON.parse(rec)['time']).getTime();
  },

  /**
   * Extract data from the message. The data are corresponding to the whole list of attributes of the JSON object
   * excepting the 'time' one.
   * @param {function} $super the parseData super method
   * @param {Object} data the data to parse
   * @returns {Object} the parsed data
   * @example
   * {
   *   location : {
   *    lat:43.61758626,
   *    lon: 1.42376557,
   *    alt:100
   *   }
   * }
   * @memberof OSH.DataReceiver.JSON
   * @instance
   */
  parseData: function(data){
    var rec = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(data)));

    var result = {};

    for(var key in rec) {
        if(key !== 'time') {
            result[key] = rec[key];
        }
    }
    return result;
  },

    /**
     * Builds the full url.
     * @param {object} properties
     * @param {string} properties.protocol the connector protocol
     * @param {string} properties.endpointUrl the endpoint url
     * @param {string} properties.service the service
     * @param {string} properties.offeringID the offeringID
     * @param {string} properties.observedProperty the observed property
     * @param {string} properties.startTime the start time (ISO format)
     * @param {string} properties.endTime the end time (ISO format)
     * @param {number} properties.replaySpeed the replay factor
     * @param {number} properties.responseFormat the response format (e.g video/mp4)
     * @instance
     * @memberof OSH.DataReceiver.DataSource
     * @returns {string} the full url
     */
    buildUrl: function(properties) {
        var url = "";

        // adds protocol
        url += properties.protocol + "://";

        // adds endpoint url
        url += properties.endpointUrl+"?";

        // adds service
        url += "service="+properties.service+"&";

        // adds version
        url += "version=2.0&";

        // adds request
        url += "request=GetResult&";

        // adds offering
        url += "offering="+properties.offeringID+"&";

        // adds observedProperty
        url += "observedProperty="+properties.observedProperty+"&";

        // adds temporalFilter
        var startTime = properties.startTime;
        var endTime = properties.endTime;
        if (startTime !== "now" && this.timeShift != 0) {
            // HACK: don't do it for old Android dataset that is indexed differently
            if (properties.offeringID !== "urn:android:device:060693280a28e015-sos") {
                // apply time shift
                startTime = new Date(Date.parse(startTime) - this.timeShift).toISOString();
                endTime = new Date(Date.parse(endTime) - this.timeShift).toISOString();
            }
        }
        url += "temporalFilter=phenomenonTime,"+startTime+"/"+endTime+"&";

        if(properties.replaySpeed) {
            // adds replaySpeed
            url += "replaySpeed="+properties.replaySpeed;
        }

        // adds responseFormat (mandatory)
        url += "&responseFormat=application/json";

        return url;
    }
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This datasource provides parsing to chart data.
 * Data has to be under the format : ISODATE,X,Y,
 * @class
 * @augments OSH.DataReceiver.DataSource
 * @example
 *var chartDataSource = new OSH.DataReceiver.Chart("chart", {
      protocol: "ws",
      service: "SOS",
      endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
      offeringID: "urn:mysos:offering03",
      observedProperty: "http://sensorml.com/ont/swe/property/Weather",
      startTime: "now",
      endTime: "2055-01-01Z",
      syncMasterTime: false,
      bufferingTime: 1000
  });
 */
OSH.DataReceiver.Chart = OSH.DataReceiver.DataSource.extend({

    /**
     * Extracts timestamp from the data. The timestamp is the first token got from split(',')
     * @param {function} $super the parseTimeStamp super method
     * @param {string} data the data to parse
     * @returns {number} the extracted timestamp
     * @memberof OSH.DataReceiver.Chart
     * @instance
     */
    parseTimeStamp: function (data) {
        var rec = String.fromCharCode.apply(null, new Uint8Array(data));
        var tokens = rec.trim().split(",");
        var t = new Date(tokens[0]).getTime();
        return t;
    },

    /**
     * Extract data from the message. This split over ",".
     * @param {function} $super the parseData super method
     * @param {Object} data the data to parse
     * @returns {Array} the parsed data as an array of tokens
     * @memberof OSH.DataReceiver.Chart
     * @instance
     */
    parseData: function (data) {
        var rec = String.fromCharCode.apply(null, new Uint8Array(data));
        var tokens = rec.trim().split(",");
        //skip time
        tokens.shift();
        return tokens;
    }
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 *
 * @constructor
 */
OSH.DataReceiver.DataSourceFactory = function() {};

OSH.DataReceiver.DataSourceFactory.DEFINITION_TYPE = {
    JSON:"json",
    VIDEO:"video"
};

OSH.DataReceiver.DataSourceFactory.definitionMap = {
    "http://sensorml.com/ont/swe/property/VideoFrame": OSH.DataReceiver.DataSourceFactory.DEFINITION_TYPE.VIDEO, //video
    "http://sensorml.com/ont/swe/property/Image" : OSH.DataReceiver.DataSourceFactory.DEFINITION_TYPE.VIDEO //video
};

OSH.DataReceiver.DataSourceFactory.createDatasourceFromType = function(properties,callback) {
    OSH.Asserts.checkIsDefineOrNotNull(properties);
    OSH.Asserts.checkIsDefineOrNotNull(properties.definition);

    var type = "";

    if(properties.definition in OSH.DataReceiver.DataSourceFactory.definitionMap) {
        type = OSH.DataReceiver.DataSourceFactory.definitionMap[properties.definition];
    }

    if(type === OSH.DataReceiver.DataSourceFactory.DEFINITION_TYPE.VIDEO) {
        OSH.DataReceiver.DataSourceFactory.createVideoDatasource(properties,callback);
    } else {
        OSH.DataReceiver.DataSourceFactory.createJsonDatasource(properties,callback);
    }
};

/**
 *
 * @param properties the datasource properties
 * @param callback callback function called when the datasource is created. The callback will returns undefined if no datasource matches.
 * @memberof OSH.DataReceiver.DataSourceFactory
 * @instance
 */
OSH.DataReceiver.DataSourceFactory.createVideoDatasource = function(properties,callback) {
    OSH.Asserts.checkIsDefineOrNotNull(properties);
    OSH.Asserts.checkIsDefineOrNotNull(callback);

    var oshServer = new OSH.Server({
        url: "http://"+properties.endpointUrl
    });

    var self = this;

    oshServer.getResultTemplate(properties.offeringID,properties.observedProperty, function(jsonResp){
        var resultEncodingArr = jsonResp.GetResultTemplateResponse.resultEncoding.member;
        var compression = null;

        for(var i=0;i < resultEncodingArr.length;i++) {
            var elt = resultEncodingArr[i];
            if('compression' in elt) {
                compression = elt.compression;
                break;
            }
        }

        // store compression info
        properties.compression = compression;

        var datasource;

        if(compression === "JPEG") {
            datasource = new OSH.DataReceiver.VideoMjpeg(properties.name, properties);
        } else if(compression === "H264") {
            datasource = new OSH.DataReceiver.VideoH264(properties.name, properties);
        }

        datasource.resultTemplate = self.buildDSStructure(datasource,jsonResp);
        callback(datasource);

    },function(error) {
        throw new OSH.Exception.Exception("Cannot Get result template for "+properties.endpointUrl,error);
    });
};

/**
 *
 * @param properties the datasource properties
 * @param callback callback function called when the datasource is created. The callback will returns undefined if no datasource matches.
 * @memberof OSH.DataReceiver.DataSourceFactory
 * @instance
 */
OSH.DataReceiver.DataSourceFactory.createJsonDatasource = function(properties,callback) {
    OSH.Asserts.checkIsDefineOrNotNull(properties);
    OSH.Asserts.checkIsDefineOrNotNull(callback);

    var datasource = new OSH.DataReceiver.JSON(properties.name, properties);

    this.buildDSResultTemplate(datasource,function (dsResult) {
        callback(dsResult);
    });
};

OSH.DataReceiver.DataSourceFactory.buildDSResultTemplate = function(dataSource,callback) {
    // get result template from datasource
    var server = new OSH.Server({
        url: "http://" + dataSource.properties.endpointUrl
    });

    var self = this;
    // offering, observedProperty
    server.getResultTemplate(dataSource.properties.offeringID,dataSource.properties.observedProperty, function(jsonResp){
        dataSource.resultTemplate = self.buildDSStructure(dataSource,jsonResp);
        callback(dataSource);
    },function(error) {
        // do something
    });
};

OSH.DataReceiver.DataSourceFactory.buildDSStructure = function (datasource, resultTemplate) {
    var result = [];
    var currentObj = null;
    var group = null;

    OSH.Utils.traverse(resultTemplate.GetResultTemplateResponse.resultStructure.field, function (key, value, params) {
        if (params.defLevel !== null && params.level < params.defLevel) {
            result.push(currentObj);
            currentObj = null;
            params.defLevel = null;
        }

        if (group !== null && params.level < group.level) {
            group = null;
        }

        //TODO: define stop rules
        if (!isUndefinedOrNull(value.definition) || !isUndefinedOrNull(value.axisID)) {

            var saveGroup = false;
            if (currentObj !== null) {
                saveGroup = true;
                group = {
                    path: currentObj.path,
                    level: params.level,
                    object: currentObj.object
                };
            }

            if (!isUndefinedOrNull(value.definition)) {
                currentObj = {
                    definition: value.definition,
                    path: null,
                    object: value
                };
            } else {
                currentObj = {
                    path: null,
                    object: value
                };
            }

            params.defLevel = params.level + 1;
        }

        if (params.defLevel !== null && params.level >= params.defLevel) {
            if (key === "name") {
                if (currentObj.path === null) {
                    if (group !== null) {
                        currentObj.path = group.path + "." + value;
                        currentObj.parentObject = group.object;
                    } else {
                        currentObj.path = value;
                    }
                } else {
                    currentObj.path = currentObj.path + "." + value;
                }
            }
        }
    }, {level: 0, defLevel: null});

    if (currentObj !== null) {
        result.push(currentObj);
    }

    for (var key in result) {
        var uiLabel = "no label/axisID/name defined";
        if (!isUndefinedOrNull(result[key].object.label)) {
            uiLabel = result[key].object.label;
        } else if (!isUndefinedOrNull(result[key].object.axisID)) {
            uiLabel = result[key].object.axisID;
        } else if (!isUndefinedOrNull(result[key].object.name)) {
            uiLabel = result[key].object.name;
        }
        result[key].uiLabel = uiLabel;
    }
    return result;
};
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This class is responsible of handling datasources. It observes necessary events to manage datasources.
 * @class OSH.DataReceiver.DataReceiverController
 * @listens {@link OSH.EventManager.EVENT.CONNECT_DATASOURCE}
 * @listens {@link OSH.EventManager.EVENT.DISCONNECT_DATASOURCE}
 * @listens {@link OSH.EventManager.EVENT.DATASOURCE_UPDATE_TIME}
 * @example
 *
 * var datasource = new OSH.DataReceiver... // creates OSH.DataReceiver.<>
 *
 * // creates controller
 * var dataProviderController = new OSH.DataReceiver.DataReceiverController({
 *   replayFactor : replayFactor
 * });
 *
 * // adds datasource to controller
 * dataProviderController.addDataSource(weatherDataSource);
 *
 * // and/or adds entity to controller
 * var entity = {
 *       id : "entity-"+OSH.Utils.randomUUID(),
 *       name: "Some entity",
 *       dataSources: [datasource]
 * };
 *
 * dataProviderController.addEntity(entity);
 *
 */
OSH.DataReceiver.DataReceiverController = BaseClass.extend({
    initialize: function (options) {
        this.options = options;
        this.initBuffer();
        this.dataSourcesIdToDataSources = {};

        /*
        * @event {@link OSH.EventManager.EVENT.CONNECT_DATASOURCE}
        * @type {Object}
        * @property {Object} event - Is notified when a dataSource has to be connected
        * @property {Object} event.dataSourcesId - The datasource id
        */
        // observe CONNECT event and connect dataSources consequently
        OSH.EventManager.observe(OSH.EventManager.EVENT.CONNECT_DATASOURCE, function (event) {
            var eventDataSourcesIds = event.dataSourcesId;
            for (var i = 0; i < eventDataSourcesIds.length; i++) {
                var id = eventDataSourcesIds[i];
                if (id in this.dataSourcesIdToDataSources) {
                    // if sync to master to time, request data starting at current time
                    if (this.dataSourcesIdToDataSources[id].syncMasterTime) {
                        this.updateDataSourceTime(id, new Date(this.buffer.currentTime).toISOString());
                    }
                    this.dataSourcesIdToDataSources[id].connect();
                    this.buffer.startDataSource(id);
                }
            }
        }.bind(this));

        /*
         * @event {@link OSH.EventManager.EVENT.DISCONNECT_DATASOURCE}
         * @type {Object}
         * @property {Object} event - Is notified when a dataSource has to be disconnected
         * @property {Object} event.dataSourcesId - The datasource id
         */
        // observe DISCONNECT event and disconnect dataSources consequently
        OSH.EventManager.observe(OSH.EventManager.EVENT.DISCONNECT_DATASOURCE, function (event) {
            var eventDataSourcesIds = event.dataSourcesId;
            for (var i = 0; i < eventDataSourcesIds.length; i++) {
                var id = eventDataSourcesIds[i];
                if (id in this.dataSourcesIdToDataSources) {
                    this.dataSourcesIdToDataSources[id].disconnect();
                    this.buffer.cancelDataSource(id);
                }
            }
        }.bind(this));


        /*
         * @event {@link OSH.EventManager.EVENT.DATASOURCE_UPDATE_TIME}
         * @type {Object}
         * @property {Object} event - Is notified when the datasource has to be updated
         * @property {Object} event.startTime - The corresponding new start time
         * @property {Object} event.endTime - The corresponding new end time
         */
        OSH.EventManager.observe(OSH.EventManager.EVENT.DATASOURCE_UPDATE_TIME, function (event) {

            var dataSourcesToReconnect = [];

            // disconnect all synchronized datasources
            for (var id in this.dataSourcesIdToDataSources) {
                var dataSrc = this.dataSourcesIdToDataSources[id];
                if (dataSrc.syncMasterTime && dataSrc.connected) {
                    dataSrc.disconnect();
                    this.buffer.cancelDataSource(id);
                    dataSourcesToReconnect.push(id);
                }
            }

            // reset buffer current time
            this.buffer.currentTime = Date.parse(event.startTime);

            // reconnect all synchronized datasources with new time parameters
            for (var i = 0; i < dataSourcesToReconnect.length; i++) {
                var id = dataSourcesToReconnect[i];
                var dataSrc = this.dataSourcesIdToDataSources[id];
                this.updateDataSourceTime(id, event.startTime, event.endTime);
                dataSrc.connect();
                this.buffer.startDataSource(id);
            }

        }.bind(this));
    },

    /**
     * Updates the datasource time range.
     * @param id the datasource id
     * @param startTime the start time
     * @param endTime the end time
     * @instance
     * @memberof OSH.DataReceiver.DataReceiverController
     */
    updateDataSourceTime: function (id, startTime, endTime) {
        // get current parameters
        var dataSource = this.dataSourcesIdToDataSources[id];
        var props = dataSource.properties;
        var options = dataSource.options;

        // update start/end time
        if (typeof startTime != "undefined") {
            props.startTime = startTime;
        }

        if (typeof endTime != "undefined") {
            props.endTime = endTime;
        }

        // reset parameters
        dataSource.initDataSource(props, options);
    },

    /**
     * Instantiates a new OSH.Buffer {@link OSH.Buffer}
     * @instance
     * @memberof OSH.DataReceiver.DataReceiverController
     */
    initBuffer: function () {
        this.buffer = new OSH.Buffer(this.options);
    },

    /**
     * Adds a entity to the current list of datasources and pushes it into the buffer.
     * @see {@link OSH.Buffer}
     * @param {Object} dataSource the datasource to add
     * @param options @deprecated
     * @instance
     * @memberof OSH.DataReceiver.DataReceiverController
     */
    addEntity: function (entity, options) {
        if (typeof (entity.dataSources) != "undefined") {
            for (var i = 0; i < entity.dataSources.length; i++) {
                this.addDataSource(entity.dataSources[i], options);
            }
        }
    },

    /**
     * Adds a dataSource to the current list of datasources and pushes it into the buffer.
     * @see {@link OSH.Buffer}
     * @param {Object} dataSource the datasource to add
     * @param options @deprecated
     * @instance
     * @memberof OSH.DataReceiver.DataReceiverController
     */
    addDataSource: function (dataSource, options) {
        // if DS does not exist yet
        if(!(dataSource.id in this.dataSourcesIdToDataSources)) {
            this.dataSourcesIdToDataSources[dataSource.id] = dataSource;
            this.buffer.addDataSource(dataSource.id, {
                name: dataSource.name,
                syncMasterTime: dataSource.syncMasterTime,
                bufferingTime: dataSource.bufferingTime,
                timeOut: dataSource.timeOut
            });

            //TODO: make frozen variables?
            dataSource.onData = function (data) {
                this.buffer.push({dataSourceId: dataSource.getId(), data: data});

            }.bind(this);
        }
    },

    /**
     * Connects each connector
     * @instance
     * @memberof OSH.DataReceiver.DataReceiverController
     */
    connectAll: function () {
        this.buffer.start();
        for (var id in this.dataSourcesIdToDataSources) {
            this.dataSourcesIdToDataSources[id].connect();
        }
    },

    getDataSource:function(id) {
        return this.dataSourcesIdToDataSources[id];
    },

    removeDataSource:function(datasource) {
        this.buffer.removeDataSource(datasource.id);
        if(datasource.id in this.dataSourcesIdToDataSources) {
            delete this.dataSourcesIdToDataSources[datasource.id];
        }
    },

    updateDataSource: function(datasource) {
        // disconnects datasource before updating
        OSH.EventManager.fire(OSH.EventManager.EVENT.DISCONNECT_DATASOURCE,{dataSourcesId:[datasource.id]});
        // removes from buffer and internal map
        this.removeDataSource(datasource);
        // adds as a new one (because of handler to regenerate
        this.addDataSource(datasource);
    }
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2012-2016 Sensia Software LLC. All Rights Reserved.

 Author: Alex Robin <alex.robin@sensiasoftware.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 */
OSH.DataSender.DataSink =  BaseClass.extend({
    initialize: function (name, properties, options) {
        if (properties.protocol == "http") {
            this.connector = new OSH.DataConnector.AjaxConnector(this.buildUrl(properties));
            this.connector.onError = this.onCatchError.bind(this);
            this.connector.onSuccess = this.onCatchSuccess.bind(this);
        }
        this.id = "DataSender-" + OSH.Utils.randomUUID();
        this.name = name;
        this.properties = properties;
    },

    /**
     * @param properties
     * @instance
     * @memberof OSH.DataSender.DataSink
     */
    sendRequest: function(properties) {
        this.connector.sendRequest(this.buildRequest(properties));
    },

    /**
     * @param properties
     * @instance
     * @memberof OSH.DataSender.DataSink
     */
    buildRequest:function(properties) {
        return "";
    },

    /**
     * @param properties
     * @instance
     * @memberof OSH.DataSender.DataSink
     */
    buildUrl: function(properties) {
        var url = "";

        // adds protocol
        url += properties.protocol + "://";

        // adds endpoint url
        url += properties.endpointUrl;

        return url;
    },

    /**
     * @param response
     * @instance
     * @memberof OSH.DataSender.DataSink
     */
    onCatchError:function(response) {
        this.onError(response);
    },

    /**
     * @param response
     * @instance
     * @memberof OSH.DataSender.DataSink
     */
    onCatchSuccess:function(response) {
        this.onSuccess(response);
    },

    /**
     * @param response
     * @instance
     * @memberof OSH.DataSender.DataSink
     */
    onError:function(response) {

    },

    /**
     * @param response
     * @instance
     * @memberof OSH.DataSender.DataSink
     */
    onSuccess:function(response) {

    },

    /**
     * The data connector default id.
     * @returns {string|*}
     * @memberof OSH.DataConnector.DataSink
     * @instance
     */
    getId: function() {
        return this.id;
    },

    /**
     * The name.
     * @returns {string}
     * @memberof OSH.DataConnector.DataSink
     * @instance
     */
    getName: function() {
        return this.name;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @augments OSH.DataSender.DataSink
 */
OSH.DataSender.PtzTasking = OSH.DataSender.DataSink.extend({

    initialize: function(name, properties) {
        this._super(name, properties);

        OSH.EventManager.observe(OSH.EventManager.EVENT.PTZ_SEND_REQUEST+"-"+this.id, function (event) {
            this.connector.sendRequest(this.buildRequest(this.getCommandData(event.cmdData)));
        }.bind(this));
    },

    // to override by specific vendor dataSender
    getCommandData:function(values) {
        var cmdData = "";

        if(values.rtilt != null) {
            cmdData += "rtilt,"+values.rtilt+" ";
        }

        if(values.rpan != null) {
            cmdData += "rpan,"+values.rpan+" ";
        }

        if(values.rzoom != null) {
            cmdData += "rzoom,"+values.rzoom+" ";
        }
        return cmdData;
    },

    /**
     * Builds the request based on sps standard.
     * @returns {string} the sps request
     * @memberof OSH.DataReceiver.PtzTasking
     * @instance
     */
    buildRequest: function(cmdData) {
        var xmlSpsRequest = "<sps:Submit ";

        // adds service
        xmlSpsRequest += "service=\""+this.properties.service+"\" ";

        // adds version
        xmlSpsRequest += "version=\""+this.properties.version+"\" ";

        // adds ns
        xmlSpsRequest += "xmlns:sps=\"http://www.opengis.net/sps/2.0\" xmlns:swe=\"http://www.opengis.net/swe/2.0\"> ";

        // adds procedure
        xmlSpsRequest += "<sps:procedure>"+this.properties.offeringID+"</sps:procedure>";

        // adds taskingParameters
        xmlSpsRequest += "<sps:taskingParameters><sps:ParameterData>";

        // adds encoding
        xmlSpsRequest += "<sps:encoding><swe:TextEncoding blockSeparator=\" \"  collapseWhiteSpaces=\"true\" decimalSeparator=\".\" tokenSeparator=\",\"/></sps:encoding>";

        // adds values
        xmlSpsRequest += "<sps:values>"+cmdData+"</sps:values>";

        // adds endings
        xmlSpsRequest += "</sps:ParameterData></sps:taskingParameters></sps:Submit>";

        return xmlSpsRequest;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @augments OSH.DataSender.DataSink
 * From describe tasking:
 * swe:item name="relMove">
 <swe:Text definition="http://sensorml.com/ont/swe/property/CameraRelativeMovementName">
 <swe:label>Camera Relative Movements</swe:label>
 <swe:constraint>
 <swe:AllowedTokens>
 <swe:value>Down</swe:value>
 <swe:value>Up</swe:value>
 <swe:value>Left</swe:value>
 <swe:value>Right</swe:value>
 <swe:value>TopLeft</swe:value>
 <swe:value>TopRight</swe:value>
 <swe:value>BottomLeft</swe:value>
 <swe:value>BottomRight</swe:value>
 </swe:AllowedTokens>
 </swe:constraint>
 </swe:Text>
 </swe:item>

 <swe:item name="preset">
 <swe:Text definition="http://sensorml.com/ont/swe/property/CameraPresetPositionName">
 <swe:label>Preset Camera Position</swe:label>
 <swe:constraint>
 <swe:AllowedTokens>
 <swe:value>Reset</swe:value>
 <swe:value>TopMost</swe:value>
 <swe:value>BottomMost</swe:value>
 <swe:value>LeftMost</swe:value>
 <swe:value>RightMost</swe:value>
 </swe:AllowedTokens>
 </swe:constraint>
 </swe:Text>
 </swe:item>
 */
OSH.DataSender.FoscamPtzTasking = OSH.DataSender.PtzTasking.extend({

    getCommandData: function (values) {
        var cmdData = "";

        if (values.preset !== null) {
            cmdData = "preset," + values.preset;
        }else if(values.rzoom !== null) {
            cmdData = "zoom,";
            if (values.rzoom < 0) {
                cmdData += "out";
            } else {
                cmdData += "in";
            }
        } else {
            if (values.rpan != null && values.rtilt != null) {
                cmdData += "relMove,";

                if (values.rtilt !== null) {
                    if (values.rtilt < 0) {
                        cmdData += "Bottom";
                    } else {
                        cmdData += "Top";
                    }
                }

                if (values.rpan < 0) {
                    cmdData += "Left";
                } else {
                    cmdData += "Right";
                }
            } else {
                if (values.rpan !== null) {
                    cmdData += "relMove,";
                    if (values.rpan < 0) {
                        cmdData += "Left";
                    } else {
                        cmdData += "Right";
                    }
                    cmdData += " "; //block separator
                }

                if (values.rtilt !== null) {
                    cmdData += "relMove,";
                    if (values.rtilt < 0) {
                        cmdData += "Down";
                    } else {
                        cmdData += "Up";
                    }
                }
            }
        }
        return cmdData;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2012-2016 Sensia Software LLC. All Rights Reserved.

 Author: Alex Robin <alex.robin@sensiasoftware.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @augments OSH.DataSender.DataSource
 */
OSH.DataSender.UavMapTasking = OSH.DataSender.DataSink.extend({

    initialize: function(name, properties) {

        this._super(name, properties);

        OSH.EventManager.observe(OSH.EventManager.EVENT.UAV_TAKEOFF, function (event) {
            this.connector.sendRequest(this.buildTakeOffRequest());            
        }.bind(this));

        OSH.EventManager.observe(OSH.EventManager.EVENT.UAV_GOTO, function (event) {
            this.connector.sendRequest(this.buildGotoRequest({lat: event.geoLat, lon: event.geoLon}));
        }.bind(this));

        OSH.EventManager.observe(OSH.EventManager.EVENT.UAV_ORBIT, function (event) {
            this.connector.sendRequest(this.buildOrbitRequest({lat: event.geoLat, lon: event.geoLon, radius: 10}));
        }.bind(this));

        OSH.EventManager.observe(OSH.EventManager.EVENT.UAV_LOOKAT, function (event) {
            this.connector.sendRequest(this.buildLookAtRequest({lat: event.geoLat, lon: event.geoLon}));
        }.bind(this));

        OSH.EventManager.observe(OSH.EventManager.EVENT.UAV_LAND, function (event) {
            this.connector.sendRequest(this.buildLandRequest({lat: event.geoLat, lon: event.geoLon}));
        }.bind(this));
    },


    /**
     * Builds the take off SPS request.
     * @param {string} props
     * @returns {string} the take off sps request
     * @memberof OSH.DataReceiver.UavMapTasking
     * @instance
     */
    buildTakeOffRequest: function(props) {
        return this.buildRequest("navCommands,TAKEOFF,10");
    },



    /**
     * Builds the got to SPS request.
     * @param {string} props
     * @returns {string} the goto SPS request
     * @memberof OSH.DataReceiver.UavMapTasking
     * @instance
     */
    buildGotoRequest: function(props) {
        return this.buildRequest("navCommands,GOTO_LLA,"+props.lat+","+props.lon+",0,0");
    },


    /**
     * Builds the orbit SPS request.
     * @returns {string} the orbit SPS request
     * @memberof OSH.DataReceiver.UavMapTasking
     * @param {string} props
     * @instance
     */
    buildOrbitRequest: function(props) {
        return this.buildRequest("navCommands,ORBIT,"+props.lat+","+props.lon+",0,"+props.radius);
    },


    /**
     * Builds the lookat SPS request.
     * @returns {string} the lookat SPS request
     * @memberof OSH.DataReceiver.UavMapTasking
     * @param {string} props
     * @instance
     */
    buildLookAtRequest: function(props) {
        return this.buildRequest("camCommands,MOUNT_TARGET,"+props.lat+","+props.lon+",0");
    },


    /**
     * Builds the land SPS request.
     * @returns {string} the land SPS request
     * @memberof OSH.DataReceiver.UavMapTasking
     * @param {string} props
     * @instance
     */
    buildLandRequest: function(props) {
        return this.buildRequest("navCommands,LAND,"+props.lat+","+props.lon);
    },


    /**
     * Builds the request based on sps standard.
     * @param {string} the command data
     * @returns {string} the sps request
     * @memberof OSH.DataReceiver.UavMapTasking
     * @instance
     */
    buildRequest: function(cmdData) {
        var xmlSpsRequest = "<sps:Submit ";

        // adds service
        xmlSpsRequest += "service=\""+this.properties.service+"\" ";

        // adds version
        xmlSpsRequest += "version=\""+this.properties.version+"\" ";

        // adds ns
        xmlSpsRequest += "xmlns:sps=\"http://www.opengis.net/sps/2.0\" xmlns:swe=\"http://www.opengis.net/swe/2.0\"> ";

        // adds procedure
        xmlSpsRequest += "<sps:procedure>"+this.properties.offeringID+"</sps:procedure>";

        // adds taskingParameters
        xmlSpsRequest += "<sps:taskingParameters><sps:ParameterData>";

        // adds encoding
        xmlSpsRequest += "<sps:encoding><swe:TextEncoding blockSeparator=\" \"  collapseWhiteSpaces=\"true\" decimalSeparator=\".\" tokenSeparator=\",\"/></sps:encoding>";

        // adds values
        xmlSpsRequest += "<sps:values>"+cmdData+"</sps:values>";

        // adds endings
        xmlSpsRequest += "</sps:ParameterData></sps:taskingParameters></sps:Submit>";

        document.fire("osh:log", xmlSpsRequest);

        return xmlSpsRequest;
    }

    
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This class is responsible for sending request to server.
 * @class
 * @param {Object} options
 */
OSH.DataSender.DataSenderController = BaseClass.extend({
    initialize: function (options) {
        this.dataSources = {};
    },

    /**
     * Adds a datasource to the list of datasources to process
     * @param {Object} datasource the datasource to add
     * @instance
     * @memberof OSH.DataSender.DataSenderController
     */
    addDataSource: function(dataSource) {
        this.dataSources[dataSource.getId()] = dataSource;
    },

    /**
     * Sends request to the server
     * @param {string} dataSourceId the datasource id to process
     * @param {Object} properties the properties to use
     * @param {function} onSucess the onSucess function
     * @param {function} onError the onError function
     * @instance
     * @memberof OSH.DataSender.DataSenderController
     */
    sendRequest: function(dataSourceId,properties, onSuccess, onError) {
        if (dataSourceId in this.dataSources) {
            // may be optimized. It is redefined the callback for every requests
            if(typeof(onSuccess) != "undefined" && onSuccess != null) {
                this.dataSources[dataSourceId].onSuccess = function(response) {
                    onSuccess(response);
                }
            }

            if(typeof(onError) != "undefined" && onError != null) {
                this.dataSources[dataSourceId].onError = function(response) {
                    onError(response);
                }
            }

            this.dataSources[dataSourceId].sendRequest(properties);
        }
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Richard Becker. All Rights Reserved.

 Author: Richard Becker <beckerr@prominentedge.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @class
 * @classdesc
 * @example
 *
 * var oshServer = new OSH.Server({
 *    url : <someUrl>,
 *    sosService: 'sos',
 *    spsService: 'sps',
 *    baseUrl: 'sensorhub'
 * });
 */
OSH.Server = BaseClass.extend({
    initialize: function (properties) {
        this.url = properties.url;
        this.id = "Server-" + OSH.Utils.randomUUID();
    },

    /**
     *
     * @param successCallback
     * @param errorCallback
     * @instance
     * @memberof OSH.Server
     */
    getCapabilities: function (successCallback, errorCallback) {
        var request = this.url + '?service=SOS&version=2.0&request=GetCapabilities';
        this.executeGetRequest(request, successCallback, errorCallback);
    },

    /**
     *
     * @param successCallback callback the corresponding JSON object
     * @param errorCallback callback the corresponding error
     * @instance
     * @memberof OSH.Server
     */
    getFeatureOfInterest: function (successCallback, errorCallback) {
        var request = this.url + '?service=SOS&version=2.0&request=GetFeatureOfInterest';
        this.executeGetRequest(request, successCallback, errorCallback);
    },

    /**
     *
     * @param successCallback callback the corresponding JSON object
     * @param errorCallback callback the corresponding error
     * @param offering the corresponding offering
     * @instance
     * @memberof OSH.Server
     */
    getResultTemplate: function (offering, observedProperty,successCallback, errorCallback) {
        var request = this.url + '?service=SOS&version=2.0&request=GetResultTemplate&offering=' + offering + "&observedProperty=" + observedProperty;
        this.executeGetRequest(request, successCallback, errorCallback);
    },

    getDescribeSensor:function(procedure, successCallback, errorCallback) {
        var request = this.url + '?service=SOS&version=2.0&request=DescribeSensor&procedure=' + procedure;
        this.executeGetRequest(request, successCallback, errorCallback);
    },
    /**
     *
     * @param request
     * @param successCallback
     * @param errorCallback
     */
    executeGetRequest: function (request, successCallback, errorCallback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var s = successCallback.bind(this);
                var sweXmlParser = new OSH.SWEXmlParser(xhr.responseText);
                s(sweXmlParser.toJson());
            } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200){
                errorCallback(xhr.responseText);
            }
        }.bind(this);
        xhr.open('GET', request, true);
        xhr.send();
    }
});

/**
 * Created by mdhsl on 5/4/17.
 */

/**
 * @class Javascript binding for SWE requests
 * @classdesc
 *
 */
OSH.SWEXmlParser = BaseClass.extend({

    initialize:function(xml) {
        this.originalXml = xml;

        var x2jsOptions = {
            xmlns: false, // does not keep xmlns
            attributePrefix:"",
            prefix: false,
            removeAttrPrefix:true,
            arrayAccessFormPaths : [
                /.*.coordinate$/,
                /.*.field$/,
                /.*.item$/,
                /.*.quality$/,
                /.*.member$/,
                /.*.constraint\.value$/,
                /.*.constraint\.interval$/,
                /.*.offering$/,
                /.*.observableProperty/
            ],
            numericalAccessFormPaths: [
                "value",
                "nilValue",
                "paddingBytes-after",
                "paddingBytes-before",
                "byteLength",
                "significantBits",
                "bitLength",
                /.*.Time\.value/,
                /.*.Quantity\.value/,
                /.*.Count\.value/
            ],
            skip: [
                "type"
            ]

        };

        this.x2jsParser = new X2JS(x2jsOptions);
    },

    toXml:function() {
        return this.originalXml;
    },

    toJson:function() {
        return this.x2jsParser.xml_str2json(this.originalXml);

    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


OSH.UI.Panel = BaseClass.extend({
    initialize: function (parentElementDivId,options) {
        this.divId = "panel-"+OSH.Utils.randomUUID();
        this.id = this.divId;
        this.options = options;
        this.elementDiv = document.createElement("div");
        this.elementDiv.setAttribute("class", "osh panel");
        this.elementDiv.setAttribute("id", this.divId);

        if(!isUndefinedOrNull(parentElementDivId) && parentElementDivId !== "") {
            document.getElementById(parentElementDivId).appendChild(this.elementDiv);
        } else {
            document.body.appendChild(this.elementDiv);
        }

        this.componentListeners = [];

        if(!isUndefinedOrNull(options)) {
            if(!isUndefinedOrNull(options.css)) {
                OSH.Utils.addCss(this.elementDiv,options.css);
            }
        }
        this.initPanel();
        this.handleEvents();
    },

    initPanel:function() {},

    addListener: function(div,listenerName, func) {
        OSH.Asserts.checkIsDefineOrNotNull(div);
        OSH.Asserts.checkIsDefineOrNotNull(func);

        OSH.Helper.HtmlHelper.onDomReady(function() {
            div.addEventListener(listenerName, func, false);
            this.componentListeners.push({
                div: div,
                name: listenerName,
                func: func
            });
        }.bind(this));
    },

    removeAllListerners:function() {
        for(var key in this.componentListeners) {
            var elt = this.componentListeners[key];
            elt.div.removeEventListener(elt.name,elt.func);
        }
    },

    getAsHTML:function() {
        return this.elementDiv.outerHTML;
    },

    /**
     *
     * @param divId
     * @instance
     * @memberof OSH.UI.Panel
     */
    attachTo : function(divId) {
       this.attachToElement(document.getElementById(divId));
    },

    /**
     *
     * @param divId
     * @instance
     * @memberof OSH.UI.Panel
     */
    attachToElement : function(element) {
        if(typeof this.elementDiv.parentNode !== "undefined") {
            // detach from its parent
            this.elementDiv.parentNode.removeChild(this.elementDiv);
        }
        element.appendChild(this.elementDiv);
        if(this.elementDiv.style.display === "none") {
            this.elementDiv.style.display = "block";
        }
        this.onResize();
    },

    /**
     * @instance
     * @memberof OSH.UI.Panel
     */
    onResize:function() {
    },

    inputFileHandlerAsBinaryString:function(callbackFn,evt) {
        var file = evt.target.files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        var inputElt = this;
        reader.onload = (function(theFile) {
            inputElt.nextSibling.text = theFile.name;
            inputElt.nextSibling.value = theFile.name;

            return function(e) {
                var l, d, array;
                d = e.target.result;
                l = d.length;
                array = new Uint8Array(l);
                for (var i = 0; i < l; i++){
                    array[i] = d.charCodeAt(i);
                }
                var blob = new Blob([array], {type: 'application/octet-stream'});
                callbackFn({
                    url:URL.createObjectURL(blob),
                    binaryString:d,
                    name:theFile.name,
                    length:l
                });
            };
        })(file);

        // Read in the image file as a binary string.
        reader.readAsBinaryString(file);
    },

    inputFileHandlerAsText:function(callbackFn,evt) {
        var file = evt.target.files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        var inputElt = this;
        reader.onload = (function(theFile) {
            inputElt.nextSibling.text = theFile.name;
            inputElt.nextSibling.value = theFile.name;

            return function(e) {
                callbackFn({
                    data:e.target.result,
                    file: theFile
                });
            };
        })(file);

        // Read in the image file as a binary string.
        reader.readAsText(file);
    },

    inputFilePasteHandler : function(callbackFn,evt) {
        OSH.Asserts.checkIsDefineOrNotNull(evt);

        var clipboardData = evt.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('Text');

        var name = "";
        var split = pastedData.split("/");
        if(split.length > 0) {
            name = split[split.length-1];
        }

        callbackFn({
            url:pastedData,
            name:name
        });
    },

    setInputFileValue:function(inputElt,props /** name,arraybuffer,type **/) {
        if(!isUndefinedOrNull(props)) {
            var url = props.url;

            var sel = inputElt.parentNode.querySelectorAll("div.preview")[0];
            sel.innerHTML = ['<img class="thumb" src="', url,
                '" title="', escape(props.name), '"/>'].join('');

            inputElt.nextSibling.text = props.name;
            inputElt.nextSibling.value = props.name;
        }
    },

    //TODO: to move into HELPER
    removeAllFromSelect:function(tagId) {
        var i;
        var selectTag = document.getElementById(tagId);
        for (i = selectTag.options.length - 1; i > 0; i--) {
            selectTag.remove(i);
        }
    },

    //TODO: to move into HELPER
    removeAllFromSelectElement:function(element) {
        var i;
        for (i = element.options.length - 1; i > 0; i--) {
            element.remove(i);
        }
    },

    /**
     * Show the view by removing display:none style if any.
     * @param properties
     * @instance
     * @memberof OSH.UI.Panel
     */
    show: function(properties) {
        this.setVisible(properties.show);
    },

    /**
     *
     * @param properties
     * @instance
     * @memberof OSH.UI.Panel
     */
    shows: function(properties) {
    },

    handleEvents:function() {
        var self = this;

        // observes the SHOW event
        OSH.EventManager.observe(OSH.EventManager.EVENT.SHOW_VIEW+"-"+this.divId,function(event){
            self.setVisible(true);
        });

        OSH.EventManager.observe(OSH.EventManager.EVENT.RESIZE+"-"+this.divId,function(event){
            self.onResize();
        });

        OSH.EventManager.observe(OSH.EventManager.EVENT.SEND_OBJECT+"-"+this.divId,function(event){
            OSH.EventManager.fire(OSH.EventManager.EVENT.GET_OBJECT+"-"+self.divId,{
                object: self
            });
        });
    },

    setVisible:function(isVisible) {
        if(!isVisible) {
            this.elementDiv.style.displayOld = window.getComputedStyle(this.elementDiv).getPropertyValue('display');
            this.elementDiv.style.display = "none";
        } else if(!isUndefinedOrNull(this.elementDiv.style.displayOld)) {
            this.elementDiv.style.display = this.elementDiv.style.displayOld;
        } else {
            this.elementDiv.style.display = "block";
        }
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.TabPanel = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        this.mainElt = document.createElement("main");
        this.mainElt.setAttribute("class","tab-panel");

        this.elementDiv.appendChild(this.mainElt);

        this.sectionNb = 0;

        this.sectionElts = [];
        this.labelElt = [];
    },

    addTab: function(label, div) {
        var id = OSH.Utils.randomUUID();

        var inputElt = document.createElement("input");
        inputElt.setAttribute("id","tab"+this.sectionNb);
        inputElt.setAttribute("type","radio");
        inputElt.setAttribute("name","tabs");

        var labelElt = document.createElement("label");
        labelElt.setAttribute("for",id);
        labelElt.setAttribute("id","label-"+id);
        labelElt.innerHTML = label;

        var sectionElt = document.createElement("section");
        sectionElt.setAttribute("id","content"+(this.sectionNb));
        sectionElt.setAttribute("class","hide-tab");

        sectionElt.appendChild(div);
        this.sectionElts.push(sectionElt);

        this.labelElt.push({
            label : labelElt,
            input: inputElt
        });

        OSH.Helper.HtmlHelper.removeAllNodes(this.mainElt);

        for(var key in this.labelElt) {
            this.mainElt.appendChild(this.labelElt[key].input);
            this.mainElt.appendChild(this.labelElt[key].label);
        }

        for(var key in this.sectionElts)  {
            this.mainElt.appendChild(this.sectionElts[key]);
        }

        // listeners
        OSH.EventManager.observeDiv(labelElt.id,"click",this.setChecked.bind(this,inputElt,sectionElt));

        var self = this;
        OSH.Helper.HtmlHelper.onDomReady(function(){
            OSH.Helper.HtmlHelper.fireEvent(self.labelElt[0].label, "click");
        });
    },

    setChecked:function(inputElt,sectionElt,evt) {
        if(!isUndefinedOrNull(this.currentSelectedInput)) {
            this.currentSelectedInput.removeAttribute("checked");
        }

        if(!isUndefinedOrNull(this.currentSelectedSection)) {
            OSH.Utils.replaceCss(this.currentSelectedSection,"show-tab","hide-tab");
        }


        inputElt.setAttribute("checked","");
        OSH.Utils.replaceCss(sectionElt,"hide-tab","show-tab");

        this.currentSelectedInput = inputElt;
        this.currentSelectedSection = sectionElt;
    },

    disableTab:function(index) {},

    addToTab:function(index,div) {
        this.sectionElts[index].appendChild(div);
    }
});
/**
 * @classdesc
 * @class
 * @type {OSH.UI.Panel}
 * @augments OSH.UI.Panel
 * @example
 var dialogPanel =  new OSH.UI.Panel.DialogPanel(containerDivId, {
        pinContainerId: "pin-container",
        swapContainerId: "main-container",
        title: title,
        show:false,
        css: "dialog",
        draggable: false,
        resizable: true,

        closeable: true,
        connectionIds : dataSources ,
        destroyOnClose: true,
        modal: false
    });
 */
OSH.UI.Panel.DialogPanel = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel: function () {
        OSH.Utils.addCss(this.elementDiv, "dialog");
        // creates header
        this.headerElt = this.createHeader();

        // creates content
        this.contentElt = this.createContent();

        // creates footer
        this.footerElt = this.createFooter();

        this.parentElementDiv = this.elementDiv.parentNode;

        // creates inner
        this.innerElementDiv = document.createElement("div");
        this.innerElementDiv.setAttribute("class","dialog-inner "+this.options.css);

        this.elementDiv.appendChild(this.innerElementDiv);

        this.innerElementDiv.appendChild(this.headerElt);
        this.innerElementDiv.appendChild(this.contentElt);
        this.innerElementDiv.appendChild(this.footerElt);

        this.initDragAndDrop(this.innerElementDiv,this.parentElementDiv);

        this.updateProperties(this.options);
    },

    /**
     * Check properties
     * @param properties the new properties
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    checkOptions:function(properties) {
        if(!isUndefinedOrNull(properties)) {
            // checks title
            if (!isUndefined(properties.title)) {
                this.title = properties.title;
            } else if(isUndefinedOrNull(this.title)) {
                this.title = "Untitled"; // default value
            }

            // checks show
            if (!isUndefined(properties.show)) {
                this.show = properties.show;
            } else if(isUndefinedOrNull(this.show)) {
                this.show = true; // default value
            }

            // checks draggable
            if (!isUndefined(properties.draggable)) {
                this.draggable = properties.draggable;
            } else if(isUndefinedOrNull(this.draggable)) {
                this.draggable = true; // default value
            }

            // checks resizable
            if (!isUndefined(properties.resizable)) {
                this.resizable = properties.resizable;
            } else if(isUndefinedOrNull(this.resizable)) {
                this.resizable = true; // default value
            }

            // checks closeable
            if (!isUndefined(properties.closeable)) {
                this.closeable = properties.closeable;
            } else if(isUndefinedOrNull(this.closeable)) {
                this.closeable = true; // default value
            }

            // checks connected & connectionIds
            if (!isUndefined(properties.connectionIds)) {
                this.connectionIds = properties.connectionIds;
                this.connected = true;
            } else if(isUndefinedOrNull(this.connectionIds)) {
                this.connected = false;  // default value
                this.connectionIds = []; // default value
            }

            // checks pin
            if (!isUndefined(properties.pinContainerId)) {
                this.pin = {
                    containerId: this.options.pinContainerId,
                    originalContainerId: this.parentElementDiv.id,
                    lastPosition: {
                        x: 0,
                        y: 0
                    }
                }
            } else if(isUndefinedOrNull(this.pin)) {
                this.pin = null; // default value
            }

            // checks swap
            if (!isUndefined(properties.swapContainerId)) {
                var dstElt = document.getElementById(properties.swapContainerId);
                if (!isUndefinedOrNull(dstElt)) {
                    var parentDstElt = dstElt.parentNode;
                    if (!isUndefinedOrNull(parentDstElt)) {
                        this.swap = {
                            swapContainerId: properties.swapContainerId,
                            position: window.getComputedStyle(dstElt).getPropertyValue('position')
                        }
                    }
                }
            } else if(isUndefinedOrNull(this.swap)) {
                this.swap = null; // default value
            }

            // checks destroy on close
            if (!isUndefined(properties.destroyOnClose)) {
                this.destroyOnClose = properties.destroyOnClose;
            } else if(isUndefinedOrNull(this.destroyOnClose)) {
                this.destroyOnClose = false; // default value
            }

            // checks modal
            if (!isUndefined(properties.modal)) {
                this.modal = properties.modal;
            } else if(isUndefinedOrNull(this.modal)) {
                this.modal = false; // default value
            }

            // checks ratio
            if (!isUndefined(properties.keepRatio)) {
                this.keepRatio = properties.keepRatio;
            } else {
                this.keepRatio = false;
            }
        }

        this.minimized = false;
    },

    //------- HEADER ---------------//
    /**
     * Init handler
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    createHeader: function () {
        var dialogHeaderElt = document.createElement("div");
        dialogHeaderElt.setAttribute("class", "dialog-header");

        // creates line
        // // Left element
        this.headerSpanLeftElt = document.createElement("span");
        this.headerSpanLeftElt.setAttribute("class","line-left");

        // // Right element
        var tableRightElt = document.createElement("table");
        tableRightElt.setAttribute("class","line-right");
        var tbodyElt = document.createElement("tbody");
        this.headerTrElt = document.createElement("tr");

        this.headerTdElts = {};

        tbodyElt.appendChild(this.headerTrElt);
        tableRightElt.appendChild(tbodyElt);

        dialogHeaderElt.appendChild(this.headerSpanLeftElt);
        dialogHeaderElt.appendChild(tableRightElt);

        return dialogHeaderElt;
    },

    /**
     * Update the dialog properties using new properties
     * @param properties the new properties
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    updateProperties:function(properties) {
        this.checkOptions(properties);

        this.headerSpanLeftElt.innerHTML = this.title;

        if(!isUndefinedOrNull(this.swap) && isUndefinedOrNull(this.headerTrElt.swap)) {
            this.headerTrElt.swap = this.addSwapIcon(this.headerTrElt);
        }

        if(!this.modal && !isUndefinedOrNull(this.pin) && isUndefinedOrNull(this.headerTrElt.pin)) {
            this.headerTrElt.pin = this.addPinIcon(this.headerTrElt);
            this.pin.position = window.getComputedStyle(this.interact.target).getPropertyValue('position');
        }

        if(isUndefinedOrNull(this.headerTrElt.minimize)) {
            this.headerTrElt.minimize = this.addMinimizeIcon(this.headerTrElt);
        }

        if((!isUndefinedOrNull(this.closeable) && this.closeable) && isUndefinedOrNull(this.headerTrElt.closeable)) {
            this.headerTrElt.closeable = this.addCloseIcon(this.headerTrElt);
        }

        if(this.keepRatio) {
            this.contentElt.style.overflow = "hidden";

            var style = window.getComputedStyle(this.innerElementDiv);
            var height = style.getPropertyValue("height");

            if(!isUndefinedOrNull(height)) {
                this.innerElementDiv.style.height = "initial";
                this.innerElementDiv.style.minHeight = height;
            }
        }

        this.setModal(this.modal);
        this.setVisible(this.show);
        this.interact.draggable(this.draggable);
        this.interact.resizable(this.resizable);
    },

    /**
     * Add swap icon to the parent element
     * @param parentElt the parent element to add the icon
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    addSwapIcon:function(parentElt) {
        // adds swap icon
        var tdElt = document.createElement("td");

        var swapIconElt = document.createElement("i");
        swapIconElt.setAttribute("class","fa fa-fw dialog-header-icon icon-swap");

        tdElt.appendChild(swapIconElt);
        parentElt.appendChild(tdElt);

        // adds listener
        this.addListener(swapIconElt,"click",this.swapHandler.bind(this));

        return swapIconElt;
    },

    /**
     * Add pin icon to the parent element
     * @param parentElt the parent element to add the icon
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    addPinIcon:function(parentElt) {
        // adds pin icon
        var tdElt = document.createElement("td");

        var pinIconElt = document.createElement("i");
        pinIconElt.setAttribute("class","fa fa-fw dialog-header-icon icon-pin");

        tdElt.appendChild(pinIconElt);
        parentElt.appendChild(tdElt);


        // adds listener
        this.addListener(pinIconElt,"click",this.pinHandler.bind(this));

        return pinIconElt;
    },

    /**
     * Add minimize icon to the parent element
     * @param parentElt the parent element to add the icon
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    addMinimizeIcon:function(parentElt) {
        // adds minimize icon
        var tdElt = document.createElement("td");

        var minimizeIconElt = document.createElement("i");
        minimizeIconElt.setAttribute("class","fa fa-fw dialog-header-icon icon-minimize");

        tdElt.appendChild(minimizeIconElt);
        parentElt.appendChild(tdElt);

        // adds listener
        this.addListener(minimizeIconElt,"click",this.minimizeHandler.bind(this));

        return minimizeIconElt;
    },

    /**
     * Add close icon to the parent element
     * @param parentElt the parent element to add the icon
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    addCloseIcon:function(parentElt) {
        // adds minimize icon
        var tdElt = document.createElement("td");

        var closeIconElt = document.createElement("i");
        closeIconElt.setAttribute("class","fa fa-fw dialog-header-icon icon-close");

        tdElt.appendChild(closeIconElt);
        parentElt.appendChild(tdElt);

        // adds listener
        this.addListener(closeIconElt,"click",this.closeHandler.bind(this));

        return closeIconElt;
    },

    setModal:function(isModal) {
        if(isModal) {
            OSH.Utils.addCss(this.elementDiv,"modal-block");
        } else {
            // current dialog is modal, make it non-modal
            OSH.Utils.removeCss(this.elementDiv,"modal-block");
        }
    },

    //------- END HEADER ---------------//

    /**
     * Create the content
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    createContent: function () {
        var dialogContentElt = document.createElement("div");
        dialogContentElt.setAttribute("class", "dialog-content ");
        dialogContentElt.setAttribute("id", "dialog-content-id-"+OSH.Utils.randomUUID());

        return dialogContentElt;
    },

    /**
     * Create the footer
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    createFooter: function () {
        var dialogFooterElt = document.createElement("div");
        dialogFooterElt.setAttribute("class", "dialog-footer");

        return dialogFooterElt;
    },

    /**
     * Init drag and drop
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    initDragAndDrop: function (element,parentElement) {
        this.interact = interact(element)
            .draggable({
                // enable inertial throwing
                inertia: true,
                // keep the element within the area of it's parent
                restrict: {
                    restriction: parentElement,
                    endOnly: false,
                    elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                },
                // enable autoScroll
                autoScroll: true,

                // call this function on every dragmove event
                onmove: dragMoveListener,
                // call this function on every dragend event
                onend: function (event) {
                }
            })
            .resizable({
                preserveAspectRatio: true,
                edges: {left: true, right: true, bottom: true, top: true},
                margin: 10
            })
            .on('resizemove', function (event) {
                var target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update the element's style
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            });

        var self = this;

        function dragMoveListener(event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

        // this is used later in the resizing and gesture demos
        window.dragMoveListener = dragMoveListener;
    },

    //------------ HANDLERS -----------------//
    /**
     * Handler for the swap event
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    swapHandler:function() {
        // swap only content
        if(!isUndefinedOrNull(this.swap)) {
            this.swapWith(this.swap.swapContainerId)
        }
    },

    /**
     * Handler for the pin event
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    pinHandler:function() {
        if(this.pinned) {
            // unpin: dialog -> original container
            this.unpin();
        } else {
            // pin: dialog -> dest container
            this.pinTo(this.pin.containerId);
        }
    },

    /**
     * Handler for the minimize event
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    minimizeHandler:function() {
        if(!this.minimized) {
            this.minimize();
        } else {
            this.restore();
        }
    },

    /**
     * Handler for the close event
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    closeHandler:function() {
        this.close();
    },

    connectDataSourceHandler:function() {
        if (this.connected) {
            OSH.EventManager.fire(OSH.EventManager.EVENT.DISCONNECT_DATASOURCE, {dataSourcesId: this.connectionIds});
        } else {
            OSH.EventManager.fire(OSH.EventManager.EVENT.CONNECT_DATASOURCE, {dataSourcesId: this.connectionIds});
        }

        this.connected = !this.connected;
    },

    //---------- FUNCTIONS ----------------//
    /**
     * Swap the dialog with another div
     * @param dstContainerId the div to swap with
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    swapWith:function(dstContainerId) {
        // removes content from dst
        var dstContainerElt = document.getElementById(dstContainerId);
        OSH.Asserts.checkIsDefineOrNotNull(dstContainerElt);

        // removes content from dst container
        var childrenDst = [];
        var i;
        for(i=0;i < dstContainerElt.children.length;i++) {
            childrenDst.push(dstContainerElt.removeChild(dstContainerElt.children[i]));
        }

        // removes content from dialog
        var childrenDialog = [];
        for(i=0;i < this.contentElt.children.length;i++) {
            childrenDialog.push(this.contentElt.removeChild(this.contentElt.children[i]));
        }

        // swap
        for(i=0;i < childrenDialog.length;i++) {
            dstContainerElt.appendChild(childrenDialog[i]);
        }

        for(i=0;i < childrenDst.length;i++) {
            this.contentElt.appendChild(childrenDst[i]);
        }

        /*  // overrides any position because it has to be relative
         firstRemovedElt.style.position = "relative";

         // applies saved position
         secondRemovedElt.style.position = this.swap.position;*/
    },

    pinAuto:function() {
        this.pinHandler();
    },

    /**
     * Pin the dialog.
     * @param containerId the parent element container id to pin the dialog into
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    pinTo:function(containerId) {
        if(!this.modal) {
            OSH.Asserts.checkIsDefineOrNotNull(this.interact);
            OSH.Asserts.checkIsDefineOrNotNull(this.interact.target);

            this.parentElementDiv.removeChild(this.elementDiv);

            var dstContainerElt = document.getElementById(containerId);
            OSH.Asserts.checkIsDefineOrNotNull(dstContainerElt);

            dstContainerElt.appendChild(this.elementDiv); //TODO: needs to store index?

            this.interact.draggable(false);

            // store last position
            this.pin.lastPosition.x = (parseFloat(this.interact.target.getAttribute('data-x')) || 0);
            this.pin.lastPosition.y = (parseFloat(this.interact.target.getAttribute('data-y')) || 0);

            // set dst position
            this.setPosition(0, 0);
            this.interact.target.style.position = "relative";

            OSH.Utils.addCss(this.headerTrElt.pin, "icon-selected");
            this.pinned = true;
        }
    },

    /**
     * Unpin the dialog
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    unpin:function() {
        if(!this.modal) {
            OSH.Asserts.checkIsDefineOrNotNull(this.interact);
            OSH.Asserts.checkIsDefineOrNotNull(this.interact.target);

            this.elementDiv.parentNode.removeChild(this.elementDiv);

            var originalContainerElt = document.getElementById(this.pin.originalContainerId);
            OSH.Asserts.checkIsDefineOrNotNull(originalContainerElt);

            originalContainerElt.appendChild(this.elementDiv); //TODO: needs to store index?
            this.interact.draggable(this.draggable);

            // restore position before pinning
            this.setPosition(this.pin.lastPosition.x, this.pin.lastPosition.y);

            // restore style before pinning
            OSH.Asserts.checkIsDefineOrNotNull(this.pin.position);
            this.interact.target.style.position = this.pin.position;

            OSH.Utils.removeCss(this.headerTrElt.pin, "icon-selected");
            this.pinned = false;
        }
    },

    /**
     * Minimize the dialog
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    minimize:function() {
        OSH.Utils.addCss(this.innerElementDiv,"minimized");
        OSH.Utils.addCss(this.contentElt,"hide");
        OSH.Utils.addCss(this.footerElt,"hide");

        OSH.Utils.replaceCss(this.headerTrElt.minimize,"icon-minimize","icon-restore");
        this.minimized = true;
        this.interact.resizable(false);
    },

    /**
     * Restore the dialog after minimizing
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    restore:function() {
        OSH.Utils.removeCss(this.innerElementDiv,"minimized");
        OSH.Utils.removeCss(this.contentElt,"hide");
        OSH.Utils.removeCss(this.footerElt,"hide");

        OSH.Utils.replaceCss(this.headerTrElt.minimize,"icon-restore","icon-minimize");
        this.minimized = false;
        this.interact.resizable(this.draggable);
    },

    /**
     *
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    onClose: function () {},

    /**
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    close: function () {
        if(this.destroyOnClose) {
            this.elementDiv.parentNode.removeChild(this.elementDiv);
        } else {
            this.setVisible(false);
        }
        this.onClose();
    },

    /**
     * Set the dialog position to x,y pixel coordinates
     * @instance
     * @memberof OSH.UI.Panel.DialogPanel
     */
    setPosition:function(x,y) {
        this.interact.target.style.webkitTransform =
            this.interact.target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

        this.interact.target.setAttribute('data-x', x);
        this.interact.target.setAttribute('data-y', y);
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc Display a dialog with multiple view attach to it.
 * @class
 * @type {OSH.UI.DialogPanel}
 * @augments OSH.UI.DialogPanel
 */
OSH.UI.Panel.MultiDialogPanel = OSH.UI.Panel.DialogPanel.extend({

    initialize: function (parentElementDivId, properties) {
        this._super(parentElementDivId, properties);
        this.properties = properties;
    },

    initPanel: function () {
        this._super();

        // creates extra
        this.extraElt = this.createExtra();

        this.innerElementDiv.insertChildAtIndex(this.extraElt,2);

    },

    createExtra:function() {
        var extraElt = document.createElement("div");
        extraElt.setAttribute("class", "dialog-extra");

        var inputExtraElt = document.createElement("input");
        inputExtraElt.setAttribute("type","checkbox");
        inputExtraElt.setAttribute("name","dialog-extra-input");
        inputExtraElt.setAttribute("id","dialog-extra-input");

        var labelExtraElt = document.createElement("label");
        labelExtraElt.setAttribute("for","dialog-extra-input");
        var iExtraElt = document.createElement("i");
        iExtraElt.setAttribute("class","fa fa-fw icon-extra");

        labelExtraElt.appendChild(iExtraElt);

        var extraContentElt = document.createElement("div");
        extraContentElt.setAttribute("class","dialog-extra-content");

        extraElt.appendChild(inputExtraElt);
        extraElt.appendChild(labelExtraElt);
        extraElt.appendChild(extraContentElt);

        return extraElt;
    },

    minimize:function() {
        this._super();
        OSH.Utils.addCss(this.extraElt,"hide");
    },

    restore:function() {
        this._super();
        OSH.Utils.removeCss(this.extraElt,"hide");
    },

    appendView:function(view,properties) {
        var extraEltContent = this.extraElt.querySelector(".dialog-extra-content");

        OSH.Asserts.checkIsDefineOrNotNull(extraEltContent);
        OSH.Asserts.checkIsDefineOrNotNull(view);

        extraEltContent.appendChild(view.elementDiv);

        view.setVisible(true);
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.SaveDialogPanel = OSH.UI.Panel.DialogPanel.extend({
    initialize: function (parentElementDivId, properties) {
        this._super(parentElementDivId, properties);

        this.properties = properties;
    },

    initPanel: function () {
        this._super();
        var saveButtonId = "dialog-save-button-"+OSH.Utils.randomUUID();

        var divButton = document.createElement("div");
        divButton.setAttribute("class","button-edit");

        var button = document.createElement("button");
        button.setAttribute("id",saveButtonId);
        button.setAttribute("class","submit save");
        button.innerHTML = "Save";

        divButton.appendChild(button);

        this.footerElt .appendChild(divButton);

        OSH.EventManager.observeDiv(saveButtonId,"click",this.onSaveClickButtonHandler.bind(this));

        OSH.Utils.addCss(this.elementDiv,"save-dialog");

    },

    onSaveClickButtonHandler:function(event) {
        this.onSave();
    },

    onSave:function() {}

});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityInfoPanel = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, properties) {
        this._super(parentElementDivId, properties);
    },

    initPanel:function() {
        this.nameTagId = OSH.Helper.HtmlHelper.addInputText(this.elementDiv,"Name","My entity","entity name");
        this.iconTagId = OSH.Helper.HtmlHelper.addInputText(this.elementDiv,"Icon","images/cameralook.png","icon path");
        this.descriptionTagId = OSH.Helper.HtmlHelper.addInputText(this.elementDiv,"Description url","","description here");

        OSH.Utils.addCss(this.elementDiv,"info");
    },

    loadInfos:function(infos){
        OSH.Asserts.checkIsDefineOrNotNull(infos);
        OSH.Asserts.checkObjectPropertyPath(infos,"name", "infos.name does not exist");
        OSH.Asserts.checkObjectPropertyPath(infos,"icon", "infos.icon does not exist");
        OSH.Asserts.checkObjectPropertyPath(infos,"description", "infos.description does not exist");

        document.getElementById(this.nameTagId).value = infos.name;
        document.getElementById(this.iconTagId).value = infos.icon;
        document.getElementById(this.descriptionTagId).value = infos.description;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityViewPanel = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, properties) {
        this._super(parentElementDivId, properties);
    },

    initPanel:function() {
        this.views = [];

        var selectViewId = OSH.Utils.randomUUID();
        var addViewButtonId = OSH.Utils.randomUUID();
        var viewContainer = OSH.Utils.randomUUID();
        var createButtonId = OSH.Utils.randomUUID();

       var selectEltId = OSH.Helper.HtmlHelper.addHTMLListBox(this.elementDiv,"",[],"Select a view");
       this.selectElt = document.getElementById(selectEltId);

       var buttonElt = document.createElement("button");
       buttonElt.setAttribute("class","submit add-view-button");
       buttonElt.innerHTML = "Add";

       this.containerElt = document.createElement("div");
       this.containerElt.setAttribute("class","view-container");

       this.elementDiv.appendChild(buttonElt);
       this.elementDiv.appendChild(this.containerElt);

       OSH.Utils.addCss(this.elementDiv,"views");

       // listeners
       OSH.EventManager.observeElement(buttonElt,"click",this.onAddViewClickHandler.bind(this));

       // inits
       this.initViews();
    },

    initViews: function() {
        // defines available views that user can create
        // views are associated with an instance type (to create final instance) and global type (abstract one)
        // the name is the one displayed
        var views = [{
            name: "Map 2D (New)",
            viewInstanceType:OSH.UI.ViewFactory.ViewInstanceType.LEAFLET,
            type: OSH.UI.View.ViewType.MAP,
            hash: 0x0001
        },{
            name: "Globe 3D (New)",
            viewInstanceType:OSH.UI.ViewFactory.ViewInstanceType.CESIUM,
            type: OSH.UI.View.ViewType.MAP,
            hash: 0x0002
        },{
            name: "Chart (New)",
            viewInstanceType:OSH.UI.ViewFactory.ViewInstanceType.NVD3_LINE_CHART,
            type: OSH.UI.View.ViewType.CHART,
            hash: 0x0003
        },{
            name: "Video - H264 (New)",
            viewInstanceType:OSH.UI.ViewFactory.ViewInstanceType.FFMPEG,
            type: OSH.UI.View.ViewType.VIDEO,
            hash: 0x0004
        },{
            name: "Video - MJPEG (New)",
            viewInstanceType:OSH.UI.ViewFactory.ViewInstanceType.MJPEG,
            type: OSH.UI.View.ViewType.VIDEO,
            hash: 0x0005
        }];

        this.removeAllFromSelectElement(this.selectElt);

        for(var key in views) {

            var option = document.createElement("option");
            option.text = views[key].name;
            option.value = views[key].name;
            option.properties = views[key];

            this.selectElt.add(option);
        }

        var self = this;

        // checks for existing views
        // checking for existing views once the DOM has been loaded
        OSH.Helper.HtmlHelper.onDomReady(this.initExistingViews.bind(this));
    },

    initExistingViews:function() {
        var self = this;

        var viewList = this.getViewList();

        for(var key in viewList) {
            var currentViewDiv = viewList[key];
            OSH.Utils.getObjectById(currentViewDiv.id,function(event){
                var option = document.createElement("option");
                option.text = event.object.name;
                option.value = event.object.name;
                option.properties = {
                    name: event.object.name,
                    type: event.object.type,
                    instance: event.object
                };

                self.selectElt.add(option);

                //if(self.entity.entityId === option.properties.instance.entityId
                var addView = false;

                for (var keyView in event.object.viewItems) {
                    if (event.object.viewItems[keyView].entityId === self.options.entityId) {
                        addView = true;
                        break;
                    }
                }

                if(addView) {
                    self.addView(option.properties);
                }
            });
        }
    },

    onAddViewClickHandler:function(event) {
        var dsTabElt = document.getElementById(this.viewContainer);
        var viewProperties = this.selectElt .options[this.selectElt .selectedIndex].properties;

        if(isUndefinedOrNull(viewProperties) || viewProperties.value === "") {
            return;
        }

        this.addView(viewProperties);
    },

    addView:function(viewProperties) {
        // two cases: this is an existing view or this is a view we want to create
        var viewInstance;

        if(isUndefinedOrNull(viewProperties.instance)) {
            // creates the instance
            viewInstance = this.getNewViewInstance(viewProperties);
        } else { // the view already exists
            viewInstance = viewProperties.instance;
            viewInstance.hash = 0x0000;
        }

        this.views.push(viewInstance);

        // adds line to tab
        var lineElt = this.getNewLine(viewInstance.name);

        // appends line to container
        this.containerElt.appendChild(lineElt);

        var editElt = lineElt.querySelectorAll(".control td.edit");
        var deleteElt = lineElt.querySelectorAll(".control td.delete");

        editElt = editElt[editElt.length-1];
        deleteElt = deleteElt[deleteElt.length-1];

        // handlers
        OSH.EventManager.observeElement(editElt,"click",this.editHandler.bind(this,lineElt,viewInstance));
        OSH.EventManager.observeElement(deleteElt, "click", this.deleteHandler.bind(this, lineElt, viewInstance));

        return viewInstance;
    },

    getViewList:function() {
        return document.querySelectorAll(".osh.view");
    },

    getNewViewInstance:function(properties) {

        // gets view type
        var viewInstanceType = properties.viewInstanceType;

        // gets default view properties
        // gets default view property
        var defaultViewProperties;

        if(isUndefinedOrNull(properties.options)) {
            defaultViewProperties = OSH.UI.ViewFactory.getDefaultViewProperties(viewInstanceType);
            defaultViewProperties.name = properties.name;
        } else {
            defaultViewProperties = properties.options;
        }

        // creates the panel corresponding to the view type
        var viewInstance = OSH.UI.ViewFactory.getDefaultViewInstance(viewInstanceType, defaultViewProperties);
        viewInstance.hash = properties.hash;

        return viewInstance;
    },

    getNewLine:function(viewName) {
        // creates the line
        var lineElt = document.createElement('div');
        lineElt.setAttribute("id","LineView"+OSH.Utils.randomUUID());
        lineElt.setAttribute("class","ds-line");

        var spanElt = document.createElement("span");
        spanElt.setAttribute("class","line-left");
        spanElt.innerHTML = ""+viewName;

        var tableElt = document.createElement("table");
        tableElt.setAttribute("class","control line-right");

        var trElt = document.createElement("tr");

        var editTdElt = document.createElement("td");
        editTdElt.setAttribute("class","fa fa-2x fa-pencil-square-o edit");
        editTdElt.setAttribute("aria-hidden","true");

        var deleteTdElt = document.createElement("td");
        deleteTdElt.setAttribute("class","fa fa-2x fa-trash-o delete");
        deleteTdElt.setAttribute("aria-hidden","true");

        var divElt = document.createElement("div");
        divElt.setAttribute("style","clear: both;");

        // builds table
        trElt.appendChild(editTdElt);
        trElt.appendChild(deleteTdElt);
        tableElt.appendChild(trElt);

        // builds line
        lineElt.appendChild(spanElt);
        lineElt.appendChild(tableElt);
        lineElt.appendChild(divElt);

        return lineElt;
    },

    editHandler:function(lineElt,viewInstance) {
        var viewInstance = this.getViewById(viewInstance.id);
        // get current viewInstance

        OSH.Asserts.checkIsDefineOrNotNull(viewInstance);

        // gathers Data Sources
        var dsArray = [];

        for(var key in this.options.datasources) {
            var dsClone = this.options.datasources[key];
            dsArray.push(dsClone);
        }

        var cloneViewInstance = {};
        OSH.Utils.copyProperties(viewInstance,cloneViewInstance);

        var options = {
            view:cloneViewInstance,
            datasources : dsArray,
            entityId:this.options.entityId
        };

        // creates the panel corresponding to the view type
        var editView;
        switch(viewInstance.type) {
            case OSH.UI.View.ViewType.MAP:  editView = new OSH.UI.Panel.EntityMapEditPanel("",options);break;
            case OSH.UI.View.ViewType.CHART:  editView = new OSH.UI.Panel.EntityChartEditPanel("",options);break;
            case OSH.UI.View.ViewType.VIDEO:  {
                if(viewInstance instanceof OSH.UI.View.MjpegView) {
                    editView = new OSH.UI.Panel.EntityMJPEGVideoEditPanel("", options);
                } else {
                    editView = new OSH.UI.Panel.EntityVideoEditPanel("", options);
                }
                break;
            }
            default:break;
        }

        OSH.Asserts.checkIsDefineOrNotNull(editView);

        var editViewDialog = new OSH.UI.Panel.SaveDialogPanel("", {
            draggable: true,
            css: "dialog-edit-view", //TODO: create unique class for all the views
            name: "Edit "+cloneViewInstance.name+" View",
            show:true,
            dockable: false,
            closeable: true,
            connectionIds : [],
            destroyOnClose:true,
            modal:true
        });

        editView.attachToElement(editViewDialog.contentElt);

        editViewDialog.onSave = function() {
            var clonedView = editView.getView();

            lineElt.querySelector("span.line-left").innerHTML = clonedView.name;

            // finds the view instance and updates i
            var i;

            for(i=0;i < this.views.length;i++) {
                if (this.views[i].id === clonedView.id) {
                    var viewProperties =  editView.getProperties();

                    this.views[i].viewItemsToAdd = clonedView.viewItemsToAdd;
                    this.views[i].viewItemsToRemove = clonedView.viewItemsToRemove;
                    this.views[i].updateProperties(viewProperties);
                    if(OSH.Utils.hasOwnNestedProperty(viewProperties,"name")) {
                        //TODO: dupplicated values, should only handle 1 property
                        this.views[i].name = viewProperties.name;
                        this.views[i].options.name = viewProperties.name;
                        // updates dialog properties
                        if (this.views[i].hash !== 0x0000 && !isUndefinedOrNull(this.views[i].dialog)) { // this is not an existing view
                            this.updateDialog(this.views[i],viewProperties);
                        }
                    }

                    break;
                }
            }

            editViewDialog.close();
            editView = null;

            //TODO: switch container or create a new one(dialog) if needed

            this.checkViewItems(this.views[i]);

        }.bind(this);

    },

    updateDialog:function(view, viewProperties) {
        var parentDialog = OSH.Utils.getSomeParentTheClass(this.views[i].elementDiv,"dialog");
        OSH.Asserts.checkIsDefineOrNotNull(parentDialog);

        OSH.Utils.getObjectById(parentDialog.id,function(event){
            OSH.Asserts.checkTrue(event.object instanceof OSH.UI.Panel.DialogPanel,"The class should be a dialog panel and is "+event.object);

            var properties = {
                title: viewProperties.name
            };

            if(!isUndefinedOrNull(viewProperties.keepRatio)) {
                properties.keepRatio = viewProperties.keepRatio;
            }

            event.object.updateProperties(properties);
        });
    },

    deleteHandler:function(lineElt,viewInstance) {
        // get current viewInstance
        var viewInstance = this.getViewById(viewInstance.id);

        OSH.Asserts.checkIsDefineOrNotNull(viewInstance);

        this.containerElt.removeChild(lineElt);
        var newArr = [];

        for(var i=0;i < this.views.length;i++) {
            if(this.views[i].id !== viewInstance.id) {
                newArr.push(this.views[i]);
            }
        }
        this.views = newArr;

        // delete corresponding viewItem
        var currentViewItem;
        for(var i = 0;i < viewInstance.viewItems.length;i++) {
            currentViewItem = viewInstance.viewItems[i];
            if(currentViewItem.entityId === this.options.entityId) {
                viewInstance.removeViewItem(currentViewItem);
            }
        }
        // destroy element
        if(viewInstance.hash !== 0x0000) {
            OSH.Utils.destroyElement(viewInstance.elementDiv);
        }
    },

    checkViewItems:function(view) {
        // updates/add view item
        if(!isUndefinedOrNull(view.viewItemsToAdd)) {
            for (var j = 0; j < view.viewItemsToAdd.length; j++) {
                var viewItemToAdd = view.viewItemsToAdd[j];

                view.addViewItem(viewItemToAdd);
            }
            view.viewItemsToAdd = [];
        }

        // DELETE
        if(!isUndefinedOrNull(view.viewItemsToRemove)) {
            for (var j = 0; j < view.viewItemsToRemove.length; j++) {
               var viewItemToRemove = view.viewItemsToRemove[j];
                view.removeViewItem(viewItemToRemove);
            }
            view.viewItemsToRemove = [];
        }

        // update all viewItems
        for (var j = 0; j < view.viewItems.length; j++) {
            var viewItemToUpdate = view.viewItems[j];
            view.updateViewItem(viewItemToUpdate);
        }
    },

    reset:function() {
        OSH.Helper.HtmlHelper.removeAllNodes(this.containerElt);
        this.views = [];
    },

    getViewById:function(id) {
        var view;

        for(i=0;i < this.views.length;i++) {
            if (this.views[i].id === id) {
                view = this.views[i];
                break;
            }
        }

        return view;
    },

    //**************************************************************//
    //*************Restoring view **********************************//
    //**************************************************************//

    /**
     * load views from saved data
     * @param viewPropertiesArray
     */
    loadViews:function(viewPropertiesArray) {
        this.reset();
        var currentProperty;

        var existingViewList = this.getViewList();
        for(var key in viewPropertiesArray) {
            currentProperty = viewPropertiesArray[key];
            if(currentProperty.hash === 0x000) {
                // existing view
                for(var i=0;i < existingViewList.length;i++) {
                    this.restoringExistingView(existingViewList[i],currentProperty);
                }
            } else {
                //TODO: case where the view is a new view
                this.restoringDialogView(existingViewList[i],currentProperty);
            }
        }
    },

    restoringDialogView:function(currentViewDiv,properties) {
        var viewInstance = this.addView({
            name: properties.name,
            type: properties.type,
            hash: properties.hash,
            viewInstanceType:properties.viewInstanceType,
            options:properties.options
        });

        this.restoringView(viewInstance,currentViewDiv,properties);
    },

    restoringExistingView:function(currentViewDiv,properties) {
        OSH.EventManager.observe(OSH.EventManager.EVENT.SEND_OBJECT + "-" + currentViewDiv.id, function (event) {
            var viewInstance = event.object;
            var nodeIndex = OSH.Utils.getChildNumber(viewInstance.elementDiv);
            if(viewInstance.type === properties.type &&
                nodeIndex === properties.nodeIdx &&
                viewInstance.elementDiv.parentNode.id === properties.container) {
                this.restoringView(viewInstance, currentViewDiv, properties);

                this.addView({
                    name: properties.name,
                    type: properties.type,
                    instance: viewInstance,
                    hash: properties.hash
                });
            }
            OSH.EventManager.remove(OSH.EventManager.EVENT.SEND_OBJECT + "-" + currentViewDiv.id);
        }.bind(this));

        OSH.EventManager.fire(OSH.EventManager.EVENT.GET_OBJECT + "-" + currentViewDiv.id);
    },

    restoringView:function(viewInstance,currentViewDiv,properties) {
        //--- Stylers
        for(var key in properties.viewItems) {
            var props = this.restoringStyler(properties.viewItems[key]);
            viewInstance.addViewItem(props);
        }
    },

    restoringStyler:function(currentViewItemProps) {
        var currentViewStylerProps = currentViewItemProps.styler;
        var stylerInstance = OSH.UI.Styler.Factory.getNewInstanceFromType(currentViewStylerProps.type);

        OSH.Utils.copyProperties(currentViewStylerProps,stylerInstance,false);

        // re-create styler function from UI selection
        if(OSH.Utils.hasOwnNestedProperty(stylerInstance,"properties.ui")) {
            for (var property in stylerInstance.properties) {
                if(property.endsWith("Func")) {
                    var fnProperty = this.restoringStylerFunction(property,stylerInstance.properties[property], stylerInstance.properties.ui);
                    stylerInstance.updateProperties(fnProperty);
                }
            }
        }

        return {
            name: currentViewItemProps.name,
            entityId: currentViewItemProps.entityId,
            styler:stylerInstance
        };
    },

    restoringStylerFunction:function(fnName,fnProperty,uiProperty) {
        var regex = /(blob:[^']*)'/g;
        var matches;
        var funcStr = fnProperty.handlerStr;

        while ((matches = regex.exec(fnProperty.handlerStr)) !== null) {
            var result = [];
            OSH.Utils.searchPropertyByValue(
                uiProperty,
                matches[1],
                result);
            if(!isUndefinedOrNull(result) && result.length > 0) {
                // regenerate a blob from binary string and replace corresponding function
                var blobUrl = OSH.Utils.binaryStringToBlob(result[0].binaryString);
                funcStr = funcStr.replace(matches[1],blobUrl);
                result[0].url = blobUrl; // TODO: should find a best way to change dynamically the blob url
            }
        }

        var func = OSH.UI.Styler.Factory.buildFunctionFromSource(
            fnProperty.dataSourceIds,
            fnName,
            funcStr);

        return func;
    }
    /** End restoring view **/
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityFilePanel = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, properties) {
        this._super(parentElementDivId, properties);
    },

    initPanel:function() {
        // LOAD part
        var loadDivElt = document.createElement("div");

        // adds button
        var loadButtonElt = document.createElement("button");
        loadButtonElt.setAttribute("id",OSH.Utils.randomUUID());
        loadButtonElt.setAttribute("class","submit load-button");
        loadButtonElt.setAttribute("disabled",""); // disabled by default

        loadButtonElt.innerHTML = "Load";

        loadDivElt.appendChild(loadButtonElt);

        // adds input field
        var inputFileEltId = OSH.Helper.HtmlHelper.addFileChooser(loadDivElt);

        var self = this;

        this.loadedFiles = [];

        OSH.Helper.HtmlHelper.onDomReady(function(){
            var nextElt = document.getElementById("text-"+inputFileEltId);
            nextElt.className += " load-settings ";

            // listeners
            var inputFileElt = document.getElementById(inputFileEltId);

            var lastDataLoaded;

            self.addListener(inputFileElt, "change", self.inputFileHandlerAsText.bind(inputFileElt,function(result) {
                self.enableElt(loadButtonElt.id);

                lastDataLoaded = result;
            }));

            self.addListener(loadButtonElt,"click",function(evt) {
                if(!isUndefinedOrNull(lastDataLoaded)) {
                    try{
                        self.loadProperties(lastDataLoaded.data,lastDataLoaded.file.name);
                    } catch(exception) {
                        throw new OSH.Exception.Exception("Cannot convert '"+lastDataLoaded.file.name+"' into JSON: ",exception);
                    }
                }
            });
        });

        // SAVE part
        var divSaveElt = document.createElement("div");
        divSaveElt.setAttribute("class","save");

        // adds button
        var saveButtonElt = document.createElement("button");
        saveButtonElt.setAttribute("id",OSH.Utils.randomUUID());
        saveButtonElt.setAttribute("class","submit load-button");

        saveButtonElt.innerHTML = "Save";

        divSaveElt.appendChild(saveButtonElt);

        // adds input field
        var defaultName = "entity-properties.json";
        var inputTextSaveEltId = OSH.Helper.HtmlHelper.addInputText(divSaveElt,null,defaultName,"filename.json");


        OSH.Helper.HtmlHelper.onDomReady(function() {
            var inputTextElt = document.getElementById(inputTextSaveEltId);
            self.addListener(saveButtonElt, "click", function (evt) {
                var inputTextValue = inputTextElt.value;
                var fileName = defaultName;

                if(!isUndefinedOrNull(inputTextValue) && inputTextValue !== "") {
                    fileName = inputTextValue;
                }

                self.savePropertiesHandler(fileName);
            });
        });

        this.elementDiv.appendChild(loadDivElt);
        this.elementDiv.appendChild(divSaveElt);
    },

    saveProperties: function(properties,fileName) {
        try {
            var blob = new Blob([JSON.stringify(properties)], {type: "text/plain;charset=utf-8"});
            saveAs(blob, fileName);
        } catch(exception) {
            throw new OSH.Exception.Exception("Cannot save the data as file: "+fileName,exception);
        }

    },

    loadProperties : function(textData,fileName) {
        try{
            if( this.loadedFiles.indexOf(fileName)  === -1) {
                this.loadPropertiesHandler(JSON.parse(textData));
                this.loadedFiles.push(fileName);
            }
        } catch(exception) {
            throw new OSH.Exception.Exception("Cannot convert '"+fileName+"' into JSON: ",exception);
        }
    },

    loadPropertiesHandler:function(jsonProperties) {},

    savePropertiesHandler:function(filename) {
        var props = this.beforeOnSaveProperties();
        this.saveProperties(props,filename);
    },

    beforeOnSaveProperties:function() {
        return [];
    },

    enableElt:function(id) {
        document.getElementById(id).removeAttribute("disabled","");
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityDatasourcePanel = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        this.addDsButtonId = OSH.Utils.randomUUID();
        this.entity = this.options.entity;

        var buttonElt = document.createElement("button");
        buttonElt.setAttribute("id",this.addDsButtonId);
        buttonElt.setAttribute("class","submit datasource");

        buttonElt.innerHTML = "Add";

        var divContainer = document.createElement("div");
        this.divDSContainerId = OSH.Utils.randomUUID();
        divContainer.setAttribute("id",this.divDSContainerId);
        divContainer.setAttribute("class","datasource-container");

        // listeners
        OSH.EventManager.observeDiv(this.addDsButtonId,"click",this.onAddDataSourceButtonClickHandler.bind(this));

        this.elementDiv.appendChild(buttonElt);
        this.elementDiv.appendChild(divContainer);

        this.datasources = {};
        this.nbDatasources = 0;
    },

    onAddDataSourceButtonClickHandler: function(event) {
        // init discovery view
        var discoveryView = new OSH.UI.Panel.DiscoveryPanel("",{
            services: this.options.services
        });

        discoveryView.onAddHandler = this.addDataSource.bind(this);

        var discoveryDialog = new OSH.UI.Panel.DialogPanel("", {
            draggable: true,
            css: "dialog-discovery",
            title: "Discovery",
            show:true,
            dockable: false,
            closeable: true,
            connectionIds : [],
            destroyOnClose:true,
            modal:true,
            keepRatio:false

        });

        discoveryView.attachToElement(discoveryDialog.contentElt);
    },

    addDataSource:function(dataSource) {

        this.nbDatasources++;
        this.datasources[dataSource.id] = dataSource;

        var div = document.createElement('div');
        div.setAttribute("id",dataSource.id);
        div.setAttribute("class","ds-line");

        var deleteId = OSH.Utils.randomUUID();
        var editId = OSH.Utils.randomUUID();

        var strVar = "<span class=\" line-left\" id=\"ds-name-"+dataSource.id+"\">"+dataSource.name+"<\/span>";
        strVar += "   <table class=\"control line-right\">";
        strVar += "      <tr>";
        strVar += "         <td><i class=\"fa fa-2x fa-pencil-square-o edit\" aria-hidden=\"true\" id=\""+editId+"\"><\/i><\/td>";
        strVar += "         <td><i class=\"fa fa-2x fa-trash-o delete\" aria-hidden=\"true\" id=\""+deleteId+"\"><\/i><\/td>";
        strVar += "      <\/tr>";
        strVar += "   <\/table>";
        strVar += "<\/div>";
        strVar += "<div style=\"clear: both;\"><\/div>";

        div.innerHTML = strVar;

        document.getElementById(this.divDSContainerId).appendChild(div);

        // add listeners
        var self = this;

        this.entity.dataSources.push(dataSource);

        OSH.EventManager.observeDiv(deleteId,"click",function(event) {
            div.parentNode.removeChild(div);
            dataSource.disconnect();

            delete self.datasources[dataSource.id];
            self.nbDatasources--;

            self.entity.dataSources = self.entity.dataSources.filter(function(ds){
                return ds.id !== dataSource.id;
            });
        });

        OSH.EventManager.observeDiv(editId,"click",function(event) {
            // init discovery view
            var discoveryView = new OSH.UI.Panel.DiscoveryPanel("",{
                services: self.options.services
            });

            discoveryView.onEditHandler = self.editDataSource.bind(self);

            var discoveryDialog = new OSH.UI.Panel.DialogPanel("", {
                draggable: true,
                css: "dialog-discovery",
                title: "Discovery",
                show:true,
                dockable: false,
                closeable: true,
                connectionIds : [],
                destroyOnClose:true,
                modal:true,
                keepRatio:false
            });

            discoveryView.attachToElement(discoveryDialog.contentElt);

            // setup existing info
            discoveryView.initDataSource(self.datasources[dataSource.id]);

            discoveryView.getButtonElement().value = "Edit";
            discoveryView.getButtonElement().text = "Edit";
            discoveryView.getButtonElement().innerHTML = "Edit";

        });
    },

    editDataSource:function(dataSource) {
        this.datasources[dataSource.id] = dataSource;
        document.getElementById("ds-name-"+dataSource.id).innerHTML = dataSource.name;

        // datasource has been changed, disconnect it
        dataSource.disconnect();

        this.onDatasourceChanged(dataSource);
    },

    onDatasourceChanged : function(dataSource) {},

    loadDataSourcesProperty:function(dsPropertyArray,callback) {
        this.reset();
        var self = this;

        if(isUndefinedOrNull(dsPropertyArray) || dsPropertyArray.length === 0) {
            callback([]);
        }
        var nbElements = dsPropertyArray.length;

        for(var key in dsPropertyArray) {
            (function(id) {
                // gets new instance
                var datasource = OSH.DataReceiver.DataSourceFactory.createDatasourceFromType(dsPropertyArray[key], function (result) {
                    result.id = id;
                    self.addDataSource(result);
                    if (--nbElements === 0) {
                        callback(Object.values(self.datasources));
                    }
                });
            })(dsPropertyArray[key].id);  //passing the variable to freeze, creating a new closure
        }
    },

    reset:function() {
        OSH.Helper.HtmlHelper.removeAllNodes(document.getElementById(this.divDSContainerId));
        this.datasources = {};
        this.nbDatasources = 0;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityEditorPanel = OSH.UI.Panel.extend({

    initialize: function (parentElementDivId, properties) {
        this._super(parentElementDivId,properties);

        // read properties
        this.viewContainer = document.body.id;
        this.services = [];

        if(!isUndefinedOrNull(properties)){
            if(!isUndefinedOrNull(properties.viewContainer)){
                this.viewContainer = properties.viewContainer;
            }

            if(!isUndefinedOrNull(properties.services)) {
                this.services = properties.services;
            }

            if(!isUndefinedOrNull(properties.entity)) {
                this.entity = properties.entity;
            }
        }

        if(isUndefinedOrNull(this.entity)) {
            // creates new entity
            this.createEntity();
        }

        // add template
        var entityEditor = document.createElement("div");
        entityEditor.setAttribute("id","Entity-editor-"+OSH.Utils.randomUUID());
        entityEditor.setAttribute("class",'entity-editor');

        document.getElementById(this.divId).appendChild(entityEditor);

        this.tabPanel = new OSH.UI.Panel.TabPanel();

        this.tabPanel.addTab("File",this.createFilePanel());
        this.tabPanel.addTab("Info",this.createInfoPanel());
        this.tabPanel.addTab("Data Sources",this.createDSPanel());
        this.tabPanel.addTab("Views",this.createViewPanel());

        entityEditor.appendChild(this.tabPanel.elementDiv);
        OSH.Helper.HtmlHelper.addHTMLLine(entityEditor);

        var createButtonElt = document.createElement("button");
        createButtonElt.setAttribute("class","submit save-entity-button");

        createButtonElt.innerHTML = "Save";

        entityEditor.appendChild(createButtonElt);


        // inits properties
        this.properties = {
            datasources : {},
            views : []
        };

        this.addListener(createButtonElt, "click", this.saveEntity.bind(this));
    },

    createEntity:function() {
        this.entity = {
            id: "entity-" + OSH.Utils.randomUUID(),
            dataSources: [],
            dataProviderController: new OSH.DataReceiver.DataReceiverController({
                replayFactor: 1 //TODO:which datasource??!
            })
        };
    },

    createFilePanel:function() {
        var filePanel = new OSH.UI.Panel.EntityFilePanel();
        filePanel.beforeOnSaveProperties = function() {
            return this.createSaveProperty();
        }.bind(this);

        filePanel.loadPropertiesHandler = function(properties) {
            this.restoreSavedProperties(properties);
         }.bind(this);
        return filePanel.elementDiv;
    },

    createInfoPanel:function() {
        this.infoPanel = new OSH.UI.Panel.EntityInfoPanel();
        return this.infoPanel.elementDiv;
    },

    createDSPanel:function() {
       this.datasourcePanel = new OSH.UI.Panel.EntityDatasourcePanel("",{services:this.services, entity:this.entity});

       this.datasourcePanel.onDatasourceChanged = function(datasource) {
           this.entity.dataProviderController.updateDataSource(datasource);
       }.bind(this);

       return this.datasourcePanel.elementDiv;
    },

    createViewPanel: function() {
        this.viewPanel = new OSH.UI.Panel.EntityViewPanel("",{
            datasources:this.datasourcePanel.datasources,
            entityId:this.entity.id
        });

        return this.viewPanel.elementDiv;
    },

    initDatasources: function() {
        if(!isUndefinedOrNull(this.entity.datacontroller)) {
            for (var key in this.entity.dataSources){
                var ds = this.entity.datacontroller.getDataSource(this.entity.dataSources[key]);
                this.datasourcePanel.addDataSource(ds);
            }
        }
    },

    enableElt:function(id) {
        document.getElementById(id).removeAttribute("disabled","");
    },

    disableElt:function(id) {
        document.getElementById(id).setAttribute("disabled","");
    },

    saveEntity:function() {
        // create corresponding views
        var views = this.viewPanel.views;

        var menuItems = [];

        for(var key in views) {
            var currentView = views[key];

            var viewId = currentView.id;

            if(currentView.hash !== 0x0000) {
                this.saveDialog(currentView);
            }

            menuItems.push({
                name: currentView.name,
                viewId: viewId,
                css: "fa fa-video-camera"
            });
        }

        if(menuItems.length > 0) {
            var menuId = "menu-"+OSH.Utils.randomUUID();
            var menu = new OSH.UI.ContextMenu.StackMenu({id: menuId ,groupId: "menu-"+OSH.Utils.randomUUID(),items : menuItems});

            for(var i = 0;i < views.length;i++) {
                for(var j=0;j < views[i].viewItems.length;j++) {
                    views[i].viewItems[j].contextMenuId = menuId;
                }
            }
        }

        // update datasources
        this.entity.dataSources = Object.values(this.datasourcePanel.datasources);

        // We can add a group of dataSources and set the options
        this.entity.dataProviderController.addEntity(this.entity);

        // starts streaming
        this.entity.dataProviderController.connectAll();
    },

    saveDialog:function(view){
        if (isUndefinedOrNull(view.dialog) || !view.dialog.in) {
            var viewDialog = new OSH.UI.Panel.DialogPanel("", {
                draggable: true,
                css: "app-dialog", //TBD into edit view
                title: view.name,
                show: true,
                dockable: false,
                closeable: true,
                connectionIds: [],//TODO
                destroyOnClose: false,
                modal: false,
                keepRatio: (!isUndefinedOrNull(view.options.keepRatio)) ? view.options.keepRatio : false
            });

            view.attachToElement(viewDialog.contentElt);
            view.dialog = {
                in : true,
                closed:false
            };

            viewDialog.onClose = function() {
                view.dialog.closed = true;
            };

            viewId=viewDialog.id;
        } else if(view.dialog.closed){
            // show dialog
            var parentDialog = OSH.Utils.getSomeParentTheClass(view.elementDiv,"dialog");
            if(!isUndefinedOrNull(parentDialog)) {
                viewId = parentDialog.id;
                OSH.EventManager.fire(OSH.EventManager.EVENT.SHOW_VIEW, {
                    viewId: viewId
                });
            }
        }
    },

    //**************************************************************//
    //*************Saving property**********************************//
    //**************************************************************//

    createSaveProperty: function () {
        var result = {};

        // Entity information
        this.saveInfo(result);

        // Datasource information
        this.saveDatasources(result);

        // view information
        // new or existing ?
        // store name, type & hash

        this.saveViews(result);

        return result;
    },

    saveInfo:function(result) {
        // Entity information
        result.infos = {
            id: this.entity.id,
            name : document.getElementById(this.infoPanel.nameTagId).value,
            icon : document.getElementById(this.infoPanel.iconTagId).value,
            description: document.getElementById(this.infoPanel.descriptionTagId).value
        };
    },

    saveDatasources:function(result) {
        var datasourcesProperty = [];
        for(var key in this.datasourcePanel.datasources) {
            var dsProps = {};
            OSH.Utils.copyProperties(this.datasourcePanel.datasources[key].properties,dsProps);
            dsProps.id = this.datasourcePanel.datasources[key].id;

            datasourcesProperty.push(dsProps);
        }
        result.datasources = datasourcesProperty;
    },

    saveViews:function(result) {
        result.views  = [];
        var currentView;

        // iterates over views
        for(var key in this.viewPanel.views) {
            currentView = this.viewPanel.views[key];
            result.views.push(this.saveView(currentView));
        }
    },

    saveView:function(view) {
        // compute view Items infos
        if(!isUndefinedOrNull(view.viewItems)) {
            var currentViewItem;
            var viewItems = [];

            for(var key in view.viewItems) {
                currentViewItem = view.viewItems[key];

                // save only viewItem created using UI
                if(currentViewItem.entityId === this.entity.id) {
                    viewItems.push(this.saveViewItem(currentViewItem));
                }
            }
        }

        return {
            type: view.type,
            hash: view.hash,
            name: view.name,
            container: view.elementDiv.parentNode.id,
            nodeIdx: OSH.Utils.getChildNumber(view.elementDiv),
            display: view.elementDiv.style.display, // for new created views, should be equal to NONE,
            viewItems:viewItems,
            options:view.options,
            viewInstanceType:view.viewInstanceType
        };
    },

    saveViewItem:function(viewItem) {
        var viewItemToSave = {
            name: viewItem.name,
            entityId: viewItem.entityId,
            styler: null
        };

        if (!isUndefinedOrNull(viewItem.styler)) {
            viewItemToSave.styler = this.saveStyler(viewItem.styler);
        }

        return viewItemToSave;
    },

    saveStyler:function(styler) {
        var stylerToSave = {
            properties:{},
            type: OSH.UI.Styler.Factory.getTypeFromInstance(styler)
        };

        for(var property in styler.properties) {
            stylerToSave.properties[property] = {};
            if(property.endsWith("Func")) {
                OSH.Utils.copyProperties(styler.properties[property],stylerToSave.properties[property]);
                stylerToSave.properties[property].handlerStr = styler.properties[property].handler.toSource();
            } else {
                stylerToSave.properties[property] = styler.properties[property];
            }
        }

        return stylerToSave;

    },

    restoreSavedProperties:function(properties){
        this.infoPanel.loadInfos(properties.infos);
        this.datasourcePanel.loadDataSourcesProperty(properties.datasources,function(datasourceArray) {

            this.createEntity();

            // asigns saved values
            this.entity.id = properties.infos.id;
            this.entity.name = properties.infos.name;
            this.entity.icon = properties.infos.icon;
            this.entity.description = properties.infos.description;
            this.entity.dataSources = datasourceArray;

            // View panel
            // re-init entity-id
            this.viewPanel.options.entityId = this.entity.id;
            this.viewPanel.options.datasources = this.datasourcePanel.datasources;

            this.viewPanel.loadViews(properties.views);

            // adds and connects datasources
            this.saveEntity();
        }.bind(this));
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityEditViewPanel = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        //this.view = OSH.ViewMap.getView(this.options.view.id);
        this.view = this.options.view;

        if(!isUndefinedOrNull(this.options.entityId)) {
            this.entityId = this.options.entityId;
        }

        OSH.Utils.addCss(this.elementDiv,"edit-view");


        // creates view properties div
        this.viewPropertiesElt = document.createElement("div");
        this.viewPropertiesElt.setAttribute("class","view-properties");
        this.elementDiv.appendChild(this.viewPropertiesElt);

        // creates content div
        this.contentElt = document.createElement("div");
        this.contentElt.setAttribute("class","content-properties");
        this.elementDiv.appendChild(this.contentElt);

        this.buildViewProperties();

        var containerArr = this.getContainers();
        if(this.view.container !== "") {
            if(!isUndefinedOrNull(this.view.container.id)) {
                containerArr.push(this.view.container.id);
            } else {
                containerArr = this.getContainers().concat(this.view.container).filter(function(value, index, self) {
                    return self.indexOf(value) === index;
                });
            }
        }
        //TODO:this.buildContainer(containerArr);


        this.buildContent();
    },

    buildViewProperties: function() {


        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.viewPropertiesElt,"View properties");

        var inputViewNameId = OSH.Helper.HtmlHelper.addInputText(this.viewPropertiesElt,"Name",this.view.name);

        var self = this;
        OSH.EventManager.observeDiv(inputViewNameId,"change",function(event){

            // updates view name
            self.view.name = this.value;
        });
    },

    buildContainer: function(containerArr) {
        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.elementDiv,"Container");
        this.containerDivId = OSH.Helper.HtmlHelper.addHTMLListBox(this.elementDiv,"",containerArr);

        OSH.Helper.HtmlHelper.HTMLListBoxSetSelected(document.getElementById(this.containerDivId),this.view.container);

        var containerElt = document.getElementById(this.containerDivId);

        if(!isUndefinedOrNull(this.view.container)) {
            var idx = -1;
            if(!isUndefinedOrNull(this.view.container.id)) {
                idx = containerArr.indexOf(this.view.container.id);
            } else {
                idx = containerArr.indexOf(this.view.container);
            }
            containerElt.options[idx].setAttribute("selected","");
        }
        // add default containers
        // listener
        var self = this;

        OSH.EventManager.observeDiv(this.containerDivId,"change",function(event){
            // updates view container
            self.view.container = this.options[this.selectedIndex].value;
        });
    },

    /**
     * Abstract
     */
    buildContent:function() {},

    getView:function() {
        return this.view;
    },

    getProperties:function() {
        return {
            name:this.view.name
        };
    },

    getContainers:function() {
        return [" ","Dialog"];
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityViewItemsEditPanel = OSH.UI.Panel.EntityEditViewPanel.extend({
    initialize: function (parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    buildContent:function() {
        var viewItems = [];
        if(!isUndefinedOrNull(this.view.viewItems) && this.view.viewItems.length > 0) {
            viewItems = this.view.viewItems;
        }

        if(!isUndefinedOrNull(this.view.viewItemsToAdd) && this.view.viewItemsToAdd.length > 0) {
            viewItems = viewItems.concat(this.view.viewItemsToAdd);
        }

        this.buildViewItems(viewItems);
    },

    buildViewItems:function(defaultViewItemArr) {
        if(isUndefinedOrNull(this.view.viewItemsToAdd)) {
            this.view.viewItemsToAdd = [];
        }
        if(isUndefinedOrNull(this.view.viewItemsToRemove)) {
            this.view.viewItemsToRemove = [];
        }

        // styler part
        this.viewItemsContainerDivId = OSH.Utils.randomUUID();
        var addViewItemId = OSH.Utils.randomUUID();

        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.contentElt,"View items");

        var viewItemsDivElt = document.createElement("div");
        viewItemsDivElt.setAttribute("class","viewItem-section");

        var addViewItemButtonElt = document.createElement("button");
        addViewItemButtonElt.setAttribute("id",addViewItemId );
        addViewItemButtonElt.setAttribute("class","submit");
        addViewItemButtonElt.innerHTML = "Add";

        var viewItemsContainerElt = document.createElement("div");
        viewItemsContainerElt.setAttribute("id",this.viewItemsContainerDivId);
        viewItemsContainerElt.setAttribute("class","viewItem-container");

        viewItemsDivElt.appendChild(addViewItemButtonElt);
        viewItemsDivElt.appendChild(viewItemsContainerElt);

        this.contentElt.appendChild(viewItemsDivElt);

        // inits from properties
        // check if the current view items are part of the current entity
        for(var i =0;i < defaultViewItemArr.length;i++) {
            if(!isUndefinedOrNull(defaultViewItemArr[i].entityId) &&
                defaultViewItemArr[i].entityId === this.entityId) {
                this.addViewItem({viewItem: defaultViewItemArr[i]});
            }
        }

        // listeners
        var self = this;

        OSH.EventManager.observeDiv(addViewItemId,"click",function (event) {
            var newStyler = self.addViewItem(event);
        });
    },

    // ACTION FUNCTIONS
    addViewItem:function(event) {
        var viewItemsContainerElt = document.getElementById(this.viewItemsContainerDivId);

        var id = OSH.Utils.randomUUID();
        var stylerSelectDivId = "styler-"+id;

        var div = document.createElement('div');
        div.setAttribute("id","viewItem-"+id);
        div.setAttribute("class","ds-line");

        var deleteId = "delete-"+id;
        var editId = "edit-"+id;

        var viewItem = null;
        var styler = null;

        // gets styler list from current instance
        var stylerList = this.getStylerList();

        var selectedStylerName = stylerList[0];

        if(!isUndefined(event.viewItem)) {
            //TODO: check if that is still necessary with the new architecture
            viewItem = event.viewItem;
            styler = viewItem.styler;
            selectedStylerName = OSH.UI.Styler.Factory.getTypeFromInstance(styler);
        } else {
            if(isUndefinedOrNull(this.nbViewItems)) {
                this.nbViewItems = 0;
            }

            var stylerUI = null;

            if(!isUndefinedOrNull(stylerList)){
                stylerUI = OSH.UI.Styler.Factory.getNewInstanceFromType(stylerList[0]);
            }

            viewItem = {
                id: "view-item-"+OSH.Utils.randomUUID(),
                name:"View item #"+this.nbViewItems++,
                styler: stylerUI
            };

            if(!isUndefinedOrNull(this.entityId)) {
                viewItem.entityId = this.entityId;
            }

            this.view.viewItemsToAdd.push(viewItem);
        }

        var inputEltId = OSH.Utils.randomUUID();

        var strVar = "<div class=\"line-left view-item-line\">";
        strVar += "     <input id=\""+inputEltId+"\" name=\""+viewItem.name+"\" value=\""+viewItem.name+"\" type=\"input-text\" class=\"input-text\">";
        strVar += "     <div class=\"select-style\">";
        strVar += "         <select id=\"" + stylerSelectDivId + "\">";

        for(var i=0;i < stylerList.length;i++) {
            if(stylerList[i] === selectedStylerName) {
                strVar += "             <option  selected value=\""+stylerList[i]+"\">"+stylerList[i]+"<\/option>";
            } else {
                strVar += "             <option  value=\""+stylerList[i]+"\">"+stylerList[i]+"<\/option>";
            }
        }

        strVar += "         <\/select>";
        strVar += "     <\/div>";
        strVar += "  <\/div>";

        strVar += "   <table class=\"control line-right\">";
        strVar += "      <tr>";
        strVar += "         <td><i class=\"fa fa-2x fa-pencil-square-o edit\" aria-hidden=\"true\" id=\"" + editId + "\"><\/i><\/td>";
        strVar += "         <td><i class=\"fa fa-2x fa-trash-o delete\" aria-hidden=\"true\" id=\"" + deleteId + "\"><\/i><\/td>";
        strVar += "      <\/tr>";
        strVar += "   <\/table>";
        strVar += "<\/div>";
        strVar += "<div style=\"clear: both;\"><\/div>";

        div.innerHTML = strVar;

        OSH.Helper.HtmlHelper.onDomReady(function(){
            var inputElt = document.getElementById(inputEltId);
            // FIX select input-text instead of dragging the element(when the parent is draggable)
            inputElt.onfocus = function (e) {
                OSH.Utils.fixSelectable(this, true);
            };

            inputElt.onblur = function (e) {
                OSH.Utils.fixSelectable(this, false);
            };
        });

        viewItemsContainerElt.appendChild(div);

        var self = this;

        OSH.EventManager.observeDiv(inputEltId, "change", function (event) {
            viewItem.name = document.getElementById(inputEltId).value;
        });

        OSH.EventManager.observeDiv(deleteId, "click", function (event) {
            viewItemsContainerElt.removeChild(div);
            self.view.viewItemsToRemove.push(viewItem);
        });

        OSH.EventManager.observeDiv(editId, "click", this.editStyler.bind(this, viewItem));

        OSH.EventManager.observeDiv(stylerSelectDivId, "change", function (event) {
            var vItem = self.getViewItemById(viewItem.id);
            vItem.styler = self.getNewStylerInstance(this.options[this.selectedIndex].value);
        });
    },

    editStyler:function(viewItem,event) {
        var editStylerView = this.getStylerPanelInstance({
            datasources:this.options.datasources,
            styler: viewItem.styler
        });

        var editViewDialog = new OSH.UI.Panel.SaveDialogPanel("", {
            draggable: true,
            css: "dialog-edit-view", //TODO: create unique class for all the views
            title: "Edit Styler",
            show:true,
            dockable: false,
            closeable: true,
            connectionIds : [],
            destroyOnClose:true,
            modal:true
        });

        editStylerView.attachToElement(editViewDialog.contentElt);

        var self = this;

        (function(viewItemId) {
            editViewDialog.onSave = function() {
                var styler = editStylerView.getStyler();

                // updates the styler of this viewItem
                var viewItem = self.getViewItemById(viewItemId);
                viewItem.styler = styler;

                editViewDialog.close();
            };
        })(viewItem.id); //passing the variable to freeze, creating a new closure
    },

    /**
     * This builds a new instance of the selected styler corresponding to the viewItem.
     * Each subclass has to return its own instance
     */
    getNewStylerInstance:function(name) {},

    getTypeFromStylerInstance:function(stylerInstance) {},

    /**
     * This gets the available styler list compatible with the view.
     * Each subclass has to return its own list
     */
    getStylerList:function() { return [];},

    getStylerPanelInstance:function(properties) {},

    getViewItemById:function(id) {
        var result=null;

        for(var key in this.view.viewItems) {
            if(this.view.viewItems[key].id === id) {
                result = this.view.viewItems[key];
                break;
            }
        }
        if(result === null) {
            for(var key in this.view.viewItemsToAdd) {
                if(this.view.viewItemsToAdd[key].id === id) {
                    result = this.view.viewItemsToAdd[key];
                    break;
                }
            }
        }

        return result;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityMapEditPanel = OSH.UI.Panel.EntityViewItemsEditPanel.extend({

    getStylerList:function() {
        return [OSH.UI.Styler.Factory.TYPE.MARKER, OSH.UI.Styler.Factory.TYPE.POLYLINE];
    },

    getStylerPanelInstance:function(properties) {
        return new OSH.UI.Panel.StylerMarkerPanel("",properties);
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityVideoEditPanel = OSH.UI.Panel.EntityViewItemsEditPanel.extend({

    buildViewProperties: function() {
        this._super();

        this.keepRatioCheckboxId = OSH.Helper.HtmlHelper.addCheckbox(this.viewPropertiesElt,"Keep ratio",this.view.options.keepRatio);
        this.showFpsCheckboxId = OSH.Helper.HtmlHelper.addCheckbox(this.viewPropertiesElt,"Show fps",this.view.options.showFps);
    },

    getStylerList:function() {
        return [OSH.UI.Styler.Factory.TYPE.VIDEO];
    },

    getStylerPanelInstance:function(properties) {
        return new OSH.UI.Panel.StylerVideoPanel("",properties);
    },

    getProperties:function() {
        var superProperties = this._super();

        OSH.Utils.copyProperties({
            showFps:  document.getElementById(this.showFpsCheckboxId).checked,
            keepRatio: document.getElementById(this.keepRatioCheckboxId).checked
        },superProperties,true);

        return superProperties;
    },
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityChartEditPanel = OSH.UI.Panel.EntityViewItemsEditPanel.extend({

    buildViewProperties: function() {
        this._super();

        this.inputXLabelId = OSH.Helper.HtmlHelper.addInputText(this.viewPropertiesElt,"X label",null,"x label");
        this.inputYLabelId = OSH.Helper.HtmlHelper.addInputText(this.viewPropertiesElt,"Y label",null,"y label");
        this.inputMaxPoint = OSH.Helper.HtmlHelper.addInputText(this.viewPropertiesElt,"Max points",null,"maximum points displayed at the same time");

        OSH.Helper.HtmlHelper.onDomReady(function(){
            document.getElementById(this.inputXLabelId).value = this.options.view.xLabel;
            document.getElementById(this.inputYLabelId).value = this.options.view.yLabel;
            document.getElementById(this.inputMaxPoint).value = this.options.view.maxPoints;
        }.bind(this));
    },

    getStylerList:function() {
        return [OSH.UI.Styler.Factory.TYPE.LINE_PLOT];
    },

    getStylerPanelInstance:function(properties) {
        return new OSH.UI.Panel.StylerLinePlotPanel("",properties);
    },

    getProperties:function() {
        var superProperties = this._super();

        OSH.Utils.copyProperties({
            xLabel:  document.getElementById(this.inputXLabelId).value,
            yLabel: document.getElementById(this.inputYLabelId).value,
            maxPoints:Number(document.getElementById(this.inputMaxPoint).value)
        },superProperties,true);

        return superProperties;
    },

    getView:function() {
        return this.view;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.EntityMJPEGVideoEditPanel = OSH.UI.Panel.EntityVideoEditPanel.extend({


});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.StylerPanel = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, options) {
        this.styler = options.styler;
        this._super(parentElementDivId, options);
    },

    getObservable:function(datasourceSelectId) {
        var datasourceSelectTag = document.getElementById(datasourceSelectId);

        // fills corresponding observable
        var currentDS = this.options.datasources[datasourceSelectTag.selectedIndex];

        var result = [];

        if(!isUndefinedOrNull(currentDS)) {
            for (var key in currentDS.resultTemplate) {

                result.push({
                    uiLabel: currentDS.resultTemplate[key].uiLabel
                });
            }
        }

        return result;
    },

    loadObservable:function(datasourceSelectId,observableSelectId) {
        var isNotEmpty = true;

        OSH.Helper.HtmlHelper.removeAllFromSelect(observableSelectId);
        var datasourceSelectTag = document.getElementById(datasourceSelectId);
        var observableSelectTag = document.getElementById(observableSelectId);

        // fills corresponding observable
        var currentDS = this.options.datasources[datasourceSelectTag.selectedIndex];

        if(!isUndefinedOrNull(currentDS)) {
            for (var key in currentDS.resultTemplate) {

                var option = document.createElement("option");
                option.text = currentDS.resultTemplate[key].uiLabel;
                option.value = currentDS.resultTemplate[key].uiLabel;
                option.object = currentDS.resultTemplate[key].object;

                observableSelectTag.add(option);
                isNotEmpty = false;
            }
        }

        return isNotEmpty;
    },

    loadUom:function(observableSelectId,thresholdInputId) {
        // gets selected observable
        var observableSelectTag = document.getElementById(observableSelectId);
        var observableOptionSelectedTag = observableSelectTag.options[observableSelectTag.selectedIndex];

        if(!isUndefined(observableOptionSelectedTag) && !isUndefined(observableOptionSelectedTag.object.uom)) {
            var uom = OSH.Utils.getUOM(observableOptionSelectedTag.object.uom);
            if(!isUndefinedOrNull(uom)) {
                document.getElementById(thresholdInputId).nextElementSibling.innerHTML = uom;
            } else {
                document.getElementById(thresholdInputId).nextElementSibling.innerHTML = "";
            }
        } else {
            document.getElementById(thresholdInputId).nextElementSibling.innerHTML = "";
        }
    },

    /**
     * To be overridden
     */
    getProperties:function(){},

    loadData:function(data){},

    loadStyler:function(styler){}

});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.StylerVideoPanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        // tab panel
        var tabPanel = new OSH.UI.Panel.TabPanel();

        // tab elements
        this.videoPanel = new OSH.UI.Panel.VideoPanel("",this.options);

        tabPanel.addTab("Video",this.videoPanel.elementDiv);

        this.elementDiv.appendChild(tabPanel.elementDiv);
    },

    getStyler:function() {
        // gets properties from panels
        var videoPanelProperties = this.videoPanel.getProperties();

        OSH.Asserts.checkObjectPropertyPath(videoPanelProperties,"properties","missing property 'properties");

        this.options.styler.updateProperties(videoPanelProperties.properties);

        return this.options.styler;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.StylerPolylinePanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        // tab panel
        var tabPanel = new OSH.UI.Panel.TabPanel();

        // tab elements
        this.locationPanel = new OSH.UI.Panel.LocationPanel("",this.options);

        tabPanel.addTab("Location",this.locationPanel.elementDiv);

        this.elementDiv.appendChild(tabPanel.elementDiv);
    },

    getStyler:function() {
        var uiProperties = {};

        // gets properties from panels
        var locationPanelProperties = this.locationPanel.getProperties();

        // copies properties
        OSH.Utils.copyProperties(locationPanelProperties.ui,uiProperties);

        // updates styler with properties
        this.options.styler.updateProperties(locationPanelProperties);

        // saves UI properties into styler object to be reloaded
        OSH.Utils.copyProperties(uiProperties,this.options.styler.ui);

        return this.options.styler;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.StylerMarkerPanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        // tab panel
        var tabPanel = new OSH.UI.Panel.TabPanel();

        // tab elements
        this.locationPanel = new OSH.UI.Panel.LocationPanel("",this.options);
        this.iconPanel = new OSH.UI.Panel.IconPanel("",this.options);

        tabPanel.addTab("Location",this.locationPanel.elementDiv);
        tabPanel.addTab("Icon",this.iconPanel.elementDiv);

        this.elementDiv.appendChild(tabPanel.elementDiv);
    },

    getStyler:function() {
        // gets properties from panels
        var locationPanelProperties = this.locationPanel.getProperties();
        var iconPanelProperties = this.iconPanel.getProperties();

        OSH.Asserts.checkObjectPropertyPath(locationPanelProperties,"properties","missing property 'properties");
        OSH.Asserts.checkObjectPropertyPath(iconPanelProperties,"properties","missing property 'properties");

        // updates styler with properties
       // this.options.styler.updateProperties(locationPanelProperties.properties);
       // this.options.styler.updateProperties(iconPanelProperties.properties);
        // updates styler with properties
        var mergedProperties = {};

        OSH.Utils.copyProperties(locationPanelProperties,mergedProperties);
        OSH.Utils.copyProperties(iconPanelProperties,mergedProperties);
        OSH.Utils.copyProperties(iconPanelProperties.properties.ui,mergedProperties.properties.ui,true);

        this.options.styler.updateProperties(mergedProperties.properties);

        return this.options.styler;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.StylerLinePlotPanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        // tab panel
        var tabPanel = new OSH.UI.Panel.TabPanel();

        // tab elements
        this.valesPanel = new OSH.UI.Panel.XYPanel("",this.options);
        this.colorPanel = new OSH.UI.Panel.ColorPanel("",this.options);

        tabPanel.addTab("Values",this.valesPanel.elementDiv);
        tabPanel.addTab("Color",this.colorPanel.elementDiv);

        this.elementDiv.appendChild(tabPanel.elementDiv);
    },

    getStyler:function() {
        // gets properties from panels
        var valuesPanelProperties = this.valesPanel.getProperties();
        var colorPanelProperties = this.colorPanel.getProperties();

        OSH.Asserts.checkObjectPropertyPath(valuesPanelProperties,"properties","missing property 'properties");
        OSH.Asserts.checkObjectPropertyPath(colorPanelProperties,"properties","missing property 'properties");

        // updates styler with properties
        var mergedProperties = {};

        OSH.Utils.copyProperties(valuesPanelProperties,mergedProperties);
        OSH.Utils.copyProperties(colorPanelProperties,mergedProperties);
        OSH.Utils.copyProperties(colorPanelProperties.properties.ui,mergedProperties.properties.ui,true);

        this.options.styler.updateProperties(mergedProperties.properties);

        return this.options.styler;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.ColorPanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        // type
        this.typeInputId = OSH.Helper.HtmlHelper.addHTMLListBox(this.elementDiv,"Color type", [
            "None",
            "Fixed",
            "Threshold"
        ]);

        this.content = document.createElement("div");
        this.elementDiv.appendChild(this.content);

        this.properties = {};

        // adds listeners
        var self = this;
        var typeInputElt = document.getElementById(this.typeInputId);

        typeInputElt.addEventListener("change", function () {
            var currentValue = (this.options[this.selectedIndex].value);
            // clear current content
            OSH.Helper.HtmlHelper.removeAllNodes(self.content);
            self.removeAllListerners();
            self.removeProps();

            switch (currentValue) {
                case "Threshold":
                    self.addThreshold();
                    break;
                case "Fixed" :
                    self.addFixed();
                    break;
                case "None" :
                    self.addNone();
                    break;
                default:
                    break;
            }
        });

        this.initDefaultValues();
    },


    initDefaultValues:function(){
        // load existing values if any
        // load UI settings

        //-- sets color type
        var typeInputElt = document.getElementById(this.typeInputId);

        if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.color")) {
            if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.color.fixed")) {
                // loads fixed
                typeInputElt.options.selectedIndex = 1;
                this.addFixed(this.styler.properties.ui.color.fixed);
            } else if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.color.threshold")) {
                // loads threshold
                typeInputElt.options.selectedIndex = 2;
                this.addThreshold(this.styler.properties.ui.color.threshold);
            } else if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.color.map")) {
                // loads map
                typeInputElt.options.selectedIndex = 3;
                this.addMap(this.styler.properties.ui.color.map);
            } else if (OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.color.custom")) {
                // loads custom
                typeInputElt.options.selectedIndex = 4;
                this.addCustom(this.styler.properties.ui.color.custom);
            }
        } else if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.colorFunc")) {
            typeInputElt.options.selectedIndex = 4;
            this.addCustom(this.styler.properties.colorFunc.handler.toSource());
        }
    },

    removeProps:function() {
        delete this.properties.fixed;
        delete this.properties.threshold;
    },

    addNone:function() {
        this.properties = {};
    },

    addFixed : function(defaultProperties) {

        this.properties = {
            fixed: {
                default: null,
                selected: null
            }
        };

        this.defaultColorInputId = OSH.Helper.HtmlHelper.addColorPicker(this.content,"Default color","#1f77b5","color");

        this.selectedColorInputId = OSH.Helper.HtmlHelper.addColorPicker(this.content,"Selected color","#1f77b5","color");

        // edit values
        OSH.Helper.HtmlHelper.onDomReady(function(){
            if(!isUndefinedOrNull(defaultProperties)){
                if(!isUndefinedOrNull(defaultProperties.default)) {
                    var defaultColorInputElt = document.getElementById(this.defaultColorInputId);
                    var defaultColorPickerElt = defaultColorInputElt.nextElementSibling;

                    defaultColorPickerElt.value = defaultProperties.default;
                    defaultColorPickerElt.select();

                    defaultColorInputElt.value = defaultProperties.default;
                    defaultColorInputElt.innerHTML = defaultProperties.default;

                    this.properties.fixed.default = defaultProperties.default;
                }
                if(!isUndefinedOrNull(defaultProperties.selected)) {
                    var selectedColorInputElt = document.getElementById(this.selectedColorInputId);
                    var selectedColorPickerElt = document.getElementById(this.selectedColorInputId).nextElementSibling;

                    selectedColorPickerElt.value = defaultProperties.selected;
                    selectedColorPickerElt.select();

                    selectedColorInputElt.value = defaultProperties.selected;
                    selectedColorInputElt.innerHTML = defaultProperties.selected;

                    this.properties.fixed.selected = defaultProperties.selected;
                }
            }
        }.bind(this));
    },

    addThreshold:function(defaultProperties) {

        this.properties = {
            threshold : {
                low: null,
                high: null,
                default: null,
                datasourceId: null,
                observableIdx: null
            }
        };

        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.content,"Data source");


        if(this.options.datasources.length > 0) {
            this.properties.threshold.datasourceIdx = 0;
        }

        var dsListBoxId = OSH.Helper.HtmlHelper.addHTMLObjectWithLabelListBox(this.content, "Data Source", this.options.datasources);
        var observableListBoxId = OSH.Helper.HtmlHelper.addHTMLListBox(this.content, "Observable", []);

        // default
        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.content,"Default");
        var defaultColorInputId = OSH.Helper.HtmlHelper.addTitledFileChooser(this.content, "Default color",true);

        // threshold
        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.content,"Threshold");

        // low color
        var lowColorInputId = OSH.Helper.HtmlHelper.addTitledFileChooser(this.content, "Low color",true);

        // high color
        var highColorInputId = OSH.Helper.HtmlHelper.addTitledFileChooser(this.content, "High color",true);

        // threshold
        var thresholdInputId = OSH.Helper.HtmlHelper.addInputTextValueWithUOM(this.content, "Threshold value", "12.0","");

        if(!this.loadObservable(dsListBoxId,observableListBoxId,thresholdInputId)) {
            this.properties.threshold.observableIdx = 0;
        }

        this.loadUom(observableListBoxId,thresholdInputId);

        var self = this;

        // adds listeners

        self.addListener(document.getElementById(dsListBoxId), "change", function () {
            self.properties.threshold.datasourceIdx = this.selectedIndex;

            // updates observable listbox
            self.loadObservable(dsListBoxId,observableListBoxId);
        });

        self.addListener(document.getElementById(observableListBoxId), "change", function () {
            self.properties.threshold.observableIdx = this.selectedIndex;

            // updates uom
            self.loadUom(observableListBoxId,thresholdInputId);
        });

        var defaultColorInputElt = document.getElementById(defaultColorInputId);
        this.addListener(defaultColorInputElt, "change", this.inputFileHandlerAsBinaryString.bind(defaultColorInputElt,function(result) {
            self.properties.threshold.default = result;
        }));

        this.addListener(defaultColorInputElt.nextElementSibling, "paste", this.inputFilePasteHandler.bind(defaultColorInputElt.nextElementSibling,function(result) {
            self.properties.threshold.default = result;
        }));

        var lowColorInputElt = document.getElementById(lowColorInputId);
        this.addListener(lowColorInputElt, "change", this.inputFileHandlerAsBinaryString.bind(lowColorInputElt,function(result) {
            self.properties.threshold.low = result;
        }));

        this.addListener(lowColorInputElt.nextElementSibling, "paste", this.inputFilePasteHandler.bind(lowColorInputElt.nextElementSibling,function(result) {
            self.properties.threshold.low = result;
        }));

        var highColorInputElt = document.getElementById(highColorInputId);
        this.addListener(highColorInputElt, "change", this.inputFileHandlerAsBinaryString.bind(highColorInputElt,function(result) {
            self.properties.threshold.high = result;
        }));

        this.addListener(highColorInputElt.nextElementSibling, "paste", this.inputFilePasteHandler.bind(highColorInputElt.nextElementSibling,function(result) {
            self.properties.threshold.high = result;
        }));

        this.addListener(document.getElementById(thresholdInputId), "change", function () {
            self.properties.threshold.value = this.value;
        });

        // edit values
        if(!isUndefinedOrNull(defaultProperties)) {
            this.setInputFileValue(defaultColorInputElt,defaultProperties.default);
            this.setInputFileValue(lowColorInputElt,defaultProperties.low);
            this.setInputFileValue(highColorInputElt,defaultProperties.high);
            document.getElementById(thresholdInputId).value = defaultProperties.value;

            this.properties.threshold.default = defaultProperties.default;
            this.properties.threshold.low = defaultProperties.low;
            this.properties.threshold.high = defaultProperties.high;
            this.properties.threshold.value = defaultProperties.value;

            var dsSelectTag = document.getElementById(dsListBoxId);

            for(var i=0; i < dsSelectTag.options.length;i++) {
                var currentOption = dsSelectTag.options[i];

                if(currentOption.object.id === defaultProperties.datasourceId) {
                    currentOption.setAttribute("selected","");
                    this.properties.threshold.datasourceIdx = i;
                    break;
                }
            }

            this.loadObservable(dsListBoxId,observableListBoxId,thresholdInputId);

            var obsSelectTag = document.getElementById(observableListBoxId);
            obsSelectTag.options[defaultProperties.observableIdx].setAttribute("selected","");

            this.properties.threshold.observableIdx = defaultProperties.observableIdx;
        }
    },

    addCustom:function(textContent) {
        this.properties = {
            custom: {}
        };

        var defaultValue = "";

        if(!isUndefinedOrNull(textContent)) {
            defaultValue = textContent;
        }

        this.textareaId = OSH.Utils.createJSEditor(this.content,defaultValue);
    },

    addMap : function(defaultProperties) {

    },

    getProperties:function() {
        var stylerProperties = {
            properties: {
                ui: {
                    color: {}
                }
            }
        };

        var dsIdsArray = [];

        for (var key in this.options.datasources) {
            dsIdsArray.push(this.options.datasources[key].id);
        }

        if (!isUndefinedOrNull(this.properties.fixed)) {
            OSH.Asserts.checkObjectPropertyPath(this.properties,"fixed");

            // DEFAULT color
            stylerProperties.properties.ui.color.fixed = {};

            OSH.Asserts.checkObjectPropertyPath(this.properties,"fixed.default");

            var defaultColor = document.getElementById(this.defaultColorInputId).value;

            var defaultColorProps = OSH.UI.Styler.Factory.getFixedColor(dsIdsArray,defaultColor);

            OSH.Utils.copyProperties(defaultColorProps,stylerProperties.properties);

            stylerProperties.properties.color = defaultColorProps.color;

            // UI
            stylerProperties.properties.ui.color.fixed.default = defaultColor;

            // SELECTED Color
            //TODO: replace selected way
            if(OSH.Utils.hasOwnNestedProperty(this.properties,"fixed.selected")) {

                OSH.Asserts.checkObjectPropertyPath(this.properties,"fixed.selected");

                var selectedColor = document.getElementById(this.selectedColorInputId).value;

                if(!isUndefinedOrNull(selectedColor)) {

                    var selectedColorProps = OSH.UI.Styler.Factory.getSelectedColorFunc(
                        dsIdsArray,
                        defaultColor,
                        selectedColor
                    );

                    OSH.Utils.copyProperties(selectedColorProps, stylerProperties.properties);

                    stylerProperties.properties.color = selectedColorProps.color;

                    // UI
                    stylerProperties.properties.ui.color.fixed.selected = selectedColor;
                }
            }
        } else if (!isUndefinedOrNull(this.properties.custom)) {
            OSH.Asserts.checkObjectPropertyPath(this.properties,"custom");

            stylerProperties.properties.ui.color.custom = {};
            var textContent = document.getElementById(this.textareaId).value;

            var colorFuncProps = OSH.UI.Styler.Factory.getCustomColorFunc(
                dsIdsArray, // ds array ids
                textContent //colorFnStr
            );

            OSH.Utils.copyProperties(colorFuncProps,stylerProperties.properties);

            // UI
            stylerProperties.properties.ui.color.custom = textContent;

        } else if (!isUndefinedOrNull(this.properties.threshold)) {
            stylerProperties.properties.ui.color.threshold = {};

            OSH.Asserts.checkObjectPropertyPath(this.properties,"threshold");

            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.observableIdx);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.datasourceIdx);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.default);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.low);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.high);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.value);

            //dataSourceIdsArray,datasource, observableIdx,
            //defaultColorArrayBuffer, lowColorArrayBuffer, highColorArrayBuffer, thresholdValue
            var currentDatasource = this.options.datasources[this.properties.threshold.datasourceIdx];

            var colorFuncProps = OSH.UI.Styler.Factory.getThresholdColor(
                currentDatasource,
                this.properties.threshold.observableIdx,
                this.properties.threshold.default,
                this.properties.threshold.low,
                this.properties.threshold.high,
                this.properties.threshold.value
            );

            OSH.Utils.copyProperties(colorFuncProps,stylerProperties.properties);

            stylerProperties.properties.color = colorFuncProps.color;

            // UI
            stylerProperties.properties.ui.color.threshold.default = this.properties.threshold.default;
            stylerProperties.properties.ui.color.threshold.low = this.properties.threshold.low;
            stylerProperties.properties.ui.color.threshold.high = this.properties.threshold.high;
            stylerProperties.properties.ui.color.threshold.value = this.properties.threshold.value;
            stylerProperties.properties.ui.color.threshold.observableIdx = this.properties.threshold.observableIdx;
            stylerProperties.properties.ui.color.threshold.datasourceId = currentDatasource.id;
        } else {
            delete stylerProperties.properties.color; // remove color properties from result
        }
        return stylerProperties;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.IconPanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        // type
        this.typeInputId = OSH.Helper.HtmlHelper.addHTMLListBox(this.elementDiv,"Icon type", [
            "None",
            "Fixed",
            "Threshold",
            "Map",
            "Custom"
        ]);

        this.content = document.createElement("div");
        this.elementDiv.appendChild(this.content);

        this.properties = {};

        // adds listeners
        var self = this;
        var typeInputElt = document.getElementById(this.typeInputId);

        typeInputElt.addEventListener("change", function () {
            var currentValue = (this.options[this.selectedIndex].value);
            // clear current content
            OSH.Helper.HtmlHelper.removeAllNodes(self.content);
            self.removeAllListerners();
            self.removeProps();

            switch (currentValue) {
                case "Threshold":
                    self.addThreshold();
                    break;
                case "Fixed" :
                    self.addFixed();
                    break;
                case "Custom" :
                    self.addCustom();
                    break;
                case "None" :
                    self.addNone();
                    break;
                default:
                    break;
            }
        });

        this.initDefaultValues();
    },


    initDefaultValues:function(){
        // load existing values if any
        // load UI settings

        //-- sets icon type
        var typeInputElt = document.getElementById(this.typeInputId);

        if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.icon")) {
            if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.icon.fixed")) {
                // loads fixed
                typeInputElt.options.selectedIndex = 1;
                this.addFixed(this.styler.properties.ui.icon.fixed);
            } else if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.icon.threshold")) {
                // loads threshold
                typeInputElt.options.selectedIndex = 2;
                this.addThreshold(this.styler.properties.ui.icon.threshold);
            } else if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.icon.map")) {
                // loads map
                typeInputElt.options.selectedIndex = 3;
                this.addMap(this.styler.properties.ui.icon.map);
            } else if (OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.icon.custom")) {
                // loads custom
                typeInputElt.options.selectedIndex = 4;
                this.addCustom(this.styler.properties.ui.icon.custom);
            }
        } else if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.iconFunc")) {
            typeInputElt.options.selectedIndex = 4;
            this.addCustom(this.styler.properties.iconFunc.handler.toSource());
        }
    },

    removeProps:function() {
        delete this.properties.fixed;
        delete this.properties.threshold;
    },

    addNone:function() {
        this.properties = {};
    },

    addFixed : function(defaultProperties) {

        this.properties = {
            fixed: {
                default: null,
                selected: null
            }
        };

        // low icon
        this.defaultIconInputId = OSH.Helper.HtmlHelper.addTitledFileChooser(this.content,"Default icon",true);

        // default icon
        var defaultIconInputElt = document.getElementById(this.defaultIconInputId);

        // selected icon
        var selectedIconInputId = OSH.Helper.HtmlHelper.addTitledFileChooser(this.content, "Selected icon",true);

        var selectedIconInputElt = document.getElementById(selectedIconInputId);

        var self = this;

        this.addListener(defaultIconInputElt, "change", this.inputFileHandlerAsBinaryString.bind(defaultIconInputElt,function(result) {
            self.properties.fixed.default = result;
        }));

        this.addListener(defaultIconInputElt.nextElementSibling, "paste", this.inputFilePasteHandler.bind(defaultIconInputElt.nextElementSibling,function(result) {
            self.properties.fixed.default = result;
        }));

        this.addListener(selectedIconInputElt, "change", this.inputFileHandlerAsBinaryString.bind(selectedIconInputElt,function(result) {
            self.properties.fixed.selected = result;
        }));

        this.addListener(selectedIconInputElt.nextElementSibling, "paste", this.inputFilePasteHandler.bind(selectedIconInputElt.nextElementSibling,function(result) {
            self.properties.fixed.selected = result;
        }));

        // edit values
        if(!isUndefinedOrNull(defaultProperties)){
            this.setInputFileValue(defaultIconInputElt,defaultProperties.default);
            this.setInputFileValue(selectedIconInputElt,defaultProperties.selected);

            this.properties.fixed.default = defaultProperties.default;
            this.properties.fixed.selected = defaultProperties.selected;
        }
    },

    addThreshold:function(defaultProperties) {

        this.properties = {
            threshold : {
                low: null,
                high: null,
                default: null,
                datasourceIdx: null,
                observableIdx: null
            }
        };

        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.content,"Data source");


        if(this.options.datasources.length > 0) {
            this.properties.threshold.datasourceIdx = 0;
        }

        var dsListBoxId = OSH.Helper.HtmlHelper.addHTMLObjectWithLabelListBox(this.content, "Data Source", this.options.datasources);
        var observableListBoxId = OSH.Helper.HtmlHelper.addHTMLListBox(this.content, "Observable", []);

        // default
        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.content,"Default");
        var defaultIconInputId = OSH.Helper.HtmlHelper.addTitledFileChooser(this.content, "Default icon",true);

        // threshold
        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.content,"Threshold");

        // low icon
        var lowIconInputId = OSH.Helper.HtmlHelper.addTitledFileChooser(this.content, "Low icon",true);

        // high icon
        var highIconInputId = OSH.Helper.HtmlHelper.addTitledFileChooser(this.content, "High icon",true);

        // threshold
        var thresholdInputId = OSH.Helper.HtmlHelper.addInputTextValueWithUOM(this.content, "Threshold value", "12.0","");

        if(!this.loadObservable(dsListBoxId,observableListBoxId,thresholdInputId)) {
            this.properties.threshold.observableIdx = 0;
        }

        this.loadUom(observableListBoxId,thresholdInputId);

        var self = this;

        // adds listeners

        self.addListener(document.getElementById(dsListBoxId), "change", function () {
            self.properties.threshold.datasourceIdx = this.selectedIndex;

            // updates observable listbox
            self.loadObservable(dsListBoxId,observableListBoxId);
        });

        self.addListener(document.getElementById(observableListBoxId), "change", function () {
            self.properties.threshold.observableIdx = this.selectedIndex;

            // updates uom
            self.loadUom(observableListBoxId,thresholdInputId);
        });

        var defaultIconInputElt = document.getElementById(defaultIconInputId);
        this.addListener(defaultIconInputElt, "change", this.inputFileHandlerAsBinaryString.bind(defaultIconInputElt,function(result) {
            self.properties.threshold.default = result;
        }));

        this.addListener(defaultIconInputElt.nextElementSibling, "paste", this.inputFilePasteHandler.bind(defaultIconInputElt.nextElementSibling,function(result) {
            self.properties.threshold.default = result;
        }));

        var lowIconInputElt = document.getElementById(lowIconInputId);
        this.addListener(lowIconInputElt, "change", this.inputFileHandlerAsBinaryString.bind(lowIconInputElt,function(result) {
            self.properties.threshold.low = result;
        }));

        this.addListener(lowIconInputElt.nextElementSibling, "paste", this.inputFilePasteHandler.bind(lowIconInputElt.nextElementSibling,function(result) {
            self.properties.threshold.low = result;
        }));

        var highIconInputElt = document.getElementById(highIconInputId);
        this.addListener(highIconInputElt, "change", this.inputFileHandlerAsBinaryString.bind(highIconInputElt,function(result) {
            self.properties.threshold.high = result;
        }));

        this.addListener(highIconInputElt.nextElementSibling, "paste", this.inputFilePasteHandler.bind(highIconInputElt.nextElementSibling,function(result) {
            self.properties.threshold.high = result;
        }));

        this.addListener(document.getElementById(thresholdInputId), "change", function () {
            self.properties.threshold.value = this.value;
        });

        // edit values
        if(!isUndefinedOrNull(defaultProperties)) {
            this.setInputFileValue(defaultIconInputElt,defaultProperties.default);
            this.setInputFileValue(lowIconInputElt,defaultProperties.low);
            this.setInputFileValue(highIconInputElt,defaultProperties.high);
            document.getElementById(thresholdInputId).value = defaultProperties.value;

            this.properties.threshold.default = defaultProperties.default;
            this.properties.threshold.low = defaultProperties.low;
            this.properties.threshold.high = defaultProperties.high;
            this.properties.threshold.value = defaultProperties.value;

            var dsSelectTag = document.getElementById(dsListBoxId);

            for(var i=0; i < dsSelectTag.options.length;i++) {
                var currentOption = dsSelectTag.options[i];

                if(currentOption.object.id === defaultProperties.datasourceId) {
                    currentOption.setAttribute("selected","");
                    this.properties.threshold.datasourceIdx = i;
                    break;
                }
            }

            this.loadObservable(dsListBoxId,observableListBoxId,thresholdInputId);

            var obsSelectTag = document.getElementById(observableListBoxId);
            obsSelectTag.options[defaultProperties.observableIdx].setAttribute("selected","");

            this.properties.threshold.observableIdx = defaultProperties.observableIdx;
        }
    },

    addCustom:function(textContent) {
        this.properties = {
            custom: {}
        };

        var defaultValue = "";

        if(!isUndefinedOrNull(textContent)) {
            defaultValue = textContent;
        }

        this.textareaId = OSH.Utils.createJSEditor(this.content,defaultValue);
    },

    addMap : function(defaultProperties) {

    },

    getProperties:function() {
        var stylerProperties = {
            properties: {
                ui: {
                    icon: {}
                }
            }
        };

        var dsIdsArray = [];

        for (var key in this.options.datasources) {
            dsIdsArray.push(this.options.datasources[key].id);
        }

        if (!isUndefinedOrNull(this.properties.fixed)) {
            OSH.Asserts.checkObjectPropertyPath(this.properties,"fixed");

            // DEFAULT ICON
            stylerProperties.properties.ui.icon.fixed = {};

            OSH.Asserts.checkObjectPropertyPath(this.properties,"fixed.default.url");

            var defaultIconProps = OSH.UI.Styler.Factory.getFixedIcon(dsIdsArray,this.properties.fixed.default.url);

            OSH.Utils.copyProperties(defaultIconProps,stylerProperties.properties);

            stylerProperties.properties.icon = defaultIconProps.icon;

            // UI
            stylerProperties.properties.ui.icon.fixed.default = this.properties.fixed.default;

            // SELECTED ICON
            //TODO: replace selected way
            if(OSH.Utils.hasOwnNestedProperty(this.properties,"fixed.selected")) {

                OSH.Asserts.checkObjectPropertyPath(this.properties,"fixed.selected");

                if(!isUndefinedOrNull(this.properties.fixed.selected)) {

                    var selectedIconProps = OSH.UI.Styler.Factory.getSelectedIconFunc(
                        dsIdsArray,
                        this.properties.fixed.default.url,
                        this.properties.fixed.selected.url
                    );

                    OSH.Utils.copyProperties(selectedIconProps, stylerProperties.properties);

                    stylerProperties.properties.icon = selectedIconProps.icon;

                    // UI
                    stylerProperties.properties.ui.icon.fixed.selected = this.properties.fixed.selected;
                }
            }
        } else if (!isUndefinedOrNull(this.properties.custom)) {
            OSH.Asserts.checkObjectPropertyPath(this.properties,"custom");

            stylerProperties.properties.ui.icon.custom = {};
            var textContent = document.getElementById(this.textareaId).value;

            var iconFuncProps = OSH.UI.Styler.Factory.getCustomIconFunc(
                dsIdsArray, // ds array ids
                textContent //iconFnStr
            );

            OSH.Utils.copyProperties(iconFuncProps,stylerProperties.properties);

            // UI
            stylerProperties.properties.ui.icon.custom = textContent;

        } else if (!isUndefinedOrNull(this.properties.threshold)) {
            stylerProperties.properties.ui.icon.threshold = {};

            OSH.Asserts.checkObjectPropertyPath(this.properties,"threshold");

            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.observableIdx);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.datasourceIdx);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.default);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.low);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.high);
            OSH.Asserts.checkIsDefineOrNotNull(this.properties.threshold.value);

            //dataSourceIdsArray,datasource, observableIdx,
            //defaultIconArrayBuffer, lowIconArrayBuffer, highIconArrayBuffer, thresholdValue
            var currentDatasource = this.options.datasources[this.properties.threshold.datasourceIdx];

            var iconFuncProps = OSH.UI.Styler.Factory.getThresholdIcon(
                currentDatasource,
                this.properties.threshold.observableIdx,
                this.properties.threshold.default.url,
                this.properties.threshold.low.url,
                this.properties.threshold.high.url,
                this.properties.threshold.value
            );

            OSH.Utils.copyProperties(iconFuncProps,stylerProperties.properties);

            stylerProperties.properties.icon = iconFuncProps.icon;

            // UI
            stylerProperties.properties.ui.icon.threshold.default = this.properties.threshold.default;
            stylerProperties.properties.ui.icon.threshold.low = this.properties.threshold.low;
            stylerProperties.properties.ui.icon.threshold.high = this.properties.threshold.high;
            stylerProperties.properties.ui.icon.threshold.value = this.properties.threshold.value;
            stylerProperties.properties.ui.icon.threshold.observableIdx = this.properties.threshold.observableIdx;
            stylerProperties.properties.ui.icon.threshold.datasourceId = currentDatasource.id;
        } else {
            delete stylerProperties.properties.icon; // remove icon properties from result
        }
        return stylerProperties;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.LocationPanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        var self = this;

        this.contentElt = document.createElement("div");
        this.elementDiv.appendChild(this.contentElt);

        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.contentElt,"Default location");


        var xDefaultValue = "";
        var yDefaultValue = "";
        var zDefaultValue = "";

        // inits default values
        if(OSH.Utils.hasOwnNestedProperty(this.styler, "location")) {
            // default location
            xDefaultValue = this.styler.location.x;
            yDefaultValue = this.styler.location.y;
            zDefaultValue = this.styler.location.z;
        }

        this.xDefaultInputId = OSH.Helper.HtmlHelper.addInputText(this.contentElt, "X", xDefaultValue,"0.0");
        this.yDefaultInputId = OSH.Helper.HtmlHelper.addInputText(this.contentElt, "Y", yDefaultValue,"0.0");
        this.zDefaultInputId = OSH.Helper.HtmlHelper.addInputText(this.contentElt, "Z", zDefaultValue,"0.0");

        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.contentElt,"Mapping");

        // load existing values if any
        // load UI settings

        if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.location.locationFuncMapping") ||
            !OSH.Utils.hasOwnNestedProperty(this.styler, "properties.locationFunc")) {
            this.initMappingFunctionUI();
        } else {
            this.initCustomFunctionUI();
        }
    },

    initMappingFunctionUI:function() {
        // data source
        var dsName = [];

        if (!isUndefinedOrNull(this.options.datasources)) {
            for (var i = 0; i < this.options.datasources.length; i++) {
                dsName.push(this.options.datasources[i].name);
            }
        }

        // add UIs
        this.dsListBoxId     = OSH.Helper.HtmlHelper.addHTMLListBox(this.contentElt, "Data Source", dsName);
        this.xInputMappingId = OSH.Helper.HtmlHelper.addHTMLListBox(this.contentElt, "X", []);
        this.yInputMappingId = OSH.Helper.HtmlHelper.addHTMLListBox(this.contentElt, "Y", []);
        this.zInputMappingId = OSH.Helper.HtmlHelper.addHTMLListBox(this.contentElt, "Z", []);

        var self = this;

        // adds default values
        if(!isUndefinedOrNull(this.options.datasources) && this.options.datasources.length > 0) {

            if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.location.locationFuncMapping")) {
                var datasourceIdx = -1;
                for (var i = 0; i < this.options.datasources.length; i++) {
                    if(this.options.datasources[i].id === this.styler.properties.ui.location.locationFuncMapping.datasourceId) {
                        datasourceIdx = i;
                        break;
                    }
                }
                if(datasourceIdx > -1) {
                    document.getElementById(this.dsListBoxId).options.selectedIndex = datasourceIdx;

                    this.loadDatasources();

                    document.getElementById(this.xInputMappingId).options.selectedIndex = this.styler.properties.ui.location.locationFuncMapping.xIdx;
                    document.getElementById(this.yInputMappingId).options.selectedIndex = this.styler.properties.ui.location.locationFuncMapping.yIdx;
                    document.getElementById(this.zInputMappingId).options.selectedIndex = this.styler.properties.ui.location.locationFuncMapping.zIdx;
                }
            } else {
               this.loadDatasources();
            }
        }

        this.addListener(document.getElementById(this.dsListBoxId), "change", function () {
            // updates observables { x,y,z} listbox
            var observables = self.getObservable(self.dsListBoxId);
            self.loadMapLocation(observables,self.xInputMappingId,self.yInputMappingId,self.zInputMappingId);
        });
    },

    loadDatasources:function() {
        // updates observables { x,y,z} listbox
        var observables = this.getObservable(this.dsListBoxId);
        this.loadMapLocation(observables,this.xInputMappingId,this.yInputMappingId,this.zInputMappingId);
    },

    loadMapLocation:function(observableArr,xInputMappingId,yInputMappingId,zInputMappingId) {
        var xInputTag = document.getElementById(xInputMappingId);
        var yInputTag = document.getElementById(yInputMappingId);
        var zInputTag = document.getElementById(zInputMappingId);

        OSH.Helper.HtmlHelper.removeAllFromSelect(xInputMappingId);
        OSH.Helper.HtmlHelper.removeAllFromSelect(yInputMappingId);
        OSH.Helper.HtmlHelper.removeAllFromSelect(zInputMappingId);

        if(!isUndefinedOrNull(observableArr)) {
            for (var i=0;i < observableArr.length;i++) {

                // x
                var option = document.createElement("option");
                option.text = observableArr[i].uiLabel;
                option.value = observableArr[i].uiLabel;

                xInputTag.add(option);

                // y
                option = document.createElement("option");
                option.text = observableArr[i].uiLabel;
                option.value = observableArr[i].uiLabel;

                yInputTag.add(option);

                // z
                option = document.createElement("option");
                option.text = observableArr[i].uiLabel;
                option.value = observableArr[i].uiLabel;

                zInputTag.add(option);
            }
        }
    },

    initCustomFunctionUI:function() {
        this.textareaId = OSH.Utils.createJSEditor(this.contentElt,this.styler.properties.locationFunc.handler.toSource());
    },

    /**
     * Returns the properties as JSON object.
     *
     * @example {
     *  ui : {
     *      location : {
     *      }
     *  },
     *
     *  location : {...}, // if any
     *
     *  locationFunc: {...} // if any
     * }
     */
    getProperties:function() {
        var stylerProperties = {
            properties: {
                ui: {
                    location: {}
                }
            }
        };

        var locationFuncProps,  defaultLocationProps;


        // default location x,y,z
        defaultLocationProps = OSH.UI.Styler.Factory.getLocation(
            Number(document.getElementById(this.xDefaultInputId).value),
            Number(document.getElementById(this.yDefaultInputId).value),
            Number(document.getElementById(this.zDefaultInputId).value)
        );

        // mapping function with data
        if(isUndefinedOrNull(this.textareaId)) {
            var xIdx=0,yIdx=0,zIdx=0;

            if (!isUndefinedOrNull(this.options.datasources) && this.options.datasources.length > 0) {
                xIdx = document.getElementById(this.xInputMappingId).selectedIndex;
                yIdx = document.getElementById(this.yInputMappingId).selectedIndex;
                zIdx = document.getElementById(this.zInputMappingId).selectedIndex;

                locationFuncProps = OSH.UI.Styler.Factory.getLocationFunc(
                    this.options.datasources[document.getElementById(this.dsListBoxId).selectedIndex], //datasource
                    xIdx, yIdx, zIdx); // obs indexes

                stylerProperties.properties.ui.location.locationFuncMapping = {
                    datasourceId: this.options.datasources[document.getElementById(this.dsListBoxId).selectedIndex].id,
                    xIdx: xIdx,
                    yIdx: yIdx,
                    zIdx: zIdx
                };
            }

        } else {
            // custom textual function
            var textContent = document.getElementById(this.textareaId).value;

            locationFuncProps = OSH.UI.Styler.Factory.getCustomLocationFunc(
                this.styler, //datasource array
                document.getElementById(this.textareaId).value //locationFnStr
            );

            stylerProperties.properties.ui.location.custom = textContent;
        }


        // copy default location properties
        OSH.Utils.copyProperties(defaultLocationProps, stylerProperties.properties);

        // copy location function properties if any
        if (!isUndefinedOrNull(locationFuncProps)) {
            OSH.Utils.copyProperties(locationFuncProps, stylerProperties.properties);
        }

        return stylerProperties;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.VideoPanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },

    initPanel:function() {
        var self = this;

        this.contentElt = document.createElement("div");
        this.elementDiv.appendChild(this.contentElt);


        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.contentElt,"Mapping");

        // load existing values if any
        // load UI settings

        var hasUIProps = OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.video");
        if(hasUIProps ||
            !OSH.Utils.hasOwnNestedProperty(this.styler, "properties.frameFunc")) { //TODO: the view should not know about function name "frameFunc"
            if(hasUIProps){
                this.initMappingFunctionUI(this.styler.properties.ui.video);
            } else {
                this.initMappingFunctionUI();
            }

        } else {
            //this.initCustomFunctionUI();
        }
    },

    initMappingFunctionUI:function(properties) {
        this.properties = {
            frame : {
                datasourceIdx: null,
                observableIdx: null
            }
        };

        // data source
        var dsName = [];

        if (!isUndefinedOrNull(this.options.datasources)) {
            for (var i = 0; i < this.options.datasources.length; i++) {
                dsName.push(this.options.datasources[i].name);
            }
        }

        if(this.options.datasources.length > 0) {
            this.properties.frame.datasourceIdx = 0;
        }

        this.dsListBoxId = OSH.Helper.HtmlHelper.addHTMLObjectWithLabelListBox(this.contentElt, "Data Source", this.options.datasources);
        this.observableListBoxId = OSH.Helper.HtmlHelper.addHTMLListBox(this.contentElt, "Observable", []);

        if(!this.loadObservable(this.dsListBoxId,this.observableListBoxId)) {
            this.properties.frame.observableIdx = 0;
        }

        // edit values
        var self = this;
        if(!isUndefinedOrNull(properties)) {
            OSH.Helper.HtmlHelper.onDomReady(function () {
                var dsTag = document.getElementById(self.dsListBoxId);

                var idx = -1;
                for(var i=0; i < dsTag.options.length;i++) {
                    if(dsTag.options[i].object.id === properties.datasourceId) {
                        idx = i;
                        break;
                    }
                }
                if(idx > -1) {
                    dsTag.options.selectedIndex = idx;
                    document.getElementById(self.observableListBoxId).options.selectedIndex = properties.observableIdx;
                }
            });
        }
    },

    getProperties:function() {
        var stylerProperties = {
            properties: {
                ui: {
                    video: {}
                }
            }
        };

        var dsIdsArray = [];

        for (var key in this.options.datasources) {
            dsIdsArray.push(this.options.datasources[key].id);
        }

        stylerProperties.properties.ui.video = {};

        OSH.Asserts.checkObjectPropertyPath(this.properties,"frame");
        OSH.Asserts.checkIsDefineOrNotNull(this.properties.frame.observableIdx);
        OSH.Asserts.checkIsDefineOrNotNull(this.properties.frame.datasourceIdx);

        var dsSelectedIdx = document.getElementById(this.dsListBoxId).options.selectedIndex;

        var currentDatasource = this.options.datasources[dsSelectedIdx];


        var observableIdx = document.getElementById(this.observableListBoxId).options.selectedIndex;

        var videoFuncProps = OSH.UI.Styler.Factory.getVideoFunc(
            currentDatasource,
            observableIdx
        );

        // copy function into properties
        OSH.Utils.copyProperties(videoFuncProps,stylerProperties.properties);

        // UI
        stylerProperties.properties.ui.video.observableIdx = observableIdx;
        stylerProperties.properties.ui.video.datasourceId = currentDatasource.id;

        return stylerProperties;
    }

});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.Panel.XYPanel = OSH.UI.Panel.StylerPanel.extend({
    initialize:function(parentElementDivId, options) {
        this._super(parentElementDivId, options);
    },
    initPanel:function() {
        var self = this;

        this.contentElt = document.createElement("div");
        this.elementDiv.appendChild(this.contentElt);

        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.contentElt,"Default values");


        var xDefaultValue = "";
        var yDefaultValue = "";
        var zDefaultValue = "";

        // inits default values
        if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.values.default")) {
            // default values
            xDefaultValue = this.styler.properties.ui.values.default.x;
            yDefaultValue = this.styler.properties.ui.values.default.y;
        }

        this.xDefaultInputId = OSH.Helper.HtmlHelper.addInputText(this.contentElt, "X", xDefaultValue,"0.0");
        this.yDefaultInputId = OSH.Helper.HtmlHelper.addInputText(this.contentElt, "Y", yDefaultValue,"0.0");

        OSH.Helper.HtmlHelper.addHTMLTitledLine(this.contentElt,"Mapping");

        // load existing values if any
        // load UI settings

        if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.values.valuesFuncMapping") ||
            !OSH.Utils.hasOwnNestedProperty(this.styler, "properties.valuesFunc")) {
            this.initMappingFunctionUI();
        } else {
            this.initCustomFunctionUI();
        }
    },

    initMappingFunctionUI:function() {
        // data source
        var dsName = [];

        if (!isUndefinedOrNull(this.options.datasources)) {
            for (var i = 0; i < this.options.datasources.length; i++) {
                dsName.push(this.options.datasources[i].name);
            }
        }

        // add UIs
        this.dsListBoxId     = OSH.Helper.HtmlHelper.addHTMLListBox(this.contentElt, "Data Source", dsName);
        this.xInputMappingId = OSH.Helper.HtmlHelper.addHTMLListBox(this.contentElt, "X", []);
        this.yInputMappingId = OSH.Helper.HtmlHelper.addHTMLListBox(this.contentElt, "Y", []);

        var self = this;

        // adds default values
        if(!isUndefinedOrNull(this.options.datasources) && this.options.datasources.length > 0) {

            if(OSH.Utils.hasOwnNestedProperty(this.styler, "properties.ui.values.valuesFuncMapping")) {
                var datasourceIdx = -1;
                for (var i = 0; i < this.options.datasources.length; i++) {
                    if(this.options.datasources[i].id === this.styler.properties.ui.values.valuesFuncMapping.datasourceId) {
                        datasourceIdx = i;
                        break;
                    }
                }
                if(datasourceIdx > -1) {
                    document.getElementById(this.dsListBoxId).options.selectedIndex = datasourceIdx;

                    this.loadDatasources();

                    document.getElementById(this.xInputMappingId).options.selectedIndex = this.styler.properties.ui.values.valuesFuncMapping.xIdx;
                    document.getElementById(this.yInputMappingId).options.selectedIndex = this.styler.properties.ui.values.valuesFuncMapping.yIdx;
                }
            } else {
                this.loadDatasources();
            }
        }

        this.addListener(document.getElementById(this.dsListBoxId), "change", function () {
            // updates observables { x,y,z} listbox
            var observables = self.getObservable(self.dsListBoxId);
            self.loadMapValues(observables,self.xInputMappingId,self.yInputMappingId);
        });
    },

    loadDatasources:function() {
        // updates observables { x,y,z} listbox
        var observables = this.getObservable(this.dsListBoxId);
        this.loadMapValues(observables,this.xInputMappingId,this.yInputMappingId);
    },

    loadMapValues:function(observableArr,xInputMappingId,yInputMappingId) {
        var xInputTag = document.getElementById(xInputMappingId);
        var yInputTag = document.getElementById(yInputMappingId);

        OSH.Helper.HtmlHelper.removeAllFromSelect(xInputMappingId);
        OSH.Helper.HtmlHelper.removeAllFromSelect(yInputMappingId);

        if(!isUndefinedOrNull(observableArr)) {
            for (var i=0;i < observableArr.length;i++) {

                // x
                var option = document.createElement("option");
                option.text = observableArr[i].uiLabel;
                option.value = observableArr[i].uiLabel;

                xInputTag.add(option);

                // y
                option = document.createElement("option");
                option.text = observableArr[i].uiLabel;
                option.value = observableArr[i].uiLabel;

                yInputTag.add(option);
            }
        }
    },

    initCustomFunctionUI:function() {
        this.textareaId = OSH.Utils.createJSEditor(this.contentElt,this.styler.properties.valuesFunc.handler.toSource());
    },

    /**
     * Returns the properties as JSON object.
     *
     * @example {
     *  ui : {
     *      values : {
     *      }
     *  },
     *
     *  values : {...}, // if any
     *
     *  valuesFunc: {...} // if any
     * }
     */
    getProperties:function() {
        var stylerProperties = {
            properties: {
                ui: {
                    values: {}
                }
            },
            values: {}
        };

        var valuesFuncProps,fixedValuesProps;

        // default values x,y
        fixedValuesProps = OSH.UI.Styler.Factory.getValues(
            Number(document.getElementById(this.xDefaultInputId).value),
            Number(document.getElementById(this.yDefaultInputId).value)
        );

        // update ui property
        stylerProperties.properties.ui.values.default = {
            x: Number(document.getElementById(this.xDefaultInputId).value),
            y: Number(document.getElementById(this.yDefaultInputId).value)
        };

        // mapping function with data
        if(isUndefinedOrNull(this.textareaId)) {
            var xIdx=0,yIdx=0;

            if (!isUndefinedOrNull(this.options.datasources) && this.options.datasources.length > 0) {
                xIdx = document.getElementById(this.xInputMappingId).selectedIndex;
                yIdx = document.getElementById(this.yInputMappingId).selectedIndex;

                valuesFuncProps = OSH.UI.Styler.Factory.getValuesFunc(
                    this.options.datasources[document.getElementById(this.dsListBoxId).selectedIndex], //datasource
                    xIdx, yIdx); // obs indexes

                stylerProperties.properties.ui.values.valuesFuncMapping = {
                    datasourceId: this.options.datasources[document.getElementById(this.dsListBoxId).selectedIndex].id,
                    xIdx: xIdx,
                    yIdx: yIdx
                };
            }
        } else {
            // custom textual function
            var textContent = document.getElementById(this.textareaId).value;

            valuesFuncProps = OSH.UI.Styler.Factory.getCustomValuesFunc(
                this.styler, //datasource array
                document.getElementById(this.textareaId).value //valuesFnStr
            );

            stylerProperties.properties.ui.values.custom = textContent;
        }


        // copy default values properties
        OSH.Utils.copyProperties(fixedValuesProps, stylerProperties);

        // copy values function properties if any
        if (!isUndefinedOrNull(valuesFuncProps)) {
            OSH.Utils.copyProperties(valuesFuncProps, stylerProperties.properties);
        }

        return stylerProperties;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This class creates a log view. It catches "osh:log" events and display them into a internal dialog.
 * This view creates a dialog view
 * @class
 * @deprecated
 */
OSH.Log = BaseClass.extend({
    initialize:function(){
        this.logDiv = document.createElement("TEXTAREA");
        this.logDiv.setAttribute("class", "osh-log popup-content");
        this.logDiv.setAttribute("wrap","off");
        this.first = true;
        // appends <div> tag to <body>
        document.observe("dom:loaded", function() {
            var dialog = new OSH.UI.DialogPanel({
                title: "Logging console"
            });
            /*dialog.appendContent(this.logDiv);
            dialog.setContentSize("300px","400px");

            this.logDiv.value = "[osh-log]> \n";*/
        }.bind(this));

        document.observe("osh:log", function(event) {
            if(this.first) {
                this.logDiv.value = "[osh-log]> " + event.memo + "\n";
                this.first = false;
            } else {
                this.logDiv.value += "[osh-log]> " + event.memo + "\n";
            }
        }.bind(this));
    }
});

//var log = new OSH.Log();
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


/**
 * @classdesc The abstract object to represent a view.
 * @class
 * @param {Object} parentElementDivId - The parent html element div id to attach/or create the view.
 * @param {string} viewItems - The list of view items
 * @param {string} options - The options
 * @abstract
 */
OSH.UI.View = OSH.UI.Panel.extend({
    initialize: function (parentElementDivId, viewItems,options) {
        this._super(parentElementDivId, options);
        // list of stylers
        this.stylers = [];
        this.contextMenus = [];
        this.viewItems = [];
        this.names = {};
        this.stylerToObj = {};
        this.stylerIdToStyler = {};
        this.lastRec = {};
        this.stylerIdToDatasources = {};

        //this.divId = divId;
        this.id = "view-" + OSH.Utils.randomUUID();
        this.name = this.id;
        this.type = this.getType();

        if(typeof(options) !== "undefined" && typeof(options.cssSelected) !== "undefined") {
            this.cssSelected = options.cssSelected;
        }

        // inits the view before adding the viewItem
        this.init(parentElementDivId,viewItems,options);
    },


    /**
     * Inits the view component.
     * @param parentElementDivId The parent html element object to attach/create the view
     * @param viewItems the list of items to add
     * @param options [TODO]
     * @memberof OSH.UI.View
     */
    init:function(parentElementDivId,viewItems,options) {
        if(!isUndefinedOrNull(options)) {
            this.options = options;

            if(!isUndefinedOrNull(options.entityId)) {
                this.entityId = options.entityId;
            }

            if(!isUndefinedOrNull(options.name)) {
                this.name = options.name;
            }
        } else {
            this.options = {};
        }
        this.css = "view";

        this.cssSelected = "";

        if(!isUndefinedOrNull(options)) {
            if(!isUndefinedOrNull(options.css)) {
                this.css += " "+options.css;
            }

            if(!isUndefinedOrNull(options.cssSelected)) {
                this.cssSelected = options.cssSelected;
            }
        }

        OSH.Utils.addCss(this.elementDiv,this.css);

        var div = document.getElementById(parentElementDivId);

        if (typeof(div) === "undefined" || div === null) {
            document.body.appendChild(this.elementDiv);
            this.hide();
            this.container = document.body;
        } else {
            div.appendChild(this.elementDiv);
            this.container = div;
        }

        this.beforeAddingItems(options);

        if (typeof (viewItems) !== "undefined") {
            for (var i =0;i < viewItems.length;i++) {
                this.addViewItem(viewItems[i]);
            }
        }

        if(typeof (options) !== "undefined") {
            if(typeof (options.show) !== "undefined") {
                document.getElementById(this.divId).style.display = (options.show)? "block": "none";
            }
        }
        this.handleEvents();

        var self = this;
        var observer = new MutationObserver( function( mutations ){
            mutations.forEach( function( mutation ){
                // Was it the style attribute that changed? (Maybe a classname or other attribute change could do this too? You might want to remove the attribute condition) Is display set to 'none'?
                if( mutation.attributeName === 'style') {
                    self.onResize();
                }
            });
        } );

        // Attach the mutation observer to blocker, and only when attribute values change
        observer.observe( this.elementDiv, { attributes: true } );

        this.updateKeepRatio();
    },

    updateKeepRatio:function() {
        var contains = OSH.Utils.containsCss(this.elementDiv,"keep-ratio-w");

        if(this.options.keepRatio && !contains) {
            OSH.Utils.addCss(this.elementDiv,"keep-ratio-w");
        } else if(!this.options.keepRatio &&  contains) {
            OSH.Utils.removeCss(this.elementDiv,"keep-ratio-w");
        }
    },

    /**
     * @instance
     * @memberof OSH.UI.View
     */
    hide: function() {
        this.elementDiv.style.display = "none";
    },

    /**
     *
     * @param options
     * @instance
     * @memberof OSH.UI.View
     */
    beforeAddingItems: function (options) {

    },

    /**
     *
     * @returns {string|*}
     * @instance
     * @memberof OSH.UI.View
     */
    getId: function () {
        return this.id;
    },

    /**
     *
     * @returns {string|*}
     * @instance
     * @memberof OSH.UI.View
     */
    getDivId: function () {
        return this.divId;
    },

    /**
     *
     * @param dataSourceId
     * @param data
     * @instance
     * @memberof OSH.UI.View
     */
    setData: function(dataSourceId,data) {},

    /**
     * Add viewItem to the view
     * @param viewItem
     * @instance
     * @memberof OSH.UI.View
     */
    addViewItem: function (viewItem) {
        OSH.Asserts.checkIsDefineOrNotNull(viewItem);

        this.viewItems.push(viewItem);
        if (viewItem.hasOwnProperty("styler")) {
            var styler = viewItem.styler;
            this.stylers.push(styler);
            if (viewItem.hasOwnProperty("name")) {
                this.names[styler.getId()] = viewItem.name;
            }
            styler.init(this);
            styler.viewItem = viewItem;
            this.stylerIdToStyler[styler.id] = styler;

            this.observeDatasourceStyler(viewItem,styler);
        }
        if (viewItem.hasOwnProperty("contextmenu")) {
            this.contextMenus.push(viewItem.contextmenu);
        }
    },

    observeDatasourceStyler:function(viewItem) {
        OSH.Asserts.checkIsDefineOrNotNull(viewItem);
        OSH.Asserts.checkIsDefineOrNotNull(viewItem.styler);

        var styler = viewItem.styler;

        var ds = styler.getDataSourcesIds();

        if(!( styler.id in this.stylerIdToDatasources)) {
            this.stylerIdToDatasources[styler.id] = [];
        }
        for(var i =0; i < ds.length;i++) {
            var dataSourceId = ds[i];

            var idx = this.stylerIdToDatasources[styler.id].indexOf(dataSourceId);

            if(idx === -1) {
                this.stylerIdToDatasources[styler.id].push(dataSourceId);
                // observes the data come in
                this.observeViewItemData(dataSourceId,viewItem);
                this.observeViewItemSelectedData(dataSourceId,viewItem);
            }
        }
    },

    observeViewItemData:function(dataSourceId,viewItem){
        var view = this;

        OSH.EventManager.observe(OSH.EventManager.EVENT.DATA + "-" + dataSourceId,function(event){
            // skip data reset events for now
                if (event.reset)
                    return;

            viewItem.styler.setData(dataSourceId, event.data, view, {
                selected: viewItem.styler.selected
            });

            view.lastRec[dataSourceId] = event.data;
        });
    },

    observeViewItemSelectedData:function(datasourceBindId,viewItem,event) {
        var view = this;

        OSH.EventManager.observe(OSH.EventManager.EVENT.SELECT_VIEW,function(event){
            var selected = false;
            if(!isUndefinedOrNull(event.entityId)) {
                selected = (viewItem.entityId === event.entityId);
            } else {
                //TODO:intersection algo
                //TODO/BUG: from styler.getDataSourceIds()
                // it seems the viewItem.styler instance does not have this function while using the entityEditor
                var stylerDsIds = [];
                for ( var i in viewItem.styler.dataSourceToStylerMap) {
                    stylerDsIds.push(i);
                }

                //var stylerDsIds = viewItem.styler.getDataSourcesId();
                for(var i =0; i < stylerDsIds.length;i++) {
                    if(event.dataSourcesIds.indexOf(stylerDsIds[i]) > -1) {
                        selected = true;
                        break;
                    }
                }
            }

            viewItem.styler.selected = selected;

            if (datasourceBindId in view.lastRec) {
                viewItem.styler.setData(datasourceBindId, view.lastRec[datasourceBindId], view, {
                    selected: selected
                });
            }
        });
    },

    /**
     * Remove viewItem to the view
     * @param viewItem
     * @instance
     * @memberof OSH.UI.View
     */
    removeViewItem: function (viewItem) {
        OSH.Asserts.checkIsDefineOrNotNull(viewItem);

        var idx = -1;
        for(var i=0;i < this.viewItems.length;i++) {
            if(this.viewItems[i].id === viewItem.id) {
                idx = i;
                break;
            }
        }

        if (idx > -1) {
            if(!isUndefinedOrNull(viewItem.styler)) {
                var viewItemToRemove = this.viewItems[idx];
                var idxStyler = -1;
                for (var i = 0; i < this.stylers.length; i++) {
                    if (this.stylers[i].id === viewItemToRemove.styler.id) {
                        idxStyler = i;
                        break;
                    }
                }

                if (idxStyler > -1) {
                    viewItem.styler.remove(this);

                    this.stylers.splice(idxStyler, 1);
                    delete this.stylerIdToStyler[viewItemToRemove.styler.id];
                }
            }
            this.viewItems.splice(idx, 1);
        }
    },

    updateViewItem: function (viewItem) {
        OSH.Asserts.checkIsDefineOrNotNull(viewItem);

        for(var i=0;i < this.viewItems.length;i++) {
            if(this.viewItems[i].id === viewItem.id) {
                // update styler
                if(!isUndefinedOrNull(this.viewItems[i].styler)) {
                    this.viewItems[i].styler.update(this);
                    this.removeOldViewItemsDatasource(this.viewItems[i]);
                    // observe datasource
                    this.observeDatasourceStyler(this.viewItems[i]);
                }
                break;
            }
        }
    },

    removeOldViewItemsDatasource:function(viewItem) {
        OSH.Asserts.checkIsDefineOrNotNull(viewItem);
        OSH.Asserts.checkIsDefineOrNotNull(viewItem.styler);

        var currentDsIds = this.stylerIdToDatasources[viewItem.styler.id];
        var newDs = viewItem.styler.getDataSourcesIds();

        for(var key in currentDsIds) {
            var currentDsId = currentDsIds[key];

            if (newDs.indexOf(currentDsId) === -1) {
                // remove observe event
                OSH.EventManager.remove(OSH.EventManager.EVENT.DATA + "-" + currentDsId);
            }
        }
    },

    /**
     * @instance
     * @memberof OSH.UI.View
     */
    handleEvents: function() {
        this._super();
        // observes the selected event
        OSH.EventManager.observe(OSH.EventManager.EVENT.SELECT_VIEW,function(event){
            this.selectDataView(event.dataSourcesIds,event.entityId);
        }.bind(this));

        // deprecated
        OSH.EventManager.observe(OSH.EventManager.EVENT.ADD_VIEW_ITEM,function(event){
            if(typeof event.viewId !== "undefined" && event.viewId === this.id) {
                this.addViewItem(event.viewItem);
            }
        }.bind(this));

        // new version including the id inside the event id
        OSH.EventManager.observe(OSH.EventManager.EVENT.ADD_VIEW_ITEM+"-"+this.id,function(event){
            this.addViewItem(event.viewItem);
        }.bind(this));

        // new version including the id inside the event id
        OSH.EventManager.observe(OSH.EventManager.EVENT.REMOVE_VIEW_ITEM+"-"+this.id,function(event){
            this.removeViewItem(event.viewItem);
        }.bind(this));

        // new version including the id inside the event id
       /* OSH.EventManager.observe(OSH.EventManager.EVENT.UPDATE_VIEW_ITEM+"-"+this.id,function(event){
            this.updateViewItem(event.viewItem);
        }.bind(this));*/
    },

    selectDataView:function() {},

    /**
     *
     * @returns {Array}
     * @instance
     * @memberof OSH.UI.View
     */
    getDataSourcesId: function() {
        var res = [];

        // check for stylers
        for(var i = 0; i < this.viewItems.length;i++) {
            var viewItem = this.viewItems[i];
            if (viewItem.hasOwnProperty("styler")) {
                var styler = viewItem.styler;
                res = res.concat(styler.getDataSourcesIds());
            }
        }

        return res;
    },

    /**
     * @instance
     * @memberof OSH.UI.View
     */
    reset: function() {
    },

    getType: function()  {
        return OSH.UI.View.ViewType.UNDEFINED;
    },

    updateProperties:function(properties) {
        if (!isUndefinedOrNull(properties)) {
            if(!isUndefinedOrNull(properties.keepRatio)) {
                this.options.keepRatio = properties.keepRatio;
                this.updateKeepRatio();
            }
        }
    }
});

OSH.UI.View.ViewType = {
    MAP: "map",
    VIDEO: "video",
    CHART: "chart",
    ENTITY_TREE:"entity_tree",
    DISCOVERY : "discovery",
    TASKING: "tasking",
    RANGE_SLIDER:"rangeSlider",
    UNDEFINED: "undefined"
};
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 *
 * @constructor
 */
OSH.UI.ViewFactory = function() {};

/**
 * This method provides a simple way to get default view properties
 * @instance
 * @memberof OSH.UI.ViewFactory
 * @param OSH.UI.ViewFactory.ViewInstanceType viewInstanceType the instance type of the view
 * @return the default properties to setup the view
 *
 */
OSH.UI.ViewFactory.getDefaultViewProperties = function(viewInstanceType){
    var props = {};

    switch (viewInstanceType) {
        case OSH.UI.ViewFactory.ViewInstanceType.LEAFLET : break;
        case OSH.UI.ViewFactory.ViewInstanceType.FFMPEG : {
            props = {
                css: "video",
                cssSelected: "video-selected",
                name: "Video",
                useWorker: true,
                useWebWorkerTransferableData: false,
                keepRatio:true
            };
            break;
        }
        case OSH.UI.ViewFactory.ViewInstanceType.MJPEG : {
            props = {
                css: "video",
                cssSelected: "video-selected",
                name: "Video",
                keepRatio:true
            };
            break;
        }
        case OSH.UI.ViewFactory.ViewInstanceType.NVD3_LINE_CHART : {
            props = {
                name: "Line chart",
                css: "chart-view",
                cssSelected: "",
                maxPoints: 30,
                initData:true
            };
            break;
        }
        default:break;
    }

    return props;
};

/**
 * Gets an instance of a view given its property and which does not contain any stylers
 * @param viewInstanceType
 * @param viewProperties
 * @param datasource
 * @param entity
 * @return {*}
 */
OSH.UI.ViewFactory.getDefaultSimpleViewInstance = function(viewInstanceType,viewProperties) {
    var cloneProperties = {};
    cloneProperties = OSH.Utils.clone(viewProperties);

    var viewInstance = null;

    switch (viewInstanceType) {
        case OSH.UI.ViewFactory.ViewInstanceType.FFMPEG : {
            viewInstance = new OSH.UI.View.FFMPEGView("",cloneProperties);
        }
        break;
        case OSH.UI.ViewFactory.ViewInstanceType.MJPEG : {
            viewInstance = new OSH.UI.View.MjpegView("",cloneProperties);
        }
            break;
        default:break;
    }

    viewInstance.id = viewProperties.id;
    viewInstance.viewInstanceType = viewInstanceType;

    return viewInstance;
};

OSH.UI.ViewFactory.getDefaultViewInstance = function(viewInstanceType, defaultProperties) {
    var viewInstance = null;

    switch (viewInstanceType) {
        case OSH.UI.ViewFactory.ViewInstanceType.FFMPEG : {
            viewInstance = new OSH.UI.View.FFMPEGView("",[],defaultProperties);
        }
            break;
        case OSH.UI.ViewFactory.ViewInstanceType.LEAFLET : {
            viewInstance = new OSH.UI.View.LeafletView("",[],defaultProperties);
        }
            break;
        case OSH.UI.ViewFactory.ViewInstanceType.CESIUM : {
            viewInstance = new OSH.UI.View.CesiumView ("",[],defaultProperties);
        }
            break;
        case OSH.UI.ViewFactory.ViewInstanceType.NVD3_LINE_CHART : {
            viewInstance = new OSH.UI.View.Nvd3LineChartView("",[],defaultProperties);
        }
            break;
        case OSH.UI.ViewFactory.ViewInstanceType.FFMPEG : {
            viewInstance = new OSH.UI.View.FFMPEGView("",[],defaultProperties);
        }
            break;
        case OSH.UI.ViewFactory.ViewInstanceType.MJPEG : {
            viewInstance = new OSH.UI.View.MjpegView("",[],defaultProperties);
        }
            break;
        default:
            break;
    }
    viewInstance.viewInstanceType = viewInstanceType;
    return viewInstance;
};

OSH.UI.ViewFactory.ViewInstanceType = {
    LEAFLET: "leaflet",
    FFMPEG:"video_h264",
    CESIUM: "cesium",
    MJPEG: "video_mjpeg",
    NVD3_LINE_CHART: "line_chart"
};
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Sensia Software LLC. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>
 Author: Alex Robin <alex.robin@sensiasoft.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.View.ChartView = OSH.UI.View.extend({

    initialize : function(parentElementDivId,viewItems, properties) {
        this._super(parentElementDivId, viewItems, properties);
    },

    getType: function()  {
        return OSH.UI.View.ViewType.CHART;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Sensia Software LLC. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>
 Author: Alex Robin <alex.robin@sensiasoft.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.View.MapView = OSH.UI.View.extend({

    initialize : function(parentElementDivId,viewItems, properties) {
        this._super(parentElementDivId, viewItems, properties);
    },

    getType: function()  {
        return OSH.UI.View.ViewType.MAP;
    },

    addMarker: function (properties) {},

    removeMarker:function() {},

    updateMarker: function (styler) {},

    addPolyline: function (properties) {},

    updatePolyline: function (styler) {},

    removePolyline:function() {}
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Sensia Software LLC. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>
 Author: Alex Robin <alex.robin@sensiasoft.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.View.TaskingView = OSH.UI.View.extend({

    initialize : function(parentElementDivId, properties) {
        this._super(parentElementDivId, [], properties);
    },

    getType: function()  {
        return OSH.UI.View.ViewType.TASKING;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Sensia Software LLC. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>
 Author: Alex Robin <alex.robin@sensiasoft.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.View.VideoView = OSH.UI.View.extend({

    initialize : function(parentElementDivId, viewItems,properties) {
        this._super(parentElementDivId, viewItems, properties);

        this.fps = 0;
        this.nbFrames = 0;
        /*
         for 1920 x 1080 @ 25 fps = 7 MB/s
         1 frame = 0.28MB
         178 frames = 50MB
         */
        this.FLUSH_LIMIT  = 200;

        this.statistics = {
            videoStartTime: 0,
            videoPictureCounter: 0,
            windowStartTime: 0,
            windowPictureCounter: 0,
            fps: 0,
            fpsMin: 1000,
            fpsMax: -1000,
            fpsSinceStart: 0
        };

        this.firstFrame = true;
    },

    init:function(parentElementDivId,viewItems,options) {
        this._super(parentElementDivId,viewItems,options);

        OSH.Utils.addCss(this.elementDiv,"video");

        this.css += " video ";

        this.options.showFps = false;
        this.options.keepRatio = false;

        if(!isUndefinedOrNull(options)) {
            // defines default options if not defined
            if (!isUndefinedOrNull(options.showFps)) {
                this.options.showFps = options.showFps;
            }
            if (!isUndefinedOrNull(options.keepRatio)) {
                this.options.keepRatio = options.keepRatio;
            }
        }

        this.updateShowFps();
    },

    updateShowFps:function() {
        var showFps = (!isUndefinedOrNull(this.options) && !isUndefinedOrNull(this.options.showFps) && this.options.showFps);

        if(showFps && isUndefinedOrNull(this.statsElt)) {

            // create stats block
            // <div id="stats-h264" class="stats"></div>
            this.statsElt = document.createElement("div");
            this.statsElt.setAttribute("class", "stats");

            // appends to root
            this.elementDiv.appendChild(this.statsElt);

            this.statsElt.innerHTML = "Fps: 0";

            var self = this;

            this.onAfterDecoded = function () {
                this.statsElt.innerHTML = "Fps: " + this.statistics.fps.toFixed(1) + "";
            };
        } else if(!showFps && !isUndefinedOrNull(this.statsElt)) {
            this.elementDiv.removeChild(this.statsElt);
            this.statsElt = null;
            this.onAfterDecoded = function () {};
        }
    },

    /**
     * @instance
     * @memberof OSH.UI.View.VideoView
     */
    updateStatistics: function () {
        this.nbFrames++;

        var s = this.statistics;
        s.videoPictureCounter += 1;
        s.windowPictureCounter += 1;
        var now = Date.now();
        if (!s.videoStartTime) {
            s.videoStartTime = now;
        }
        var videoElapsedTime = now - s.videoStartTime;
        s.elapsed = videoElapsedTime / 1000;
        if (videoElapsedTime < 1000) {
            return;
        }

        if (!s.windowStartTime) {
            s.windowStartTime = now;
            return;
        } else if ((now - s.windowStartTime) > 1000) {
            var windowElapsedTime = now - s.windowStartTime;
            var fps = (s.windowPictureCounter / windowElapsedTime) * 1000;
            s.windowStartTime = now;
            s.windowPictureCounter = 0;

            if (fps < s.fpsMin) s.fpsMin = fps;
            if (fps > s.fpsMax) s.fpsMax = fps;
            s.fps = fps;
        }

        fps = (s.videoPictureCounter / videoElapsedTime) * 1000;
        s.fpsSinceStart = fps;
    },

    /**
     * @instance
     * @memberof OSH.UI.View.VideoView
     */
    onAfterDecoded: function () {
    },

    updateFrame:function(styler) {
        if(this.firstFrame) {
            OSH.EventManager.observeDiv(this.divId,"click",function(event) {
                OSH.EventManager.fire(OSH.EventManager.EVENT.SELECT_VIEW, {
                    dataSourcesIds: styler.getDataSourcesIds(),
                    entityId: styler.viewItem.entityId
                });
            });
            this.firstFrame = false;
        }
    },

    /**
     *
     * @param dataSourceIds
     * @param entityId
     * @instance
     * @memberof OSH.UI.View.H264View
     */
    selectDataView: function(dataSourceIds,entityId) {
        var currentDataSources= this.getDataSourcesId();
        if(OSH.Utils.isArrayIntersect(dataSourceIds,currentDataSources)) {
            OSH.Utils.addCss(this.elementDiv,this.cssSelected);
        } else {
            OSH.Utils.removeCss(this.elementDiv,this.cssSelected);
        }
    },

    stopVideo:function() {

    },

    getType: function()  {
        return OSH.UI.View.ViewType.VIDEO;
    },

    updateProperties: function (properties) {
        this._super(properties);
        if (!isUndefinedOrNull(properties)) {
            if(!isUndefinedOrNull(properties.showFps)) {
                this.options.showFps = properties.showFps;
                this.updateShowFps();
            }
        }
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc This class is an abstract class for ContextMenu.
 * @abstract
 * @class OSH.UI.ContextMenu
 * @listens {@link OSH.EventManager.EVENT.CONTEXT_MENU}
 * @param {Object} properties the properties object
 * @param {string} properties.id the context menu id
 */
OSH.UI.ContextMenu = BaseClass.extend({
	initialize : function(properties) {
		if(typeof  properties != "undefined" && typeof  properties.id != "undefined") {
			this.id = properties.id;
		} else {
			this.id = "contextMenu-" + OSH.Utils.randomUUID();
		}
		this.handleEvents();
	},

	/**
	 * Shows the context menu
	 * @memberof OSH.UI.ContextMenu
	 * @instance
	 */
	show:function() {},

	/**
	 * Hides the context menu
	 * @memberof OSH.UI.ContextMenu
	 * @instance
	 */
	hide:function() {},

	/**
	 * Inits events
	 * @memberof OSH.UI.ContextMenu
	 * @instance
	 */
	handleEvents:function() {
		/*
		 * @event {@link OSH.EventManager.EVENT.CONTEXT_MENU}
		 * @type {Object}
		 * @property {Object} event
		 * @property {string} action - show | hide
		 */
		OSH.EventManager.observe(OSH.EventManager.EVENT.CONTEXT_MENU+"-"+this.id,function(event) {
			if(event.action == "show") {
				this.show(event);
			} else if(event.action == "hide") {
				this.hide();
			}
		}.bind(this));
	}
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @class
 * @classdesc A css context menu allowing to create various context menu using only css.
 * @type {OSH.UI.ContextMenu}
 * @augments OSH.UI.ContextMenu
 */
OSH.UI.ContextMenu.CssMenu = OSH.UI.ContextMenu.extend({
    initialize:function(properties,type) {
        this._super(properties);

        this.items = [];
        if(typeof(type) != "undefined") {
            this.type = type;
        } else {
            this.type = "";
        }

        if(typeof(properties) != "undefined") {
            if(typeof (properties.items) != "undefined") {
                for(var i = 0;i < properties.items.length;i++) {
                    var elId = OSH.Utils.randomUUID();
                    var htmlVar = "<a  id=\""+elId+"\" ";
                    if(typeof (properties.items[i].css) != "undefined"){
                        htmlVar += "class=\""+properties.items[i].css+"\" ";
                    }
                    var name = "";
                    if(typeof (properties.items[i].name) != "undefined") {
                        name = properties.items[i].name;
                    }
                    htmlVar += "title=\""+name+"\"";
                    htmlVar += "><span id =\""+elId+"\"class=\""+this.type+"-menu-label\">"+name+"</span><\/a>";

                    //htmlVar += "<label for=\""+elId+"\" class=\""+this.type+"-menu-label\">"+name+"</label></div>";

                    var action = "";
                    if(typeof (properties.items[i].action) != "undefined") {
                        action = properties.items[i].action;
                    }
                    var viewId = "";
                    if(typeof (properties.items[i].viewId) != "undefined") {
                        viewId = properties.items[i].viewId;
                    }
                    this.items.push({
                        html : htmlVar,
                        id : elId,
                        action : action,
                        viewId : viewId
                    })
                }
            }
        }
    },
    /**
     *
     * @param $super
     * @param {Object} properties
     * @param {number} properties.offsetX - the x offset to shift the menu
     * @param {number} properties.offsetY - the y offset to shift the menu
     * @instance
     * @memberof OSH.UI.ContextMenu.CssMenu
     */
    show:function(properties) {
        this.removeElement();
        var closeId = OSH.Utils.randomUUID();
        var videoId = OSH.Utils.randomUUID();

        var htmlVar="";
        htmlVar += "<div class=\""+this.type+"-menu\">";
        htmlVar += "  <div class=\""+this.type+"-menu-circle\">";
        // adds items
        for(var i = 0; i < this.items.length; i++) {
            htmlVar += this.items[i].html;
        }
        htmlVar += "  <\/div>";
        htmlVar += "  <a id=\""+closeId+"\"class=\""+this.type+"-menu-button fa fa-times fa-2x\"><\/a>";
        htmlVar += "<\/div>";

        this.rootTag = document.createElement("div");
        this.rootTag.setAttribute("class",""+this.type+"-menu-container");
        this.rootTag.innerHTML = htmlVar;

        document.body.appendChild(this.rootTag);

        var items = document.querySelectorAll('.'+this.type+'-menu-circle a');

        for(var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
        }

        document.getElementById(closeId).onclick = this.hide.bind(this);

        var offsetX = 0;
        var offsetY = 0;

        if(properties.offsetX) {
            offsetX = properties.offsetX;
        }

        if(properties.offsetY) {
            offsetY = properties.offsetY;
        }

        document.querySelector('.'+this.type+'-menu-circle').classList.toggle('open');

        if(!isUndefinedOrNull(properties.x) && !isUndefinedOrNull(properties.y)) {
            this.rootTag.style.transform = "translate("+(properties.x + offsetX)+"px, "+(properties.y + offsetY)+"px)";
        }

        // binds actions based on items
        this.bindEvents = {};
        for(var i = 0; i < this.items.length; i++) {
            var item =  this.items[i];
            this.bindEvents[item.id] = item.viewId;
            document.getElementById(item.id).onclick = function(event) {
                OSH.EventManager.fire(OSH.EventManager.EVENT.SHOW_VIEW, {
                    viewId: this.bindEvents[event.target.id]
                });
            }.bind(this);
        }

        // this causes preventing any closing event
        this.rootTag.onmousedown = function(event) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    /**
     * Hides the menu
     * @param $super
     * @instance
     * @memberof OSH.UI.ContextMenu.CssMenu
     */
    hide:function(){
        var selectDiv = document.querySelector('.'+this.type+'-menu-circle');
        if(!isUndefinedOrNull(selectDiv)) {
            selectDiv.classList.toggle('open');
            this.removeElement();
        }
    },

    /**
     * @instance
     * @memberof OSH.UI.ContextMenu.CssMenu
     */
    removeElement: function() {
        if(typeof(this.rootTag) != "undefined" && this.rootTag != null && typeof(this.rootTag.parentNode) != "undefined") {
            this.rootTag.parentNode.removeChild(this.rootTag);
            this.rootTag = null;
        }
    },

    /**
     * @instance
     * @memberof OSH.UI.ContextMenu.CssMenu
     */
    getTransform: function(el) {
        var transform = el.style.transform;
        if(!transform || 0 === transform.length) {
            return "";
        }
        var regExp = /^\s*((\w+)\s*\(([^)]+)\))/;
        var matches = regExp.exec(transform);

        return matches[1];
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc A circular context menu
 * @class
 * @type {OSH.UI.ContextMenu.CssMenu}
 * @augments OSH.UI.ContextMenu.CssMenu
 * @example
 * var menuItems = [{
        name: "Item 1",
        viewId: viewId,
        css: "someCssClass"
   },{
        name: "Item 2",
        viewId: viewId2,
        css: "someCssClass"
   }];

  var contextCircularMenu = new OSH.UI.ContextMenu.CircularMenu({id : randomId,groupId: randomGroupId,items : menuItems});
 */
OSH.UI.ContextMenu.CircularMenu = OSH.UI.ContextMenu.CssMenu.extend({
    initialize:function(properties) {
        this._super(properties,"circular");
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc A stack context menu
 * @class
 * @type {OSH.UI.ContextMenu.CssMenu}
 * @augments OSH.UI.ContextMenu.CssMenu
 * @example
 * var menuItems = [{
        name: "Item 1",
        viewId: viewId,
        css: "someCssClass"
   },{
        name: "Item 2",
        viewId: viewId2,
        css: "someCssClass"
   }];

   var contextStackMenu = new OSH.UI.ContextMenu.StackMenu({id : randomId,groupId: randomGroupId,items : menuItems});
 */
OSH.UI.ContextMenu.StackMenu = OSH.UI.ContextMenu.CssMenu.extend({
    initialize:function(properties) {
        this._super(properties,"stack");
    },

    /**
     * Shows the context menu.
     * @param $super
     * @param properties
     * @instance
     * @memberof OSH.UI.ContextMenu.StackMenu
     */
    show:function(properties) {
        this.removeElement();
        var htmlVar="";
        htmlVar += "  <div class=\""+this.type+"-menu-circle\">";
        // adds items
        for(var i = 0; i < this.items.length; i++) {
            htmlVar += this.items[i].html;
        }
        htmlVar += "  <\/div>";

        this.rootTag = document.createElement("div");
        this.rootTag.setAttribute("class",""+this.type+"-menu-container");
        this.rootTag.innerHTML = htmlVar;

        if(typeof properties.div != "undefined") {
            properties.div.appendChild(this.rootTag);
        } else {
            document.body.appendChild(this.rootTag);
        }

        var offsetX = 0;
        var offsetY = 0;

        if(properties.offsetX) {
            offsetX = properties.offsetX;
        }

        if(properties.offsetY) {
            offsetY = properties.offsetY;
        }

        if(!isUndefinedOrNull(properties.x) && !isUndefinedOrNull(properties.y)) {
            this.rootTag.style.transform = "translate("+(properties.x + offsetX)+"px, "+(properties.y + offsetY)+"px)";
        }

        document.querySelector('.'+this.type+'-menu-circle').classList.toggle('open');

        // binds actions based on items
        this.bindEvents = {};
        for(var i = 0; i < this.items.length; i++) {
            var item =  this.items[i];
            this.bindEvents[item.id] = item.viewId;
            document.getElementById(item.id).onclick = function(event){
                //TODO:deprecated
                OSH.EventManager.fire(OSH.EventManager.EVENT.SHOW_VIEW, {
                    viewId: this.bindEvents[event.target.id]
                });


                OSH.EventManager.fire(OSH.EventManager.EVENT.SHOW_VIEW+"-"+this.bindEvents[event.target.id], {
                    viewId: this.bindEvents[event.target.id]
                });
            }.bind(this);
        }

        // this causes preventing any closing event
        this.rootTag.onmousedown = function(event) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    handleEvents:function() {
        this._super();

        var self = this;
        window.onmousedown = function() {
            self.hide();
        };

        window.onclick = function() {
            self.hide();
        };
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class OSH.UI.Styler
 * @abstract
 */
OSH.UI.Styler = BaseClass.extend({
	initialize : function(jsonProperties) {
		this.properties = jsonProperties;
		this.id = "styler-" + OSH.Utils.randomUUID();

		this.dataSourceToStylerMap = {};

		this.initEvents();
	},

	/**
	 * @memberof OSH.UI.Styler
	 * @instance
	 */
	initEvents:function() {
		OSH.EventManager.observe(OSH.EventManager.EVENT.DATASOURCE_UPDATE_TIME,function(event){
			this.clear();
		}.bind(this));
	},

	/**
	 * @memberof OSH.UI.Styler
	 * @instance
	 */
	clear: function() {

	},

	/**
	 * Gets the styler id.
	 * @returns {string} the styler id
	 * @memberof OSH.UI.Styler
	 * @instance
	 */
	getId : function() {
		return this.id;
	},

	/**
	 * Selects the datasource contained into the list
	 * @param {Array} dataSourceIds the list of datasources
	 * @memberof OSH.UI.Styler
	 * @instance
	 */
	select : function(dataSourceIds) {
	},

	/**
	 * Adds a function
	 * @param {Array} dataSourceIds the list of datasources
	 * @param {function} fn the function to apply
	 * @memberof OSH.UI.Styler
	 * @instance
	 */
	addFn : function(dataSourceIds, fn) {
		this.removeFn(fn.fnName);
        for (var i = 0; i < dataSourceIds.length; i++) {
            var dataSourceId = dataSourceIds[i];

            if (isUndefinedOrNull (this.dataSourceToStylerMap[dataSourceId])) {
                this.dataSourceToStylerMap[dataSourceId] = [];
            }
            this.dataSourceToStylerMap[dataSourceId].push(fn);
        }
	},

	removeFn:function(fnName) {
        for (var dsKey in this.dataSourceToStylerMap) {
        	var currentDsArray = this.dataSourceToStylerMap[dsKey];

            var idx = -1;
            for (var j=0;j< currentDsArray.length;j++) {
                var currentDsElt = currentDsArray[j];
                if(!isUndefinedOrNull(currentDsElt.fnName) && fnName  === currentDsElt.fnName) {
                    // remove old function having the same name
                    idx = j;
                    break;
                }
            }

            // if a function has to be removed
            if(idx > -1) {
            	// removed from the array
                this.dataSourceToStylerMap[dsKey].splice(idx, 1);
                if(this.dataSourceToStylerMap[dsKey].length === 0) {
                    // remove this datasource because it is not longer used
                	delete this.dataSourceToStylerMap[dsKey];
                }
            }
        }
	},

	/**
	 *
	 * @param dataSourceId
	 * @param rec
	 * @param view
	 * @param options
	 * @returns {boolean}
	 * @memberof OSH.UI.Styler
	 * @instance
	 */
	setData : function(dataSourceId, rec, view, options) {
		if (dataSourceId in this.dataSourceToStylerMap) {
			var fnArr = this.dataSourceToStylerMap[dataSourceId];
			for (var i = 0; i < fnArr.length; i++) {
				fnArr[i](rec.data, rec.timeStamp, options);
			}
			return true;
		} else {
			return false;
		}
	},

	/**
	 *
	 * @returns {Array}
	 * @memberof OSH.UI.Styler
	 * @instance
	 */
	getDataSourcesIds : function() {
		var res = [];
		for ( var i in this.dataSourceToStylerMap) {
			res.push(i);
		}
		return res;
	},

	/**
	 * @memberof OSH.UI.Styler
	 * @instance
	 */
	init: function() {},

    /**
	 *  Remove a styler from its view
     * @memberof OSH.UI.Styler
     * @instance
     */
	remove:function(view) {},

    /**
     *  Update a styler from its view
     * @memberof OSH.UI.Styler
     * @instance
     */
    update:function(view) {}

});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Sensia Software LLC. All Rights Reserved.

 Author: Alex Robin <alex.robin@sensiasoft.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class OSH.UI.Styler.ImageDraping
 * @type {OSH.UI.Styler}
 * @augments OSH.UI.Styler
 */
OSH.UI.Styler.ImageDraping = OSH.UI.Styler.extend({
	initialize : function(properties) {
		this._super(properties);
		this.properties = properties;
		this.platformLocation = null;
		this.platformOrientation = null;
		this.gimbalOrientation = null;
		this.cameraModel = null;
		this.imageSrc = null;
		this.snapshotFunc = null;
		
		this.options = {};
		
		if (!isUndefinedOrNull(properties.platformLocation)){
			this.platformLocation = properties.platformLocation;
		} 
		
		if (!isUndefinedOrNull(properties.platformOrientation)){
			this.platformOrientation = properties.platformOrientation;
		} 
		
		if (!isUndefinedOrNull(properties.gimbalOrientation)){
			this.gimbalOrientation = properties.gimbalOrientation;
		} 
		
		if (!isUndefinedOrNull(properties.cameraModel)){
			this.cameraModel = properties.cameraModel;
		}
		
		if (!isUndefinedOrNull(properties.imageSrc)){
			this.imageSrc = properties.imageSrc;
		} 
		
		if (!isUndefinedOrNull(properties.platformLocationFunc)) {
			var fn = function(rec,timeStamp,options) {
				this.platformLocation = properties.platformLocationFunc.handler(rec,timeStamp,options);
			}.bind(this);
            fn.fnName = "platformLocation";
			this.addFn(properties.platformLocationFunc.dataSourceIds,fn);
		}
		
		if (!isUndefinedOrNull(properties.platformOrientationFunc)) {
			var fn = function(rec,timeStamp,options) {
				this.platformOrientation = properties.platformOrientationFunc.handler(rec,timeStamp,options);
			}.bind(this);
            fn.fnName = "platformOrientation";
			this.addFn(properties.platformOrientationFunc.dataSourceIds,fn);
		}
		
		if (!isUndefinedOrNull(properties.gimbalOrientationFunc)) {
			var fn = function(rec,timeStamp,options) {
				this.gimbalOrientation = properties.gimbalOrientationFunc.handler(rec,timeStamp,options);
			}.bind(this);
            fn.fnName = "gimbalOrientation";
			this.addFn(properties.gimbalOrientationFunc.dataSourceIds,fn);
		}
		
		if (!isUndefinedOrNull(properties.cameraModelFunc)) {
			var fn = function(rec,timeStamp,options) {
				this.cameraModel = properties.cameraModelFunc.handler(rec,timeStamp,options);
			}.bind(this);
            fn.fnName = "cameraModel";
			this.addFn(properties.cameraModelFunc.dataSourceIds,fn);
		}
		
		if (!isUndefinedOrNull(properties.snapshotFunc)) {
            fn.fnName = "snapshot";
			this.snapshotFunc = properties.snapshotFunc;
		}
	},

	/**
	 *
	 * @param $super
	 * @param view
	 * @memberof  OSH.UI.Styler.ImageDraping
	 * @instance
	 */
	init: function(view) {
		this._super(view);
	},

	/**
	 *
	 * @param $super
	 * @param dataSourceId
	 * @param rec
	 * @param view
	 * @param options
	 * @memberof  OSH.UI.Styler.ImageDraping
	 * @instance
	 */
	setData: function(dataSourceId,rec,view,options) {
		if (this._super(dataSourceId,rec,view,options)) {
			
			var enabled = true;
			var snapshot = false;
			if (this.snapshotFunc != null)
			    snapshot = this.snapshotFunc();
			
			if (typeof(view) != "undefined" && enabled &&
				this.platformLocation != null &&
				this.platformOrientation != null &&
				this.gimbalOrientation != null &&
				this.cameraModel != null &&
				this.imageSrc != null) {
				    view.updateDrapedImage(this,rec.timeStamp,options,snapshot);
			}
		}
	}

});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class OSH.UI.Styler.LinePlot
 * @type {OSH.UI.Style}
 * @augments OSH.UI.Styler
 */
OSH.UI.Styler.LinePlot = OSH.UI.Styler.extend({
	initialize : function(properties) {
		this._super(properties);
		this.xLabel = "";
		this.yLabel = "";
		this.color = "#1f77b5";
		this.stroke = 1;
		this.x = 0;
		this.y = [];

        this.updateProperties(properties);
	},

    updateProperties:function(properties) {
        OSH.Utils.copyProperties(properties,this.properties,true);

        if(!isUndefinedOrNull(properties.stroke)){
            this.stroke = properties.stroke;
        }

        if(!isUndefinedOrNull(properties.color)){
            this.color = properties.color;
        }

        if(!isUndefinedOrNull(properties.x)){
            this.x = properties.x;
        }

        if(!isUndefinedOrNull(properties.y)){
            this.y = properties.y;
        }

        if(!isUndefinedOrNull(properties.strokeFunc)) {
            var fn = function(rec,timeStamp,options) {
                this.stroke = properties.strokeFunc.handler(rec,timeStamp,options);
            }.bind(this);
            fn.fnName = "stroke";
            this.addFn(properties.strokeFunc.dataSourceIds,fn);
        }

        if(!isUndefinedOrNull(properties.colorFunc)) {
            var fn = function(rec,timeStamp,options) {
                this.color = properties.colorFunc.handler(rec,timeStamp,options);
            }.bind(this);
            fn.fnName = "color";
            this.addFn(properties.colorFunc.dataSourceIds,fn);
        }

        if(!isUndefinedOrNull(properties.valuesFunc)) {
            var fn = function(rec,timeStamp,options) {
                var values = properties.valuesFunc.handler(rec,timeStamp,options);
                this.x = values.x;
                this.y = values.y;
            }.bind(this);
            fn.fnName = "values";
            this.addFn(properties.valuesFunc.dataSourceIds,fn);
        }
    },

	/**
	 * @param $super
	 * @param dataSourceId
	 * @param rec
	 * @param view
	 * @param options
	 * @instance
	 * @memberof OSH.UI.Styler.Curve
	 */
	setData: function(dataSourceId,rec,view,options) {
		if(this._super(dataSourceId,rec,view,options)) {
			//if(typeof(view) != "undefined" && view.hasOwnProperty('updateMarker')){
			if(typeof(view) != "undefined") {
                this.lastData = {
                    lastTimeStamp : rec.timeStamp,
                    lastOptions : options,
                    x: this.x,
					y: this.y
                };
				view.updateLinePlot(this,rec.timeStamp,options);
			}
		}
	},

    /**
     *
     * @memberof OSH.UI.Styler.StylerLinePlot
     * @instance
     */
    clear:function(){
    },

    remove:function(view) {
        if(!isUndefinedOrNull(view)) {
            view.removeLinePlot(this);
        }
    },

    update:function(view) {
        if(!isUndefinedOrNull(view) && !isUndefinedOrNull(this.lastData)) {
            this.x = this.lastData.x;
            this.y = this.lastData.y;
            view.updateLinePlot(this,this.lastData.lastTimeStamp,this.lastData.lastOptions);
        }
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class OSH.UI.Styler.Video
 * @type {OSH.UI.Styler}
 * @augments OSH.UI.Styler
 * @example
 * var videoStyler = new OSH.UI.Styler.Video();
 */
OSH.UI.Styler.Video = OSH.UI.Styler.extend({
	initialize : function(properties) {
		this._super(properties);
		this.initProperties(properties);
	},

	initProperties:function(properties) {
        this.frame = null;
        this.options = {};

        this.updateProperties(properties);
	},

	updateProperties:function(properties) {
	    OSH.Utils.copyProperties(properties,this.properties,true);

        if(!isUndefinedOrNull(properties.frameFunc)) {
            var fn = function(rec,timeStamp,options) {
                this.frame = properties.frameFunc.handler(rec,timeStamp,options);
            }.bind(this);
            fn.fnName = "frame";
            this.addFn(properties.frameFunc.dataSourceIds,fn);
        }
    },

	/**
	 *
	 * @param view
	 * @memberof OSH.UI.Styler.PointMarker
	 * @instance
	 */
	init: function(view) {
		this._super(view);
	},

	/**
	 *
	 * @param dataSourceId
	 * @param rec
	 * @param view
	 * @param options
	 * @memberof OSH.UI.Styler.PointMarker
	 * @instance
	 */
	setData: function(dataSourceId,rec,view,options) {
		if(this._super(dataSourceId,rec,view,options)) {
			if (!isUndefinedOrNull(view) && !isUndefinedOrNull(this.frame)) {
			    this.lastData = {
                    lastTimeStamp : rec.timeStamp,
                    lastOptions : options,
                    frame: this.frame
                };
				view.updateFrame(this, rec.timeStamp, options);
			}
		}
	},

	/**
	 *
	 * @memberof OSH.UI.Styler.PointMarker
	 * @instance
	 */
	clear:function(){
	},

	remove:function(view) {
        if(!isUndefinedOrNull(view)) {
            view.stopVideo(this);
        }
    },

    update:function(view) {
        if(!isUndefinedOrNull(view) && !isUndefinedOrNull(this.lastData)) {
            this.frame = this.lastData.frame;
            view.updateFrame(this,this.lastData.lastTimeStamp,this.lastData.lastOptions);
        }
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 *
 * @constructor
 */
OSH.UI.Styler.Factory = function() {};

OSH.UI.Styler.Factory.LOCATION_DEFINITIONS = ["http://www.opengis.net/def/property/OGC/0/SensorLocation","http://sensorml.com/ont/swe/property/Location"];
OSH.UI.Styler.Factory.ORIENTATION_DEFINITIONS = ["http://sensorml.com/ont/swe/property/OrientationQuaternion"];
OSH.UI.Styler.Factory.CURVE_DEFINITIONS = ["http://sensorml.com/ont/swe/property/Weather"];

OSH.UI.Styler.Factory.TYPE = {
    MARKER:"Marker",
    POLYLINE:"Polyline",
    LINE_PLOT: "LinePlot",
    VIDEO: "Video"
};


OSH.UI.Styler.Factory.getLocation = function(x,y,z) {
  return {
      location: {
          x: x,
          y: y,
          z: z
      }
  };
};


//---- LOCATION ----//
OSH.UI.Styler.Factory.getLocationFunc = function(datasource,xIdx,yIdx,zIdx) {

    var x = "timeStamp",y = "timeStamp",z="timeStamp";

    if(xIdx > 0 ) {
        x = "rec." + datasource.resultTemplate[xIdx].path;
    }

    if(yIdx > 0 ) {
        y = "rec." + datasource.resultTemplate[yIdx].path;
    }

    if(zIdx > 0 ) {
        z = "rec." + datasource.resultTemplate[zIdx].path;
    }

    var locationFnStr = "return {" +
        "x: "+ x + "," +
        "y: "+ y + "," +
        "z: "+ z +
        "}";

    var argsLocationTemplateHandlerFn = ['rec','timeStamp','options', locationFnStr];
    var locationTemplateHandlerFn = Function.apply(null, argsLocationTemplateHandlerFn);

    return {
        locationFunc : {
            dataSourceIds: [datasource.id],
            handler: locationTemplateHandlerFn
        }
    };
};

OSH.UI.Styler.Factory.getCustomLocationFunc = function(styler,locationFnStr) {
    OSH.Asserts.checkObjectPropertyPath(styler,
        "properties.locationFunc.dataSourceIds","The styler must have datasourceId to be used with locationFunc");

    var argsLocationTemplateHandlerFn = ['rec', locationFnStr];
    var locationTemplateHandlerFn = Function.apply(null, argsLocationTemplateHandlerFn);

    return {
        locationFunc : {
            dataSourceIds: styler.properties.locationFunc.dataSourceIds,
            handler: locationTemplateHandlerFn
        }
    };
};

//----- ICON ----//
OSH.UI.Styler.Factory.getFixedIcon = function(dataSourceIdsArray,url) {

    var iconTemplate =  "return '"+url+ "';";

    var argsIconTemplateHandlerFn = ['rec', 'timeStamp', 'options', iconTemplate];
    var iconTemplateHandlerFn = Function.apply(null, argsIconTemplateHandlerFn);

    // generates iconFunc in case of iconFunc was already set. This is to override existing function if no selected
    // icon has been set
    return  {
        icon: url,
        iconFunc : {
        dataSourceIds: dataSourceIdsArray, // TODO: find a way to use something else because it is not depending on datasources but user interaction in that case
            handler: iconTemplateHandlerFn
        }
    };
};

OSH.UI.Styler.Factory.getThresholdIcon = function(datasource, observableIdx,
                                      defaultIconUrl, lowIconUrl, highIconUrl, thresholdValue) {

    OSH.Asserts.checkObjectPropertyPath(datasource,"resultTemplate", "The data source must contain the resultTemplate property");
    OSH.Asserts.checkArrayIndex(datasource.resultTemplate, observableIdx);
    OSH.Asserts.checkIsDefineOrNotNull(datasource);
    OSH.Asserts.checkIsDefineOrNotNull(defaultIconUrl);
    OSH.Asserts.checkIsDefineOrNotNull(lowIconUrl);
    OSH.Asserts.checkIsDefineOrNotNull(highIconUrl);
    OSH.Asserts.checkIsDefineOrNotNull(thresholdValue);

    var path = "timeStamp";

    if(observableIdx > 0) {
        path = "rec."+datasource.resultTemplate[observableIdx].path;
    }

    var iconTemplate = "if (" + path + " < " + thresholdValue + " ) { return '" + lowIconUrl + "'; }" + // <
                       "else if (" + path + " > " + thresholdValue + " ) { return '" + highIconUrl + "'; }" + // >
                       "else { return '"+defaultIconUrl+ "'; }"; // ==

    var argsIconTemplateHandlerFn = ['rec', 'timeStamp', 'options', iconTemplate];
    var iconTemplateHandlerFn = Function.apply(null, argsIconTemplateHandlerFn);

    return {
        icon: defaultIconUrl,
        iconFunc : {
            dataSourceIds: [datasource.id],
            handler: iconTemplateHandlerFn
        }
    };

};

OSH.UI.Styler.Factory.getCustomIconFunc = function(dataSourceIdsArray,iconFnStr) {
    var argsTemplateHandlerFn = ['rec', 'timeStamp', 'options', iconFnStr];
    var templateHandlerFn = Function.apply(null, argsTemplateHandlerFn);

    return {
        iconFunc : {
            dataSourceIds: dataSourceIdsArray,
            handler: templateHandlerFn
        }
    };
};

OSH.UI.Styler.Factory.getSelectedIconFunc = function(dataSourceIdsArray,defaultUrl,selectedUrl) {

    OSH.Asserts.checkIsDefineOrNotNull(dataSourceIdsArray);
    OSH.Asserts.checkIsDefineOrNotNull(defaultUrl);
    OSH.Asserts.checkIsDefineOrNotNull(selectedUrl);

    var iconTemplate = "";
    var blobURL = "";

    iconTemplate = "if (options.selected) {";
    iconTemplate += "  return '" +  selectedUrl + "'";
    iconTemplate += "} else {";
    iconTemplate += "  return '" + defaultUrl + "'";
    iconTemplate += "}";

    var argsIconTemplateHandlerFn = ['rec', 'timeStamp', 'options', iconTemplate];
    var iconTemplateHandlerFn = Function.apply(null, argsIconTemplateHandlerFn);

    return {
        icon:defaultUrl,
        iconFunc : {
            dataSourceIds: dataSourceIdsArray,
            handler: iconTemplateHandlerFn
        }
    };
};

//---- VALUES ----//
OSH.UI.Styler.Factory.getValues = function(x,y) {
    return {
        values: {
            x: x,
            y: y
        }
    };
};

OSH.UI.Styler.Factory.getValuesFunc = function(datasource,xIdx,yIdx) {

    var x = "timeStamp",y = "timeStamp";

    if(xIdx > 0 ) {
        x = "rec." + datasource.resultTemplate[xIdx].path;
    }

    if(yIdx > 0 ) {
        y = "rec." + datasource.resultTemplate[yIdx].path;
    }

    var valuesFnStr = "return {" +
        "x: "+ x + "," +
        "y: "+ y +
        "}";

    var argsValuesTemplateHandlerFn = ['rec', 'timeStamp', 'options', valuesFnStr];
    var valuesTemplateHandlerFn = Function.apply(null, argsValuesTemplateHandlerFn);

    return {
        valuesFunc : {
            dataSourceIds: [datasource.id],
            handler: valuesTemplateHandlerFn
        }
    };
};

OSH.UI.Styler.Factory.getCustomValuesFunc = function(dataSourceIdsArray,valuesFnStr) {
    var argsTemplateHandlerFn = ['rec', 'timeStamp', 'options', valuesFnStr];
    var templateHandlerFn = Function.apply(null, argsTemplateHandlerFn);

    return {
        valuesFunc : {
            dataSourceIds: dataSourceIdsArray,
            handler: templateHandlerFn
        }
    };
};

// COLOR
OSH.UI.Styler.Factory.getFixedColor = function(dataSourceIdsArray,url) {

    var colorTemplate =  "return '"+url+ "';";

    var argsColorTemplateHandlerFn = ['rec', 'timeStamp', 'options', colorTemplate];
    var colorTemplateHandlerFn = Function.apply(null, argsColorTemplateHandlerFn);

    // generates iconFunc in case of iconFunc was already set. This is to override existing function if no selected
    // icon has been set
    return  {
        color: url,
        colorFunc : {
            dataSourceIds: dataSourceIdsArray, // TODO: find a way to use something else because it is not depending on datasources but user interaction in that case
            handler: colorTemplateHandlerFn
        }
    };
};

OSH.UI.Styler.Factory.getThresholdColor = function(datasource, observableIdx,
                                                  defaultColor, lowColor, highColor, thresholdValue) {

    OSH.Asserts.checkObjectPropertyPath(datasource,"resultTemplate", "The data source must contain the resultTemplate property");
    OSH.Asserts.checkArrayIndex(datasource.resultTemplate, observableIdx);
    OSH.Asserts.checkIsDefineOrNotNull(datasource);
    OSH.Asserts.checkIsDefineOrNotNull(defaultColor);
    OSH.Asserts.checkIsDefineOrNotNull(lowColor);
    OSH.Asserts.checkIsDefineOrNotNull(highColor);
    OSH.Asserts.checkIsDefineOrNotNull(thresholdValue);

    var path = "timeStamp";

    if(observableIdx > 0) {
        path = "rec."+datasource.resultTemplate[observableIdx].path;
    }

    var colorTemplate = "if (" + path + " < " + thresholdValue + " ) { return '" + lowColor + "'; }" + // <
        "else if (" + path + " > " + thresholdValue + " ) { return '" + highColor + "'; }" + // >
        "else { return '"+defaultColor+ "'; }"; // ==

    var argsColorTemplateHandlerFn = ['rec', 'timeStamp', 'options', colorTemplate];
    var colorTemplateHandlerFn = Function.apply(null, argsColorTemplateHandlerFn);

    return {
        color: defaultColor,
        colorFunc : {
            dataSourceIds: [datasource.id],
            handler: colorTemplateHandlerFn
        }
    };
};

OSH.UI.Styler.Factory.getCustomColorFunc = function(dataSourceIdsArray,colorFnStr) {
    var argsTemplateHandlerFn = ['rec', 'timeStamp', 'options', colorFnStr];
    var templateHandlerFn = Function.apply(null, argsTemplateHandlerFn);

    return {
        colorFunc : {
            dataSourceIds: dataSourceIdsArray,
            handler: templateHandlerFn
        }
    };
};

OSH.UI.Styler.Factory.getSelectedColorFunc = function(dataSourceIdsArray,defaultColor,selectedColor) {

    OSH.Asserts.checkIsDefineOrNotNull(dataSourceIdsArray);
    OSH.Asserts.checkIsDefineOrNotNull(defaultColor);
    OSH.Asserts.checkIsDefineOrNotNull(selectedColor);

    var colorTemplate = "";
    var blobURL = "";

    colorTemplate = "if (options.selected) {";
    colorTemplate += "  return '" +  selectedColor + "'";
    colorTemplate += "} else {";
    colorTemplate += "  return '" + defaultColor + "'";
    colorTemplate += "}";

    var argsColorTemplateHandlerFn = ['rec', 'timeStamp', 'options', colorTemplate];
    var colorTemplateHandlerFn = Function.apply(null, argsColorTemplateHandlerFn);

    return {
        color:defaultColor,
        colorFunc : {
            dataSourceIds: dataSourceIdsArray,
            handler: colorTemplateHandlerFn
        }
    };
};

// VIDEO
OSH.UI.Styler.Factory.getVideoFunc = function(datasource, observableIdx) {

    OSH.Asserts.checkObjectPropertyPath(datasource,"resultTemplate", "The data source must contain the resultTemplate property");
    OSH.Asserts.checkArrayIndex(datasource.resultTemplate, observableIdx);
    OSH.Asserts.checkIsDefineOrNotNull(datasource);

    var videoTemplate = "return rec"; // ==

    var argsVideoTemplateHandlerFn = ['rec', 'timeStamp', 'options', videoTemplate];
    var videoTemplateHandlerFn = Function.apply(null, argsVideoTemplateHandlerFn);

    return {
        frameFunc : {
            dataSourceIds: [datasource.id],
            handler: videoTemplateHandlerFn
        }
    };

};


OSH.UI.Styler.Factory.getTypeFromInstance = function(stylerInstance) {
    if(stylerInstance instanceof OSH.UI.Styler.PointMarker){
        return OSH.UI.Styler.Factory.TYPE.MARKER;
    } else if(stylerInstance instanceof OSH.UI.Styler.Polyline){
        return OSH.UI.Styler.Factory.TYPE.POLYLINE;
    } else if(stylerInstance instanceof OSH.UI.Styler.LinePlot){
        return OSH.UI.Styler.Factory.TYPE.LINE_PLOT;
    } else if(stylerInstance instanceof OSH.UI.Styler.Video){
        return OSH.UI.Styler.Factory.TYPE.VIDEO;
    } else {
        throw new OSH.Exception.Exception("No type available for the instance "+stylerInstance);
    }
};

OSH.UI.Styler.Factory.getNewInstanceFromType = function(type) {
    if(type === OSH.UI.Styler.Factory.TYPE.LINE_PLOT) {
        return new OSH.UI.Styler.LinePlot({});
    } else if(type === OSH.UI.Styler.Factory.TYPE.MARKER) {
        return new OSH.UI.Styler.PointMarker({});
    } else if(type === OSH.UI.Styler.Factory.TYPE.POLYLINE) {
        return new OSH.UI.Styler.Polyline({});
    } else if(type === OSH.UI.Styler.Factory.TYPE.VIDEO) {
        return new OSH.UI.Styler.Video({});
    } else {
        throw new OSH.Exception.Exception("No styler instance available for the type "+type);
    }
};


OSH.UI.Styler.Factory.buildFunctionFromSource = function(dataSourceIds,propertyName,strSource) {
    var stylerFunc = {};

    var argsFuncTemplateHandlerFn = ['rec', 'timeStamp', 'options', strSource];
    var funcTemplateHandlerFn = Function.apply(null, argsFuncTemplateHandlerFn);

    stylerFunc[propertyName] = {
        dataSourceIds: dataSourceIds,
        handler: funcTemplateHandlerFn
    };

    return stylerFunc;
};

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class OSH.UI.Panel.DiscoveryPanel
 * @type {OSH.UI.View}
 * @augments OSH.UI.View
 * @example
var discoveryView = new OSH.UI.Panel.DiscoveryPanel("discovery-container",{
    services: ["http://sensiasoft.net:8181/"]
});

//------ More complex example
 var discoveryView = new OSH.UI.Panel.DiscoveryPanel("",{
        services: ["http://sensiasoft.net:8181/"] // server list
    });
 */
OSH.UI.Panel.DiscoveryPanel = OSH.UI.Panel.extend({

    initialize: function (parentElementDivId, properties) {
        this._super(parentElementDivId,[],properties);

        this.dialogContainer = document.body.id;

        this.formTagId = "form-"+OSH.Utils.randomUUID();
        this.serviceSelectTagId = "service-"+OSH.Utils.randomUUID();
        this.offeringSelectTagId = "offering-"+OSH.Utils.randomUUID();
        this.observablePropertyTagId = "obsProperty-"+OSH.Utils.randomUUID();
        this.nameTagId = "name-"+OSH.Utils.randomUUID();
        this.startTimeTagId = "startTime-"+OSH.Utils.randomUUID();
        this.endTimeTagId = "endTime-"+OSH.Utils.randomUUID();
        this.typeSelectTagId = "type-"+OSH.Utils.randomUUID();
        this.formButtonId = "submit-"+OSH.Utils.randomUUID();
        this.syncMasterTimeId = "syncMasterTime-"+OSH.Utils.randomUUID();
        this.replaySpeedId = "resplaySpeed-"+OSH.Utils.randomUUID();
        this.responseFormatId = "responseFormat-"+OSH.Utils.randomUUID();
        this.bufferingId = "buffering-"+OSH.Utils.randomUUID();
        this.timeShiftId = "timeShift-"+OSH.Utils.randomUUID();
        this.timeoutId = "timeout-"+OSH.Utils.randomUUID();

        // add template
        var discoveryForm = document.createElement("form");
        discoveryForm.setAttribute("action","#");
        discoveryForm.setAttribute("id",this.formTagId);
        discoveryForm.setAttribute("class",'discovery-form');

        OSH.Utils.addCss(document.getElementById(this.divId),"discovery-view");

        document.getElementById(this.divId).appendChild(discoveryForm);

        var strVar="";
        strVar += "<ul class=\"osh-ul\">";
        strVar += "            <li class=\"osh-li\">";
        strVar += "                <h2>Discovery<\/h2>";
        strVar += "                <span class=\"required_notification\">* Denotes Required Field<\/span>";
        strVar += "            <\/li>";
        strVar += "            <li class=\"osh-li\">";
        strVar += "                <label>Service:<\/label>";
        strVar += "                <div class=\"select-style\">";
        strVar += "                     <select id=\""+this.serviceSelectTagId+"\" required pattern=\"^(?!Select a service$).*\">";
        strVar += "                         <option value=\"\" disabled selected>Select a service<\/option>";
        strVar += "                     <\/select>";
        strVar += "                <\/div>";
        strVar += "            <\/li>";
        strVar += "            <li class=\"osh-li\">";
        strVar += "                <label>Offering:<\/label>";
        strVar += "                <div class=\"select-style\">";
        strVar += "                    <select id=\""+this.offeringSelectTagId+"\" required>";
        strVar += "                        <option value=\"\" disabled selected>Select an offering<\/option>";
        strVar += "                    <\/select>";
        strVar += "                <\/div>";
        strVar += "            <\/li>";
        strVar += "            <li class=\"osh-li\">";
        strVar += "                <label>Observable Property:<\/label>";
        strVar += "                <div class=\"select-style\">";
        strVar += "                     <select id=\""+this.observablePropertyTagId+"\" required>";
        strVar += "                         <option value=\"\" disabled selected>Select a property<\/option>";
        strVar += "                     <\/select>";
        strVar += "                <\/div>";
        strVar += "            <\/li>";
        strVar += "            <li class=\"osh-li\">";
        strVar += "                 <label for=\"name\">Name:<\/label>";
        strVar += "                 <input id=\""+this.nameTagId+"\"  class=\"input-text\" type=\"input-text\" name=\"name\"/>";
        strVar += "            <\/li>";
        strVar += "            <li class=\"osh-li\">";
        strVar += "                <label for=\"startTime\">Start time:<\/label>";
        //strVar += "                <input type=\"text\" name=\"startTime\" placeholder=\"YYYY-MM-DDTHH:mm:ssZ\" required pattern=\"\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)\" />";
        strVar += "                <input id=\""+this.startTimeTagId+"\" type=\"text\" name=\"startTime\" class=\"input-text\" placeholder=\"YYYY-MM-DDTHH:mm:ssZ\" required/>";
        strVar += "                <span class=\"form_hint\">YYYY-MM-DDTHH:mm:ssZ<\/span>";
        strVar += "            <\/li>";
        strVar += "            <li class=\"osh-li\">";
        strVar += "                <label for=\"endTime\">End time:<\/label>";
        //strVar += "                <input type=\"text\" name=\"endTime\" placeholder=\"YYYY-MM-DDTHH:mm:ssZ\"  required pattern=\"\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)\" />";
        strVar += "                <input id=\""+this.endTimeTagId+"\" type=\"text\" name=\"endTime\" class=\"input-text\" placeholder=\"YYYY-MM-DDTHH:mm:ssZ\"  required/>";
        strVar += "                <span class=\"form_hint\">YYYY-MM-DDTHH:mm:ssZ<\/span>";
        strVar += "            <\/li>";
        strVar += "            <div class=\"advanced\">";
        strVar += "                 <!--input type=\"checkbox\" class=\"advanced\"><i class=\"fa fa-plus-square-o details-button\" aria-hidden=\"true\"><\/i>&nbsp; Advanced <\/input-->";
        strVar += "                 <input type=\"checkbox\" name=\"advanced\" id=\"advanced\"/><label for=\"advanced\"><i class=\"fa\"></i>Advanced</label>";
        strVar += "                 <div class=\"details\">";
        strVar += "                     <li class=\"osh-li\">";
        strVar += "                         <label for=\"syncMasterTime\">Sync master time:<\/label>";
        strVar += "                         <input id=\""+this.syncMasterTimeId+"\"  class=\"input-checkbox\" type=\"checkbox\" name=\"syncMasterTime\" />";
        strVar += "                     <\/li>";
        strVar += "                     <li class=\"osh-li\">";
        strVar += "                         <label for=\"replaySpeed\">Replay factor:<\/label>";
        strVar += "                         <input id=\""+this.replaySpeedId+"\"  class=\"input-text\" type=\"input-text\" name=\"replaySpeed\" value=\'1\' />";
        strVar += "                     <\/li>";
        strVar += "                     <li class=\"osh-li\">";
        strVar += "                         <label for=\"responseFormat\">Response format<\/label>";
        strVar += "                         <input id=\""+this.responseFormatId+"\"  class=\"input-text\" type=\"input-text\" name=\"responseFormat\" placeholder='\e.g: mp4\'/>";
        strVar += "                     <\/li>";
        strVar += "                     <li class=\"osh-li\">";
        strVar += "                         <label for=\"buffering\">Buffering time (ms)<\/label>";
        strVar += "                         <input id=\""+this.bufferingId+"\"  class=\"input-text\" type=\"input-text\" name=\"buffering\" value=\'1000\'/>";
        strVar += "                     <\/li>";
        strVar += "                     <li class=\"osh-li\">";
        strVar += "                         <label for=\"timeShift\">TimeShift (ms)<\/label>";
        strVar += "                         <input id=\""+this.timeShiftId+"\"  class=\"input-text\" type=\"input-text\" name=\"timeShift\" value=\"0\"/>";
        strVar += "                     <\/li>";
        strVar += "                     <li class=\"osh-li\">";
        strVar += "                         <label for=\"timeout\">Timeout (ms)<\/label>";
        strVar += "                         <input id=\""+this.timeoutId+"\"  class=\"input-text\" type=\"input-text\" name=\"timeout\" value=\"1000\"/>";
        strVar += "                     <\/li>";
        strVar += "                 <\/div>";
        strVar += "             <\/div>";
        strVar += "            <li class=\"osh-li\">";
        strVar += "                <button id=\""+this.formButtonId+"\" class=\"submit\" type=\"submit\">Add<\/button>";
        strVar += "            <\/li>";
        strVar += "        <\/ul>";

        discoveryForm.innerHTML = strVar;

        // FIX select input-text instead of dragging the element(when the parent is draggable)
        var inputs = discoveryForm.querySelectorAll("input.input-text");
        for(var i = 0;i < inputs.length;i++) {
            inputs[i].onfocus = function(e){
              OSH.Utils.fixSelectable(this, true);
            };

            inputs[i].onblur = function(e){
                OSH.Utils.fixSelectable(this, false);
            };
        }
        // fill service from urls
        if(typeof properties !== "undefined") {
            // add services
            if(typeof properties.services !== "undefined"){
                this.addValuesToSelect(this.serviceSelectTagId,properties.services);
            }
        }

        // add listeners
        OSH.EventManager.observeDiv(this.serviceSelectTagId,"change",this.onSelectedService.bind(this));
        OSH.EventManager.observeDiv(this.offeringSelectTagId,"change",this.onSelectedOffering.bind(this));
        OSH.EventManager.observeDiv(this.observablePropertyTagId,"change",this.onSelectedObsProperty.bind(this));
        OSH.EventManager.observeDiv(this.formTagId,"submit",this.onFormSubmit.bind(this));
    },

    getButtonElement:function() {
        return document.getElementById(this.formButtonId);
    },

    initDataSource:function(dataSource) {
        var serverTag = document.getElementById(this.serviceSelectTagId);

        serverTag.dataSourceId = dataSource.id;

        this.removeAllFromSelect(this.offeringSelectTagId);
        this.removeAllFromSelect(this.observablePropertyTagId);

        var dataSourceEndPoint = dataSource.properties.endpointUrl;
        if(!dataSourceEndPoint.startsWith("http")) {
            dataSourceEndPoint = "http://"+dataSourceEndPoint;
        }
        for(var i=0; i < serverTag.options.length;i++) {
            var currentOption = serverTag.options[i].value;
            if(!currentOption.startsWith("http")) {
                currentOption = "http://"+currentOption;
            }
            if(currentOption === dataSourceEndPoint) {
                serverTag.options[i].setAttribute("selected","");
                this.onSelectedService({dataSource:dataSource});
                break;
            }
        }

        // edit advanced values
        // sync master time
        var syncMasterTimeTag = document.getElementById(this.syncMasterTimeId);
        syncMasterTimeTag.checked = dataSource.syncMasterTime;

        // replaySpeed
        var replaySpeedTag = document.getElementById(this.replaySpeedId);
        replaySpeedTag.value = dataSource.properties.replaySpeed;

        // buffering
        var bufferingTag = document.getElementById(this.bufferingId);
        bufferingTag.value = dataSource.bufferingTime;

        // response format
        var responseFormatTag = document.getElementById(this.responseFormatId);
        responseFormatTag.value = (!isUndefined(dataSource.properties.responseFormat)) ? dataSource.properties.responseFormat : "";

        // time shift
        var timeShiftTag = document.getElementById(this.timeShiftId);
        timeShiftTag.value = dataSource.timeShift;

    },

    setButton:function(name) {
        var button = document.getElementById(this.formButtonId);
        button.innerHTML = name;
    },

    /**
     *
     * @param event
     * @memberof OSH.UI.Panel.DiscoveryPanel
     * @instance
     */
    onSelectedService : function(event) {
        var serverTag = document.getElementById(this.serviceSelectTagId);
        var option = serverTag.options[serverTag.selectedIndex];

        this.removeAllFromSelect(this.offeringSelectTagId);

        this.oshServer = new OSH.Server({
            url: option.value
        });

        var onSuccessGetCapabilities = function(jsonObj) {
            var startTimeInputTag = document.getElementById(this.startTimeTagId);
            var endTimeInputTag = document.getElementById(this.endTimeTagId);

            var offering=null;

            var offeringMap = {};

            // load content
            for(var i=0;i < jsonObj.Capabilities.contents.offering.length;i++) {
                offering = jsonObj.Capabilities.contents.offering[i];
                this.addValueToSelect(this.offeringSelectTagId,offering.name,offering);

                offeringMap[offering.name] = offering;
            }

            // edit selected filter
            if(!isUndefined(event.dataSource)) {
                var offeringTag = document.getElementById(this.offeringSelectTagId);
                var offeringId = event.dataSource.properties.offeringID;

                for(var i=0; i < offeringTag.options.length;i++) {
                    var currentOption = offeringTag.options[i].value;
                    var currentOffering = offeringMap[offeringTag.options[i].value];

                    if(!isUndefined(currentOffering) && currentOffering.identifier === offeringId) {
                        offeringTag.options[i].setAttribute("selected","");
                        this.onSelectedOffering({dataSource:event.dataSource});
                        break;
                    }
                }

            }
        }.bind(this);

        var onErrorGetCapabilities = function(event) {
        };

        this.oshServer.getCapabilities(onSuccessGetCapabilities,onErrorGetCapabilities);
    },

    /**
     *
     * @param event
     * @memberof OSH.UI.Panel.DiscoveryPanel
     * @instance
     */
    onSelectedOffering : function(event) {
        var e = document.getElementById(this.offeringSelectTagId);
        var option = e.options[e.selectedIndex];
        var offering = option.parent;

        this.removeAllFromSelect(this.observablePropertyTagId);

        var startTimeInputTag = document.getElementById(this.startTimeTagId);
        var endTimeInputTag = document.getElementById(this.endTimeTagId);

        // feed observable properties
        for(var i = 0; i  < offering.observableProperty.length;i++) {
            // check if obs if supported
            var disable = false;
            //disable = !(offering.observableProperty[i] in OSH.DataReceiver.DataSourceFactory.definitionMap);
            disable = false;
            this.addValueToSelect(this.observablePropertyTagId,offering.observableProperty[i],offering,null,disable);
        }

        // edit selected filter
        if(!isUndefined(event.dataSource)) {
            var obsPropertyTag = document.getElementById(this.observablePropertyTagId);

            for(var i=0; i < obsPropertyTag.options.length;i++) {
                var currentOption = obsPropertyTag.options[i].value;

                if(currentOption === event.dataSource.properties.observedProperty) {
                    obsPropertyTag.options[i].setAttribute("selected","");
                    this.onSelectedObsProperty({dataSource:event.dataSource});
                    break;
                }
            }

            // setup start/end time
            startTimeInputTag.value = event.dataSource.properties.startTime;
            endTimeInputTag.value = event.dataSource.properties.endTime;
        } else {
            // set times
            startTimeInputTag.value = offering.phenomenonTime.beginPosition;

            if(typeof offering.phenomenonTime.endPosition.indeterminatePosition !== "undefined") {
                var d = new Date();
                d.setUTCFullYear(2055);
                endTimeInputTag.value = d.toISOString();

                startTimeInputTag.value = "now";
            } else {
                endTimeInputTag.value = offering.phenomenonTime.endPosition;
            }
        }
    },

    /**
     *
     * @param event
     * @memberof OSH.UI.Panel.DiscoveryPanel
     * @instance
     */
    onSelectedObsProperty: function(event) {
        // edit filter
        if(!isUndefined(event.dataSource)) {
            // setup name
            document.getElementById(this.nameTagId).value = event.dataSource.name;

        } else {
            var e = document.getElementById(this.observablePropertyTagId);
            var option = e.options[e.selectedIndex];
            var obsProp = option.value;

            var split = obsProp.split("/");

            var newNameValue = "";

            if(typeof  split !== "undefined" && split !== null && split.length > 0) {
                newNameValue = split[split.length-1];
            }

            document.getElementById(this.nameTagId).value = newNameValue;
        }
    },

    /**
     *
     * @param event
     * @returns {boolean}
     * @memberof OSH.UI.Panel.DiscoveryPanel
     * @instance
     */
    onFormSubmit : function(event) {
        event.preventDefault();
        // service
        var serviceTag = document.getElementById(this.serviceSelectTagId);
        var serviceTagSelectedOption = serviceTag.options[serviceTag.selectedIndex];

        // offering
        var offeringTag = document.getElementById(this.offeringSelectTagId);
        var offeringTagSelectedOption = offeringTag.options[offeringTag.selectedIndex];

        // obs property
        var observablePropertyTag = document.getElementById(this.observablePropertyTagId);
        var observablePropertyTagSelectedOption = observablePropertyTag.options[observablePropertyTag.selectedIndex];

        // name
        var nameTag = document.getElementById(this.nameTagId);

        // time
        var startTimeInputTag = document.getElementById(this.startTimeTagId);
        var endTimeInputTag = document.getElementById(this.endTimeTagId);

        // sync master time
        var syncMasterTimeTag = document.getElementById(this.syncMasterTimeId);

        // replaySpeed
        var replaySpeedTag = document.getElementById(this.replaySpeedId);

        // buffering
        var bufferingTag = document.getElementById(this.bufferingId);

        // response format
        var responseFormatTag = document.getElementById(this.responseFormatId);

        // time shift
        var timeShiftTag = document.getElementById(this.timeShiftId);

        // timeout
        var timeoutTag = document.getElementById(this.timeoutId);

        // get values
        var name=offeringTagSelectedOption.parent.name;
        var endPointUrl=serviceTagSelectedOption.value;
        var offeringID=offeringTagSelectedOption.parent.identifier;
        var obsProp=observablePropertyTagSelectedOption.value;
        var startTime=startTimeInputTag.value;
        var endTime=endTimeInputTag.value;

        endPointUrl = endPointUrl.replace('http://', '');
        var syncMasterTime = syncMasterTimeTag.checked;

        var replaySpeed = replaySpeedTag.value;
        var buffering = bufferingTag.value;
        var responseFormat = responseFormatTag.value;
        var timeShift = timeShiftTag.value;
        var timeout = timeoutTag.value;

        var properties = {
            name:nameTag.value,
            protocol: "ws",
            service: "SOS",
            endpointUrl: endPointUrl,
            offeringID: offeringID,
            observedProperty: obsProp,
            startTime: startTime,
            endTime: endTime,
            replaySpeed: Number(replaySpeed),
            syncMasterTime: syncMasterTime,
            bufferingTime: Number(buffering),
            timeShift: Number(timeShift),
            timeout: Number(timeout),
            responseFormat: (typeof responseFormat !== "undefined" && responseFormat !== null) ? responseFormat : undefined,
            definition:obsProp
        };

        var existingDSId = serviceTag.dataSourceId;

        OSH.DataReceiver.DataSourceFactory.createDatasourceFromType(properties,function(result){
            if(!isUndefinedOrNull(existingDSId)) {
                result.id = existingDSId;
                this.onEditHandler(result);
            } else {
                this.onAddHandler(result);
            }
        }.bind(this));

        return false;
    },

    onEditHandler:function(datasource) {},
    onAddHandler:function(datasource) {},

    /**
     *
     * @param tagId
     * @param objectsArr
     * @memberof OSH.UI.Panel.DiscoveryPanel
     * @instance
     */
    addObjectsToSelect:function(tagId,objectsArr) {
        var selectTag = document.getElementById(tagId);
        for(var i=0;i < objectsArr.length;i++) {
            var object = objectsArr[i];
            var option = document.createElement("option");
            option.text = object.name;
            option.value = object.name;
            option.object = object;
            selectTag.add(option);
        }
    },

    /**
     *
     * @param tagId
     * @param valuesArr
     * @memberof OSH.UI.Panel.DiscoveryPanel
     * @instance
     */
    addValuesToSelect:function(tagId,valuesArr) {
        var selectTag = document.getElementById(tagId);
        for(var i=0;i < valuesArr.length;i++) {
            var value = valuesArr[i];
            var option = document.createElement("option");
            option.text = value;
            option.value = value;
            selectTag.add(option);
        }
    },

    /**
     *
     * @param tagId
     * @param value
     * @param parent
     * @param object
     * @param disable indicate if the the option will be disabled
     * @memberof OSH.UI.Panel.DiscoveryPanel
     * @instance
     */
    addValueToSelect:function(tagId,value,parent,object,disable) {
        var selectTag = document.getElementById(tagId);
        var option = document.createElement("option");
        option.text = value;
        option.value = value;
        option.parent = parent;

        if(typeof object !== "undefined" && object !== null) {
            option.object = object;
        }

        if(typeof parent !== "undefined") {
            option.parent = parent;
        }
        if(typeof disable !== "undefined" && disable) {
            option.setAttribute("disabled","");
            option.text += " (not supported)";
        }
        selectTag.add(option);
    },

    /**
     *
     * @param tagId
     * @memberof OSH.UI.Panel.DiscoveryPanel
     * @instance
     */
    removeAllFromSelect:function(tagId) {
        var i;
        var selectTag = document.getElementById(tagId);
        for (i = selectTag.options.length - 1; i > 0; i--) {
            selectTag.remove(i);
        }
    },

    getType: function()  {
        return OSH.UI.View.ViewType.DISCOVERY;
    }
});

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Sensia Software LLC. All Rights Reserved.

 Author: Alex Robin <alex.robin@sensiasoft.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class OSH.UI.Styler.Nexrad
 * @type {OSH.UI.Styler}
 * @augments OSH.UI.Styler
 */
OSH.UI.Styler.Nexrad = OSH.UI.Styler.extend({
	initialize : function(properties) {
		this._super(properties);
		this.properties = properties;
		this.location = null;
		this.radialData = null;
		
		this.options = {};
		
		if (!isUndefinedOrNull(properties.location)){
			this.location = properties.location;
		}  
		
		if (!isUndefinedOrNull(properties.radialData)){
			this.radialData = properties.radialData;
		} 
		
		if (!isUndefinedOrNull(properties.locationFunc)) {
			var fn = function(rec,timeStamp,options) {
				this.location = properties.locationFunc.handler(rec,timeStamp,options);
			}.bind(this);
            fn.fnName = "location";
			this.addFn(properties.locationFunc.dataSourceIds,fn);
		}
		
		if (!isUndefinedOrNull(properties.radialDataFunc)) {
			var fn = function(rec,timeStamp,options) {
				this.radialData = properties.radialDataFunc.handler(rec,timeStamp,options);
			}.bind(this);
            fn.fnName = "radialData";
			this.addFn(properties.radialDataFunc.dataSourceIds,fn);
		}
		
		this.reflectivityColorMap = [
			Cesium.Color.fromBytes(100, 100, 100),
			Cesium.Color.fromBytes(204, 255, 255),
			Cesium.Color.fromBytes(204, 153, 204),
			Cesium.Color.fromBytes(153, 102, 153),
			Cesium.Color.fromBytes(102,  51, 102),
			Cesium.Color.fromBytes(204, 204, 153),
			Cesium.Color.fromBytes(153, 153, 102),
			Cesium.Color.fromBytes(100, 100, 100),
			Cesium.Color.fromBytes(  4, 233, 231),
			Cesium.Color.fromBytes(  1, 159, 244),
			Cesium.Color.fromBytes(  3,   0, 244),
			Cesium.Color.fromBytes(  2, 253,   2),
			Cesium.Color.fromBytes(  1, 197,   1),
			Cesium.Color.fromBytes(  0, 142,   0),
			Cesium.Color.fromBytes(253, 248,   2),
			Cesium.Color.fromBytes(229, 188,   0),
			Cesium.Color.fromBytes(253, 149,   0),
			Cesium.Color.fromBytes(253,   0,   0),
			Cesium.Color.fromBytes(212,   0,   0),
			Cesium.Color.fromBytes(188,   0,   0),
			Cesium.Color.fromBytes(248,   0, 253),
			Cesium.Color.fromBytes(152,  84, 198),
			Cesium.Color.fromBytes(253, 253, 253)
		];
		
		this.pointCollection = new Cesium.PointPrimitiveCollection();
		this.radialCount = 0;
	},

	/**
	 *
	 * @param view
	 * @instance
	 * @memberof OSH.UI.Styler.Nexrad
	 */
	init: function(view) {
		this._super(view);
	},

	/**
	 *
	 * @param dataSourceId
	 * @param rec
	 * @param view
	 * @param options
	 * @instance
	 * @memberof OSH.UI.Styler.Nexrad
	 */
	setData: function(dataSourceId,rec,view,options) {
		if (this._super(dataSourceId,rec,view,options)) {
			if (!isUndefinedOrNull(view)) {
				
				var DTR = Math.PI/180;
				
				// keep only first elevation
				if (rec.data.elevation > 0.7)
					return;
				
				// draw directly in Cesium view
				var radarLoc = Cesium.Cartesian3.fromDegrees(this.location.x, this.location.y, this.location.z);
				var quat = Cesium.Transforms.headingPitchRollQuaternion(radarLoc, (rec.data.azimuth-90)*DTR, rec.data.elevation*DTR, 0.0);
				var rotM = Cesium.Matrix3.fromQuaternion(quat);
				
				var points = new Cesium.PointPrimitiveCollection();
				var dist0 = rec.data.rangeToCenterOfFirstRefGate;
				var step = rec.data.refGateSize;
				for (var i=0; i<rec.data.reflectivity.length; i++) {
					
				   var val = rec.data.reflectivity[i];
				   
				   // skip points that are out of range
				   if (val < -32 || val > 94.5)
					  continue;
				   
				   var gatePos = new Cesium.Cartesian3(dist0 + i*step, 0, 0);
				   Cesium.Matrix3.multiplyByVector(rotM, gatePos, gatePos);
				   
				   // apply color map and add point to collection
				   this.pointCollection.add({
					  position : Cesium.Cartesian3.add(radarLoc, gatePos, gatePos),
					  color : this.getReflectivityColor(val),
					  pixelSize : 3
				   });
				}
				
				this.radialCount++;
				if (this.radialCount === 100)
			    {
					view.viewer.scene.primitives.add(this.pointCollection);
					this.pointCollection = new Cesium.PointPrimitiveCollection();
					this.radialCount = 0;
			    }
			}
		}
	},

	/**
	 *
	 * @param val
	 * @returns {*}
	 * @instance
	 * @memberof OSH.UI.Styler.Nexrad
	 */
	getReflectivityColor: function(val)
	{
		var index = Math.floor((val + 30) / 5) + 1;
	    return this.reflectivityColorMap[index];
	}

});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @class OSH.UI.Styler.Polyline
 * @classdesc
 * @type {OSH.UI.Styler}
 * @augments OSH.UI.Styler
 * @example
 * var polylineStyler = new OSH.UI.Styler.Polyline({
		locationFunc : {
			dataSourceIds : [datasource.getId()],
			handler : function(rec) {
				return {
					x : rec.lon,
					y : rec.lat,
					z : rec.alt
				};
			}
		},
		color : 'rgba(0,0,255,0.5)',
		weight : 10,
		opacity : .5,
		smoothFactor : 1,
		maxPoints : 200
	});
 */
OSH.UI.Styler.Polyline = OSH.UI.Styler.extend({
	initialize : function(properties) {
		this._super(properties);
		this.properties = properties;
		this.locations = [];
     	this.color = 'red';
		this.weight = 1;
		this.opacity = 1;
		this.smoothFactor = 1;
		this.maxPoints = 10;
		
		if(!isUndefinedOrNull(properties.color)){
			this.color = properties.color;
		} 
		
		if(!isUndefinedOrNull(properties.weight)){
			this.weight = properties.weight;
		} 
		
		if(!isUndefinedOrNull(properties.opacity)){
			this.opacity = properties.opacity;
		} 
		
		if(!isUndefinedOrNull(properties.smoothFactor)){
			this.smoothFactor = properties.smoothFactor;
		} 
		
		if(!isUndefinedOrNull(properties.maxPoints)){
			this.maxPoints = properties.maxPoints;
		} 
		
		if(!isUndefinedOrNull(properties.locationFunc)) {
			var fn = function(rec) {
				var loc = properties.locationFunc.handler(rec);
				this.locations.push(loc);
				if(this.locations.length > this.maxPoints) {
					this.locations.shift();
				}
			}.bind(this);
            fn.fnName = "location";
			this.addFn(properties.locationFunc.dataSourceIds,fn);
		}
		
		if(!isUndefinedOrNull(properties.colorFunc)) {
			var fn = function(rec) {
				this.color = properties.colorFunc.handler(rec);
			}.bind(this);
            fn.fnName = "color";
			this.addFn(properties.colorFunc.dataSourceIds,fn);
		}
		
		if(!isUndefinedOrNull(properties.weightFunc)) {
			var fn = function(rec) {
				this.weight = properties.weightFunc.handler(rec);
			}.bind(this);
            fn.fnName = "weight";
			this.addFn(properties.weightFunc.dataSourceIds,fn);
		}
		
		if(!isUndefinedOrNull(properties.opacityFunc)) {
			var fn = function(rec) {
				this.opacity = properties.opacityFunc.handler(rec);
			}.bind(this);
            fn.fnName = "opacity";
			this.addFn(properties.opacityFunc.dataSourceIds,fn);
		}
		
		if(!isUndefinedOrNull(properties.smoothFactorFunc)) {
			var fn = function(rec) {
				this.smoothFactor = properties.smoothFactorFunc.handler(rec);
			}.bind(this);
            fn.fnName = "smoothFactor";
			this.addFn(properties.smoothFactorFunc.dataSourceIds,fn);
		}
	},

	/**
	 *
	 * @param dataSourceId
	 * @param rec
	 * @param view
	 * @param options
	 * @instance
	 * @memberof OSH.UI.Styler.Polyline
	 */
	setData: function(dataSourceId,rec,view,options) {
		if(this._super(dataSourceId,rec,view,options)) {
			if(!isUndefinedOrNull(view) && typeof view.updatePolyline === 'function'){
				view.updatePolyline(this);
			}
		}
	},

	/**
	 *
	 * @param $super
	 * @instance
	 * @memberof OSH.UI.Styler.Polyline
	 */
	clear: function($super) {
		this.locations = [];
	}
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class OSH.UI.Styler.PointMarker
 * @type {OSH.UI.Styler}
 * @augments OSH.UI.Styler
 * @example
 * var pointMarker = new OSH.UI.Styler.PointMarker({
        location : {
            x : 1.42376557,
            y : 43.61758626,
            z : 100
        },
        locationFunc : {
            dataSourceIds : [androidPhoneGpsDataSource.getId()],
            handler : function(rec) {
                return {
                    x : rec.lon,
                    y : rec.lat,
                    z : rec.alt
                };
            }
        },
        orientationFunc : {
            dataSourceIds : [androidPhoneOrientationDataSource.getId()],
            handler : function(rec) {
                return {
                    heading : rec.heading
                };
            }
        },
        icon : 'images/cameralook.png',
        iconFunc : {
            dataSourceIds: [androidPhoneGpsDataSource.getId()],
            handler : function(rec,timeStamp,options) {
                if(options.selected) {
                    return 'images/cameralook-selected.png'
                } else {
                    return 'images/cameralook.png';
                };
            }
        }
    });
 */
OSH.UI.Styler.PointMarker = OSH.UI.Styler.extend({
	initialize : function(properties) {
		this._super(properties);
		this.initProperties(properties);
	},

	initProperties:function(properties) {
        this.location = {
            x:0,
            y:0,
            z:0
        };
        this.orientation = {heading:0};
        this.icon = null;
        this.iconAnchor = [16,16];
        this.label = null;
        this.color = "#000000";

        this.options = {};

        this.updateProperties(properties);
	},

	updateProperties:function(properties) {
	    OSH.Utils.copyProperties(properties,this.properties,true);

        if(!isUndefinedOrNull(properties.location)){
            this.location = properties.location;
        }

        if(!isUndefinedOrNull(properties.orientation)){
            this.orientation = properties.orientation;
        }

        if(!isUndefinedOrNull(properties.icon)){
            this.icon = properties.icon;
        }

        if(!isUndefinedOrNull(properties.iconAnchor)){
            this.iconAnchor = properties.iconAnchor;
        }

        if(!isUndefinedOrNull(properties.label)){
            this.label = properties.label;
        }

        if(!isUndefinedOrNull(properties.color)){
            this.color = properties.color;
        }

        if(!isUndefinedOrNull(properties.locationFunc)) {
            var fn = function(rec,timeStamp,options) {
                this.location = properties.locationFunc.handler(rec,timeStamp,options);
            }.bind(this);
            fn.fnName = "location";
            this.addFn(properties.locationFunc.dataSourceIds,fn);
        }

        if(!isUndefinedOrNull(properties.orientationFunc)) {
            var fn = function(rec,timeStamp,options) {
                this.orientation = properties.orientationFunc.handler(rec,timeStamp,options);
            }.bind(this);
            fn.fnName = "orientation";
            this.addFn(properties.orientationFunc.dataSourceIds,fn);
        }

        if(!isUndefinedOrNull(properties.iconFunc)) {
            var fn = function(rec,timeStamp,options) {
                this.icon = properties.iconFunc.handler(rec,timeStamp,options);
            }.bind(this);
            fn.fnName = "icon";
            this.addFn(properties.iconFunc.dataSourceIds,fn);
        }

        if(!isUndefinedOrNull(properties.labelFunc)) {
            var fn = function(rec,timeStamp,options) {
                this.label = properties.labelFunc.handler(rec,timeStamp,options);
            }.bind(this);
            fn.fnName = "label";
            this.addFn(properties.labelFunc.dataSourceIds,fn);
        }

        if(!isUndefinedOrNull(properties.colorFunc)) {
            var fn = function(rec,timeStamp,options) {
                this.color = properties.colorFunc.handler(rec,timeStamp,options);
            }.bind(this);
            fn.fnName = "color";
            this.addFn(properties.colorFunc.dataSourceIds,fn);
        }
    },

	/**
	 *
	 * @param view
	 * @memberof OSH.UI.Styler.PointMarker
	 * @instance
	 */
	init: function(view) {
		this._super(view);
		if(!isUndefinedOrNull(view) && this.location !==null) {
			view.updateMarker(this,0,{});
		}
	},

	/**
	 *
	 * @param dataSourceId
	 * @param rec
	 * @param view
	 * @param options
	 * @memberof OSH.UI.Styler.PointMarker
	 * @instance
	 */
	setData: function(dataSourceId,rec,view,options) {
		if(this._super(dataSourceId,rec,view,options)) {
			if (!isUndefinedOrNull(view) && !isUndefinedOrNull(this.location)) {
			    this.lastData = {
                    lastTimeStamp : rec.timeStamp,
                    lastOptions : options,
                    location: this.location
                };
				view.updateMarker(this, rec.timeStamp, options);
			}
		}
	},

	/**
	 *
	 * @memberof OSH.UI.Styler.PointMarker
	 * @instance
	 */
	clear:function(){
	},

	remove:function(view) {
        if(!isUndefinedOrNull(view)) {
            view.removeMarker(this);
        }
    },

    update:function(view) {
        if(!isUndefinedOrNull(view) && !isUndefinedOrNull(this.lastData)) {
            this.location = this.lastData.location;
            view.updateMarker(this,this.lastData.lastTimeStamp,this.lastData.lastOptions);
        } else {
            view.updateMarker(this,0,{});
        }
    }

});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class OSH.UI.Nvd3CurveChartView
 * @type {OSH.UI.View}
 * @augments OSH.UI.View.ChartView
 * @example
// Chart View
var windSpeedChartView = new OSH.UI.Nvd3CurveChartView(chartDialog.popContentDiv.id, [{
    styler: new OSH.UI.Styler.Curve({
        valuesFunc: {
            dataSourceIds: [weatherDataSource.getId()],
            handler: function(rec, timeStamp) {
                return {
                    x: timeStamp,
                    y: parseFloat(rec[2])
                };
            }
        }
    })
}], {
    name: "WindSpeed chart",
    yLabel: 'Wind Speed (m/s)',
    xLabel: 'Time',
    css: "chart-view",
    cssSelected: "video-selected",
    maxPoints: 30
});
 */
OSH.UI.View.Nvd3LineChartView = OSH.UI.View.ChartView.extend({
	initialize : function(parentElementDivId,viewItems, options) {
		this._super(parentElementDivId,viewItems,options);

		this.entityId = options.entityId;
		this.xLabel = 'Time';
        this.yLabel = 'yAxisLabel';
		var xTickFormat = null;

		var yTickFormat = d3.format('.02f');
		var useInteractiveGuideline = true;
		var showLegend = true;
		var showYAxis = true;
		var showXAxis = true;
		var transitionDuration = 1;
        this.maxPoints = 999;

		if (!isUndefinedOrNull(options)) {
			if (options.xLabel) {
                this.xLabel = options.xLabel;
			}

			if (options.yLabel) {
                this.yLabel = options.yLabel;
			}

			if (options.xTickFormat) {
				xTickFormat = options.xTickFormat;
			}

			if (options.yTickFormat) {
				yTickFormat = options.yTickFormat;
			}

			if (options.showLegend) {
				showLegend = options.showLegend;
			}

			if (options.showXAxis) {
				showXAxis = options.showXAxis;
			}

			if (options.showYAxis) {
				showYAxis = options.showYAxis;
			}

			if (options.useInteractiveGuideline) {
				useInteractiveGuideline = options.useInteractiveGuideline;
			}

			if (options.transitionDuration) {
				transitionDuration = options.transitionDuration;
			}
			if (options.maxPoints) {
				this.maxPoints = options.maxPoints;
			}
		}

		this.chart = nv.models.lineChart().margin({
			left : 75,
			right : 25
		}) //Adjust chart margins to give the x-axis some breathing room.
		.options({
			duration : 1, // This should be duration: 300
			useInteractiveGuideline : useInteractiveGuideline
		}) //We want nice looking tooltips and a guideline!
		.duration(1)
		//.transitionDuration(1) //how fast do you want the lines to transition?
		.showLegend(showLegend) //Show the legend, allowing users to turn on/off line series.
		.showYAxis(showYAxis) //Show the y-axis
		.showXAxis(showXAxis) //Show the x-axis
		// .forceY([27.31,28])
		;

		this.chart.xAxis //Chart x-axis settings
		.axisLabel(this.xLabel).tickFormat(function(d) {
			return d3.time.format.utc('%H:%M:%SZ')(new Date(d));
		}).axisLabelDistance(5);

		this.chart.yAxis //Chart y-axis settings
		.axisLabel(this.yLabel).tickFormat(d3.format('.02f'))
		.axisLabelDistance(5);

		this.css = document.getElementById(this.divId).className;

		if(!isUndefinedOrNull(options)) {
			if (options.css) {
				this.css += " " + options.css;
			}

			if (options.cssSelected) {
				this.cssSelected = options.cssSelected;
			}
		}

		//create svg element
		var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');

		this.div = document.getElementById(this.divId);
		this.div.appendChild(svg);

		this.div.style.width = this.width;
		this.div.style.height = this.height;
		
		this.svgChart = d3.select('#' + this.divId + ' svg'); //Select the <svg> element you want to render the chart in.

		var self =this;

        /**
		 * entityId : styler.viewItem.entityId
         */

        this.chart.legend.margin().bottom = 25;
		if(!isUndefinedOrNull(options) && !isUndefinedOrNull(options.initData) && options.initData) {
            this.svgChart
                .datum([{
                    values : [{y : 0,x : 0}],
                    key : "",
                    interpolate : "cardinal",
                    area : true
                }]) //Populate the <svg> element with chart data...
                .call(this.chart);
		}
	},

	/**
	 *
	 * @param styler
	 * @param timestamp
	 * @param options
	 * @instance
	 * @memberof OSH.UI.Nvd3CurveChartView
	 */
	updateLinePlot : function(styler, timestamp, options) {
		if (typeof (this.data) === "undefined") {
			this.d3Data = [];	
			var name = options.name;

			this.data = {
				values : [],
				key : this.names[styler.getId()],
				interpolate : "cardinal",
				area : true,
				color:styler.color
			};

			this.data.values.push({
				y : styler.y,
				x : styler.x
			});

			this.svgChart
					.datum([this.data]) //Populate the <svg> element with chart data...
					.call(this.chart);

            OSH.EventManager.observeDiv(this.divId,"click",function(event){

                var dataSourcesIds = [];
                var entityId;
				OSH.EventManager.fire(OSH.EventManager.EVENT.SELECT_VIEW,{
					dataSourcesIds: styler.getDataSourcesIds(),
					entityId : styler.viewItem.entityId
				});
            });

		} else {
			this.data.color = styler.color;
			if(!isUndefinedOrNull(styler.viewItem.name)) {
				this.data.key  = styler.viewItem.name;
			}
			this.data.values.push({
				y : styler.y,
				x : styler.x
			});
		}

		this.chart.update();
		if (this.data.values.length > this.maxPoints) {
			this.data.values.shift();
		}
	},

	updateProperties:function(properties) {
		if(!isUndefined(properties)) {
			if(!isUndefinedOrNull(properties.xLabel)) {
				this.xLabel = properties.xLabel;
                this.chart.xAxis.axisLabel(this.xLabel);
			}

            if(!isUndefinedOrNull(properties.yLabel)) {
                this.yLabel = properties.yLabel;
                this.chart.yAxis.axisLabel(this.yLabel);
            }

            if(!isUndefinedOrNull(properties.maxPoints)) {
				this.maxPoints = properties.maxPoints;
            }
		}
	},

	/**
	 *
	 * @param dataSourceIds
	 * @instance
	 * @memberof OSH.UI.Nvd3CurveChartView
	 */
	selectDataView: function(dataSourceIds) {
		var currentDataSources= this.getDataSourcesId();
		if(OSH.Utils.isArrayIntersect(dataSourceIds,currentDataSources)) {
			this.div.setAttribute("class",this.css+" "+this.cssSelected);
		} else {
			this.div.setAttribute("class",this.css);
		}
	},

	removeLinePlot:function(styler) {
		//TODO: remove current styler
	},

	/**
     * @instance
     * @memberof OSH.UI.Nvd3CurveChartView
     */
    reset: function () {
        this.data.values = [];
        this.chart.update();
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @type {OSH.UI.View}
 * @augments OSH.UI.View
 * @param {Object} parentElement The parent html element to attach the view
 * @param {Array} entityItems The entity items array
 * @param {Object} options the {@link OSH.View} options
 * @example
 var entityTreeView = new OSH.UI.EntityTreeView(entityTreeDialog.popContentDiv.id,
     [{
        entity : androidEntity,
        path: "Sensors/Toulouse",
        treeIcon : "images/android_icon.png",
        contextMenuId: stackContextMenuId
     }],
     {
         css: "tree-container"
     }
 );
 */
OSH.UI.EntityTreeView = OSH.UI.View.extend({
    initialize:function(parentElementDivId,entityItems,options) {
        this._super(parentElementDivId,[],options);

        this.entityItems = entityItems;
        this.initTree(options);
    },

    /**
     *
     * @param options
     * @instance
     * @memberof OSH.UI.EntityTreeView
     */
    initTree:function(options) {
        this.tree = createTree(this.divId,'white',null);

        // iterates over entities to create treeNode
        for(var i = 0;i < this.entityItems.length;i++) {
            var currentItem = this.entityItems[i];
            var entity = currentItem.entity;
            var path = currentItem.path;
            var treeIcon = currentItem.treeIcon;
            var contextMenuId = currentItem.contextMenuId;

            if(path.endsWith("/")) {
                path = path.substring(0,path.length-1);
            }
            
            // create intermediary folders or append to them as needed 
            var folder = path.split("/");
            var nbNodes = folder.length;
            var currentNode = this.tree;
            var pos = 0;
            while(nbNodes > 0) {
                var existingChildNode = null;
                
                // scan child nodes to see if folder already exists
                for (n=0; n<currentNode.childNodes.length; n++) {
                    var node = currentNode.childNodes[n];
                    if (node.text === folder[pos]) {
                        existingChildNode = node;
                        break;
                    }
                }
                
                // if folder already exists, just use it as parent in next iteration
                // otherwise create a new node to use as new parent
                if (existingChildNode == null) {
                    if (currentNode === this.tree)
                        currentNode = this.tree.createNode(folder[pos],false,'',this.tree,null,null);
                    else
                        currentNode = currentNode.createChildNode(folder[pos],false,'',null,null);    
                } else {
                    currentNode = existingChildNode;
                }
                
                pos++;
                nbNodes--;
            }
            
            var entityNode;
            if(currentNode === this.tree) {
                entityNode = this.tree.createNode(entity.name,false,treeIcon,this.tree,entity,contextMenuId);
            } else {
                entityNode = currentNode.createChildNode(entity.name,false,treeIcon,entity,contextMenuId);
            }
            currentItem.node = entityNode;
        }

        //Rendering the tree
        this.tree.drawTree();
    },

    /**
     *
     * @param dataSourcesIds
     * @param entityId
     * @instance
     * @memberof OSH.UI.EntityTreeView
     */
    selectDataView: function (dataSourcesIds, entityId) {
        
        // when an entity is selected we find the corresponding node in the tree
        // we expand all its ancestors and we mark it as selected
        if (typeof(entityId) != "undefined") {
            for(var i = 0;i < this.entityItems.length;i++) {
                var currentItem = this.entityItems[i];
                if (currentItem.entity.id === entityId) {
                    this.tree.selectNode(currentItem.node, false);
                    var node = currentItem.node.parent
                    while (node != this.tree) {
                        this.tree.expandNode(node);
                        node = node.parent;
                    }
                }
                    
            }
        }
    },

    getType: function()  {
        return OSH.UI.View.ViewType.ENTITY_TREE;
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Sensia Software LLC. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>
 Author: Alex Robin <alex.robin@sensiasoft.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @type {OSH.UI.View}
 * @augments OSH.UI.View.MapView
 * @example
 var cesiumMapView = new OSH.UI.View.CesiumView ("",
 [{
	styler :  pointMarker,
	contextMenuId: circularContextMenuId,
	name : "Android Phone GPS",
	entityId : androidEntity.id
 },
 {
    styler : new OSH.UI.Styler.Polyline({
        locationFunc : {
            dataSourceIds : [androidPhoneGpsDataSource.getId()],
            handler : function(rec) {
                return {
                    x : rec.lon,
                    y : rec.lat,
                    z : rec.alt
                };
            }
        },
        color : 'rgba(0,0,255,0.5)',
        weight : 10,
        opacity : .5,
        smoothFactor : 1,
        maxPoints : 200
    }),
    name : "Android Phone GPS Path",
    entityId : androidEntity.id
 }]
 );
 */
OSH.UI.View.CesiumView  = OSH.UI.View.MapView.extend({
	
	initialize : function(parentElementDivId,viewItems, properties) {
		this._super(parentElementDivId,viewItems,properties);

		var cssClass = document.getElementById(this.divId).className;
		document.getElementById(this.divId).setAttribute("class", cssClass+" "+this.css);
		
		this.imageDrapingPrimitive = null;
		this.imageDrapingPrimitiveReady = false;		
		this.frameCount = 0;
		
		this.captureCanvas = document.createElement('canvas');
		this.captureCanvas.width = 640;
		this.captureCanvas.height = 480;
	},

	/**
	 *
	 * @param styler
	 * @param timeStamp
	 * @param options
	 * @instance
	 * @memberof OSH.UI.View.CesiumView 
	 */
	updateMarker : function(styler,timeStamp,options) {
		var markerId = 0;

		if (!(styler.getId() in this.stylerToObj)) {
			markerId = this.addMarker({
				lat : styler.location.y,
				lon : styler.location.x,
				alt : styler.location.z,
				orientation : styler.orientation,
				color : styler.color,
				icon : styler.icon,
				label : styler.label,
				timeStamp: timeStamp,
				selected: ((typeof(options.selected) !== "undefined")? options.selected : false)
			});

			this.stylerToObj[styler.getId()] = markerId;
		} else {
			markerId = this.stylerToObj[styler.getId()];
		}

		this.updateMapMarker(markerId, {
			lat : styler.location.y,
			lon : styler.location.x,
			alt : styler.location.z,
			orientation : styler.orientation,
			color : styler.color,
			icon : styler.icon,
			timeStamp: timeStamp,
			selected:((typeof(options.selected) !== "undefined")? options.selected : false)
		});
	},

	/**
	 *
	 * @param styler
	 * @param timeStamp
	 * @param options
	 * @instance
	 * @memberof OSH.UI.View.CesiumView 
	 *
	 */
    updateDrapedImage: function(styler,timeStamp,options,snapshot) {
		
    	var llaPos = styler.platformLocation;
    	var camPos = Cesium.Cartesian3.fromDegrees(llaPos.x, llaPos.y, llaPos.z);
    	
    	var DTR = Math.PI/180.;
    	var attitude = styler.platformOrientation;
    	var gimbal = styler.gimbalOrientation;
    	
    	///////////////////////////////////////////////////////////////////////////////////
    	// compute rotation matrix to transform lookrays from camera frame to ECEF frame //
    	///////////////////////////////////////////////////////////////////////////////////
    	var nedTransform = Cesium.Transforms.northEastDownToFixedFrame(camPos);
    	var camRot = new Cesium.Matrix3();
    	Cesium.Matrix4.getRotation(nedTransform, camRot);    	
    	var rotM = new Cesium.Matrix3();
    	
        // UAV heading, pitch, roll (given in NED frame)
    	var uavHeading = Cesium.Matrix3.fromRotationZ(attitude.heading*DTR, rotM);
    	Cesium.Matrix3.multiply(camRot, uavHeading, camRot);    	
        var uavPitch = Cesium.Matrix3.fromRotationY(attitude.pitch*DTR, rotM);
        Cesium.Matrix3.multiply(camRot, uavPitch, camRot);
        var uavRoll = Cesium.Matrix3.fromRotationX(attitude.roll*DTR, rotM);
        Cesium.Matrix3.multiply(camRot, uavRoll, camRot);
        
        // gimbal angles (on solo gimbal, order is yaw, roll, pitch!)
        var gimbalYaw = Cesium.Matrix3.fromRotationZ(gimbal.heading*DTR, rotM);
        Cesium.Matrix3.multiply(camRot, gimbalYaw, camRot);
        var gimbalRoll = Cesium.Matrix3.fromRotationX(gimbal.roll*DTR, rotM);
        Cesium.Matrix3.multiply(camRot, gimbalRoll, camRot);
        var gimbalPitch = Cesium.Matrix3.fromRotationY((90+gimbal.pitch)*DTR, rotM);
        Cesium.Matrix3.multiply(camRot, gimbalPitch, camRot);
        
        // transform to camera frame
        var img2cam = Cesium.Matrix3.fromRotationZ(90*DTR, rotM);
        Cesium.Matrix3.multiply(camRot, img2cam, camRot);

        ////////////////////////////////////////////////////////////////////////////////////
        
    	var camProj = styler.cameraModel.camProj;
    	var camDistR = styler.cameraModel.camDistR;
    	var camDistT = styler.cameraModel.camDistT;
    	
    	var imgSrc = styler.imageSrc;
    	
    	//if (this.frameCount%60 == 0)
    	{
	    	/*var newImageDrapingPrimitive = this.viewer.scene.primitives.add(new Cesium.ImageDrapingPrimitive({
	            imageSrc: videoElt,
	            camPos: camPos,
	            camRot: camRot,
	            camProj: camProj,
	            camDistR: camDistR,
	            camDistT: camDistT,
	            asynchronous : true
	        }));
	        
	        // remove previous primitive
            if (styler.snapshotFunc == null) {
                if (this.imageDrapingPrimitive != null) {
                    this.viewer.scene.primitives.remove(this.imageDrapingPrimitive);
                }
                this.imageDrapingPrimitive = newImageDrapingPrimitive;
            }*/
    	    
    	    // snapshot
            if (snapshot) {
                var ctx = this.captureCanvas.getContext('2d');
                ctx.drawImage(imgSrc, 0, 0, this.captureCanvas.width, this.captureCanvas.height);
                imgSrc = this.captureCanvas;                
            }
    	    
    	    var encCamPos = Cesium.EncodedCartesian3.fromCartesian(camPos);
    	    var appearance = new Cesium.MaterialAppearance({
                material : new Cesium.Material({
                    fabric : {
                        type : 'Image',
                        uniforms : {
                            image : imgSrc,
                            camPosHigh : encCamPos.high,
                            camPosLow : encCamPos.low,
                            camAtt: Cesium.Matrix3.toArray(Cesium.Matrix3.transpose(camRot, new Cesium.Matrix3())),
                            camProj: Cesium.Matrix3.toArray(camProj),
                            camDistR: camDistR,
                            camDistT: camDistT
                        }
                    }
                }),
                vertexShaderSource: Cesium._shaders.ImageDrapingVS,
                fragmentShaderSource: Cesium._shaders.ImageDrapingFS
            });
    	    
    	    /*appearance = new Cesium.MaterialAppearance({
                material : new Cesium.Material({
                    fabric : {
                        type: 'Color',
                        uniforms : {
                            color : new Cesium.Color(1.0, 0.0, 0.0, 0.5)
                        }
                    }
                })
            });*/
    	    
    	    if (this.imageDrapingPrimitive === null || snapshot) {
    	        if (this.imageDrapingPrimitive === null)
    	            this.imageDrapingPrimitive = {};
    	        
    	        var promise = Cesium.sampleTerrain(this.viewer.terrainProvider, 11, [Cesium.Cartographic.fromDegrees(llaPos.x, llaPos.y)]);
    	        var that = this;
                Cesium.when(promise, function(updatedPositions) {
                    //console.log(updatedPositions[0]);
                    var newImageDrapingPrimitive = that.viewer.scene.primitives.add(new Cesium.Primitive({
                        geometryInstances: new Cesium.GeometryInstance({
                            geometry: new Cesium.RectangleGeometry({
                                rectangle: Cesium.Rectangle.fromDegrees(llaPos.x-0.1, llaPos.y-0.1, llaPos.x+0.1, llaPos.y+0.1),
                                height: updatedPositions[0].height-100,
                                extrudedHeight: llaPos.z-1
                            })
                        }), 
                        appearance: appearance
                    }));
                    
                    if (!snapshot)
                        that.imageDrapingPrimitive = newImageDrapingPrimitive;
                    
                    that.viewer.scene.primitives.raiseToTop(that.imageDrapingPrimitive);
                    that.imageDrapingPrimitiveReady = true;
                });                
    	        
    	    } else if (this.imageDrapingPrimitiveReady) {
    	        this.imageDrapingPrimitive.appearance = appearance;
    	    }
    	}
    	
    	this.frameCount++;
	},

	//---------- MAP SETUP --------------//
	/**
	 *
	 * @param $super
	 * @param options
	 * @instance
	 * @memberof OSH.UI.View.CesiumView 
	 */
	beforeAddingItems: function (options) {
		this.markers = {};
	    this.first = true;
	    
	    var imageryProviders = Cesium.createDefaultImageryProviderViewModels();
	    this.viewer = new Cesium.Viewer(this.divId, {
	    	baseLayerPicker: true,
	    	imageryProviderViewModels: imageryProviders,
	    	selectedImageryProviderViewModel: imageryProviders[6],
	    	timeline: false,
			homeButton: false,
			navigationInstructionsInitiallyVisible: false,
			navigationHelpButton: false,
			geocoder: true,
			fullscreenButton: false,
			showRenderLoopErrors: true,
			animation: false,
			targetFrameRate: 10,
        	scene3DOnly: true // for draw layer
	    });
	    
	    this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
	        url : '//assets.agi.com/stk-terrain/world'
	    });
	    
	    this.viewer.scene.copyGlobeDepth = true;
	    this.viewer.scene._environmentState.useGlobeDepthFramebuffer = true;
	    
	    var self = this;
	    Cesium.knockout.getObservable(this.viewer, '_selectedEntity').subscribe(function(entity) {
	        //change icon
            if (Cesium.defined(entity)) {
	        	var dataSrcIds = [];
	        	var entityId;
		    	for (var stylerId in self.stylerToObj) {
		    		if(self.stylerToObj[stylerId] === entity._dsid) {
		    			for(var i=0;i < self.stylers.length;i++) {
			    			if(self.stylers[i].getId() === stylerId) {
			    				dataSrcIds = dataSrcIds.concat(self.stylers[i].getDataSourcesIds());
			    				entityId = self.stylers[i].viewItem.entityId;
				    			break;
			    			}
		    			}
		    		}
		    	}

                OSH.EventManager.fire(OSH.EventManager.EVENT.SELECT_VIEW, {
                    dataSourcesIds: dataSrcIds,
                    entityId: entityId
                });
            } else {
                OSH.EventManager.fire(OSH.EventManager.EVENT.SELECT_VIEW, {
                    dataSourcesIds: [],
                    entityId: null
                });
            }
	    }.bind(this));
	},

	/**
	 *
	 * @param properties
	 * @returns {string}
	 * @instance
	 * @memberof OSH.UI.View.CesiumView 
	 */
	addMarker : function(properties) {
		
		var imgIcon = 'images/cameralook.png';
		if(properties.icon !== null) {
			imgIcon = properties.icon;
		}
		var isModel = imgIcon.endsWith(".glb");
        var name = "";
        if(properties.label) {
            name = properties.label;
        }
		var geom;
		
		if (isModel)
		{
			geom = {
				name: name,
				position : Cesium.Cartesian3.fromDegrees(0, 0, 0),
				model : {
					uri: imgIcon,
					scale: 4,
					modelM: Cesium.Matrix4.IDENTITY.clone()
				}
			};
		}
		else
		{
			geom = {
				//name: properties.label,
				position : Cesium.Cartesian3.fromDegrees(0, 0, 0),
				billboard : {
					image : imgIcon,
					rotation : Cesium.Math.toRadians(0),
					horizontalOrigin : Cesium.HorizontalOrigin.CENTER
				}
			};
		}
		
		var entity = this.viewer.entities.add(geom);
		var id = "view-marker-"+OSH.Utils.randomUUID();
		entity._dsid = id;
		this.markers[id] = entity;
		
		return id;
	},

	/**
	 *
	 * @param id
	 * @param properties
	 * @instance
	 * @memberof OSH.UI.View.CesiumView 
	 */
	updateMapMarker: function(id, properties) {
		var lon = properties.lon;
        var lat = properties.lat;
        var alt = properties.alt;
        var orient = properties.orientation;
        var imgIcon = properties.icon;
        
        if (!isNaN(lon) && !isNaN(lat)) {
        	var marker =  this.markers[id];
        	
        	// get ground altitude if non specified
        	if (typeof(alt) === "undefined" || isNaN(alt))
        	{
	    		alt = this.getAltitude(lat, lon);
	    		if (alt > 1)
	    			alt += 0.3;
    		}

    		// update position
        	var pos = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
    		marker.position = pos;
    		    		
    		// update orientation
    		if (typeof(orient) !== "undefined")
    	    {
    			var DTR = Math.PI/180.;
    			var heading = orient.heading;
	    		var pitch = 0.0;
	    		var roll = 0.0;
	    		var quat = Cesium.Transforms.headingPitchRollQuaternion(pos, new Cesium.HeadingPitchRoll(heading*DTR, /*roll*DTR*/0.0, pitch*DTR)); // inverse roll and pitch to go from NED to ENU
	    		marker.orientation = quat;
    	    }
    		
    		// update icon or models
    		marker.billboard.image = imgIcon;
    		
    		// zoom map if first marker update
    		if (this.first) {
    			this.viewer.zoomTo(this.viewer.entities, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-90), 2000));
    			this.first = false;
    		}
    		
    		if (properties.selected) {
    			 this.viewer.selectedEntity = marker;
    		}
        }
	},

	/**
	 *
	 * @param lat
	 * @param lon
	 * @returns {Number|undefined}
	 * @instance
	 * @memberof OSH.UI.View.CesiumView 
	 */
	getAltitude : function(lat, lon) {
		var position = Cesium.Cartesian3.fromDegrees(lon, lat, 0, this.viewer.scene.globe.ellipsoid, new Cesium.Cartesian3());
		var altitude = this.viewer.scene.globe.getHeight(Cesium.Ellipsoid.WGS84.cartesianToCartographic(position));

		if (altitude === 'undefined' || altitude <= 0)
			altitude = 0.1;
		return altitude;
	}
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @type {OSH.UI.View}
 * @augments OSH.UI.View.MapView
 * @example
 var leafletMapView = new OSH.UI.View.LeafletView("",
 [{
            styler :  pointMarker,
            contextMenuId: circularContextMenuId,
            name : "Android Phone GPS",
            entityId : androidEntity.id
        },
 {
     styler : new OSH.UI.Styler.Polyline({
         locationFunc : {
             dataSourceIds : [androidPhoneGpsDataSource.getId()],
             handler : function(rec) {
                 return {
                     x : rec.lon,
                     y : rec.lat,
                     z : rec.alt
                 };
             }
         },
         color : 'rgba(0,0,255,0.5)',
         weight : 10,
         opacity : .5,
         smoothFactor : 1,
         maxPoints : 200
     }),
     name : "Android Phone GPS Path",
     entityId : androidEntity.id
 }]
 );
 */
OSH.UI.View.LeafletView = OSH.UI.View.MapView.extend({
    initialize: function (parentElementDivId, viewItems, options) {
        this._super(parentElementDivId, viewItems, options);

        var cssClass = document.getElementById(this.divId).className;
        document.getElementById(this.divId).setAttribute("class", cssClass+" "+this.css);
    },

    /**
     *
     * @param $super
     * @param options
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    beforeAddingItems: function (options) {
        // inits the map
        this.initMap(options);
        this.initEvents();
    },

    /**
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    initEvents: function () {
        // removes default right click
        document.getElementById(this.divId).oncontextmenu = function (e) {
            var evt = new Object({keyCode: 93});
            if (e.preventDefault != undefined)
                e.preventDefault();
            if (e.stopPropagation != undefined)
                e.stopPropagation();
        };
    },

    //---------- MAP SETUP --------------//
    /**
     *
     * @param options
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    initMap: function (options) {

        var initialView = {
            location: new L.LatLng(0, 0),
            zoom: 3
        };
        this.first = true;
        var defaultLayers = this.getDefaultLayers();

        var defaultLayer = defaultLayers[0].layer;

        var baseLayers = {};
        var overlays = {};

        baseLayers[defaultLayers[0].name] = defaultLayers[0].layer;
        overlays[defaultLayers[1].name] = defaultLayers[1].layer;

        if (typeof(options) != "undefined") {
            if (options.initialView) {
                initialView = {
                    location: new L.LatLng(options.initialView.lat, options.initialView.lon),
                    zoom: options.initialView.zoom
                }
            }
            // checks autoZoom
            if (!options.autoZoomOnFirstMarker) {
                this.first = false;
            }

            // checks overlayers
            if (options.overlayLayers) {
                overlays = options.overlayLayers;
            }

            // checks baseLayer
            if (options.baseLayers) {
                baseLayers = options.baseLayers;
            }

            // checks defaultLayer
            if (options.defaultLayer) {
                defaultLayer = options.defaultLayer;
            }
        }

        // sets layers to map
        this.map = new L.Map(this.divId, {
            fullscreenControl: true,
            layers: defaultLayer
        });

        L.control.layers(baseLayers, overlays).addTo(this.map);

        this.map.setView(initialView.location, initialView.zoom);
        //this.initLayers();
        this.markers = {};
        this.polylines = {};
    },

    /**
     *
     * @returns {{}}
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    getDefaultBaseLayers: function () {
        return {};
    },

    getDefaultLayers: function (options) {
        var maxZoom = 22;
        if (typeof(options) != "undefined" && options.maxZoom) {
            maxZoom = options.maxZoom;
        }
        // copyrights
        var mbAttr = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            mbUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        var esriLink = '<a href="http://www.esri.com/">Esri</a>';
        var esriWholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

        // leaflet layers
        var esriLayer = L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; ' + esriLink + ', ' + esriWholink,
                maxZoom: maxZoom,
                maxNativeZoom: 19
            });

        var streets = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr, maxZoom: maxZoom});

        return [{
            name: "OSM Streets",
            layer: streets
        }, {
            name: "Esri Satellite",
            layer: esriLayer
        }];
    },

    /**
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    initLayers: function () {
        // create the tile layer with correct attribution
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.tileLayer(osmUrl, {
            minZoom: 1,
            maxZoom: 22,
            attribution: osmAttrib
        });
        this.map.addLayer(osm);
    },

    //---------- FEATURES SETUP --------------//

    addMarker: function (properties) {
        //create marker
        var marker = null;
        if (properties.icon != null) {
            var markerIcon = L.icon({
                iconAnchor: properties.iconAnchor,
                iconUrl: properties.icon
            });

            marker = L.marker([properties.lat, properties.lon], {
                icon: markerIcon
            });
        } else {
            marker = L.marker([properties.lat, properties.lon]);
        }

        marker.bindPopup(properties.name);

        //TODO:for selected marker event
        //this.marker.on('click',this.onClick.bind(this));

        marker.addTo(this.map);
        marker.setRotationAngle(properties.orientation);

        var id = "view-marker-" + OSH.Utils.randomUUID();
        this.markers[id] = marker;

        if (this.first === true) {
          this.map.setView(new L.LatLng(properties.lat, properties.lon), 19);
          this.first = false;
        }
        var self = this;

        marker._icon.id = id;

        // adds onclick event
        marker.on('click', function () {
            var dataSourcesIds = [];
            var entityId;
            for (var stylerId in self.stylerToObj) {
                if (self.stylerToObj[stylerId] == id) {
                    var styler = self.stylerIdToStyler[stylerId];
                    OSH.EventManager.fire(OSH.EventManager.EVENT.SELECT_VIEW,{
                        dataSourcesIds: dataSourcesIds.concat(styler.getDataSourcesIds()),
                        entityId : styler.viewItem.entityId
                    });
                    break;
                }
            }
        });

        document.getElementById(id).oncontextmenu = function (e) {
            var evt = new Object({keyCode: 93});

            if (e.preventDefault != undefined)
                e.preventDefault();
            if (e.stopPropagation != undefined)
                e.stopPropagation();

            // gets the corresponding styler
            for(var stylerId in self.stylerToObj) {
                if(self.stylerToObj[stylerId] == id) {
                    // does not send event if the viewItem does not handle conte
                    if(OSH.Utils.hasOwnNestedProperty(self.stylerIdToStyler[stylerId],"viewItem.contextMenuId")) {
                        OSH.EventManager.fire(OSH.EventManager.EVENT.CONTEXT_MENU + "-" + self.stylerIdToStyler[stylerId].viewItem.contextMenuId, {
                            //TODO: values have to be provided by properties
                            offsetX: -70,
                            offsetY: -70,
                            action: "show",
                            x: OSH.Utils.getXCursorPosition(),
                            y: OSH.Utils.getYCursorPosition(),
                            drawLineTo: id
                        });
                    }
                    break;
                }
            }


        }.bind(this);

        return id;
    },

    /**
     *
     * @param properties
     * @returns {string}
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    addPolyline: function (properties) {
        var polylinePoints = [];

        for (var i = 0; i < properties.locations.length; i++) {
            polylinePoints.push(new L.LatLng(properties.locations[i].y, properties.locations[i].x));
        }

        //create path
        var polyline = new L.Polyline(polylinePoints, {
            color: properties.color,
            weight: properties.weight,
            opacity: properties.opacity,
            smoothFactor: properties.smoothFactor
        }).addTo(this.map);

        var id = "view-polyline-" + OSH.Utils.randomUUID();
        this.polylines[id] = polyline;

        return id;
    },

    /**
     * Remove marker from the map
     * @param styler
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    removeMarker:function(styler) {
        if(styler.id in this.stylerIdToStyler) {
            var markerId = this.stylerToObj[styler.getId()];
            var marker = this.markers[markerId];
            this.map.removeLayer(marker);
        }
    },

    /**
     *
     * @param styler
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    updateMarker: function (styler) {
        var markerId = 0;
        if (!(styler.getId() in this.stylerToObj)) {
            // adds a new marker to the leaflet renderer
            markerId = this.addMarker({
                lat: styler.location.y,
                lon: styler.location.x,
                orientation: styler.orientation.heading,
                color: styler.color,
                icon: styler.icon,
                iconAnchor: styler.iconAnchor,
                name: this.names[styler.getId()]
            });
            this.stylerToObj[styler.getId()] = markerId;
        } else {
            markerId = this.stylerToObj[styler.getId()];
        }

        var marker = this.markers[markerId];

        if(!isUndefinedOrNull(styler.viewItem)) {
            marker.bindPopup(styler.viewItem.name);
        }

        // updates position
        var lon = styler.location.x;
        var lat = styler.location.y;

        if (!isNaN(lon) && !isNaN(lat)) {
            var newLatLng = new L.LatLng(lat, lon);
            marker.setLatLng(newLatLng);
        }


        // updates orientation
        if(typeof styler.orientation != "undefined") {
            marker.setRotationAngle(styler.orientation.heading);
        }

        if (styler.icon != null && marker._icon.iconUrl != styler.icon) {
            // updates icon
            var markerIcon = L.icon({
                iconAnchor: [16, 16],
                iconUrl: styler.icon
            });
            marker.setIcon(markerIcon);
        }
    },



    /**
     *
     * @param styler
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    updatePolyline: function (styler) {
        var polylineId = 0;

        if (!(styler.getId() in this.stylerToObj)) {
            // adds a new marker to the leaflet renderer
            polylineId = this.addPolyline({
                color: styler.color,
                weight: styler.weight,
                locations: styler.locations,
                maxPoints: styler.maxPoints,
                opacity: styler.opacity,
                smoothFactor: styler.smoothFactor
            });

            this.stylerToObj[styler.getId()] = polylineId;
        } else {
            polylineId = this.stylerToObj[styler.getId()];
        }

        if (polylineId in this.polylines) {
            var polyline = this.polylines[polylineId];

            // removes the layer
            this.map.removeLayer(polyline);

            var polylinePoints = [];
            for (var i = 0; i < styler.locations.length; i++) {
                polylinePoints.push(new L.LatLng(styler.locations[i].y, styler.locations[i].x));
            }

            //create path
            var polyline = new L.Polyline(polylinePoints, {
                color: styler.color,
                weight: styler.weight,
                opacity: styler.opacity,
                smoothFactor: styler.smoothFactor
            }).addTo(this.map);

            this.polylines[polylineId] = polyline;
        }
    },

    /**
     *
     * @param $super
     * @param parentElement
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    attachTo:function(parentElement) {
        this._super(parentElement);
        // Fix leaflet bug when resizing the div parent container
        this.map.invalidateSize();
    },

    /**
     *
     * @param $super
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    onResize:function($super) {
        this._super();
        this.map.invalidateSize();
    },
});

/***  little hack starts here ***/

L.Map = L.Map.extend({
    openPopup: function (popup) {
        this._popup = popup;
        return this.addLayer(popup).fire('popupopen', {
            popup: this._popup
        });
    }
});

// Defines rotated marker
(function () {
    // save these original methods before they are overwritten
    var proto_initIcon = L.Marker.prototype._initIcon;
    var proto_setPos = L.Marker.prototype._setPos;

    var oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

    L.Marker.addInitHook(function () {
        var iconAnchor = this.options.icon.options.iconAnchor;
        if (iconAnchor) {
            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
        }
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom';
        this.options.rotationAngle = this.options.rotationAngle || 0;
    });

    L.Marker.include({
        _initIcon: function () {
            proto_initIcon.call(this);
        },

        _setPos: function (pos) {
            proto_setPos.call(this, pos);

            if (this.options.rotationAngle) {
                this._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;

                if (oldIE) {
                    // for IE 9, use the 2D rotation
                    this._icon.style[L.DomUtil.TRANSFORM] = ' rotate(' + this.options.rotationAngle + 'deg)';
                } else {
                    // for modern browsers, prefer the 3D accelerated version
                    this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
                }
            }
        },

        setRotationAngle: function (angle) {
            this.options.rotationAngle = angle;
            this.update();
            return this;
        },

        setRotationOrigin: function (origin) {
            this.options.rotationOrigin = origin;
            this.update();
            return this;
        }
    });
})();


/***  end of hack ***/

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @type {OSH.UI.View}
 * @augments OSH.UI.View.MapView
 */
OSH.UI.View.OpenLayerView = OSH.UI.View.MapView.extend({
    initialize: function (parentElementDivId, viewItems, options) {
        this._super(parentElementDivId, viewItems, options);
        this.onResize();
    },

    /**
     *
     * @param $super
     * @param options
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    beforeAddingItems: function (options) {
        // inits the map
        this.initMap(options);

        //events will NOT automatically be added to the map, if one is provided by the user
        if(typeof(options) == "undefined" || !options.map)
            this.initEvents();
    },


    /**
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    initEvents: function () {
        // removes default right click
        document.getElementById(this.divId).oncontextmenu = function (e) {
            var evt = new Object({keyCode: 93});
            if (e.preventDefault != undefined)
                e.preventDefault();
            if (e.stopPropagation != undefined)
                e.stopPropagation();
        };

        var self = this;

        this.map.getViewport().addEventListener('contextmenu', function (e) {
            e.preventDefault();

            var feature = self.map.forEachFeatureAtPixel(self.map.getEventPixel(e),
                function (feature, layer) {
                    return feature;
                });
            if (feature) {
                var id = feature.ha;

                // gets the corresponding styler
                for(var stylerId in self.stylerToObj) {
                    if(self.stylerToObj[stylerId] == id) {
                        OSH.EventManager.fire(OSH.EventManager.EVENT.CONTEXT_MENU+"-"+self.stylerIdToStyler[stylerId].viewItem.contextMenuId,{
                            //TODO: values have to be provided by properties
                            offsetX: -70,
                            offsetY: -70,
                            action : "show",
                            x:OSH.Utils.getXCursorPosition(),
                            y:OSH.Utils.getYCursorPosition()
                        });
                        break;
                    }
                }
            }
        });

        this.map.on("click", function(e) {
            self.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                var id = feature.ha;
                var dataSourcesIds = [];
                var entityId;
                for (var stylerId in self.stylerToObj) {
                    if (self.stylerToObj[stylerId] == id) {
                        var styler = self.stylerIdToStyler[stylerId];
                        OSH.EventManager.fire(OSH.EventManager.EVENT.SELECT_VIEW,{
                            dataSourcesIds: dataSourcesIds.concat(styler.getDataSourcesIds()),
                            entityId : styler.viewItem.entityId
                        });
                        break;
                    }
                }
            });
        });
    },

    /**
     *
     * @param styler
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    updateMarker: function (styler) {
        var markerId = 0;

        if (!(styler.getId() in this.stylerToObj)) {
            // adds a new marker to the leaflet renderer
            markerId = this.addMarker({
                lat: styler.location.y,
                lon: styler.location.x,
                orientation: styler.orientation.heading,
                color: styler.color,
                icon: styler.icon,
                name: this.names[styler.getId()]
            });

            this.stylerToObj[styler.getId()] = markerId;
        } else {
            markerId = this.stylerToObj[styler.getId()];
        }

        var markerFeature = this.markers[markerId];
        // updates position
        var lon = styler.location.x;
        var lat = styler.location.y;

        if (!isNaN(lon) && !isNaN(lat)) {
            var coordinates = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:900913');
            markerFeature.getGeometry().setCoordinates(coordinates);
        }

        // updates orientation
        if (styler.icon != null) {
            // updates icon
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    opacity: 0.75,
                    src: styler.icon,
                    rotation: styler.orientation.heading * Math.PI / 180
                }))
            });
            markerFeature.setStyle(iconStyle);
        }
    },

    /**
     *
     * @param styler
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    updatePolyline: function (styler) {
        var polylineId = 0;

        if (!(styler.getId() in this.stylerToObj)) {
            // adds a new marker to the leaflet renderer
            polylineId = this.addPolyline({
                color: styler.color,
                weight: styler.weight,
                locations: styler.locations,
                maxPoints: styler.maxPoints,
                opacity: styler.opacity,
                smoothFactor: styler.smoothFactor,
                name: this.names[styler.getId()]
            });

            this.stylerToObj[styler.getId()] = polylineId;
        } else {
            polylineId = this.stylerToObj[styler.getId()];
        }

        //TODO: handle opacity, smoothFactor, color and weight
        if (polylineId in this.polylines) {
            var geometry = this.polylines[polylineId];

            var polylinePoints = [];
            for (var i = 0; i < styler.locations.length; i++) {
                polylinePoints.push(ol.proj.transform([styler.locations[i].x, styler.locations[i].y], 'EPSG:4326', 'EPSG:900913'))
            }

            geometry.setCoordinates(polylinePoints);
        }
    },

    //---------- MAP SETUP --------------//
    /**
     *
     * @param options
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    initMap: function (options) {

        var initialView = null;
        this.first = true;
        var overlays = [];
        var defaultLayer = null;
        this.markers = {};
        this.polylines = {};

        var baseLayers = this.getDefaultLayers();

        if (typeof(options) != "undefined") {
            var maxZoom = 19;

            //if the user passed in a map then use that one, don't make a new one
            if(options.map) {
                this.map = options.map;
                return;
            }

            if (options.maxZoom) {
                maxZoom = options.maxZoom;
            }
            if (options.initialView) {
                initialView = new ol.View({
                    center: ol.proj.transform([options.initialView.lon, options.initialView.lat], 'EPSG:4326', 'EPSG:900913'),
                    zoom: options.initialView.zoom,
                    maxZoom: maxZoom
                });
            }
            // checks autoZoom
            if (!options.autoZoomOnFirstMarker) {
                this.first = false;
            }

            // checks overlayers
            if (options.overlayLayers) {
                overlays = options.overlayLayers;
            }

            // checks baseLayer
            if (options.baseLayers) {
                baseLayers = options.baseLayers;
            }

            // checks defaultLayer
            if (options.defaultLayer) {
                defaultLayer = options.defaultLayer;
            }
        } else {
            // loads the default one
            initialView = new ol.View({
                center: ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:900913'),
                zoom: 11,
                maxZoom: maxZoom
            });
        }

        // sets layers to map
        //create map
        this.map = new ol.Map({
            target: this.divId,
            controls: ol.control.defaults({
                attributionOptions: ({
                    collapsible: false
                })
            }).extend([
                new ol.control.ZoomSlider(),
                new ol.control.Rotate(),
                new ol.control.ScaleLine(),
            ]),
            // interactions and controls are seperate entities in ol3
            // we extend the default navigation with a hover select interaction
            interactions: ol.interaction.defaults().extend([
                new ol.interaction.Select({
                    condition: ol.events.condition.mouseMove
                })
            ]),
            layers: [
                new ol.layer.Group({
                    'title': 'Base maps',
                    layers: baseLayers
                }),
                new ol.layer.Group({
                    title: 'Overlays',
                    layers: overlays
                })
            ],
            view: initialView,

        });

        var layerSwitcher = new ol.control.LayerSwitcher({
            tipLabel: 'Layers' // Optional label for button
        });

        this.map.addControl(layerSwitcher);

        // inits onClick events
        var select_interaction = new ol.interaction.Select();

        var self = this;
        select_interaction.getFeatures().on("add", function (e) {
            var feature = e.element; //the feature selected
            var dataSourcesIds = [];
            var entityId;
            for (var stylerId in self.stylerToObj) {
                if (self.stylerToObj[stylerId] == feature.getId()) {
                    var styler = self.stylerIdToStyler[stylerId];
                    OSH.EventManager.fire(OSH.EventManager.EVENT.SELECT_VIEW,{
                        dataSourcesIds: dataSourcesIds.concat(styler.getDataSourcesIds()),
                        entityId : styler.viewItem.entityId
                    });
                    break;
                }
            }
        });

        this.map.addInteraction(select_interaction);
    },

    /**
     *
     * @returns {Object}
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    getDefaultBaseLayers: function () {
        return {};
    },


    /**
     *
     * @returns {Array}
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    getDefaultLayers: function () {
        var osm = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        });
        return [osm];
    },

    /**
     *
     * @param properties
     * @returns {string}
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    addMarker: function (properties) {
        //create marker
        var marker = new ol.geom.Point(ol.proj.transform([properties.lon, properties.lat], 'EPSG:4326', 'EPSG:900913'));
        var markerFeature = new ol.Feature({
            geometry: marker,
            name: 'Marker' //TODO
        });

        if (properties.icon != null) {
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    opacity: 0.75,
                    src: properties.icon,
                    rotation: properties.orientation * Math.PI / 180
                }))
            });
            markerFeature.setStyle(iconStyle);
        }


        //TODO:for selected marker event
        //this.marker.on('click',this.onClick.bind(this));
        var vectorMarkerLayer =
            new ol.layer.Vector({
                title: properties.name,
                source: new ol.source.Vector({
                    features: [markerFeature]
                })
            });

        this.map.addLayer(vectorMarkerLayer);

        var id = "view-marker-" + OSH.Utils.randomUUID();
        markerFeature.setId(id);
        this.markers[id] = markerFeature;

        if (this.first) {
            this.first = false;
            this.map.getView().setCenter(ol.proj.transform([properties.lon, properties.lat], 'EPSG:4326', 'EPSG:900913'));
            this.map.getView().setZoom(19);
        }

        return id;
    },

    /**
     *
     * @param styler
     * @returns {string} the id of the newly created marker, or the id of the marker if it already exists from the current styler
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    createMarkerFromStyler: function (styler) {
        //This method is intended to create a marker object only for the OpenLayerView. It does not actually add it
        //to the view or map to give the user more control
        if (!(styler.getId() in this.stylerToObj)) {

            var properties = {
                lat: styler.location.y,
                lon: styler.location.x,
                orientation: styler.orientation.heading,
                color: styler.color,
                icon: styler.icon,
                name: this.names[styler.getId()]
            }

            //create marker
            var marker = new ol.geom.Point(ol.proj.transform([properties.lon, properties.lat], 'EPSG:4326', 'EPSG:900913'));
            var markerFeature = new ol.Feature({
                geometry: marker,
                name: 'Marker' //TODO
            });

            if (properties.icon != null) {
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        opacity: 0.75,
                        src: properties.icon,
                        rotation: properties.orientation * Math.PI / 180
                    })
                });
                markerFeature.setStyle(iconStyle);
            }
            var id = "view-marker-" + OSH.Utils.randomUUID();
            markerFeature.setId(id);
            this.markers[id] = markerFeature;
            this.stylerToObj[styler.getId()] = id;
            return id;

        } else {
            return this.stylerToObj[styler.getId()];
        }
    },


    /**
     *
     * @param properties
     * @returns {string}
     * @instance
     * @memberof OSH.UI.View.OpenLayerView
     */
    addPolyline: function (properties) {
        var polylinePoints = [];

        for (var i = 0; i < properties.locations.length; i++) {
            polylinePoints.push(ol.proj.transform([properties.locations[i].x, properties.locations[i].y], 'EPSG:4326', 'EPSG:900913'))
        }

        //create path
        var pathGeometry = new ol.geom.LineString(polylinePoints);
        var feature = new ol.Feature({
            geometry: pathGeometry,
            name: 'Line'
        });
        var source = new ol.source.Vector({
            features: [feature]
        });

        var vectorPathLayer = new ol.layer.Vector({
            title: properties.name,
            source: source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: properties.color
                }),
                stroke: new ol.style.Stroke({
                    color: properties.color,
                    width: properties.weight
                })
            })
        });

        this.map.addLayer(vectorPathLayer);
        var id = "view-polyline-" + OSH.Utils.randomUUID();
        this.polylines[id] = pathGeometry;

        return id;
    },

    /**
     *
     * @param $super
     * @instance
     * @memberof OSH.UI.View.LeafletView
     */
    onResize:function($super) {
        this._super();
        this.map.updateSize();
    },
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 *
 * @class
 * @classdesc
 * @type {OSH.UI.View}
 * @augments OSH.UI.View
 *
 */
var htmlTaskingComponent="";
htmlTaskingComponent += "<div class=\"ptz-zoom\">";
htmlTaskingComponent += "   <div class=\"ptz-zoom-in\"><i class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i></div>";
htmlTaskingComponent += "   <div class=\"ptz-zoom-bar\"></div>";
htmlTaskingComponent += "   <div class=\"ptz-zoom-out\"><i class=\"fa fa-minus-circle\" aria-hidden=\"true\"></i></div>";
htmlTaskingComponent += "<\/div>";
htmlTaskingComponent += "<div class=\"ptz\">";
htmlTaskingComponent += "   <div tag=\"0\" class='moveUp' name=\"\"><\/div>";
htmlTaskingComponent += "   <div tag=\"91\" class='moveTopLeft' name=\"\"><\/div>";
htmlTaskingComponent += "   <div tag=\"90\" class=\"moveTopRight\" name=\"\"><\/div>";
htmlTaskingComponent += "   <div tag=\"6\" class=\"moveLeft\" name=\"\"><\/div>";
htmlTaskingComponent += "   <div cmd=\"ptzReset\" class=\"reset\" title=\"Center\" name=\"\"><\/div>";
htmlTaskingComponent += "   <div tag=\"4\" class=\"moveRight\" name=\"\"><\/div>";
htmlTaskingComponent += "   <div tag=\"93\" class=\"moveBottomLeft\" name=\"\"><\/div>";
htmlTaskingComponent += "   <div tag=\"92\" class=\"moveBottomRight\" name=\"\"><\/div>";
htmlTaskingComponent += "   <div tag=\"2\" class=\"moveDown\" name=\"\"><\/div>";
htmlTaskingComponent += "<\/div>";
htmlTaskingComponent += "<div class=\"ptz-right\">";
htmlTaskingComponent += "<ul>";
htmlTaskingComponent += "            <li>";
htmlTaskingComponent += "                <label>Presets:<\/label>";
htmlTaskingComponent += "                <div class=\"ptz-select-style\">";
htmlTaskingComponent += "                     <select class=\"ptz-presets\" required pattern=\"^(?!Select a Preset).*\">";
htmlTaskingComponent += "                         <option value=\"\" disabled selected>Select a Preset<\/option>";
htmlTaskingComponent += "                     <\/select>";
htmlTaskingComponent += "                <\/div>";
htmlTaskingComponent += "            <\/li>";
htmlTaskingComponent += "</ul>";
htmlTaskingComponent += "<\/div>";

OSH.UI.View.PtzTaskingView = OSH.UI.View.extend({
    initialize: function (divId, options) {
        this._super(divId,[],options);
        var width = "640";
        var height = "480";
        this.css = "tasking";

        this.cssSelected = "";

        if(typeof (options) !== "undefined") {
            if (options.width) {
                width = options.width;
            }

            if (options.height) {
                height = options.height;
            }

            if (options.css) {
                this.css += options.css;
            }

            if (options.cssSelected) {
                this.cssSelected = options.cssSelected;
            }

            if(options.dataSenderId) {
                this.dataSenderId = options.dataSenderId;
            }
        }

        // creates video tag element
        this.rootTag = document.createElement("div");
        this.rootTag.setAttribute("height", height);
        this.rootTag.setAttribute("width", width);
        this.rootTag.setAttribute("class", this.css);
        this.rootTag.setAttribute("id", "dataview-" + OSH.Utils.randomUUID());

        // appends <img> tag to <div>
        document.getElementById(this.divId).appendChild(this.rootTag);

        this.rootTag.innerHTML = htmlTaskingComponent;

        this.pan = 0;
        this.tilt = 0;
        this.zoom = 0;

        var increment = 5;

        this.observers = [];

        document.querySelector('#'+this.rootTag.id+ " >  .ptz > .moveUp").onclick = function(){this.onTiltClick(increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz > .moveTopLeft").onclick = function(){this.onTiltPanClick(-1*increment,increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz > .moveTopRight").onclick =  function(){this.onTiltPanClick(increment,increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz > .moveRight").onclick =  function(){this.onPanClick(increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz > .moveLeft").onclick =  function(){this.onPanClick(-1*increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz > .moveDown").onclick =  function(){this.onTiltClick(-1*increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz > .moveBottomLeft").onclick = function(){this.onTiltPanClick(-1*increment,-1*increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz > .moveBottomRight").onclick =  function(){this.onTiltPanClick(increment,-1*increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz-zoom > .ptz-zoom-in").onclick =  function(){this.onZoomClick(increment)}.bind(this);
        document.querySelector('#'+this.rootTag.id+ " >  .ptz-zoom > .ptz-zoom-out").onclick =  function(){this.onZoomClick(-1*increment)}.bind(this);

        // add presets if any
        if(typeof (options) !== "undefined" && (options.presets)) {
            this.addPresets(options.presets);

            // add listeners
            document.querySelector('#'+this.rootTag.id+ "  .ptz-right  .ptz-select-style  .ptz-presets").onchange = this.onSelectedPresets.bind(this);
        }
    },

    /**
     *
     * @param presets array
     * @instance
     * @memberof OSH.UI.View.PtzTaskingView
     */
    addPresets:function(presetsArr) {
        var selectTag = document.querySelector('#'+this.rootTag.id+ "  .ptz-right  .ptz-select-style  .ptz-presets");
        for(var i in presetsArr) {
            var option = document.createElement("option");
            option.text = presetsArr[i];
            option.value = presetsArr[i];
            selectTag.add(option);
        }
    },

    /**
     *
     * @param event
     * @memberof OSH.UI.View.PtzTaskingView
     * @instance
     */
    onSelectedPresets : function(event) {
        var serverTag = document.querySelector('#'+this.rootTag.id+ "  .ptz-right  .ptz-select-style  .ptz-presets");
        var option = serverTag.options[serverTag.selectedIndex];
        this.onChange(null,null,null,option.value);
    },

    /**
     *
     * @param interval
     * @instance
     * @memberof OSH.UI.View.PtzTaskingView
     */
    removeInterval: function(interval) {
        if(this.timerIds.length > 0) {
            setTimeout(clearInterval(this.timerIds.pop()),interval+50);
        }
    },

    /**
     *
     * @param value
     * @instance
     * @memberof OSH.UI.View.PtzTaskingView
     */
    onTiltClick: function (value) {
        this.tilt += value;
        this.onChange(null,value,null,null);
    },

    /**
     *
     * @param tiltValue the titl value
     * @param panValue the panValue value
     * @instance
     * @memberof OSH.UI.View.PtzTaskingView
     */
    onTiltPanClick:function(tiltValue,panValue) {
        this.tilt += tiltValue;
        this.pan += panValue;

        this.onChange(tiltValue,panValue,null,null);
    },

    /**
     *
     * @param value
     * @instance
     * @memberof OSH.UI.View.PtzTaskingView
     */
    onPanClick: function(value) {
        this.pan += value;
        this.onChange(value,null,null,null);
    },

    /**
     *
     * @param value
     * @instance
     * @memberof OSH.UI.View.PtzTaskingView
     */
    onZoomClick: function(value) {
        this.zoom += value;
        this.onChange(null,null,value,null);
    },

    /**
     *
     * @param rpan
     * @param rtilt
     * @param rzoom
     * @instance
     * @memberof OSH.UI.View.PtzTaskingView
     */
    onChange: function(rpan, rtilt, rzoom,preset) {
        OSH.EventManager.fire(OSH.EventManager.EVENT.PTZ_SEND_REQUEST+"-"+this.dataSenderId,{
            cmdData : {rpan:rpan,rtilt:rtilt,rzoom:rzoom,preset:preset},
            onSuccess:function(event){console.log("Failed to send request: "+event);},
            onError:function(event){console.log("Request sent successfully: "+event);}
        });
    }
});


/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @type {OSH.UI.View}
 * @augments OSH.UI.View
 * @example
 var videoView = new OSH.UI.View.FFMPEGView("videoContainer-id", [{
        styler: new OSH.UI.Styler.Video({
            frameFunc: {
                dataSourceIds: [videoDataSource.id],
                handler: function (rec, timestamp, options) {
                    return rec;
                }
            }
        }),
        name: "H264 ViDEO",
        entityId:entityId
    }], {
    css: "video",
    cssSelected: "video-selected",
    name: "Video",
    useWorker:true
});
 */
OSH.UI.View.FFMPEGView = OSH.UI.View.VideoView.extend({
    initialize: function (divId, viewItems,options) {
        this._super(divId, viewItems,options);

        this.useWorker = OSH.Utils.isWebWorker();
        this.resetCalled = true;
        this.useWebWorkerTransferableData = false;

        var width = 1920;
        var height = 1080;

        if (!isUndefinedOrNull(options)) {
            if (options.width) {
                width = options.width;
            }

            if (options.height) {
                height = options.height;
            }

            this.useWorker = (!isUndefinedOrNull(options.useWorker)) && (options.useWorker) && (OSH.Utils.isWebWorker());

            if(!isUndefinedOrNull(options.adjust) && options.adjust) {
                var divElt = document.getElementById(this.divId);
                if(divElt.offsetWidth < width) {
                    width = divElt.offsetWidth;
                }
                if(divElt.offsetHeight < height) {
                    height = divElt.offsetHeight;
                }
            }

            if(!isUndefinedOrNull(options.useWebWorkerTransferableData) &&  options.useWebWorkerTransferableData) {
                this.useWebWorkerTransferableData = options.useWebWorkerTransferableData;
            }
        }

        // create webGL canvas
        this.yuvCanvas = new YUVCanvas({width: width, height: height, contextOptions: {preserveDrawingBuffer: true}});
        var domNode = document.getElementById(this.divId);

        domNode.appendChild(this.yuvCanvas.canvasElement);

        // add selection listener
        var self = this;

        if (this.useWorker) {
            this.initFFMPEG_DECODER_WORKER();
        } else {
            this.initFFMEG_DECODER();
        }
    },

    /**
     *
     * @param styler
     * @instance
     * @memberof OSH.UI.View.FFMPEGView
     */
    updateFrame: function (styler) {
        this._super(styler);

        var pktData = styler.frame;
        var pktSize = pktData.length;

        this.resetCalled = false;

        if (this.useWorker) {
            this.decodeWorker(pktSize, pktData);
        } else {
            var decodedFrame = this.decode(pktSize, pktData);
            if(!isUndefinedOrNull(decodedFrame)) {
                // adjust canvas size to fit to the decoded frame
                if(decodedFrame.frame_width !== this.yuvCanvas.width) {
                    this.yuvCanvas.canvasElement.width = decodedFrame.frame_width;
                    this.yuvCanvas.width = decodedFrame.frame_width;
                }
                if(decodedFrame.frame_height !== this.yuvCanvas.height) {
                    this.yuvCanvas.canvasElement.height = decodedFrame.frame_height;
                    this.yuvCanvas.height = decodedFrame.frame_height;
                }

                this.yuvCanvas.drawNextOuptutPictureGL({
                    yData: decodedFrame.frameYData,
                    yDataPerRow: decodedFrame.frame_width,
                    yRowCnt: decodedFrame.frame_height,
                    uData: decodedFrame.frameUData,
                    uDataPerRow: decodedFrame.frame_width / 2,
                    uRowCnt: decodedFrame.frame_height / 2,
                    vData: decodedFrame.frameVData,
                    vDataPerRow: decodedFrame.frame_width / 2,
                    vRowCnt: decodedFrame.frame_height / 2
                });

                this.updateStatistics();
                this.onAfterDecoded();
            }
        }

        //check for flush
        this.checkFlush();
    },


    /**
     * @instance
     * @memberof OSH.UI.View.FFMPEGView
     */
    reset: function () {
        _avcodec_flush_buffers(this.av_ctx);
        // clear canvas
        this.resetCalled = true;
        var nodata = new Uint8Array(1);
        this.yuvCanvas.drawNextOuptutPictureGL({
            yData: nodata,
            yDataPerRow: 1,
            yRowCnt: 1,
            uData: nodata,
            uDataPerRow: 1,
            uRowCnt: 1,
            vData: nodata,
            vDataPerRow: 1,
            vRowCnt: 1
        });
    },

    //-- FFMPEG DECODING PART

    //-------------------------------------------------------//
    //---------- Web worker --------------------------------//
    //-----------------------------------------------------//

    /**
     * The worker code is located at the location js/workers/FFMPEGViewWorker.js.
     * This location cannot be changed. Be sure to have the right file at the right place.
     * @instance
     * @memberof OSH.UI.View.FFMPEGView
     * @param callback
     */
    initFFMPEG_DECODER_WORKER: function (callback) {
        this.worker = new Worker(window.OSH.BASE_WORKER_URL+'/osh-UI-FFMPEGViewWorker.js');

        var self = this;
        this.worker.onmessage = function (e) {
            var decodedFrame = e.data;

            if (!this.resetCalled) {
                self.yuvCanvas.canvasElement.drawing = true;
                // adjust canvas size to fit to the decoded frame
                if(decodedFrame.frame_width != self.yuvCanvas.width) {
                    self.yuvCanvas.canvasElement.width = decodedFrame.frame_width;
                    self.yuvCanvas.width = decodedFrame.frame_width;
                }
                if(decodedFrame.frame_height != self.yuvCanvas.height) {
                    self.yuvCanvas.canvasElement.height = decodedFrame.frame_height;
                    self.yuvCanvas.height = decodedFrame.frame_height;
                }

                self.yuvCanvas.drawNextOuptutPictureGL({
                    yData: decodedFrame.frameYData,
                    yDataPerRow: decodedFrame.frame_width,
                    yRowCnt: decodedFrame.frame_height,
                    uData: decodedFrame.frameUData,
                    uDataPerRow: decodedFrame.frame_width / 2,
                    uRowCnt: decodedFrame.frame_height / 2,
                    vData: decodedFrame.frameVData,
                    vDataPerRow: decodedFrame.frame_width / 2,
                    vRowCnt: decodedFrame.frame_height / 2
                });
                self.yuvCanvas.canvasElement.drawing = false;

                self.updateStatistics();
                self.onAfterDecoded();
            }
        }.bind(this);
    },

    /**
     *
     * @param pktSize
     * @param pktData
     * @instance
     * @memberof OSH.UI.View.FFMPEGView
     */
    decodeWorker: function (pktSize, pktData) {
        var data = {
            pktSize: pktSize,
            pktData: pktData.buffer,
            byteOffset: pktData.byteOffset
        };

        if (this.useWebWorkerTransferableData) {
            this.worker.postMessage(data, [data.pktData]);
        } else {
            // no transferable data
            // a copy of the data to be made before being sent to the worker. That could be slow for a large amount of data.
            this.worker.postMessage(data);
        }
    },

    checkFlush: function() {
        if(!this.useWorker && this.nbFrames >= this.FLUSH_LIMIT) {
            this.nbFrames = 0;
            _avcodec_flush_buffers(this.av_ctx);
        }
    },

    //-------------------------------------------------------//
    //---------- No Web worker -----------------------------//
    //-----------------------------------------------------//

    /**
     * @instance
     * @memberof OSH.UI.View.FFMPEGView
     */
    initFFMEG_DECODER: function () {
        // register all compiled codecs
        Module.ccall('avcodec_register_all');

        // find h264 decoder
        var codec = Module.ccall('avcodec_find_decoder_by_name', 'number', ['string'], ["h264"]);
        if (codec == 0)
        {
            console.error("Could not find H264 codec");
            return;
        }

        // init codec and conversion context
        this.av_ctx = _avcodec_alloc_context3(codec);

        // open codec
        var ret = _avcodec_open2(this.av_ctx, codec, 0);
        if (ret < 0)
        {
            console.error("Could not initialize codec");
            return;
        }

        // allocate packet
        this.av_pkt = Module._malloc(96);
        this.av_pktData = Module._malloc(1024*150);
        _av_init_packet(this.av_pkt);
        Module.setValue(this.av_pkt+24, this.av_pktData, '*');

        // allocate video frame
        this.av_frame = _avcodec_alloc_frame();
        if (!this.av_frame)
            alert("Could not allocate video frame");

        // init decode frame function
        this.got_frame = Module._malloc(4);
        this.maxPktSize = 1024 * 50;


    },

    /**
     *
     * @param pktSize
     * @param pktData
     * @returns {{frame_width: *, frame_height: *, frameYDataPtr: *, frameUDataPtr: *, frameVDataPtr: *, frameYData: Uint8Array, frameUData: Uint8Array, frameVData: Uint8Array}}
     * @instance
     * @memberof OSH.UI.View.FFMPEGView
     */
    decode: function (pktSize, pktData) {
        if(pktSize > this.maxPktSize) {
            this.av_pkt = Module._malloc(96);
            this.av_pktData = Module._malloc(pktSize);
            _av_init_packet(this.av_pkt);
            Module.setValue(this.av_pkt + 24, this.av_pktData, '*');
            this.maxPktSize = pktSize;
        }
        // prepare packet
        Module.setValue(this.av_pkt + 28, pktSize, 'i32');
        Module.writeArrayToMemory(pktData, this.av_pktData);

        // decode next frame
        var len = _avcodec_decode_video2(this.av_ctx, this.av_frame, this.got_frame, this.av_pkt);
        if (len < 0) {
            console.log("Error while decoding frame");
            return;
        }

        if (Module.getValue(this.got_frame, 'i8') == 0) {
            //console.log("No frame");
            return;
        }

        var decoded_frame = this.av_frame;
        var frame_width = Module.getValue(decoded_frame + 68, 'i32');
        var frame_height = Module.getValue(decoded_frame + 72, 'i32');
        //console.log("Decoded Frame, W=" + frame_width + ", H=" + frame_height);

        // copy Y channel to canvas
        var frameYDataPtr = Module.getValue(decoded_frame, '*');
        var frameUDataPtr = Module.getValue(decoded_frame + 4, '*');
        var frameVDataPtr = Module.getValue(decoded_frame + 8, '*');

        return {
            frame_width: frame_width,
            frame_height: frame_height,
            frameYDataPtr: frameYDataPtr,
            frameUDataPtr: frameUDataPtr,
            frameVDataPtr: frameVDataPtr,
            frameYData: new Uint8Array(Module.HEAPU8.buffer, frameYDataPtr, frame_width * frame_height),
            frameUData: new Uint8Array(Module.HEAPU8.buffer, frameUDataPtr, frame_width / 2 * frame_height / 2),
            frameVData: new Uint8Array(Module.HEAPU8.buffer, frameVDataPtr, frame_width / 2 * frame_height / 2)
        };
    }
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @class
 * @classdesc
 * @type {OSH.UI.View}
 * @augments OSH.UI.View
 */
OSH.UI.View.H264View = OSH.UI.View.VideoView.extend({
    initialize: function (divId, viewItems,options) {
        this._super(divId, viewItems,options);

		var width = "640";
		var height = "480";
		
		if(typeof options != "undefined") {
			if (options.width) {
				width = options.width;
			}

			if (options.height) {
				height = options.height;
			}
		}

		var useWorker = false;
		var reuseMemory = false;
		var webgl = "auto";
		this.hasSps = false;

		this.avcWs = new Player({
			useWorker : useWorker,
			reuseMemory : reuseMemory,
			webgl : webgl,
			size : {
				width : width,
				height : height
			}
		});

		this.video = this.avcWs.canvas
		this.video.setAttribute("width", width);
		this.video.setAttribute("height", height);
		var domNode = document.getElementById(this.divId);
		domNode.appendChild(this.video);
	},

	/**
	 *
	 * @param fullNal
	 * @instance
	 * @memberof OSH.UI.View.H264View
	 */
	decode : function(fullNal) {
		this.avcWs.decode(fullNal);
	},

    /**
     *
     * @param styler
     * @instance
     * @memberof OSH.UI.View.H264View
     */
    updateFrame: function (styler) {
        this._super(styler);

		this.computeFullNalFromRaw(data.data, function(nal) {
			var nalType = nal[0] & 0x1F;
			//7 => PPS
			//8 => SPS
			//6 => SEI
			//5 => IDR
			if (nalType != 7 && nalType != 8 && nalType != 1
					&& nalType != 5 & nalType != 6)
				return;
			if (nalType == 7)
				this.hasSps = true;
			if (this.hasSps) {
				this.decode(nal);
			}
		}.bind(this));
	},

	/**
	 *
	 * @param data
	 * @param callback
	 * @instance
	 * @memberof OSH.UI.View.H264View
	 */
	computeFullNalFromRaw : function(data, callback) {
		if (!(data && data.length)) {
			return;
		} else {
			var endIndex = -1;
			var firstIndex = -1;

			// find first NAL separator
			var nalSeparator = false;
			while ((firstIndex = data.indexOf(1, firstIndex + 1)) != -1) {
				nalSeparator = data[firstIndex - 1] == 0;
				nalSeparator &= data[firstIndex - 2] == 0;
				nalSeparator &= data[firstIndex - 3] == 0;
				if (nalSeparator)
					break;
			}

			//if found a NAL separator
			if (nalSeparator) {
				endIndex = firstIndex;
				//gets the data until the next separator
				while ((endIndex = data.indexOf(1, endIndex + 1)) != -1) {
					nalSeparator = data[endIndex - 1] == 0;
					nalSeparator &= data[endIndex - 2] == 0;
					nalSeparator &= data[endIndex - 3] == 0;

					//end separator found, callback full NAL unit
					if (nalSeparator) {
						callback(data.subarray(firstIndex + 1, endIndex - 3)); // subarray provides a new view of the array
						firstIndex = endIndex;
					}
				}

				if (endIndex == -1) {
					//otherwise = end of buffer       
					callback(data.subarray(firstIndex + 1, data.length)); // subarray provides a new view of the array
					firstIndex = endIndex;
				}
			}
		}
	}
});
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @type {OSH.UI.View}
 * @augments OSH.UI.View
 * @example
 var videoView = new OSH.UI.View.MjpegView("containerId", [{
        styler: new OSH.UI.Styler.Video({
            frameFunc: {
                dataSourceIds: [videoDataSource.id],
                handler: function (rec, timestamp, options) {
                    return rec;
                }
            }
        }),
        name: "H264 ViDEO",
        entityId:entityId
    }],{
    css: "video",
    cssSelected: "video-selected",
    name: "Video"
});
 */
OSH.UI.View.MjpegView = OSH.UI.View.VideoView.extend({
    initialize: function (divId, viewItems,options) {
        this._super(divId, viewItems,options);

        // creates video tag element
        this.imgTag = document.createElement("img");
        this.imgTag.setAttribute("id", "dataview-" + OSH.Utils.randomUUID());

        // rotation option
        this.rotation = 0;
        if (!isUndefinedOrNull(options) && !isUndefinedOrNull(options.rotation)) {
            this.rotation = options.rotation * Math.PI / 180;
            this.canvas = document.createElement('canvas');
            this.canvas.width = 640;
            this.canvas.height = 480;
            var ctx = this.canvas.getContext('2d');
            ctx.translate(0, 480);
            ctx.rotate(this.rotation);
            document.getElementById(this.divId).appendChild(this.canvas);
        } else {
            // appends <img> tag to <div>
            document.getElementById(this.divId).appendChild(this.imgTag);
        }
    },

    /**
     *
     * @param styler
     * @instance
     * @memberof OSH.UI.View.MjpegView
     */
    updateFrame: function (styler) {
        this._super(styler);
        var oldBlobURL = this.imgTag.src;
        this.imgTag.src = styler.frame;
        window.URL.revokeObjectURL(oldBlobURL);

        this.updateStatistics();
        this.onAfterDecoded();
    },

    /**
     * @instance
     * @memberof OSH.UI.View.MjpegView
     */
    reset: function () {
        this.imgTag.src = "";
    }
});


/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/**
 * @classdesc
 * @class
 * @type {OSH.UI.View}
 * @augments OSH.UI.View
 * @example
 var videoView = new OSH.UI.View.Mp4View("videoContainer-id", [{
        styler: new OSH.UI.Styler.Video({
            frameFunc: {
                dataSourceIds: [videoDataSource.id],
                handler: function (rec, timestamp, options) {
                    return rec;
                }
            }
        }),
        name: "MP4 ViDEO",
        entityId:entityId
    }]
    , {
    css: "video",
    cssSelected: "video-selected",
    name: "Video"
 });
 */
OSH.UI.View.Mp4View = OSH.UI.View.VideoView.extend({
    initialize: function (divId, viewItems, options) {
        this._super(divId, viewItems, options);

        var width = "640";
        var height = "480";

        // creates video tag element
        this.video = document.createElement("video");
        this.video.setAttribute("control", '');

        // appends <video> tag to <div>
        document.getElementById(this.divId).appendChild(this.video);

        this.init = false;
        this.mp4box = new MP4Box();
    },

    /**
     *
     * @param styler
     * @instance
     * @memberof OSH.UI.View.Mp4View
     */
    updateFrame: function (styler) {
        var frame = styler.frame;
        if (!this.init) {
            this.init = true;
            frame.fileStart = 0;

            var self = this;

            this.mp4box.onError = function (e) {
                console.error("MP4 error");
            };
            this.mp4box.onReady = function (info) {
                OSH.Asserts.checkArrayIndex(info.tracks, 0);
                self.createMediaSource(info.tracks[0],function(sourcebuffer){
                    self.sourcebuffer = sourcebuffer;
                });
            };
            self.mp4box.appendBuffer(frame);
            self.mp4box.flush();
        } else if(!isUndefinedOrNull(this.sourcebuffer)){
            console.log("append");
            if (this.sourcebuffer.updating || this.queue.length > 0) {
                this.queue.push(frame);
            } else {
                this.sourcebuffer.appendBuffer(frame);
            }
        }
    },

    createMediaSource: function (mp4track,callback) {
        if (!'MediaSource' in window) {
            throw new ReferenceError('There is no MediaSource property in window object.');
        }

        var track_id = mp4track.id;
        var codec = mp4track.codec;
        var mime = 'video/mp4; codecs=\"' + codec + '\"';

        if (!MediaSource.isTypeSupported(mime)) {
            console.log('Can not play the media. Media of MIME type ' + mime + ' is not supported.');
            throw ('Media of type ' + mime + ' is not supported.');
        }

        this.queue = [];
        var mediaSource = new MediaSource();
        this.video.src =  window.URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('sourceopen', function(e) {
            mediaSource.duration = 10000000;
            var playPromise = this.video.play();

            // In browsers that don’t yet support this functionality,
            // playPromise won’t be defined.

            if (playPromise !== undefined) {
                playPromise.then(function() {
                    // Automatic playback started!
                }).catch(function(error) {
                    // Automatic playback failed.
                    // Show a UI element to let the user manually start playback.
                });
            }


            /**
             * avc1.42E01E: H.264 Constrained Baseline Profile Level 3
             avc1.4D401E: H.264 Main Profile Level 3
             avc1.64001E: H.264 High Profile Level 3
             */
            var sourcebuffer = mediaSource.addSourceBuffer(mime);

            sourcebuffer.addEventListener('updatestart', function(e) {
                /*console.log('updatestart: ' + mediaSource.readyState);*/
                if(this.queue.length > 0 && !this.buffer.updating) {
                    sourcebuffer.appendBuffer(this.queue.shift());
                }
            }.bind(this));
            sourcebuffer.addEventListener('error', function(e) { /*console.log('error: ' + mediaSource.readyState);*/ });
            sourcebuffer.addEventListener('abort', function(e) { /*console.log('abort: ' + mediaSource.readyState);*/ });

            sourcebuffer.addEventListener('updateend', function() { // Note: Have tried 'updateend'
                if(this.queue.length > 0) {
                    sourcebuffer.appendBuffer(this.queue.shift());
                }
            }.bind(this));

            callback(sourcebuffer);
        }.bind(this), false);

        mediaSource.addEventListener('sourceopen', function(e) { /*console.log('sourceopen: ' + mediaSource.readyState);*/ });
        mediaSource.addEventListener('sourceended', function(e) { /*console.log('sourceended: ' + mediaSource.readyState);*/ });
        mediaSource.addEventListener('sourceclose', function(e) { /*console.log('sourceclose: ' + mediaSource.readyState);*/ });
        mediaSource.addEventListener('error', function(e) { /*console.log('error: ' + mediaSource.readyState);*/ });

    }

});