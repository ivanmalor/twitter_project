package Model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONArray;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import database.DBConnection;

public class Election {
	private static DBConnection dbClient;
	
	public Election(){
		
	}
	
	public List<JsonObject> getMentions(String param)
	{
		List<JsonObject> result= new ArrayList<JsonObject>();
		/* Change database-name*/
		dbClient=new DBConnection("queries_results",false,"http","115.146.93.167",5984);

		List<String> keys = Arrays.asList(new String[]{"election_mentions"});
		result=dbClient.bulkDocsRetrieve("_all_docs",keys);
					
		return result;
	}
	
	

	public List<JsonObject> getSentiment(String param)
	{
		List<JsonObject> result= new ArrayList<JsonObject>();
		/* Change database-name*/
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		result=dbClient.bulkDocsRetrieve("election_sentiment_category/election_sentiment_category",false,3,true);
		return result;	
	}
	
}