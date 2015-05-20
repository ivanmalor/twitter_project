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

public class Accent {
	private static DBConnection dbClient;
	
	public Accent(){
		
	}
	
	
	public List<JsonObject> getAccent(String param)
	{
			
		
			List<JsonObject> result= new ArrayList<JsonObject>();
			/* Change database-name*/
			dbClient=new DBConnection("queries_results",false,"http","115.146.93.167",5984);
			System.out.println("PARAM:" + param);

			List<String> keys = Arrays.asList(new String[]{"topic_accent"});
			result=dbClient.bulkDocsRetrieve("_all_docs",keys);
			
			return result;
		

		
	}
	
	
	
	
}