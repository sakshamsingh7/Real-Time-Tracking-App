//front end code
// intializing socket io
const socket=io();

//the check if browser supports geonavigation
if(navigator.geolocation){//if yes
    navigator.geolocation.watchPosition(
        (position)=>{
        const {latitude,longitude}=position.coords;
        socket.emit("send-location",{latitude,longitude});
        //this send location we sent must be accepted at backend
    },
    //if error aya
    (error)=>{
        console.log(error);
    },
    //turant data no cacjed data and sends location after 5 sec
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    }

)
}

const map=L.map("map").setView([0,0],40);//asking location through leaflet
//to see the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Saksham Singh"
}).addTo(map)
//creating empty object marker

const markers={};
socket.on("receive-location",(data)=>{
    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
});
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

