import data from './api_constants.json' assert { type: 'JSON' };
const token = data["maps_sdk_key"];

const mapCall = new URL(`https://maps.googleapis.com/maps/api/js?key=${token}&callback=initMap&v=weekly`);

const apiScriptTag = document.createElement("script");
apiScriptTag.setAttribute("src", mapCall.href);
document.body.appendChild(apiScriptTag);