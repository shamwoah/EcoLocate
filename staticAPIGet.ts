import data from './api_constants.json' assert { type: 'JSON' };
const key = data["maps_sdk_key"];
const {Loc} = require('./index.ts');
const Params = {
    coord: Loc.lat + "," + Loc.lng,
    zoom: '12',
    size: '640x640',
    scale: '2',
    format: 'png',
    maptype: 'satellite',
}

const url = new URL(`https://maps.googleapis.com/maps/api/staticmap?center=${Params.coord}&zoom=${Params.zoom}&size=${Params.size}&scale=${Params.scale}&format=${Params.format}&maptype=${Params.maptype}&key=${key}`);

async function getImg(url) {
    const response = await fetch(url);
}

