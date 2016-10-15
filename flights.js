'use strict';

var IntentMedia = IntentMedia || {};

IntentMedia.Airports = (function() {
    var pub = {};

    pub.airport_exists = function(airport_code) {
        return pub.airport_distances().hasOwnProperty(airport_code);
    };

    pub.airport_distances = function() {
        return {
            JFK: { LAX: 2475, LAS: 2248, PDX: 2454 },
            LAX: { JFK: 2475, LAS: 236, PDX: 834 },
            LAS: { JFK: 2248, LAX: 236, PDX: 763 },
            PDX: { JFK: 2454, LAS: 763, LAX: 834 }
        }
    };

    return pub;
}(IntentMedia || {}));

IntentMedia.Distances = (function() {
    var pub = {};
    var airport_distances = airport_distances || IntentMedia.Airports.airport_distances();

    pub.distance_between_airports = function(from_airport, to_airport) {
        if (IntentMedia.Airports.airport_exists(from_airport) && IntentMedia.Airports.airport_exists(to_airport)) {
            if (from_airport === to_airport) {
                return 0;
            }

            return airport_distances[from_airport][to_airport];
        }

        return -1;
    };

    return pub;
}(IntentMedia || {}));


/** Drew's Code Below this Line **/
/** Please note that this code is written in ES6 **/

var app = {};

app.init = function() {

    // App Variable Declarations
    var airport_list = [];

    // Function Declarations
    var getAirportCodes = function() {
        var airport_codes = [];

        // Get all airport info. Could be replaced with an API call 
        var all_airports_info = IntentMedia.Airports.airport_distances();

        // Create airport code list
        for (let airport_code in all_airports_info) {
            airport_codes.push(airport_code);
        }

        return airport_codes;
    };

    // Populates list with airport codes
    var populateSelector = function(selector, list) {
        //console.log("Available airports", list);
        var list = list || airport_list; // Use provided list or default list
        var selector = document.getElementById(selector);

        // Clear selector if full
        selector.innerHTML = '';

        // Add option for each airport from list
        list.forEach(airport_code => {
            let list_item = document.createElement('li');
            list_item.classList.add(airport_code);
            list_item.setAttribute("data-airportcode", airport_code);
            list_item.innerHTML = airport_code;
            list_item.onclick = function() {
                app.selectAirport(airport_code);
            };
            selector.appendChild(list_item);
        });
    }

    // Old code from when I thought I was going to use two selector inputs
    /*
    app.updateForm = function(list_item) {
        var airport_code = list_item.value;
        var second_airport_list = airport_list.filter(x => x !== airport_code);
        populateSelector('second-selector', second_airport_list);
    }
    */

    // Declare map object as part of app
    app.usaMap = {};

    // Declare init function. Useful if map needs to be reinitialized with new data points
    app.usaMap.init = function() {
        airport_list.forEach(airport_code => {
            let pin = document.getElementById(airport_code);
            pin.classList.add("pin");
            pin.setAttribute("data-airportcode", airport_code);
            pin.onclick = function() {
                app.selectAirport(airport_code);
            };
        });
    };

    // Execute init functions
    airport_list = getAirportCodes();
    populateSelector('airport-list', airport_list);

};



/* 
 * Declare selectAirport function. 
 * 1. Takes a airport code as a param, 
 * 2. Figures out the From and To airports 
 * 3. Gets and displays distance
 */

app.selectAirport = function(id) {
    var form = document.getElementById('airport-form');
    var from_airport = form.elements[0];
    var to_airport = form.elements[1];

    // Helper function 
    // This activates/deactives all visual representations of 
    // each airport via data attribute
    var toggleAirport = function(id) {
        var elements = document.querySelectorAll(`*[data-airportcode="${id}"]`);
        elements = Array.from(elements);
        elements.forEach(el => {
            console.log(el);
            el.classList.toggle('active');
        });
    }
    
    toggleAirport(id);

    // Set form values
    if (from_airport.value === id) {
        // "Remove" airport
        // If the id parameter matches from_aiport value
        // Clear value and displayed distance
        app.clearDistance();
        from_airport.value = "";
    } else if (to_airport.value === id) {
        // Same but for to_airport
        app.clearDistance();
        to_airport.value = "";
    } else if (!from_airport.value) {
        // If there is no from airport
        // Use code to set it
        from_airport.value = id;
        if (to_airport.value) {
            // if to_airport already set, have match, submit and get distance
            app.submitForm();
        }
    } else {
        if (to_airport.value) {
            // If there is already both a to and from airport value
            // but the user has selected a new airport
            // deactivate last to airport 
            toggleAirport(to_airport.value);
        }
        // Set new to airport and calculate distance. 
        // "Activation" will have happened already onclick
        to_airport.value = id;
        app.submitForm();
    }
}

app.submitForm = function() {
    // Get codes from input fields and get distance
    // Then update view
    var form = document.getElementById('airport-form');
    var from_airport = form.elements[0].value.toUpperCase();
    var to_airport = form.elements[1].value.toUpperCase();
    var distance = IntentMedia.Distances.distance_between_airports(from_airport, to_airport);
    //console.log(from_airport, to_airport, distance);
    app.updateDistance(distance)
    return false;
}

app.clearDistance = function() {
    // Clear distance element in view
    document.getElementById('miles-wrapper').classList.add('invisible');
}

app.updateDistance = function(distance) {
    var text_area = document.getElementById('distance-text');
    var counter_start = 0;
    var counter_end = parseInt(distance);

    // Make distance visible
    document.getElementById('miles-wrapper').classList.remove('invisible');

    // Creates animated counter from 0 to distance
    for (let dist = 0; dist <= counter_end; dist++) {
        setTimeout(() => {
            requestAnimationFrame(text_area.innerHTML = dist);
        }, dist/2);
    }
}

window.onload = function() {
    app.init();
    app.usaMap.init();
}