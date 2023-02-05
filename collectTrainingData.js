const Params = {
    zoom: '12',
    size: '640x640',
    scale: '2',
    format: 'png',
    maptype: 'satellite',
}

var glob = require("glob");
var http = require('http');
var fs = require('fs');
var file = fs.createWriteStream("./training_data/images");

'use strict';
let assert = require('assert');
let pythonBridge = require('python-bridge');
let python = pythonBridge();

python.ex`
from faker import Faker

def randomCoord():
    Faker.seed(0)
    fake = Faker()
    coords = fake.location_on_land(True)
    return coords[0] + "," + coords[1]
`;

function getImgURL(coord = Params.coord) {
    const staticMap = new URL(`https://maps.googleapis.com/maps/api/staticmap?center=${coord}&zoom=${Params.zoom}&size=${Params.size}&scale=${Params.scale}&format=${Params.format}&maptype=${Params.maptype}&key=AIzaSyDUmfFb_52uU1LA8wmWVWLS7veo8Wld3X4`);

    var imgMap = document.getElementById("imgMap");
    $("#imgMap").attr("src", staticMap.href);
    return imgMap + "png";
}

for (let i = 0; i < 100; i++) {
    var coord = python`randomCoord()`;

    glob(getImgURL(coord), function (er, files) {
  //you will get list of files in the directory as an array.
  // now use your previus logic to fetch individual file
  // the name of which can be found by iterating over files array
  // loop over the files array. please implement you looping construct.
        var request = http.get(files[i], function(response) {
            response.pipe(file);
        });

    });
}