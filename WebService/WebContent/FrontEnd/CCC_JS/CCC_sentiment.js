/**
 * Sentiment analysis presentation
 */
var rootURL = "http://localhost:8080/WebService/bhm";

$( document ).ready(function(){
	getSentimentByDay();
	getMarkersData();
	getTotalSentiment();
});
function getSentimentByDay(){
	//http://localhost:8080/WebService/bhm/tweet?geo=true&mapformat=true
	console.log('getTweetGeo');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/sentiments',
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false, // data type of response
		success: createGraphSentiments, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}
function createGraphSentiments(data){
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
	data_mornings=[];
	data_afternoon=[];
	data_night=[];
	$.each(list, function(index, sentiment_data) {
		if(index==0){
			data_mornings=sentiment_data.morning;
		}else if(index==1){
			data_afternoon=sentiment_data.afternoon;
		}else if(index==2){
			data_night=sentiment_data.night;
		}
	});
	
	//-------------
    //- BAR CHART -
    //-------------
	
	var barChartData = {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [
        {
          label: "Morning",
          fillColor: "#FDB813",
          strokeColor: "rgba(210, 214, 222, 1)",
          pointColor: "rgba(210, 214, 222, 1)",
          pointStrokeColor: "#c1c7d1",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: data_mornings
        },
        {
            label: "Afternnon",
            fillColor: "#00a65a",
            strokeColor: "rgba(210, 214, 222, 1)",
            pointColor: "rgba(210, 214, 222, 1)",
            pointStrokeColor: "#c1c7d1",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: data_afternoon
        },
        {
          label: "Night",
          fillColor: "#0073b7",
          strokeColor: "rgba(60,141,188,0.8)",
          pointColor: "#3b8bba",
          pointStrokeColor: "rgba(60,141,188,1)",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(60,141,188,1)",
          data: data_night
        }
      ]
    };
	
    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    var barChart = new Chart(barChartCanvas);
  
    var barChartOptions = {
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,
      //Boolean - If there is a stroke on each bar
      barShowStroke: true,
      //Number - Pixel width of the bar stroke
      barStrokeWidth: 1,
      //Number - Spacing between each of the X value sets
      barValueSpacing: 15,
      //Number - Spacing between data sets within X values
      barDatasetSpacing: 1,
      //String - A legend template
      legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
      //Boolean - whether to make the chart responsive
      responsive: true,
      maintainAspectRatio: false,
   // Boolean - Whether to animate the chart
      animation: true,
      // Number - Number of animation steps
      animationSteps: 60
      
      
    };

    barChartOptions.datasetFill = false;
    barChart.Bar(barChartData, barChartOptions);
}

//MAP FUNCTIONS
var map;
var positiveMarkers=[];
var negativeMarkers=[];
var neutralMarkers=[];
function getMarkersData(){
	//http://localhost:8080/WebService/bhm/tweet?geo=true&mapformat=true
	console.log('geoSentiment');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/geoSentiments',
		async:true,
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false,
		data: {geo:true,mapformat:true,pp:10000},
		success: initializeMap, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}
function initializeMap(data) {
	
	//Setup Google Map
	var bhm = new google.maps.LatLng(52.4814200, -1.8998300);
	var light_grey_style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
	var myOptions = {
	    zoom: 10,
	    center: bhm,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControl: true,
	    mapTypeControlOptions: {
	      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
	      position: google.maps.ControlPosition.LEFT_BOTTOM
	    },
	    styles: light_grey_style
	  };
	  map = new google.maps.Map(document.getElementById("CCC_map_canvas"), myOptions);
	  setMarkersMap(data);
}
function setMarkersMap(data){
	var geo_data = data == null ? [] : (data instanceof Array ? data : [data]);
	
	$.each(geo_data, function(index, tweet) {
		var resp=tweet.value;
		var score=resp[1];
		var coordinate=resp[0];
		mylanglong = new google.maps.LatLng(coordinate[1], coordinate[0]);
		//score scale goes from -1 to 1
		if(score<-0.4){
			//negative
			negativeMarkers[negativeMarkers.length] = new google.maps.Marker({
		        position: mylanglong,
				icon: "../CCC_images/angry.png"
		    });
		}else if(score<0.4){
			//neutral
			neutralMarkers[neutralMarkers.length] = new google.maps.Marker({
		        position: mylanglong,
				icon: "../CCC_images/serious.gif"
		    });
		}else{
			//positive
			positiveMarkers[positiveMarkers.length] = new google.maps.Marker({
		        position: mylanglong,
		        map: map,
				icon: "../CCC_images/happy.png"
		    });
		}
	});
}
function toggleHeatmap(action) {
	
	var currentmap=$("#CCC_active_map").val();
	
	//clear all markers
	if(currentmap=="positive"){
		clearMarkers(positiveMarkers);
	}else if(currentmap=="negative"){
		clearMarkers(negativeMarkers);
	}else if(currentmap=="neutral"){
		clearMarkers(neutralMarkers);
	}
	
	if(action=="positive"){
		setAllMap(positiveMarkers,map);
	}else if(action=="negative"){
		setAllMap(negativeMarkers,map);
	}else if(action=="neutral"){
		setAllMap(neutralMarkers,map);
	}
	//set variable the say which is the current map
	$("#CCC_active_map").val(action);
}
function setAllMap(marker,map) {
	for (var i = 0; i < marker.length; i++) {
		marker[i].setMap(map);
	}
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers(marker) {
	setAllMap(marker,null);
}

//PIE CHART 
//TOTAL SENTIMENT PERCENTAGE
//For a pie chart
function getTotalSentiment(){
	//http://localhost:8080/WebService/bhm/tweet?geo=true&mapformat=true
	console.log('getTweetGeo');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/sentiments/totals',
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false, // data type of response
		success: createPieSentiments, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}
function createPieSentiments(data){
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
	positive=0;
	negative=0;
	nuetral=0;
	$.each(list, function(index, tweet) {
		console.log(tweet);
		if(tweet.key=="positive"){
			positive=tweet.value;
		}else if(tweet.key=="negative"){
			negative=tweet.value;
		}else {
			nuetral=tweet.value;
		}
	});
	//var total=positive+negative+nuetral;
	//positive=(positive/total)*100;
	//negative=(negative/total)*100;
	//nuetral=(nuetral/total)*100;
	var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
	var piedata = [
	        {
	            value: positive,
	            color:"#f39c12",
	            highlight: "#FFCC33",
	            label: "Negative"
	        },
	        {
	            value: negative,
	            color: "#dd4b39",
	            highlight: "#FF0000",
	            label: "Positive"
	        },
	        {
	            value: nuetral,
	            color: "#0073b7",
	            highlight: "#0000CC",
	            label: "Neutral"
	        }
	    ];
	var pieChart = new Chart(pieChartCanvas).Pie(piedata,options=null);
}