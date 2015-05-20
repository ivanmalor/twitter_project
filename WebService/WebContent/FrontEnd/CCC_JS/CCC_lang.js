/**
 * language
 */
var rootURL = "http://localhost:8080/WebService/bhm";

$( document ).ready(function(){
	getLangStats();
	
});
function getLangStats(){
	//http://localhost:8080/WebService/bhm/statistics/lang
	console.log('getLangStats');
	$.ajax({
		type: 'GET',
		url: rootURL + '/statistics/lang',
		dataType: "json", // data type of response
		success: createPie, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}


function createPie(data)
{
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
	var langs=list[0].data;
	var langFrequecy=new Object();
	$.each(langs, function(index, lang) {
		var lansimp=lang[0].substr(0,2);
		if(langFrequecy[lansimp]){
			langFrequecy[lansimp]=langFrequecy[lansimp]+lang[1];
		}else{
			langFrequecy[lansimp]=lang[1]
		}
	});
	
	var dataGraph=[];
	var i=0;
	for(var k in langFrequecy) {
		console.log(k+","+langFrequecy.k);
		dataGraph[i]={"label":k,"value":langFrequecy[k]};
		i++;
	}
	
	//data: [
    //{label: "Download Sales", value: 12},
    //{label: "In-Store Sales", value: 30},
    //{label: "Mail-Order Sales", value: 20},
    //{label: "Mail-Order Sales", value: 20},
    //{label: "Mail-Order Sales", value: 20}
    //],
	//DONUT CHART
     var donut = new Morris.Donut({
       element: 'lang-chart',
       resize: true,
       data:dataGraph,
       hideHover: 'auto'
     });
     
}