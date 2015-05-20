package com.app.restservice;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.glassfish.jersey.server.JSONP;

import Model.Statistic;
import Model.Tweet;

@Path("/statistics")
public class Statistics {
	private Statistic stat=new Statistic();
	
	@GET
	@Path("/sentiments")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getSentimentsByDay(@DefaultValue("none") @QueryParam("day") String day)
	{	
		return stat.getSentimentsByDay(day).toString();
	}
	
	@GET
	@Path("/geoSentiments")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String geoSentiments()
	{	
		return stat.geoSentiments().toString();
	}
	
	@GET
	@Path("/sentiments/totals")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getTotalsSentiments()
	{	
		return stat.getTotalsSentiments().toString();
	}
	
	@GET
	@Path("/top10")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getTopTen(@DefaultValue("none") @QueryParam("param") String param)
	{	
		return stat.getTopTen(param).toString();
	}
	
	@GET
	@Path("/lang")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getLangStats(@DefaultValue("none") @QueryParam("param") String param)
	{	
		return stat.getLangStats(param).toString();
	}
 
	@GET
	@Path("/tweetxhour")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getTweetXHour()
	{	
		return stat.getTweetXHour().toString();
	}
 
}
