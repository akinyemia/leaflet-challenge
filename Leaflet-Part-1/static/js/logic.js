//Geojson file location
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var earthquakes = L.layerGroup();
//default tile using street view 
// const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// });

//tile layer using mapbox with gray map style
var grayMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v11",
  accessToken: API_KEY
});

// create map and display on load 
var map = L.map('map',{
    center: [39.74739, -105], 
    zoom: 4, 
    layers: [grayMap]
});

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<i style="background: lightgreen"></i><span>-10-10</span><br>';
  div.innerHTML += '<i style="background: yellow"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: gold"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: orange"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: orangered"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: red"></i><span>90+</span><br>';
//   div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
  

  return div;
};
legend.addTo(map);


d3.json(url).then(function(data){
    function markerSize(magnitude){
        return magnitude*4;
    }
    console.log(data);

    // function colorSelect(depth){

    // }

    // Determine the marker color by depth
    function colorSelect(depth) {
        switch(true) {
            case depth > 90:
            return "red";
            case depth > 70:
            return "orangered";
            case depth > 50:
            return "orange";
            case depth > 30:
            return "gold";
            case depth > 10:
            return "yellow";
            default:
            return "lightgreen";
        }
    }

  // Create a GeoJSON layer containing the features array
  // Each feature a popup describing the place and time of the earthquake
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        // Set the style of the markers based on properties.mag
        {
          radius: markerSize(feature.properties.mag),
          fillColor: colorSelect(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
      + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);
  // Sending our earthquakes layer to the createMap function
  earthquakes.addTo(map);

    // Add legend
//   var legend = L.control({position: "bottomright"});
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend"),
//     depth = [-10, 10, 30, 50, 70, 90];

//     // div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
//   for (var i =0; i < depth.length; i++) {
//     div.innerHTML += 
//     '<i style="background:' + colorSelect(depth[i] + 1) + '"></i> ' +
//         depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
//       }
      
//     return div;
//   };
//   legend.addTo(map);


    
});


