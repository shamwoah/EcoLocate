import data from './api_constants.json' assert { type: 'JSON' };
const token = data["openweather_api_key"];
const {Loc} = require('./index.ts');



async function getWeatherData(lat, lng) {
  var wind: number = 0;
  var cloud: number = 0;
  var sunshine: number = 0;
  var weather: number[] = [];

  for (let i = 1; i < 13; i++) {
    try {
      let res = await fetch(`https://api.openweathermap.org/data/2.5/aggregated/month?month=${i}lat=${lat}&lon=${lng}&appid=a2bc44f0f6e89d7d610d239bdf435b37`);
      let myJson = await res.json();
      wind += <number>myJson.result.wind["mean"];
      cloud += <number>myJson.result.cloud["mean"];
      sunshine += (<number>myJson.result["sunshine_hours"] / 30);
    } catch (error) {
      console.log(error);
    }
  }
  return weather = [(wind/12), (cloud/12), (sunshine/12)];
}