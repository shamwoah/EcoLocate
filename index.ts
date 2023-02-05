import data from './api_constants.json' assert { type: 'JSON' };
const token = data["maps_sdk_key"];

var staticMap = new URL(`https://maps.googleapis.com/maps/api/staticmap?center=40,20&zoom=14&size=640x640&scale=2&format=png&maptype=satellite&key=AIzaSyDUmfFb_52uU1LA8wmWVWLS7veo8Wld3X4`);
document.getElementById('staticmap')!.setAttribute("src", staticMap.href);

async function getWeatherData(lat, lng) {
    var wind: number = 0;
    var cloud: number = 0;
    var sunshine: number = 0;
  
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
    return [(wind/12), (cloud/12), (sunshine/12)];
}

async function getPowerData(lat,lng) {
    var prod: number = 0;
    var consum: number = 0;
    var renewPct: number = 0;
    
    try {
        let res = await fetch(`https://api.electricitymap.org/v3/power-breakdown/latest?lat=${lat}&lon=${lng}`, {
            method: "GET",
            headers: {'auth-token': 'biCpupAK1b1Wc51F8pwXzJBzgx1l4anE'}
        });
        let myJson = await res.json();
        consum = <number>myJson["powerConsumptionTotal"];
        prod = <number>myJson["powerProductionTotal"];
        renewPct = <number>myJson["renewablePercentage"];
    } catch (error) {
        console.log(error);
    }
    return [consum, prod, renewPct];
}

function initMap() {
    const myLatLng = { lat: 43.261, lng: -79.920};

    const map = new google.maps.Map(document.getElementById("map")!, {
        zoom: 4,
        center: myLatLng,
        mapTypeId: 'satellite',
        mapTypeControl: false,
        streetViewControl: false,
    });

    let marker = new google.maps.Marker({
        map,
        position: myLatLng,
        title: myLatLng.lat + ", " + myLatLng.lng,
    });

    map.addListener("click", (mapsMouseEvent) => {
        marker.setMap(null);

        var Location = {
            lat: <number>mapsMouseEvent.latLng.toJSON()["lat"].toFixed(4),
            lng: <number>mapsMouseEvent.latLng.toJSON()["lng"].toFixed(4),
        };

        marker = new google.maps.Marker({
            map,
            position: mapsMouseEvent.latLng,
            title: Location.lat + ", " + Location.lng,
        });

        var weather = getWeatherData(Location.lat,Location.lng);
        var power = getPowerData(Location.lat,Location.lng);
        
        var apiImgTag = document.getElementById('staticmap')!;
        staticMap = new URL(`https://maps.googleapis.com/maps/api/staticmap?center=${Location.lat},${Location.lng}&zoom=14&size=640x640&scale=2&format=png&maptype=satellite&key=AIzaSyDUmfFb_52uU1LA8wmWVWLS7veo8Wld3X4`);
        document.getElementById('staticmap')!.setAttribute("src", staticMap.href);
    });
}

declare global {
    interface Window {
        initMap: () => void;    
    }
}
window.initMap = initMap;
module.exports = {Location};
export {};