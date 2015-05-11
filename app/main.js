requirejs.config({
    "paths": {
        "map": "map",
        "highered_map" : "highered_map",
        "jquery": "node_modules/jquery/jquery.min",
        "raphael": "node_modules/raphaeljs/raphael.min",
        "uspaths": "us_paths",
        "mapcolors" : "mapcolors",
        "mapevents" : "mapevents",
        "highered_data": "highered_data",
        "legend" : "legend",
        "stateNames" : "statenames"
    }
});

requirejs(["highered_map"], function(map) {
    
});    