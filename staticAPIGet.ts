import data from './src/api_constants.json' assert { type: 'JSON' };
const key = data["maps_sdk_key"];
const {Loc} = require('./index.ts');

const url = `https://maps.googleapis.com/maps/api/staticmap?center=${Loc.lat},${Loc.lng}&format=png&maptype=satellite&key=${key}`;