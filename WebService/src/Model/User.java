package Model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonObject;

import database.DBConnection;

public class User {
	private static DBConnection dbClient;
	
	public User(){
		
	}
	
	public List<JsonObject> getUsers(int pp,int page){
		List<JsonObject> result= null;
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		result=dbClient.bulkDocsRetrieve("view_user",null,pp);
		return result;
	}
	
	public List<JsonObject> findUserByUsername(String username){
		List<JsonObject> result= null;
		//List<String> keys = Arrays.asList(new String[]{"username", "doc-id-2"});
		List<String> keys = Arrays.asList(new String[]{username});
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		result=dbClient.bulkDocsRetrieve("view_user",keys);
		return result;
	}
	
	public List<JsonObject> userTweets(String username,boolean geo){
		List<JsonObject> result= null;
		if(geo){
			result=userTweetsGeo(username);
		}else{
			List<String> keys = Arrays.asList(new String[]{username});
			dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
			result=dbClient.bulkDocsRetrieve("view_user",keys);
		}
		return result;
	}
	
	public List<JsonObject> userTweetsGeo(String username){
		//List<JsonObject> result= null;
		//List<String> keys = Arrays.asList(new String[]{"username", "doc-id-2"});
		List<String> keys = Arrays.asList(new String[]{username});
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		
		List<JsonObject> result = dbClient.getClientConnection().view("geolocation/user_coordinates")
				.includeDocs(true)
				.limit(1000)
				.reduce(false)
				.startKey(username,"1",new JSONObject())
				.endKey(username,new JSONObject(),new JSONObject())
				.query(JsonObject.class);
		return result;
	}
	
}
