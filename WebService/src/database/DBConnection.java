package database;

import java.util.List;

import org.lightcouch.CouchDbClient;
import org.lightcouch.Response;

import com.google.gson.JsonObject;

public class DBConnection {
	private CouchDbClient dbClient;
	private boolean createDbIfNotExist=true;
	private String protocol="http";
	private String host="localhost";
	private int port=5984;
	private String errMsg;
	
	public DBConnection(String databaseName){
		dbClient=new CouchDbClient(databaseName, createDbIfNotExist, protocol, host, port, null, null);
	}
	
	public DBConnection(String databaseName,boolean createDbIfNotExist,
			String protocol, String host, int port){
		dbClient=new CouchDbClient(databaseName, createDbIfNotExist, protocol, host, port, null, null);
	}
	
	public void releaseConnection(){
		if(dbClient!=null){
			dbClient.shutdown();
		}
	}
	
	public CouchDbClient getClientConnection(){
		return dbClient;
	}
	
	public boolean insertNewRow(Object obj){
		boolean result=true;
		dbClient.save(obj);
		return result;
	}
	
	public boolean updateRow(Object obj){
		boolean result=true;
		dbClient.update(obj);
		return result;
	}
	
	public List<JsonObject> bulkDocsRetrieve(String view,List<String> keys,int limit) {
		
		List<JsonObject> docs=null;
		
		if(keys!=null && keys.size()>0){
			docs = dbClient.view(view)
					.includeDocs(true)
					.keys(keys)
					.limit(limit)
					.query(JsonObject.class);
		}else{
			docs = dbClient.view(view)
					.includeDocs(true)
					.limit(limit)
					.query(JsonObject.class);
			
		}
		
		return docs;
	}
	
	public List<JsonObject> bulkDocsRetrieve(String view,List<String> keys,int limit, String startKey) {
		
		List<JsonObject> docs=null;
		
		if(keys!=null && keys.size()>0){
			docs = dbClient.view(view)
					.includeDocs(true)
					.keys(keys)
					.limit(limit)
					.startKey(startKey)
					.query(JsonObject.class);
		}else{
			docs = dbClient.view(view)
					.includeDocs(true)
					.limit(limit)
					.startKey(startKey)
					.query(JsonObject.class);
			
		}
		
		return docs;
	}
	
	public List<JsonObject> bulkDocsRetrieve(String view,List<String> keys) {
		
		List<JsonObject> docs=null;
		
		if(keys!=null && keys.size()>0){
			docs = dbClient.view(view)
					.includeDocs(true)
					.keys(keys)
					.query(JsonObject.class);
		}else{
			docs = dbClient.view(view)
					.includeDocs(true)
					.query(JsonObject.class);
			
		}
		
		return docs;
	}
	
	public List<JsonObject> bulkDocsRetrieve(String view,boolean includeDocs) {
		
		List<JsonObject> docs=null;
		docs = dbClient.view(view)
				.includeDocs(includeDocs)
				.limit(200000)
				.query(JsonObject.class);
		return docs;
	}
	
	public List<JsonObject> bulkDocsRetrieve(String view,boolean includeDocs,int groupLevel,boolean reduce) {
		List<JsonObject> docs=null;
		docs = dbClient.view(view)
				.includeDocs(includeDocs)
				.reduce(reduce)
				.groupLevel(groupLevel)
				.query(JsonObject.class);
		return docs;
	}
	
	public void bulkModifyDocs(List<Object> docsNewOrModify) {

		boolean allOrNothing = true;
		
		List<Response> responses = dbClient.bulk(docsNewOrModify, allOrNothing);
	}
	
}
