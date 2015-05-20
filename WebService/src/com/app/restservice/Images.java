package com.app.restservice;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.glassfish.jersey.server.JSONP;

import Model.Image;


@Path("/images")
public class Images {
	private Image stat=new Image();
	
	@GET
	@Path("/popular")
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	public String getImages(@DefaultValue("none") @QueryParam("param") String param)
	{	
		return stat.getImages(param).toString();
	}
	
	
 
}
