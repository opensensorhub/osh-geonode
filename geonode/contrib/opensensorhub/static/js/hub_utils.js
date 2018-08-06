// For reuse
const hostName = window.location.hostname;
const portNum = window.location.port;


/*window.onload = function () {
    // add event listener to JSON-Raw field
    document.getElementById('id_view').addEventListener("change", generateJsonBinding);
    // requestOfferingsofView(1);
    // getSensorDescription('http://botts-geo.com:8181/sensorhub', 'urn:android:device:89845ed469b7edc7');
    // getCapabilities('http://botts-geo.com:8181/sensorhub');
};*/

function output(inp) {
    // document.body.appendChild(document.createElement('pre')).innerHTML = inp;#}
    document.getElementById("pretty-json").innerHTML = inp;
}

/**
 * Creates a syntax highlighted js span element
 * @param json
 * @returns {*}
 */
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

/**
 * Gets a complete list of Capabilities from and OSH Node
 * @param hubAddress Address of the OSH Node from which to retrieve a listing of capabilities
 */
async function getCapabilities(hubAddress) {
    console.log("Hub Address: " + hubAddress);
    var data = {};
    data['hubAddress'] = hubAddress;
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'get_capabilities', true);
    xhr.setRequestHeader('Content-Type', 'application/json, charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // output(syntaxHighlight(xhr.response));
            console.log(xhr.response);
            return xhr.response;
        }
    };
    xhr.send(JSON.stringify(data));
};

// Promise version of getCapabilities
function getCapabilitesPromise(hubAddress) {
    return new Promise(function (resolve, reject) {
        var data = {};
        data['hubAddress'] = hubAddress;
        var request = new XMLHttpRequest();

        request.open('POST', 'get_capabilities', true);
        request.setRequestHeader('Content-Type', 'application/json, charset=UTF-8');
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                // output(syntaxHighlight(request.response));
                // return request.response;
                console.log(request.response)
            }
        };
        request.onload = function () {
            if (request.status === 200) {
                resolve(request.response)
            } else {
                reject(Error(request.statusText));
            }
        };

        request.onerror = function () {
            reject(Error("Network Error"));
        };

        // Make the request
        request.send(JSON.stringify(data));
    })
}

/**
 * For retrieving the Result Template of an offering's specific capability from an OSH Node
 * @param hubAddress Address of the OSH Node
 * @param offeringId ID of the Offering on the Node
 * @param observedProperty The specific property whose template is to be retrieved
 */
function getResultTemplate(hubAddress, offeringId, observedProperty) {
    var data = {};
    data['hubAddress'] = hubAddress;
    data['offering'] = offeringId;
    data['observed_property'] = observedProperty;
    /*data['hubAddress'] = 'http://botts-geo.com:8181/sensorhub';
    data['offering'] = 'urn:android:device:89845ed469b7edc7-sos';
    data['observed_property'] = 'http://sensorml.com/ont/swe/property/Location';*/
    var xhr = new XMLHttpRequest();

    // TODO: check on URL here
    xhr.open('POST', 'get_result_template', true);
    xhr.setRequestHeader('Content-Type', 'application/json, charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            output(syntaxHighlight(xhr.response));
        }
    };
    xhr.send(JSON.stringify(data));
};

/**
 * Gets a full sensor description of a procedure (Observation or Command)
 * @param hubAddress Address of the OSH Node
 * @param procedure The Observation or Command to be described
 * @return description {*} returns the request's response whether the query was successful or returned an error
 */
function getSensorDescription(hubAddress, procedure) {
    var data = {};
    data['hubAddress'] = hubAddress;
    data['procedure'] = procedure;
    // data['hubAddress'] = 'http://botts-geo.com:8181/sensorhub';
    // data['procedure'] = 'urn:android:device:89845ed469b7edc7';
    var xhr = new XMLHttpRequest();

    console.log(data);

    // xhr.open('POST', 'get_sensor_description', true);
    xhr.open('POST', 'http://localhost:8000/osh/get_sensor_description', true);
    xhr.setRequestHeader('Content-Type', 'application/json, charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // output(syntaxHighlight(xhr.response));
            console.log(xhr.response);
            let description = xhr.response;
            return description;
        }
    };
    xhr.send(JSON.stringify(data));
};

