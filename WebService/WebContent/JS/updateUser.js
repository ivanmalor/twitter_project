var error_free=true;
$( document ).ready(function(){
	alert(2);
	$('#update_user_firstname').on('input', function() {
	    var input=$(this);
	    var is_name=input.val();
	    if(is_name){input.removeClass("invalid").addClass("valid");}
	    else{input.removeClass("valid").addClass("invalid");}
	});

	$('#update_user_lastname').on('input', function() {
	    var input=$(this);
	    var is_name=input.val();
	    if(is_name){input.removeClass("invalid").addClass("valid");}
	    else{input.removeClass("valid").addClass("invalid");}
	});

	$('#update_user_email').on('input', function() {
	    var input=$(this);
	    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	    var is_email=re.test(input.val());
	    if(is_email){input.removeClass("invalid").addClass("valid");}
	    else{input.removeClass("valid").addClass("invalid");}
	});
});

function target(){
	alert( "Handler for .click() called." );
}

function updateUserButton(){
	alert(1);
	$(".updating_user").css("display","block");
}

//i dont know why onclick event does not work
/**$("#update_user").click(function(){
	alert(1);
	$(".updating_user").css("display","block");
});*/

function userCDN(fName, lName, eMail, username) {
    this.firstname = fName;
    this.lastname = lName;
    this.email = eMail;
    this.username = username;
    this.toJsonString = function () { return JSON.stringify(this); };
}

$("#update_user_submit button").click(function(event){
	var form_data=$("#update_user_form");
	var error_free=validateForm();
    if (!error_free){
    	alert('Errors in data form');
    }
    else{
        updateUserAjax();
    }
});

function updateUserSubmit(){
	var form_data=$("#update_user_form");
	var error_free=validateForm();
    if (!error_free){
    	alert('Errors in data form');
    }
    else{
        updateUserAjax();
    }
}

function validateForm(){
	var error_free=true;
	var form_data=$("#update_user_form").serializeArray();
	for (var input in form_data){
        var element=$("#update_"+form_data[input]['name']);
        var valid=element.hasClass("valid");
        var error_element=$("span", element.parent());
        if (!valid){error_element.removeClass("error").addClass("error_show"); error_free=false;}
        else{error_element.removeClass("error_show").addClass("error");}
    }
	return error_free;
}

function updateUserAjax(){
	var firstname=$("input[name='user_firstname']").val();
	var lastname=$("input[name='user_lastname']").val();
	var email=$("input[name='user_email']").val();
	var username=$("input[name='username']").val();
	
	var user = new userCDN(firstname, lastname, email, username);
	
	/**
	 * In order to add digest authentication
	 * http://stackoverflow.com/questions/5288150/digest-authentication-w-jquery-is-it-possible
	 */
	
	//read json content
	//https://rvieiraweb.wordpress.com/2013/01/21/consuming-webservice-net-json-using-jquery/
	 jQuery.ajax({
         type: "PUT",
         url: "http://localhost:8080/testCDN/updateUser/"+username,
         contentType: "application/json; charset=utf-8",
         data: user.toJsonString(),
         dataType: "json",
         success: function (data, status, jqXHR) {
        	 console.log(jqXHR.status);
        	 if(jqXHR.status==202){
        		 //user updated
        		 var username=data.username;
        		 var firstname=data.firstname;
        		 alert("username: "+username+" firstname:"+firstname);
        	 }
         },
         error: function (jqXHR, status) {
             // error handler
    		 alert("xhrstatus: "+jqXHR.status+" stattus:"+status);
         }     
     });
}