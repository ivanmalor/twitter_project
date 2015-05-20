package com.app.restservice;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.*;
import javax.ws.rs.core.*;

import org.glassfish.jersey.server.JSONP;
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

import Model.Tweet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Path("/tweet")
public class TweetRest {
	
	private Tweet tweetModel=new Tweet();
	
	@GET
	@Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
	/**
	 * Return a list of tweets order by id. As default return 10 tweets
	 * Params:
	 * pp: number of tweets to return per page. default 10
	 * page: number of page that want to be returned.
	 * @return
	 */
	public String tweet(@DefaultValue("10") @QueryParam("pp") int pp,
	        @DefaultValue("1") @QueryParam("page") int page,
	        @DefaultValue("false") @QueryParam("geo") boolean geo,
	        @DefaultValue("false") @QueryParam("mapformat") boolean mapformat)
	{	
		return tweetModel.getTweets(pp, page, geo, mapformat).toString();
	}
 
    @GET @Path("{id}")
    @Produces({"application/json", "application/javascript"})
    @JSONP(queryParam = "callback")
    public String findById(@PathParam("id") String id) {
    	return tweetModel.findTweetById(id).toString();
    }
	
	public String excutePost() throws Exception {
		//String url = "https://selfsolve.apple.com/wcResults.do";
		String host = "115.146.93.167";
		
		String jsonString="";
		
		//JSONObject keyq = new JSONObject();
		//["_acpm_","1430569084269",[52.443860999999998285,-1.933254000000000028]]
        JSONArray keyqv=new JSONArray();
        JSONArray co=new JSONArray();
        co.put(0.0);
        co.put(-100.0);
        keyqv.put("_acpm_");
        keyqv.put("100");
        keyqv.put(new JSONObject());
        
        JSONArray keyqv2=new JSONArray();
        JSONArray co2=new JSONArray();
        co2.put(100.0);
        co2.put(0.0);
        keyqv2.put("_acpm_");
        //wildcard
        keyqv2.put(new JSONObject());
        keyqv2.put(new JSONObject());
        
		URIBuilder builder = new URIBuilder();
	    builder.setScheme("http").setHost(host).setPort(5984).setPath("/twit/_design/geolocation/_view/user_coordinates")
	    .setParameter("limit", "10")
	    //.setParameter("include_docs", "true")
	    //.setParameter("group_level","2")
	    .setParameter("reduce", "false")
	    .setParameter("startkey", keyqv.toString())
	    .setParameter("endkey", keyqv2.toString());
	    
	    //.setParameter("group_level","1");
	    //.setParameter("action", "finish");
		
		HttpPost httpPost = new HttpPost(builder.build());
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-type", "application/json");
        
        //to select on specfic key from a compose key in a view 
        //o from queries with _all_docs we have to sent in the content
        //a JSON with the content {"keys": ["key1", "key2", ...]}
        JSONObject jsonObject = new JSONObject();
        JSONArray keys=new JSONArray();
        //keys.put("_acpm_");
        //jsonObject.put("keys", keys);
        
		//setEntity : set the content of the POST request
		httpPost.setEntity(new StringEntity(jsonObject.toString()));
        
        System.out.println(httpPost.getURI().toString());
        HttpResponse response = new DefaultHttpClient().execute(httpPost);
		
        System.out.println("Status "+response.toString());
        int responseCode = response.getStatusLine().getStatusCode();
        String str = Integer.toString(responseCode);
        System.out.println("Responce code"+ str);
        switch(responseCode) {
        case 200:
            HttpEntity entity = response.getEntity();
            if(entity != null) {
                String responseBody = EntityUtils.toString(entity);
                //Log.d("Responce", responseBody.toString());
                jsonString = responseBody.toString();

            }
            break;
        }
        
		return jsonString;
	}
}