// function getCapabiltiesWrapper() {
//     var hubSelector = document.getElementById('hubSelector');
//     // get current selection
//     hubAddr = hubSelector.value;
//     console.log(hubAddr);
//     // make call to getCapabilities
//     var response = getCapabilities(hubAddr);
//     console.log("Printing response...");
//     console.log(response);
// }

// TODO: Definitely make sure this is the correct way to do this and Ask Josh for direction
function requestOfferingsofView(viewPK) {
    let offeringExts = [];
    let offerings = [];
    // TODO: There needs to be a more robust way of getting the port or not using it if it's not necessary
    let url = 'http://' + window.location.hostname + ':8000' + '/osh/api/view/' + viewPK + '/';
    let otherParams = {
        headers: {'content-type': 'application/json; charset=UTF-8'},
        // mode: 'cors',
        method: 'GET'
    };

    console.log(url);
    console.log(otherParams);

    fetch(url, otherParams)
        .then(data => {
            return data.json()
        })
        .then(res => {
            console.log(res);
            // TODO: Change to offerings when they are properly implemented and tested.
            console.log("Getting Observations...");
            offeringExts = res.observations;
            console.log(offeringExts);
            offerings = requestOfferingsbyPK(offeringExts);
            return offerings;
        })
        .catch(error => console.log(error));


}

function requestOfferingsbyPK(offeringUrls) {
    let offerings = [];
    for (let offering of offeringUrls) {
        let endpoint = "";
        let procedureId = "";
        // TODO: How to best obtain the port number when a user is deploying?
        let offeringUrl = 'http://' + window.location.hostname + ':8000' + offering;
        console.log(offeringUrl);
        let otherParams = {
            headers: {'content-type': 'application/json; charset=UTF-8'},
            method: 'GET'
        };

        console.log(otherParams);

        fetch(offeringUrl, otherParams)
            .then(data => {
                return data.json()
            })
            .then(res => {
                console.log(res);
                // endpoint = res.endpoint;
                // procedureId = res.procedure;
                endpoint = 'http://botts-geo.com:8181/sensorhub';
                procedureId = 'urn:android:device:89845ed469b7edc7';
                // get the Sensor Description via OSH
                getSensorDescription(endpoint, procedureId);
            })
            .catch(error => console.log(error));
    }
    return offerings;
}

function generateJsonBinding(event) {
    let jsonRaw = document.getElementById('id_json_raw');
    let viewSelect = document.getElementById("id_view");
    let selectedView = viewSelect.options[viewSelect.selectedIndex].value;
    // get offerings/observations
    if (selectedView !== "") {
        requestOfferingsofView(selectedView);
    }

}

function urlChecker(urlString) {
    console.log('URL Check started...');
    let urlEndIsValid = false;
    let cleanedUrl = urlString;
    // check for trailing spaces
    while (urlEndIsValid === false) {
        console.log(cleanedUrl);
        if (cleanedUrl.slice(-1).match(/[a-z]/i) || cleanedUrl.slice(-1).match(/[/]/i)) {
            if (cleanedUrl.slice(-1).match(/[a-z]/i)) {
                cleanedUrl = cleanedUrl + '/';
            }
            urlEndIsValid = true
        }
        else {
            console.log(cleanedUrl);
            cleanedUrl = cleanedUrl.slice(0, -1);
        }
    }
    // check for ending '/' character
    return cleanedUrl;
}

export {
    getCapabilities,
    getSensorDescription,
    getResultTemplate,
    generateJsonBinding,
    requestOfferingsofView,
    requestOfferingsbyPK,
    urlChecker,
    getCapabilitesPromise
}