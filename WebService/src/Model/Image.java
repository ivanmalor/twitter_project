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

public class Image {
	private static DBConnection dbClient;
	
	public Image(){
		
	}
	
	
	public List<JsonObject> getImages(String param)
	{
		
		
		List<JsonObject> result= new ArrayList<JsonObject>();
		/* Change database-name*/
		dbClient=new DBConnection("twit",false,"http","115.146.93.167",5984);
		System.out.println("PARAM:" + param);
		
	
		
		result = dbClient.getClientConnection().view("photo/photo")
				.limit(30)
				.reduce(false)
				.query(JsonObject.class);
		return result;
		

		
	}
	
	
	
	
}
