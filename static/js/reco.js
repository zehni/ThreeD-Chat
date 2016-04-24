var reco = (function(){
  "use strict";

  // list of lists containing the language and the format for the translation (to make scalability easier for adding new languages)
    var langs =
    [['English',         ['en-US', 'United States']],
     ['Français',        ['fr-FR']]];

     // a dictionary to map language to the speech person. 
     //To add a new language, you can add the language as a key and the person as a value
    var voice = {'English': 'US English Female', 'Français' : 'French Female'};

    // loop that goes through the available languages and add them in the dropdown menu for selecting the language
    for (var i = 0; i < langs.length; i++) {
      select_language.options[i] = new Option(langs[i][0], i);
    }

    // by default, the dropdown menu is the first one in the langs which is English
    select_language.selectedIndex = 0;

    // Code for recognition and speech

    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;

    //checking if speechkit is availabe for the browser
    //if no, we update the broser
    //else, we establish a new speechkitobject
    if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } else {
      start_button.style.display = 'inline-block';
      var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onstart = function() {
        recognizing = true;
        start_img.src = '../../../static/media/mic-animate.gif';
      };


      //error actions depending on each type of error
      recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          start_img.src = '../../../static/media/mic.gif';
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          start_img.src = '../../../static/media/mic.gif';
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
          } 
          ignore_onend = true;
        }
      };


      // an event handler to be called when the API finishes with recognizing of speech
      recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
          return;
        }
        start_img.src = '../../../static/media/mic.gif';
        // if it didn't finish it and add it to the final_transcript, then return
        if (!final_transcript) {
          return;
        }
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
          var range = document.createRange();
          range.selectNode(document.getElementById('final_span'));
          window.getSelection().addRange(range);
        }
      };

      //this concatenates the interim text and the final and
      //shows them in the textbox.
      recognition.onresult = function(event) {

        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }

        final_transcript = capitalize(final_transcript);
        final_span.value = linebreak(final_transcript);
        // interim_span.innerHTML = linebreak(interim_transcript);

        //inCase we have any audio that changed into texy, show buttons.
        if (final_transcript || interim_transcript) {
          showButtons('inline-block');
        }
      };
    }

    //for upgrading browser
    function upgrade() {
      start_button.style.visibility = 'hidden';
    }

    //----------------------formating the textbox-----------------------------------
    var two_line = /\n\n/g;
    var one_line = /\n/g;

    function linebreak(s) {
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    var first_char = /\S/;

    function capitalize(s) {
      return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }

    //----------------------formating the textbox ends here-----------------------------------

    //  TRANSLATE API ///
    function translate(chatText){
      var yandexAPI = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160326T095713Z.490275ce80794de0.21d4b1e0f180dfcb1f31c9a9851d87090ca51ab2";

      // get the language selected
      var langselected = langs[select_language.selectedIndex][0];

      // this portion of code translate the text 
      // only using English and French, This portion need to be modified a bit if more languages need to be added
      if(langselected == "English"){  // if language selected is English then translate from French to English
        $.getJSON( yandexAPI, {
          text: chatText,
          lang: "fr-en"
        })
        .success(function(data, status){
            addMessage2(data.text[0], "US English Female");
        });
      }

      if(langselected == "Français"){ // if language selecteed is French, then translate from English to French
        $.getJSON( yandexAPI, {

          text: chatText,
          lang: "en-fr"
        })
        .success(function(data, status){
            addMessage2(data.text[0], "French Female");
        });
      }


    }


    function translateStatus(chatText){
        var yandexAPI = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160326T095713Z.490275ce80794de0.21d4b1e0f180dfcb1f31c9a9851d87090ca51ab2";

      // get the language selected
        var langselected = langs[select_language.selectedIndex][0];

        // this portion of code translate the text 
        // only using English and French, This portion need to be modified a bit if more languages need to be added
        if(langselected == "English"){  // if language selected is English then translate from French to English
          $.getJSON( yandexAPI, {
            text: chatText,
            lang: "fr-en"
          })
          .success(function(data, status){
                addStatusMessage(data.text[0], voice[langs[select_language.selectedIndex][0]]);

          });
        }

        if(langselected == "Français"){ // if language selecteed is French, then translate from English to French
          $.getJSON( yandexAPI, {

            text: chatText,
            lang: "en-fr"
          })
          .success(function(data, status){
              addStatusMessage(data.text[0], voice[langs[select_language.selectedIndex][0]]);
          });
        } 
    }
  


    // The wait functions are used for the mouth movement
    // Keep checking if the responsiveVoice started to play, if so, start the mouth animation
    // the mouth will keep animating till the resonsiveVoice isn't playing anymore
    function wait2(){
        setTimeout(function(){
            if (responsiveVoice.isPlaying()){
                wait2();
            } else{
                threed.stopSpeaking();
            }
        }, 20);
    }

    function wait(){
        setTimeout(function(){
            if (!responsiveVoice.isPlaying()){
                wait();
            } else{
                threed.startSpeaking();
                wait2();
            }
        }, 20);
    }
    //// End of the waiting funcitons ///

    // The chatting part
    var peer;
    var conn;

    var roomID;

    var connectedPeerName = "";  // the username of the user we are connected to
    var myName = ""; // the username of our user
    var connectPeerID = -1;  // to check if we are already connected and hold the connected peer id

    var amICreator = 0; // to check if I am the creator of the room

    // this function takes the text and the language that is received from the other peer and it adds it to the UI
    function addMessage2(text, language){
      var msgs = document.getElementById("chatMessages");
      var sideMsgs = document.getElementById("side-msgs");
      msgs.innerHTML = '<div class="message-text-wrapper"><p class="message-text"><span class="username2">' + connectedPeerName + ': </span>' + text+'</p></div>';
      sideMsgs.innerHTML += "<p>" + connectedPeerName + ": " + text + "</p>";
      //Fading out the message
      setTimeout(function() {  
      $('#chatMessages').fadeOut();
      }, 3000 );
      $('#chatMessages').show();

      // calling the speak for text to speech
      responsiveVoice.speak(text, language);

      // start calling the wait for the mouth movement to start based on if the responseVoice is playing
      wait();
     }

     // this function takes text and language and show the message as a status message (e.g. user joined chatroom..etc)
    function addStatusMessage(text, language){
      var msgs = document.getElementById("chatMessages");
      var sideMsgs = document.getElementById("side-msgs");
      msgs.innerHTML = '<div class="message-text-wrapper"><p class="message-text"><span class="username2">' + '</span>' + text+'</p></div>';
      sideMsgs.innerHTML += "<p id='statusMsg'>" + text + "</p>";
      //Fading out the message
      setTimeout(function() {
      $('#chatMessages').fadeOut();
      }, 3000 );
      $('#chatMessages').show();


      // callign the speak function for the text to speech
      // responsiveVoice.speak(text, voice[langs[select_language.selectedIndex][0]]);
      responsiveVoice.speak(text, voice[langs[select_language.selectedIndex][0]]);


      // calls the waiting to start the mouth movement based on the responsiveVoice is playing
      wait();
    }

    // add the User meessage (my messages) to the UI 
    function addMessage(text){
      var sideMsgs = document.getElementById("side-msgs");
      var msgs = document.getElementById("chatMessages");
      msgs.innerHTML = '<div class="message-text-wrapper"><p class="message-text"><span class="username1">' + myName + ": " + '</span>' + text +'</p></div>';
      sideMsgs.innerHTML += "<p>" + myName + ": "+text+"</p>";

      //Fading out the message
      setTimeout(function() {
      $('#chatMessages').fadeOut();
      }, 3000 );
      $('#chatMessages').show();
    }

    //http://stackoverflow.com/questions/14354040/jquery-1-9-live-is-not-a-function

    //Using enter button to send message from text box
    $('#final_span').on("keypress", function(e) {
            if (e.keyCode == 13) {
                sendButton();
                return false; // prevent the button click from happening
            }
    });

    // sending button to send the text (if connected and there is something in the textbox to send)
    function sendButton() {
      if (recognizing) {
        recognizing = false;
        recognition.stop();
        return;
      }

      if (final_span.value !== '' && connectPeerID !== -1){
        addMessage(final_span.value);

         var a = {'language': langs[select_language.selectedIndex][0],
                  'isActive': 'true',
                  'text': final_span.value,
                  'name' : document.querySelector('#myName').innerHTML};

        conn.send(JSON.stringify(a));
        final_span.value = "";
      }


    }

    //setting up everything when recording starts
    function startButton(event) {
      if (recognizing){
        final_span.value = '';
        interim_span.innerHTML = '';
        recognition.stop();
        return;
      }


      final_transcript = '';
     // recognition.lang = select_dialect.value;
      recognition.lang = langs[select_language.selectedIndex][1][0];
      recognition.start();
      ignore_onend = false;
      final_span.value = '';
      interim_span.innerHTML = '';
      start_img.src = '../../../static/media/mic-slash.gif';
      start_timestamp = event.timeStamp;
    }



    var current_style;

    function showButtons(style) {
      if (style == current_style) {
        return;
      }

      current_style = style;
      copy_button.style.display = style;

    }


    // flag to check if the leave button was pressed
    var leaveFlag = 0;

    // a function is called in the beginning, it starts the connection 
    function startConnection(){

      var myID = document.getElementById("myID").innerHTML;
      peer = new Peer(myID, {host:'sheltered-lowlands-42561.herokuapp.com', port:443, secure:true});
      myName = document.querySelector("#myName").innerHTML;

      // event handling when someone connects to the user (current peer)
      peer.on('connection', function(conns) {
        conns.on('data', function(data){  // on the receiving of data
          // Will print 'hi!'
          if (connectPeerID == -1){  // check if we are already connected 
            conn = peer.connect(conns.peer);
            conn.on('open', function(){
               var a = {'language': langs[select_language.selectedIndex][0],
                        'isActive': 'start',
                        'name': myName};

              a.text = "you are connected to " + a.name;
              conn.send(JSON.stringify(a));   
            });
            connectPeerID = conns.peer;
          } else{
            if (connectPeerID !== conns.peer){
               return;  // not allow more connections 
            }
          }

          // parse the data sent by the other peer
          var temp = JSON.parse(data);
          // set the peer name (being sent in the JSON)
          connectedPeerName = temp.name;
          document.querySelector("#peerUserName").innerHTML = connectedPeerName;

          // check if the chat is active (messages are for chat and not for setting up the connectoin)
          if (temp.isActive == 'true'){
            // if the peers have the same language no need to translate
            if (temp.language === langs[select_language.selectedIndex][0]){
                addMessage2(temp.text, voice[temp.language]);
            } else{ // else we need to translate the text
                translate(temp.text);
            }
          } else { // add the message to the UI (it is a status message)
            // addStatusMessage(temp.text, voice[temp.language]);
            translateStatus(temp.text);
          }

          // if received the signal that the other peer disconnected
          conn.on('disconnected', function(){
            peerLeft();        
          });

          // if received the signal that the other peer closed
          conn.on('close', function(){
            peerLeft();
          });

        });

      });

      roomID = getRoomID();
  
    // event handler being called when user click on a link, change the url, or close the window/tab
      $(window).bind('beforeunload', function() {
          if (leaveFlag == 0)  // check if the leave button was clicked and if not do the following
            leaveRoom();    // cal leave the room, to send to the db to update the entry
            peer.disconnect(); // disconnect the peer (send the signal to the other peer)
      });


    }

    // function is called when peer leaves to redirect and show that a peer has left in the UI
    function peerLeft(){
      var msg = connectedPeerName + " has left the room";
      //addStatusMessage(msg, "US English Female");
      translateStatus(msg);

      document.querySelector("#peerUserName").innerHTML = "Waiting..";

      // if I am not the creator and the peer left (he was the creator of the room) .. get redirected to the chatrooms page
      if (amICreator === 0)
        window.location.href = "/chatrooms/1";

      connectPeerID = -1; // reset the connect peer ID to -1 since we aren't connected anymore

    }

    // function being called to connect to a peer
    function connectToPeer(){
      var peerID = document.getElementsByName("peerID")[0].value;

      if (peerID === ""){ // if i am the creator don't do anything (we don't connect to anyone .. yet)
        amICreator = 1;
        return;
      } 

      conn = peer.connect(peerID);

      connectPeerID = peerID;
      // on the creation of the connection
      conn.on('open', function(){
        var a = {'language': langs[select_language.selectedIndex][0],
              'isActive': 'start',  // this is start because this is a setting up message
              'name': document.querySelector("#myName").innerHTML};

        a.text = a.name + " joined chatroom";
        conn.send(JSON.stringify(a));  // send a setting up message
      });
    }

    // a function that reads the url and get the roomID from the url
    function getRoomID(){
      var x = (window.location.href).split("/chatroom/")[1];
      var roomID = x.split("/")[0];
      return roomID;

    }

    // function called to leave room
    function leaveRoom(){
      chatRoomController.setupAjax();
      var urlReq = "/chat/" + roomID +"/leaveRoom/";

      // set the leave flag to 1 
      leaveFlag = 1;

      // send an ajax request to update the db
      $.ajax({
        type: "POST",
        url: urlReq,
        data: {'isCreator' : amICreator},
        success: function(data){
          window.location.href = "/chatrooms/1";
        }
      });

    }


      // to handle button leave clicked
      $('#leaveBtn').click(function(){
        peer.disconnect();
        leaveRoom();

      });


    startConnection();


    return {connectToPeer: connectToPeer,
            sendButton: sendButton,
            startButton: startButton,
            upgrade: upgrade,
            leaveRoom: leaveRoom};
})();
