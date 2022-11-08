
////////////////////////
//initiate mapbox
////////////////////////
mapboxgl.accessToken = 'pk.eyJ1IjoibGlhbmd0YW8xMjE2IiwiYSI6ImNraWZ4cmVkYTA4ZmUycW10eGk3ZTFuajEifQ.sAZWQbIf5fYoDyAKBrIAFw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-74.0059, 40.7128],
    zoom: 10
});

$("#legend-1").hide();
$("#legend-2").hide();
$("#legend-3").hide();
$("#legend-4").hide();

////////////////////////
// add data layers
//////////////////////// 
map.on('load', () => {


    // Case 11 Ave

    map.addSource('Case', {
        'type': 'geojson',
        'data': 'https://raw.githubusercontent.com/liangtao1216/Citibike_Project/main/data/Case11.geojson'
    });


    map.addLayer({
        'id': 'Protected',
        'type': 'line',
        'source': 'Case',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'none',
        },
        'paint': {
            'line-color': {
                property: 'In_Protected_diff',
                type: 'interval',
                stops: [
                    [0, '#2979FF'],
                    [100, '#ffc300'],
                    [150, '#ff3d00'],
                ]
            },

            'line-width': {
                property: 'With_BikeLane',
                type: 'categorical',
                stops: [
                    [0, 10],
                    [1, 10]]
            },

        },
        //'filter': ['all', filterCorridor]

    });


    map.addLayer({
        'id': 'Unprotected',
        'type': 'line',
        'source': 'Case',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'none',
        },
        'paint': {
            'line-color': {
                property: 'In_Unprotected_diff',
                type: 'interval',
                stops: [
                    [0, '#2979FF'],
                    [100, '#ffc300'],
                    [150, '#ff3d00'],
                ]
            },

            'line-width': {
                property: 'With_BikeLane',
                type: 'categorical',
                stops: [
                    [0, 10],
                    [1, 10]]
            },

        },
        //'filter': ['all', filterCorridor]

    });



    // CITI BIKE DATA

    map.addSource('BIKE', {
        'type': 'geojson',
        'data': 'https://raw.githubusercontent.com/liangtao1216/Citibike_Project/main/data/Bike_Predict.geojson'
    });

    let index = 'Flow_Median';

    map.addLayer({
        'id': 'BIKE',
        'type': 'line',
        'source': 'BIKE',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible',
        },
        'paint': {
            'line-color': {
                property: index,
                type: 'interval',
                stops: [
                    [2, '#2979FF'],
                    [14, '#42c3ff'],
                    [41, '#e0e0e0'],
                    [108, '#ffc300'],
                    [307, '#ff3d00'],
                ]
            },

            'line-width': {
                property: 'With_BikeLane',
                type: 'categorical',
                stops: [
                    [0, 1],
                    [1, 3]]
            },

        },
        //'filter': ['all', filterCorridor]

    });



});

////////////////////////
// pop up
//////////////////////// 


map.on('click', 'BIKE', function (e) {
    new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        anchor: 'bottom',
        offset: [0, -10],
        className: 'popupWindow'
    })
        .setLngLat(e.lngLat)
        .setHTML('<h5>' + e.features[0].properties.Street
            + '<br>' + '-----------------------' +
            '</h4>'

            + '<p>' + '<b>SegmentID:</b>' + e.features[0].properties.SegmentID + '</p>'
            + '<p>' + '<b>BikeLane:</b> ' + e.features[0].properties.With_BikeLane + '</p>'
            + '<p>' + '<b>Protected Bike Lane:</b> ' + e.features[0].properties.Protected_Lane + '</p>'
            + '<p>' + '<b>Citi Bike Daily Trips:</b> ' + e.features[0].properties.Flow_Median + '</p>'
            + '<p>' + '<b>Predicted Trips:</b> ' + e.features[0].properties.Flow_Median_predict + '</p>'
            + '<p>' + '<b>Absolute Error:</b> ' + e.features[0].properties.Error_abs + '</p>'
        )
        .addTo(map);
});

map.on('click', 'Protected', function (e) {
    new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        anchor: 'bottom',
        offset: [0, -10],
        className: 'popupWindow'
    })
        .setLngLat(e.lngLat)
        .setHTML('<h5>' + e.features[0].properties.Street
            + '<br>' + '-----------------------' +
            '</h4>'

            + '<p>' + '<b>SegmentID:</b>' + e.features[0].properties.SegmentID + '</p>'
            + '<p>' + '<b>Before:</b> ' + e.features[0].properties.Flow_Median_predict + '</p>'
            + '<p>' + '<b>After:</b> ' + e.features[0].properties.In_Protected + '</p>'
        )
        .addTo(map);
});

