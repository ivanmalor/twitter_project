package com.app.restservice;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.glassfish.jersey.server.JSONP;

import Model.Election;
import Model.Image;


@Path("/election")
public class Elections {
	private Election stat=new Election();
	
	@GET
	@Path("/mention")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getMentions(@DefaultValue("none") @QueryParam("param") String param)
	{	
		return stat.getMentions(param).toString();
	}
	
	@GET
	@Path("/sentiment")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getSentiment(@DefaultValue("none") @QueryParam("param") String param)
	{	
		return stat.getSentiment(param).toString();
	}
	
	
 
}
