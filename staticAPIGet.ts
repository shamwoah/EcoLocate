import data from './api_constants.json' assert { type: 'JSON' };
const token = data["maps_sdk_key"];
const sig = data["maps_static_secret"]
const {Loc} = require('./index.ts');
const Params = {
    coord: Loc.lat + "," + Loc.lng,
    zoom: '16',
    size: '640x640',
    scale: '2',
    format: 'png',
    maptype: 'satellite',
}

const staticMap = new URL(`https://maps.googleapis.com/maps/api/staticmap?center=40,20&zoom=14&size=640x640&scale=2&format=png&maptype=satellite&key=${token}`);

const apiImgTag = document.createElement("img");
apiImgTag.setAttribute('alt', "static map");
apiImgTag.setAttribute("width", "640");
apiImgTag.setAttribute("height", "640");
apiImgTag.setAttribute("src", staticMap.href);
document.body.appendChild(apiImgTag);