map.on('click', 'Unprotected', function (e) {
    new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        anchor: 'bottom',
        offset: [0, -10],
        className: 'popupWindow'
    })
        .setLngLat(e.lngLat)
        .setHTML('<h5>' + e.features[0].properties.Street
            + '<br>' + '-----------------------' +
            '</h4>'

            + '<p>' + '<b>SegmentID:</b>' + e.features[0].properties.SegmentID + '</p>'
            + '<p>' + '<b>Before:</b> ' + e.features[0].properties.Flow_Median_predict + '</p>'
            + '<p>' + '<b>After:</b> ' + e.features[0].properties.In_Unprotected + '</p>'
        )
        .addTo(map);
});



function myPopup(idName) {
    var popup = document.getElementById(idName);
    popup.classList.toggle("show");
}





////////////////////////
// filter corridor type
////////////////////////
document
    .getElementById('selectIndex')
    .addEventListener('change', (event) => {
        const select = event.target.value;
        // update the map filter
        if (select === 'sample') {
            index = 'Flow_Median';

            var CustomColor = {
                property: index,
                type: 'interval',
                stops: [
                    [2, '#2979FF'],
                    [14, '#42c3ff'],
                    [41, '#e0e0e0'],
                    [108, '#ffc300'],
                    [307, '#ff3d00'],

                ]
            }
            $("#score-legend").show();
            $("#legend-1").hide();

        } else if (select === 'predict') {
            index = 'Flow_Median_predict';

            var CustomColor = {
                property: index,
                type: 'interval',
                stops: [
                    [2, '#2979FF'],
                    [14, '#42c3ff'],
                    [41, '#e0e0e0'],
                    [108, '#ffc300'],
                    [307, '#ff3d00'],

                ]
            }
            $("#score-legend").show();
            $("#legend-1").hide();

        } else if (select === 'error') {
            index = 'Error_abs';

            var CustomColor = {
                property: index,
                type: 'interval',
                stops: [
                    [0, '#2979FF'],
                    [50, '#42c3ff'],
                    [100, '#e0e0e0'],
                    [200, '#ffc300'],
                    [300, '#ff3d00'],

                ]
            }
            $("#legend-1").show();
            $("#score-legend").hide();
        }




        map.setPaintProperty('BIKE', 'line-color', CustomColor);
    });



//////////////////////
//switch to Bike Lane
////////////////////// 

$("#mySwitch1").on('change', function () {
    let filterCorridor = ['!=', ['number', ['get', 'With_BikeLane']], 3];

    mySwitch1 = !mySwitch1;
    if (mySwitch1) {
        filterCorridor = ['!=', ['number', ['get', 'With_BikeLane']], 3];
    } //end of if mySwitch

    else {
        filterCorridor = ['==', ['number', ['get', 'With_BikeLane']], 1];
    }
    map.setFilter('BIKE', ['all', filterCorridor]);
});



//////////////////////
//layer control
////////////////////// 

var layers1 = [
    ['BIKE', 'Bike'],
    ['Protected', '11Ave: Protected Lane'],
    ['Unprotected', '11Ave: Unprotected Lane'],
];


map.on('load', function () {

    for (i = 0; i < layers1.length; i++) {
        $("#layers-control1").append("<a href='#' class=' button-default' id='" + layers1[i][0] + "'>" + layers1[i][1] + "</a>"); // see http://api.jquery.com/append/
    }

    $("#layers-control1>a").on('click', function (e) {
        var clickedLayer = e.target.id;

        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
        console.log(visibility);

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            $(e.target).removeClass('active');
        } else {
            $(e.target).addClass('active');
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
        //change legend
        if (map.getLayoutProperty('BIKE', 'visibility') == 'visible') {
            $("#score-legend").show();
        } else {
            $("#score-legend").hide();
        }
        if (map.getLayoutProperty('Protected', 'visibility') == 'visible') {
            $("#legend-2").show();
        } else {
            $("#legend-2").hide();
        }
        if (map.getLayoutProperty('Unprotected', 'visibility') == 'visible') {
            $("#legend-3").show();
        } else {
            $("#legend-3").hide();
        }
        if (map.getLayoutProperty('EL_Infrastructure', 'visibility') == 'visible') {
            $("#legend-4").show();
        } else {
            $("#legend-4").hide();
        }
    });


});






/////////////////////////////////
// Add the search bar to the map.
////////////////////////////////

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


