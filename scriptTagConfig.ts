import data from './src/api_constants.json' assert { type: 'JSON' };
var token = data["maps_sdk_key"];

const apiScriptTag = document.createElement("script");

const staticMapCall = new URL(`https://maps.googleapis.com/maps/api/js?key=${token}&callback=initMap&v=weekly`);

apiScriptTag.setAttribute("src", staticMapCall.href);

document.body.appendChild(apiScriptTag);