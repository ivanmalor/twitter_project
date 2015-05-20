/**
 * 
 */

// The root URL for the RESTful services
var rootURL = "http://localhost:8080/WebService/bhm";

$( document ).ready(function(){
	//Register listeners
	$('#btnSearchTweet').click(function() {
		alert(1);
		searchTweet($('#searchKeyTweet').val());
		return false;
	});

	// Trigger search when pressing 'Return' on search key input field
	$('#searchKeyTweet').keypress(function(e){
		if(e.which == 13) {
			alert(2);
			searchTweet($('#searchKeyTweet').val());
			e.preventDefault();
			return false;
	    }
	});

	$('#btnSearchUser').click(function() {
		searchUser($('#searchKeyUser').val());
		return false;
	});

	// Trigger search when pressing 'Return' on search key input field
	$('#searchKeyUser').keypress(function(e){
		if(e.which == 13) {
			searchUser($('#searchKeyUser').val());
			e.preventDefault();
			return false;
	    }
	});
});


function searchTweet(searchKey) {
	if (searchKey == ''){
		alert(3);
		findAllTweet();
	}else{
		alert(4);
		findTweetById(searchKey);
	}
}

function searchUser(searchKey) {
	if (searchKey == '') 
		findAllUser();
	else
		findUserByUsername(searchKey);
}

function findAllTweet() {
	console.log('findAll');
	alert(5);
	$.ajax({
		type: 'GET',
		url: rootURL + '/tweet' ,
		dataType: "json", // data type of response
		success: renderListTweet
	});
}

function findTweetById(searchKey) {
	console.log('findByName: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/tweet/' + searchKey,
		dataType: "json",
		success: renderListTweet 
	});
}

function findAllUser() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL + '/user/',
		dataType: "json", // data type of response
		success: renderListUser
	});
}

function findUserByUsername(searchKey) {
	console.log('findByName: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + + '/user/' + '/search/' + searchKey,
		dataType: "json",
		success: renderListUser 
	});
}

function renderListTweet(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	$('#displaySearch li').remove();
	$.each(list, function(index, tweet) {
		//$('#displaySearch ul').append('<li><a href="#" data-identity="' + wine.id + '">'+wine.name+'</a></li>');
		$('#displaySearch').append('<li>'+tweet._id+','+tweet.tweet_data.user.screen_name+','+tweet.tweet_data.text+'</li>');
	});
}

