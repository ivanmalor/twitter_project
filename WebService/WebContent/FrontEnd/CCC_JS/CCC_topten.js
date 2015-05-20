/**
 * Top 10 presentation
 */
var rootURL = "http://localhost:8080/WebService/bhm";

$( document ).ready(function(){
	getTopTenByHashtag();
	getTopTenByMostFollowers();
	getTopTenByTopic();
	getTopTenByMentionedTweeter();
	getTopTenByTweetMost();
});
function getTopTenByHashtag(){
	//http://localhost:8080/WebService/bhm/statistics/top10?param=hashtag
	console.log('getTopTen');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/top10?param=hashtag',
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

function getTopTenByMostFollowers(){
	//http://localhost:8080/WebService/bhm/statistics/top10?param=mostFollowers
	console.log('getTopTen');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/top10?param=mostFollowers',
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false, // data type of response
		success: createTableMostFollowers, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}

function getTopTenByTopic(){
	//http://localhost:8080/WebService/bhm/statistics/top10?param=topics
	console.log('getTopTen');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/top10?param=topics',
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false, // data type of response
		success: createTableTopics, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}

function getTopTenByMentionedTweeter(){
	//http://localhost:8080/WebService/bhm/statistics/top10?param=mentionedTweeter
	console.log('getTopTen');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/top10?param=mentionedTweeter',
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false, // data type of response
		success: createTableMentionedTweeter, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}

function getTopTenByTweetMost(){
	//http://localhost:8080/WebService/bhm/statistics/top10?param=userTweetMost
	console.log('getTopTen');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/top10?param=userTweetMost',
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false, // data type of response
		success: createTableTweetMost, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}


function createTable(data)
{
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	 var trHTML = '';
	 
	 $.each(list, function(index, info) {
			
			info.data.forEach(function(entry , index) {
				rank = index+1;
				if(rank == 1) color = "badge bg-red";
				if(rank>=2 && rank <=4) color = "badge bg-yellow";
				if(rank>=5 && rank <=7) color = "badge bg-light-blue";
				if(rank>=8 && rank <=10) color = "badge bg-green";
				
				 trHTML += '<tr><td>' + rank + '</td><td>' + entry[0] + '</td><td> <span class="'+color+'">' +  entry[1] + '</span></td></tr>';
	        });
			  $('#hashtag').append(trHTML);
		
		});
     
}

function createTableMostFollowers(data)
{
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	 var trHTML = '';
	 
	 $.each(list, function(index, info) {
			
			info.data.forEach(function(entry , index) {
				rank = index+1;
				if(rank == 1) color = "badge bg-red";
				if(rank>=2 && rank <=4) color = "badge bg-yellow";
				if(rank>=5 && rank <=7) color = "badge bg-light-blue";
				if(rank>=8 && rank <=10) color = "badge bg-green";
				
				 trHTML += '<tr><td>' + rank + '</td><td>' + entry[0] + '</td><td> <span class="'+color+'">' +  entry[1] + '</span></td></tr>';
	        });
			  $('#most_followers').append(trHTML);
		
		});
     
}

function createTableTopics(data)
{
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	 var trHTML = '';
	 
	 $.each(list, function(index, info) {
			
			info.data.forEach(function(entry , index) {
				rank = index+1;
				if(rank == 1) color = "badge bg-red";
				if(rank>=2 && rank <=4) color = "badge bg-yellow";
				if(rank>=5 && rank <=7) color = "badge bg-light-blue";
				if(rank>=8 && rank <=10) color = "badge bg-green";
				
				 trHTML += '<tr><td>' + rank + '</td><td>' + entry[0] + '</td><td> <span class="'+color+'">' +  entry[1] + '</span></td></tr>';
	        });
			  $('#topics').append(trHTML);
		
		});
     
}

function createTableMentionedTweeter(data)
{
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	 var trHTML = '';
	 
	 $.each(list, function(index, info) {
			
			info.data.forEach(function(entry , index) {
				rank = index+1;
				if(rank == 1) color = "badge bg-red";
				if(rank>=2 && rank <=4) color = "badge bg-yellow";
				if(rank>=5 && rank <=7) color = "badge bg-light-blue";
				if(rank>=8 && rank <=10) color = "badge bg-green";
				
				 trHTML += '<tr><td>' + rank + '</td><td>' + entry[0] + '</td><td> <span class="'+color+'">' +  entry[1] + '</span></td></tr>';
	        });
			  $('#mentioned_user').append(trHTML);
		
		});
     
}


function createTableTweetMost(data)
{
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	 var trHTML = '';
	 
	 $.each(list, function(index, info) {
			
			info.data.forEach(function(entry , index) {
				rank = index+1;
				if(rank == 1) color = "badge bg-red";
				if(rank>=2 && rank <=4) color = "badge bg-yellow";
				if(rank>=5 && rank <=7) color = "badge bg-light-blue";
				if(rank>=8 && rank <=10) color = "badge bg-green";
				
				 trHTML += '<tr><td>' + rank + '</td><td>' + entry[0] + '</td><td> <span class="'+color+'">' +  entry[1] + '</span></td></tr>';
	        });
			  $('#most_tweets').append(trHTML);
		
		});
     
}

