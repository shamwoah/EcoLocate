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
            lat: <number>mapsMouseEvent.latLng.toJSON()["lat"].toFixed(6),
            lng: <number>mapsMouseEvent.latLng.toJSON()["lng"].toFixed(6),
        };

        marker = new google.maps.Marker({
            map,
            position: mapsMouseEvent.latLng,
            title: Location.lat + ", " + Location.lng,
        });
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