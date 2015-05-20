// The root URL for the RESTful services
var rootURL = "http://localhost:8080/WebService/bhm";

var map, heatmap;
//this is necessary to be able to delete the point in the map later
var heatmapData=[];
//this is necessary to be able to delete the markers in the map later
var myMarkers=[];

var geo_data=[];

$( document ).ready(function(){
	getMarkersData();
});

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
	  setHeapMap(data);
}

//google.maps.event.addDomListener(window, 'load', initialize);

function getMarkersData(){
	//http://localhost:8080/WebService/bhm/tweet?geo=true&mapformat=true
	console.log('getTweetGeo');
	$.ajax({
		type: 'GET',
		url: rootURL + '/tweet',
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

function setHeapMap(data){
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
	$.each(list, function(index, tweet) {
		//$('#displaySearch ul').append('<li><a href="#" data-identity="' + wine.id + '">'+wine.name+'</a></li>');
		var resp=tweet.key;
		var coordinate=resp[2];
		heatmapData[index] = new google.maps.LatLng(coordinate[0], coordinate[1]);
	});
	heatmap = new google.maps.visualization.HeatmapLayer({
	  data: heatmapData,
	  radius: 30
	});
}


function toggleHeatmap() {
	
	var currentmap=$("#CCC_active_map").val();
	
	if(currentmap=="marker"){
		clearMarkers();
		$("#CCC_active_map").val("heatmap");
		heatmap.setMap(map);
	}else{
		heatmap.setMap(null)
		$("#CCC_active_map").val("marker");
		setAllMap(map);
	}
}


function setMarkersMap(data){
	var geo_data = data == null ? [] : (data instanceof Array ? data : [data]);
	
	$.each(geo_data, function(index, tweet) {
		//$('#displaySearch ul').append('<li><a href="#" data-identity="' + wine.id + '">'+wine.name+'</a></li>');
		var resp=tweet.key;
		var username=resp[0];
		var coordinate=resp[2];
		mylanglong = new google.maps.LatLng(coordinate[0], coordinate[1]);
	    //var image = "css/small-dot-icon.png";
		myMarkers[index] = new google.maps.Marker({
	        position: mylanglong,
	        map: map,
	        title: username,
			icon: "FrontEnd/CCC_images/red.png"
	    });
	});
}

function setAllMap(map) {
  for (var i = 0; i < myMarkers.length; i++) {
	  myMarkers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}
/*
function initialize() {
  //Setup Google Map
  var myLatlng = new google.maps.LatLng(17.7850,-12.4183);
  var light_grey_style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
  var myOptions = {
    zoom: 2,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    styles: light_grey_style
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  
  //Setup heat map and link to Twitter array we will append data to
  var heatmap;
  var liveTweets = new google.maps.MVCArray();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: liveTweets,
    radius: 25
  });
  heatmap.setMap(map);

  
  if(io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    // This listens on the "twitter-steam" channel and data is 
    // received everytime a new tweet is receieved.
    socket.on('twitter-stream', function (data) {

      //Add tweet to the heat map array.
      var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
      liveTweets.push(tweetLocation);

      //Flash a dot onto the map quickly
      var image = "css/small-dot-icon.png";
      var marker = new google.maps.Marker({
        position: tweetLocation,
        map: map,
        icon: image
      });
      setTimeout(function(){
        marker.setMap(null);
      },600);

    });

    // Listens for a success response from the server to 
    // say the connection was successful.
    socket.on("connected", function(r) {

      //Now that we are connected to the server let's tell 
      //the server we are ready to start receiving tweets.
      socket.emit("start tweets");
    });
  }
}*/