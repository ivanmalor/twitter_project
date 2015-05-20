/**
 * Photos
 */
var rootURL = "http://localhost:8080/WebService/bhm";

$( document ).ready(function(){
	getPopularPhotos();
	
});
function getPopularPhotos(){
	//http://localhost:8080/WebService/bhm/images/popular
	console.log('getPopularPhotos');
	$.ajax({
		type: 'GET',
		url: rootURL + '/images/popular',
		dataType: "json", // data type of response
		success: createImages, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}


function createImages(data)
{
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	 var trHTML = '';
	// Init mosaicflow
	 var container = $('##image-gallery').mosaicflow();


	 
	 $.each(list, function(index, info) {
		 //$('#image-gallery').append('<li data-thumb="'+info.value+'" /> <img src="'+info.value +'" /></li>');
	
		 // Create new html node and append to smallest column
		 var elm = $('<li data-thumb="'+info.value+'" /> <img src="'+info.value +'" /></li>');
		 container.mosaicflow('add', elm);	
		});
     
}