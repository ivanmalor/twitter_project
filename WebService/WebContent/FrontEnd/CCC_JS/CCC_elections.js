/**
 * Elections Analysis
 */
var rootURL = "http://localhost:8080/WebService/bhm/election";

$( document ).ready(function(){
	getElectionsMentions();
	getElectionsSentiments();
});
var colorPP={labour:"#da1500",conservative:"#0098d9",liberal:"#fbc300",green:"#6ab023",ukip:"#722889"}
var resultElectionData = [
	{data:[[191321, 4]],color: colorPP.labour}, //Labour
	{data:[[109071, 3]],color: colorPP.conservative},  //Conservative
	{data:[[44163, 2]],color: colorPP.liberal},   //Liberal
	{data:[[20083, 1]],color: colorPP.green},    //Green
	{data:[[13098, 0]],color: colorPP.ukip},  //Ukip 
];
var ticks = [
	[4, "Labour"], [3, "Conservartive"], [2, "Liberal"], [1, "Geen"], [0, "UKIP"]
]; 
var options = {
	label: "Political Partiec",
	series: {
        bars: {
            show: true,
            lineWidth: 0,
            order: 1,
            fillColor: {
                colors: [{
                    opacity: 1
                }, {
                    opacity: 0.7
                }]
            }
        }
    },
    bars: {
        align: "center",
        barWidth: 0.75,
        horizontal: true,
        lineWidth: 1
    },
    xaxis: {
    	
    },
    yaxis: {
        axisLabel: "Political Parties",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 3,
        tickColor: "#5E5E5E",
        tickLength: 0,
        ticks: ticks,
        color: "black"
    },
    xaxis: {
        axisLabel: "Number of Votes",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 15,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 10,
        max: 200000,
        tickColor: "#5E5E5E",
        color:"black"
    },
    legend: {
        noColumns: 4,
        labelBoxBorderColor: "#858585",
        position: "ne"
    },
    grid: {
        hoverable: true,
        borderWidth: 0
        //borderWidth: 1
        //backgroundColor: { colors: ["#171717", "#4F4F4F"] }
    }
};
var dataSet = [
   { label: "Election Results", data: resultElectionData, color: "#AB5800" }
];
$.plot("#CCC_election_result1",resultElectionData,options);
$.plot("#CCC_election_result2",resultElectionData,options);
$.plot("#CCC_election_result3",resultElectionData,options);

function getElectionsMentions(){
	//http://localhost:8080/WebService/bhm/tweet?geo=true&mapformat=true
	console.log('getElectionsMentions');
	$.ajax({
		type: 'GET',
		url: rootURL + '/mention',
		jsonp: 'callback',
        dataType: "jsonp",
        cache: false, // data type of response
		success: createGraphMentions, 
		error: function(xhr) {
		    //Do Something to handle error
			alert("error");
		}
	});
}

