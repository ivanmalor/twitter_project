package com.app.restservice;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.*;
import javax.ws.rs.core.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import Model.User;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@Path("/user")
public class UserRest {
	private User userModel=new User();
	
	@GET
	@Produces("application/json")
	/**
	 * Return a list of users oreder by username. As default return 10
	 * Params:
	 * pp: number of user to return per page. default 10 max 100
	 * page: number of page that want to be returned.
	 * @return
	 */
	public List<JsonObject> users(@QueryParam("pp") int pp, 
            			@QueryParam("page") int page)
	{	
		return userModel.getUsers(pp,page);
	}
	
	@GET @Path("search/{username}")
	@Produces("application/json")
	public List<JsonObject> findByUsername(@PathParam("username") String username) {
		return userModel.findUserByUsername(username);
    }
 
	@GET @Path("search/{username}/tweets")
	@Produces("application/json")
	public List<JsonObject> usernameTweets(@PathParam("username") String username) {
		return userModel.findUserByUsername(username);
    }
	
	@GET @Path("search/{username}/tweets/geo")
	@Produces("application/json")
	public List<JsonObject> usernameTweetsWithGeo(@PathParam("username") String username) {
		return userModel.userTweetsGeo(username);
    }
	
    @GET @Path("{id}")
    @Produces("application/json")
    public String findById(@PathParam("id") String id) {
        return "";
    }
}
