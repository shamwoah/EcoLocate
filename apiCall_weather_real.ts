import data from './api_constants.json' assert { type: 'JSON' };
const token = data["openweather_api_key"];
const {Loc} = require('./index.ts');

interface Data {
  // The structure of the response data
  setresponse: JSON;
  name: string;
  age: number;
}

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${Loc.lat}&lon=${Loc.lng}&appid=${token}`)
  .then(response =>  {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<Data>;
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));