//Chatroom Controller
var chatRoomController = (function(){


	var setupAjax = function(){
		$.ajaxSetup({ 
	     beforeSend: function(xhr, settings) {
	         // generate CSRF token using jQuery
	         var csrftoken = $.cookie('csrftoken');
	         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
	             // Only send the token to relative URLs i.e. locally.
	             xhr.setRequestHeader("X-CSRFToken", csrftoken);
	         }
	     } 
	    });
	};

	//Post request on creating the room.
	var createChatRoom = function(){
		chatRoomController.setupAjax();
		var createdRoomID = null;
		console.log("I am calling the func");

		$.ajax({
			type: "POST",
			url: '/chat/createRoom/',
			success: function(data){
				$.getJSON('/chat/getCreatedChatRoomID/', {})
					.success(function(data, status){
						console.log("Success");
						createdRoomID = data[0].pk;
						console.log(data[0].pk);
						window.location.href = '/chatroom/'+createdRoomID+"?peerCreatorID=" + (data[0].fields).peerCreatorID;

					});	
			}
		});	
	};

	//Post request on joining the room.
	var joinChatRoom = function(roomID, roomCreatorName){

		chatRoomController.setupAjax();

		$.ajax({
			type: "POST",
			url: '/chat/' + roomID + '/joinRoom/',
			success: function(data){
				if (data.state == 'success'){
					window.location.href = '/chatroom/'+data.room + "/?peerJoinerID=" + data.peerJoinerID + "&peerCreatorID=" + data.peerCreatorID;
				}
				else{
					var myName = document.querySelector("#myName").innerHTML;

					if (myName == roomCreatorName){
						document.querySelector("#error_msg").display = "block";
						document.querySelector("#error_msg").innerHTML = "You can't join a room that you created";
					}
				}
			}

		});

	};

	//navigting through pages of chatrooms
	var changeRoomsPage = function(page){
		window.location.href = "/chatrooms/" + page;
		
	};

	return {
		setupAjax: setupAjax,
		createChatRoom: createChatRoom,
		joinChatRoom: joinChatRoom,
		changeRoomsPage: changeRoomsPage
	};


})();


 
