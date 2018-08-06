import * as hubUtils from "/static/js/hub_utils.js";

const hostName = window.location.hostname;
const portNum = window.location.port;

window.onload = function () {
    // attach onchange listener to  Hub selection field
    document.getElementById('id_hub').addEventListener("change", fillProcedureIds);
};

// To get Procedure IDs we must make a GetCapabilities request to the endpoint entered in the offering
// TODO: Make sure this handles bad requests more gracefully!!!
function fillProcedureIds() {
    let hub = document.getElementById('id_hub');
    let selectedHub = hub.options[hub.selectedIndex].value;
    if (selectedHub !== "") {
        fetch('http://' + hostName + ':' + portNum + '/osh/api/hub/' + selectedHub + '/')
            .then(function (response) {
                return response.json()
            })
            .then(function (responseJson) {
                console.log(responseJson);
                return responseJson.url;
            })
            .then(function (hubUrl) {
                return hubUtils.getCapabilities(hubUrl)
            })
            .then(function (capResponse) {
                console.log(capResponse)
            })
    }
}

function getHubEndpoint() {
    return new Promise(function (resolve, reject) {
        let hubEndpoint = '';
        let hub = document.getElementById('id_hub');
        let selectedHub = hub.options[hub.selectedIndex].value;
        if (selectedHub !== "") {
            // make request to selected hub for its endpoint
            var request = new XMLHttpRequest();
            request.open('GET', 'http://' + hostName + ':' + portNum + '/osh/api/hub/' + selectedHub + '/', true);
            request.setRequestHeader('Content-Type', 'application/json, charset=UTF-8');

            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    console.log(request.response);
                    hubEndpoint = JSON.parse(request.response).url;
                    hubEndpoint = hubUtils.urlChecker(hubEndpoint);
                    console.log(hubEndpoint);
                    return hubEndpoint;
                }
            };

            request.onload = function () {
                if (request.status === 200) {
                    console.log("Get Endpoint Resolved!");
                    resolve(request.response)
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function () {
                reject(Error("Network Error"));
            };

            // Make the request
            request.send();
        } else {
            reject(Error("Invalid Hub Selected"))
        }
    })
}

function getHubEndpointPromise() {
}

