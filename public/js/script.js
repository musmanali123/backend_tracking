const socket = io();
console.log('asdad');

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location',
            { latitude, longitude })
    },
        (err) => {
            console.log('errr 1', err)
        },
        {
            enableHighAccuracy:true,
            maximumAge:0,
            timeout:5000,
        }
    )
}


// [24.8702963,67.1762941]
const map = L.map('map').setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
attribution:'tile of map'
}).addTo(map)

const markers = {};

socket.on('receive-location',(data)=>{
    const { id, latitude,longitude} = data;
    map.setView([latitude,longitude])
    console.log('data',data);
    if (markers[id]) {
        markers[id].setLatLng([latitude,longitude])

    } else {
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})


socket.on("user-disconnected",(id)=>{
    console.log('id',id);
if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id]
}
})