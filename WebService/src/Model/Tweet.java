package Model;

import java.util.Arrays;
import java.util.List;

import org.json.JSONObject;

import com.google.gson.JsonObject;

import database.DBConnection;

public class Tweet {
	private static DBConnection dbClient;
	
	public Tweet(){
		
	}
	
	public List<JsonObject> getTweets(int pp,int page,boolean geo, boolean mapformat){
		List<JsonObject> result= null;
		if(geo){
			result=tweetsWithGeo(pp,mapformat);
		}else{
			dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
			result=dbClient.bulkDocsRetrieve("_all_docs",null,pp);
		}
		return result;
	}
	
	public List<JsonObject> findTweetById(String id){
		List<JsonObject> result= null;
		//List<String> keys = Arrays.asList(new String[]{"username", "doc-id-2"});
		List<String> keys = Arrays.asList(new String[]{id});
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		result=dbClient.bulkDocsRetrieve("_all_docs",keys);
		return result;
	}
	
	public List<JsonObject> tweetsWithGeo(int pp,boolean mapformat){
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		List<JsonObject> result = null;
		
		boolean includeDocs=(mapformat)?false:true;
		
		result = dbClient.getClientConnection().view("geolocation/user_coordinates")
				.limit(pp)
				.includeDocs(includeDocs)
				.reduce(false)
				.query(JsonObject.class);
		return result;
	}
}
