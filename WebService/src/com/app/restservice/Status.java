package com.app.restservice;

import javax.ws.rs.*;
import javax.ws.rs.core.*;

@Path("/status")
public class Status {

	@GET
	@Produces(MediaType.TEXT_HTML)
	public String test()
	{
		return "<h1> Testing web service <h1>";
	}
	
	@Path("/test2")
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String test2()
	{
		return "<h1> test 2 <h1>";
	}
	
	
}
