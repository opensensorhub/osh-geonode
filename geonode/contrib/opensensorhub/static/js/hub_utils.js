function output(inp) {
    // document.body.appendChild(document.createElement('pre')).innerHTML = inp;#}
    document.getElementById("pretty-json").innerHTML = inp;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="json-' + cls + '">' + match + '</span>';
    });
}

getCapabilities = function (hubAddress) {
    var data = {};
    data['hubAddress'] = hubAddress;
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'get_capabilities', true);
    xhr.setRequestHeader('Content-Type', 'application/json, charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // output(syntaxHighlight(xhr.response));
            return xhr.response;
        }
    };
    xhr.send(JSON.stringify(data));
};

getResultTemplate = function (hubAddress, offeringId, observedProperty) {
    var data = {};
    data['hubAddress'] = hubAddress;
    data['offering'] = offeringId;
    data['observed_property'] = observedProperty;
    /*data['hubAddress'] = 'http://botts-geo.com:8181/sensorhub';
    data['offering'] = 'urn:android:device:89845ed469b7edc7-sos';
    data['observed_property'] = 'http://sensorml.com/ont/swe/property/Location';*/
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'get_result_template', true);
    xhr.setRequestHeader('Content-Type', 'application/json, charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            output(syntaxHighlight(xhr.response));
        }
    };
    xhr.send(JSON.stringify(data));
};

getSensorDescription = function (hubAddress, procedure) {
    var data = {};
    data['hubAddress'] = hubAddress;
    data['procedure'] = procedure;
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'get_sensor_description', true);
    xhr.setRequestHeader('Content-Type', 'application/json, charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            output(syntaxHighlight(xhr.response));
        }
    }
    xhr.send(JSON.stringify(data));
};

function getCapabiltiesWrapper(){
    var hubSelector = document.getElementById('hubSelector');
    // get current selection
    hubAddr = hubSelector.value;
    console.log(hubAddr);
    // make call to getCapabilities
    var response = getCapabilities(hubAddr);
    console.log("Printing response...");
    console.log(response);
}

// getCapabilities();
// getResultTemplate();
// getSensorDescription();