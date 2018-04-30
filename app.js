var map, position = [], tempData;

function geolocateUser (callback) {
    var xhttp = new XMLHttpRequest();
    var url = 'https://ux-exam.firebaseio.com/chatTask/wadud/LBKu9VbjvEgP4Tczu2S.json';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var pos = JSON.parse(xhttp.responseText);
            if (pos) {
                tempData = pos;
                callback(pos);
            }
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}
function initialize() {
    geolocateUser(function (pos) {
        position[0] = pos.lat;
        position[1] = pos.lng;
        var latlng = new google.maps.LatLng(position[0], position[1]);
        var myOptions = {
            zoom: 18,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);

        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: './icons/car-icon.png',
            title: "Latitude:"+position[0]+" | Longitude:"+position[1]
        });
    });
}



function getMapData(){
    var xhttp = new XMLHttpRequest();
    var url = 'https://ux-exam.firebaseio.com/chatTask/wadud/LBKu9VbjvEgP4Tczu2S.json';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var pos = JSON.parse(xhttp.responseText);
            //console.log(JSON.stringify(tempData) === JSON.stringify(pos));
            //console.log('pos', pos);
            //console.log('tempData', tempData);
            if (JSON.stringify(tempData) !== JSON.stringify(pos)) {
                transition(pos);
                //console.log('tempData', tempData);
                tempData = pos;
            }
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}

// initialize with a little help of jQuery
$(document).ready(function() {
    initialize();
    registerServiceWorker();
});

setInterval(function () {
    getMapData();
    console.log('logging started...');
}, 3000);

var numDeltas = 100;
var delay = 5; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;

function transition(result){
    i = 0;
    deltaLat = (result.lat - position[0])/numDeltas;
    deltaLng = (result.lng - position[1])/numDeltas;
    moveMarker();
}

function moveMarker(){
    position[0] += deltaLat;
    position[1] += deltaLng;
    var latlng = new google.maps.LatLng(position[0], position[1]);
    marker.setTitle("Latitude:"+position[0]+" | Longitude:"+position[1]);
    marker.setPosition(latlng);

    map.panTo(new google.maps.LatLng(
        position[0],
        position[1]
    ));

    if(i!=numDeltas){
        i++;
        setTimeout(moveMarker, delay);
    }
}


function registerServiceWorker () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('service-worker.js',  {scope: '/'})
            .then(function() { console.log('Service Worker Registered'); });
    }
}