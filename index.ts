function initMap() {
    const latLng = { lat: 43.26071490220645, lng: -79.91971892827242};

    const map = new google.maps.Map(document.getElementById("map")!, {
        zoom: 4,
        center: latLng,
    });

    let infoWindow = new google.maps.InfoWindow({
        content: "click for coords",
        position: latLng,
    });

    infoWindow.open(map);

    map.addListener("click", (mapsMouseEvent) => {
        infoWindow.close();

        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(map);
    });
}

declare global {
    interface Window {
        initMap: () => void;
    }
}
window.initMap = initMap;
export {};