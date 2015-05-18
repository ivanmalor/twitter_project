//Map function to get the user language and tweet language
//Of all the tweets collected in couchDB

function(doc) {
	tweet_lang = doc.tweet_data.lang
	user_lang = doc.tweet_data.user.lang
    emit([user_lang.toLowerCase(), tweet_lang], 1);
}