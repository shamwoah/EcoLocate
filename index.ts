import data from './api_constants.json' assert { type: 'JSON' };
const token = data["maps_sdk_key"];

function initMap() {
    const myLatLng = { lat: 43.261, lng: -79.920};

    var staticMap = new URL(`https://maps.googleapis.com/maps/api/staticmap?center=40,20&zoom=14&size=640x640&scale=2&format=png&maptype=satellite&key=${token}`);

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
        
        var apiImgTag = document.getElementById('staticmap')!;
        staticMap = new URL(`https://maps.googleapis.com/maps/api/staticmap?center=${Location.lat},${Location.lng}&zoom=14&size=640x640&scale=2&format=png&maptype=satellite&key=AIzaSyDUmfFb_52uU1LA8wmWVWLS7veo8Wld3X4`);
        apiImgTag.setAttribute("src", "staticMap.href");
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