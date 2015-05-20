package Model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import javax.swing.text.html.parser.Parser;

import org.json.JSONArray;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import database.DBConnection;

public class Statistic {
	private static DBConnection dbClient;
	
	public Statistic(){
		
	}
	
	//{data:[[day-time,value],[day-time,value],[day-time,value]]}
	public List<JsonObject> getSentimentsByDay(String day){
		Double[] mornigha=new Double[7];
		Double[] afternoonha=new Double[7];
		Double[] nightha=new Double[7];
		List<JsonObject> result= new ArrayList<JsonObject>();
		List<String> keys = Arrays.asList(new String[]{"sentiment_morning_night"});
		dbClient=new DBConnection("queries_results",false,"http","115.146.93.167",5984);
		List<JsonObject> tmp_result=dbClient.bulkDocsRetrieve("_all_docs",keys);
		JsonArray jsonData=tmp_result.get(0).getAsJsonArray("data");
		System.out.println(jsonData.toString());
		for(int i=0;i<jsonData.size();i++){
			String dayTime=jsonData.get(i).getAsJsonArray().get(0).getAsString();
			double perc=jsonData.get(i).getAsJsonArray().get(1).getAsDouble();
			System.out.println(dayTime+","+perc);
			processSentimentDayResult(dayTime,perc,mornigha,afternoonha,nightha);
		}
		
		JsonObject morning=new JsonObject();
		morning.add("morning", new JsonParser().parse(new Gson().toJson(mornigha)));
		JsonObject afternoon=new JsonObject();
		afternoon.add("afternoon", new JsonParser().parse(new Gson().toJson(afternoonha)));
		JsonObject night=new JsonObject();
		night.add("night", new JsonParser().parse(new Gson().toJson(nightha)));
		result.add(morning);
		result.add(afternoon);
		result.add(night);
		return result;
	}

	private void processSentimentDayResult(String dayTime, double perc,
			Double[] mornigha, Double[] afternoonha, Double[] nightha){
		
		if(dayTime.toLowerCase().equals("monday morning")){
			mornigha[0]=perc;
		}else if(dayTime.toLowerCase().equals("monday afternoon")){
			afternoonha[0]=perc;
		}else if(dayTime.toLowerCase().equals("monday night")){
			nightha[0]=perc;
		}else if(dayTime.toLowerCase().equals("tuesday morning")){
			mornigha[1]=perc;
		}else if(dayTime.toLowerCase().equals("tuesday afternoon")){
			afternoonha[1]=perc;
		}else if(dayTime.toLowerCase().equals("tuesday night")){
			nightha[1]=perc;
		}else if(dayTime.toLowerCase().equals("wednesday morning")){
			mornigha[2]=perc;
		}else if(dayTime.toLowerCase().equals("wednesday afternoon")){
			afternoonha[2]=perc;
		}else if(dayTime.toLowerCase().equals("wednesday night")){
			nightha[2]=perc;
		}else if(dayTime.toLowerCase().equals("thursday morning")){
			mornigha[3]=perc;
		}else if(dayTime.toLowerCase().equals("thursday afternoon")){
			afternoonha[3]=perc;
		}else if(dayTime.toLowerCase().equals("thursday night")){
			nightha[3]=perc;
		}else if(dayTime.toLowerCase().equals("friday morning")){
			mornigha[4]=perc;
		}else if(dayTime.toLowerCase().equals("friday afternoon")){
			afternoonha[4]=perc;
		}else if(dayTime.toLowerCase().equals("friday night")){
			nightha[4]=perc;
		}else if(dayTime.toLowerCase().equals("saturday morning")){
			mornigha[5]=perc;
		}else if(dayTime.toLowerCase().equals("saturday afternoon")){
			afternoonha[5]=perc;
		}else if(dayTime.toLowerCase().equals("saturday night")){
			nightha[5]=perc;
		}else if(dayTime.toLowerCase().equals("sunday morning")){
			mornigha[6]=perc;
		}else if(dayTime.toLowerCase().equals("sunday afternoon")){
			afternoonha[6]=perc;
		}else if(dayTime.toLowerCase().equals("sunday night")){
			nightha[6]=perc;
		}
		
	}
	
	
	public List<JsonObject> getLangStats(String param)
	{
		List<JsonObject> result= new ArrayList<JsonObject>();
		/* Change database-name*/
		dbClient=new DBConnection("queries_results",false,"http","115.146.93.167",5984);
		System.out.println("PARAM:" + param);

		List<String> keys = Arrays.asList(new String[]{"user_tweet_language"});
		result=dbClient.bulkDocsRetrieve("_all_docs",keys);
		
		return result;
	}
	
	
	public List<JsonObject> getTopTen(String param)
	{
		List<JsonObject> result= new ArrayList<JsonObject>();
		dbClient=new DBConnection("queries_results",false,"http","115.146.93.167",5984);
		System.out.println("PARAM:" + param);
		if(param.equals("hashtag"))
		{
			List<String> keys = Arrays.asList(new String[]{"hash_tag_topics"});
			result=dbClient.bulkDocsRetrieve("_all_docs",keys);				
		}
		
		if(param.equals("mostFollowers"))
		{
			List<String> keys = Arrays.asList(new String[]{"most_followers"});
			result=dbClient.bulkDocsRetrieve("_all_docs",keys);				
		}
		
		if(param.equals("topics"))
		{
			List<String> keys = Arrays.asList(new String[]{"all_concepts_bham"});
			result=dbClient.bulkDocsRetrieve("_all_docs",keys);
		}
			
		if(param.equals("mentionedTweeter"))
		{
			List<String> keys = Arrays.asList(new String[]{"most_mentioned_tweeter"});
			result=dbClient.bulkDocsRetrieve("_all_docs",keys);			
		}
		
		if(param.equals("userTweetMost"))
		{
			List<String> keys = Arrays.asList(new String[]{"most_prolific_tweeter"});
			result=dbClient.bulkDocsRetrieve("_all_docs",keys);
		}
		
		return result;
		
	}
	
	public List<JsonObject> geoSentiments(){
		List<JsonObject> result= null;
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		result=dbClient.bulkDocsRetrieve("bham_coordinate_sentiment/bham_coordinate_sentiment",false);
		return result;
	}
	
	public List<JsonObject> getTotalsSentiments(){
		List<JsonObject> result= null;
		
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		
		result = dbClient.getClientConnection().view("TotalSentiment/TotalSentiment")
				.includeDocs(false)
				.reduce(true)
				.groupLevel(1)
				.query(JsonObject.class);
		return result;
	}
	
	public List<JsonObject> getTweetXHour(){
		List<JsonObject> result= null;
		dbClient=new DBConnection("queries_results",false,"http","115.146.93.167",5984);
		List<String> keys = Arrays.asList(new String[]{"most_frequent_tweet_hour"});
		result=dbClient.bulkDocsRetrieve("_all_docs",keys);
		return result;
	}
}
