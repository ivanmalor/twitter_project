/**
 * Top 10 presentation
 */
var rootURL = "http://localhost:8080/WebService/bhm";

$( document ).ready(function(){
	getAccentTweets();

});
function getAccentTweets(){
	//http://localhost:8080/WebService/bhm/statistics/top10?param=hashtag
	console.log('getTopTen');
	$.ajax({
		type: 'GET',
		url: rootURL + '/accent/tweets',
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false, // data type of response
		success: createTable, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTable(data)
{
	 
	var flag =0;
		 
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	 var trHTML = '';

	 $.each(list, function(index, info) 
			 {
		 		
		 		var random;
				 var color;
				 if(flag==0)
					
					 {
					flag=flag+1;
					for (i = 0; i < 10; i++) 
				     {
						
						 rank =i;
						 if(rank ==0) color = "badge bg-red";
						 if(rank>=2 && rank <=4) color = "badge bg-yellow";
						 if(rank>=5 && rank <=7) color = "badge bg-light-blue";
						 if(rank>=8 && rank <=10) color = "badge bg-green";
						 random=getRandomInt(1,500);
						 //alert (info.data[random][1]);
						 trHTML += '<tr><td> <span class="'+color+'">' + info.data[random][0] + '</span></td><td><h2>' +  info.data[random][1] + '</h2></td></tr>';
						
							
				      }
			 
			 }
				 $('#accent').append(trHTML);
		});
     
}