function getElectionsSentiments(){
	//http://localhost:8080/WebService/bhm/tweet?geo=true&mapformat=true
	console.log('getElectionsMentions');
	$.ajax({
		type: 'GET',
		url: rootURL + '/sentiment',
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
function createGraphMentions(data){
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
	var pplist=list[0].data;
	var ppMentions=[];
	$.each(pplist, function(index, pp) {
		//{data:[[191321, 4]],color: colorPP.labour},
		var dataVal={};
		if(pp[0]=="conservative, pre-election"){
			dataVal={data:[[pp[1],3]],color: colorPP.conservative};
		}else if(pp[0]=="labour, pre-election"){
			dataVal={data:[[pp[1],4]],color: colorPP.labour};
		}else if(pp[0]=="liberal, pre-election"){
			dataVal={data:[[pp[1],2]],color: colorPP.liberal};
		}else if(pp[0]=="ukip, pre-election"){
			dataVal={data:[[pp[1],0]],color: colorPP.ukip};
		}else if(pp[0]=="green, pre-election"){
			dataVal={data:[[pp[1],1]],color: colorPP.green};
		}
		ppMentions[index]=dataVal;
	});
	options.xaxis.max=13000;
	$.plot("#CCC_election_ment",ppMentions,options);
}
function createGraphSentiments(data){
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
	
	var ppPrePositives=new Object();
	var ppPreNegatives=[];
	var ppPostPositives=[];
	var ppPostNegatives=[];
	var totalPre=new Object();
	var totalPost=new Object();
	
	$.each(list, function(index, pp) {
		//{data:[[191321, 4]],color: colorPP.labour},
		var keys=pp.key;
		if(keys[1]=="pre-election"){
			if(keys[2]=="positive"){
				ppPrePositives[keys[0]]=pp.value;
			}else if(keys[2]=="negative"){
				ppPreNegatives[keys[0]]=pp.value;
			}
			if(totalPre[keys[0]]==null){
				totalPre[keys[0]]=pp.value;
			}else{
				totalPre[keys[0]]=totalPre[keys[0]]+pp.value;
			}
		}else if(keys[1]=="post-election"){
			if(keys[2]=="positive"){
				ppPostPositives[keys[0]]=pp.value;
			}else if(keys[2]=="negative"){
				ppPostNegatives[keys[0]]=pp.value;
			}
			if(totalPre[keys[0]]==null){
				totalPost[keys[0]]=pp.value;
			}else{
				totalPost[keys[0]]=totalPre[keys[0]]+pp.value;
			}
		}
	});
	
	
	var ppPrePositivesData=objectToDataSet(ppPrePositives,totalPre);
	var ppPreNegativesData=objectToDataSet(ppPreNegatives,totalPre);
	
	var ppPostPositivesData=objectToDataSet(ppPrePositives,totalPost);
	var ppPostNegativesData=objectToDataSet(ppPreNegatives,totalPost);
	
	options.xaxis.max=100;
	$.plot("#CCC_election_ment_po",ppPrePositivesData,options);
	options.xaxis.max=100;
	$.plot("#CCC_election_ment_ne",ppPreNegativesData,options);
	
	var ms_data = [{"label":"FOO","data":[[0,80],[0,-10],[1,70],[2,100],[3,60],[4,102]]},
	                 {"label":"BAR","data":[[0,10],[1,20],[2,30],[3,40],[4,80]]},
	                 {"label":"CAR","data":[[0,5],[1,10],[2,15],[3,20],[4,25]]}]
    var ms_ticks = [[0,"1/28"],[1,"1/29"],[2,"1/30"],[3,"1/31"],[4,"1/32"]];

    //function plotWithOptions() {
      $.plot($("#CCC_election_prepost"), ms_data, {
        bars: { show: true, barWidth: 0.6, series_spread: true, align: "center" },
        xaxis: { ticks: ms_ticks, autoscaleMargin: .10 },
        grid: { hoverable: true, clickable: true }
      });
    //}
	//prepost Analysis
	//var resultElectionData = [
    //  	{data:[[10, 4],[-5, 4],[10, 4],[-9, 4]],color: colorPP.labour}, //Labour
    //  	{data:[[109071, 3]],color: colorPP.conservative},  //Conservative
    //  	{data:[[44163, 2]],color: colorPP.liberal},   //Liberal
    //  	{data:[[20083, 1]],color: colorPP.green},    //Green
    //  	{data:[[13098, 0]],color: colorPP.ukip},  //Ukip 
    //  ];
	//options.bars.horizontal=false;
	//options.yaxis.ticks=null;
	//options.xaxis.ticks=ticks;
	//$.plot("#CCC_election_prepost",resultElectionData,options);
	//createPiePrePostElections();
}
function objectToDataSet(dataset,total){
	var dataVal={}
	var result=[];
	var i=0;
	for(k in dataset){
		var perct=(100*dataset[k])/total[k];
		if(k=="conservative"){
			dataVal={"data":[[perct,3]],"color": colorPP.conservative};
		}else if(k=="labour"){
			dataVal={"data":[[perct,4]],"color": colorPP.labour};
		}else if(k=="liberal"){
			dataVal={"data":[[perct,2]],"color": colorPP.liberal};
		}else if(k=="ukip"){
			dataVal={"data":[[perct,0]],"color": colorPP.ukip};
		}else if(k=="green"){
			dataVal={"data":[[perct,1]],"color": colorPP.green};
		}
		result[i]=dataVal;
		i++;
	}
	return result;
}
function createPiePrePostElections(){
	//-------------
    //- BAR CHART -
    //-------------
	var barChartData = {
      labels: ["Labour", "Conservative", "Liberal", "Ukip", "Green"],
      datasets: [
        {
          label: "Pre Election",
          fillColor: "#FDB813",
          strokeColor: "rgba(210, 214, 222, 1)",
          pointColor: "rgba(210, 214, 222, 1)",
          pointStrokeColor: "#c1c7d1",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: [[10,-10],[7,-8],[2,-10],[5,-10],[6,-10]]
        },
        {
            label: "Post Election",
            fillColor: "#00a65a",
            strokeColor: "rgba(210, 214, 222, 1)",
            pointColor: "rgba(210, 214, 222, 1)",
            pointStrokeColor: "#c1c7d1",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [[4,-4],[7,-8],[2,-10],[5,-10],[6,-10]]
        },
      ]
    };
	
    var barChartCanvas = $("#CCC_election_prepost").get(0).getContext("2d");
    //var barChartCanvas = $("#CCC_election_prepost");
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