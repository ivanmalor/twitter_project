package com.app.restservice;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.glassfish.jersey.server.JSONP;

import Model.Accent;


@Path("/accent")
public class Accents {
	private Accent stat=new Accent();
	
	@GET
	@Path("/tweets")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getAccent(@DefaultValue("none") @QueryParam("param") String param)
	{	
		return stat.getAccent(param).toString();
	}
	
	
 
}
