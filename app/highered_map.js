/*Code specific to this map*/

define(["map", "highered_data", "jquery", "stateNames"], function (Map, highered_data, $, stateNames) {
    "use strict";
    
    /*I'm making an empty object rather than just starting with the map object because I also
    need to keep track of the year outside of the core map module functionality*/

    var highered_map = {};
    highered_map.startYear = 2008;
	highered_map.dataIndex = 0;
    
    function openEmbed() {
		$("#embedBox").show(100);
	}
	
	function closeEmbed() {
		$("#embedBox").hide(100);
	}
	
	$("#embedCode .url").html(window.location.href);
	
	$("#mapLinks a.embed").click(function (e) {
		e.preventDefault();
		openEmbed();
	});
	
	$("#embedBox a").click(function (e) {
		e.preventDefault();
		closeEmbed();
	});
    
    /*Function to switch the dataset year and redraw the map*/
    function switchData(year, dataset) {
        
		year = +year;
		dataset = +dataset;
		
		$("#mapTitle span.dataset").html([
			"state spending",
			"tuition",
			"enrollment"
		][dataset]);
		
        //short reference to map object
        var m = highered_map.map;
        
        //get rid of any visible popups
        $("#map .popup_container").fadeOut(100, function () {
            $(this).remove();
        });
		
		/*if (dataset === 2) {
			$("#yearPicker .toHide").hide();
		} else {
			$("#yearPicker .toHide").show();
		}
		
		if (year === 2014) {
			$("#dataPicker div[data-dataset=2]").hide();
		} else {
			$("#dataPicker div[data-dataset=2]").show();
		}*/
        
        //assign the new data to the map
        m.data = highered_data[year];
		m.dataIndex = dataset;
        
		if (year === 2008 && dataset === 1) {
			m.colors.customMin = 0;
			m.changeColor("low", "#ffffff");
		} else {
			delete m.colors.customMin;
			m.changeColor("low", "#eb9123");
		}
		
        //recalculate the max and min based on the new dataset
        m.colors.calculateMinMax();

		
        //recalculate the map colors based on new data and new max/min
        m.colors.calcStateColors();
        
        //redraw the map (animate over 100 ms)
        m.colors.applyStateColors(100);
        
        //redraw the legend
        m.legendMaker.setBounds(m.min, m.max);
        m.legendMaker.draw(m);
        
        //store the new year in the base object
        highered_map.startYear = year;
		highered_map.dataIndex = dataset;
    }
    
    /*Runs when the user clicks on the year picker*/
    $("#yearPicker div.year").click(function () {
        
        //unselect all the year clickers
        $("#yearPicker div.year").removeClass("selected");
        
        //get the year from the clicked div
        var year = $(this).data("year");
        
        //select it
        $(this).addClass("selected");
        
        //run the year switcher function above
        switchData(year, highered_map.dataIndex);
    });
	
	$("#dataPicker div").click(function () {
		
		 //unselect all the year clickers
        $("#dataPicker div").removeClass("selected");
        
        //get the year from the clicked div
        var dataset = $(this).data("dataset");
        
        //select it
        $(this).addClass("selected");
		
		switchData(highered_map.startYear, dataset);
		
	});
    
    /*Make the actual map object - all of the possible configuration options are used here
    except for the stateClick callback*/
    highered_map.map = new Map({
        
        /*Assign data to the map*/
        data: highered_data[highered_map.startYear],
        
        /*Each data point is an array (so that the popup can show more info than the colors) -
        this tells the map which quantity to use for the color scheme*/
        dataIndex: 0,
        
        /*Tell the object which div to paint the map inside*/
        mapDivID: "map",
        
        /*Not even sure if this works yet when true, but it will*/
        hideDC: true,
		hideUS: true,
		
		labelFontSize: 28,
		
		invertHoverText: true,
        
        /*Template for popup box. Function must return an HTML string*/
        popupTemplate: function (data, state) {
            function formatNumber(n) {
                var m = highered_map.map;
                if (n >= 0) {
                    return "up " + Math.round(n * 100) / 100 + "%";
                } else {
                    return "down " + Math.round(-n * 100) / 100 + "%";
                }
            }
            
      
		
            var str = "<h4>" + stateNames[state] + ", " + highered_map.startYear + " - 2015</h4>";
            str += "<p>Tuition is " + formatNumber(data[1]) + "<br />";
            str += "State funding is " + formatNumber(data[0]);
			/*if (highered_map.startYear !== 2014) {
				str += "<br />Enrollment is " + formatNumber(data[2]);
			}*/
            str += "</p>";
            return str;
        },
        
        /*Background color for popup*/
        popupStyle: {
            bgColor: "#ffffff",
			width: 300
            /*These options are also available though not used here*/
            /*padding: 10,
            fontSize: 28*/
        },
        
        /*Configure colors for map*/
        colorConfig: {
            highColor  : "#0081a4", //max of dataset
            lowColor   : "#eb9123", //min of dataset
            hoverColor : "#b9292f", //color when hovering over a state
            noDataColor: "#aaaaaa", //color for null or NaN data
            
            /*if dataset goes from negative to positive, it uses a three color gradient with
            the middle color at zero*/
            zeroColor  : "#ffffff"
        },
        
        /*Function to format the legend labels*/
        legendFormatter: function (t) {
            return Math.round(t * 100) / 100 + "%";
        }
        
        /*Below is an example of how to define a state click callback, 
        though this particular map has no need for it*/
        /*stateClick: function (state) {
            console.log("you clicked on " + state);
        },*/
    });
    
    
    
});