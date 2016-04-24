# Untitled Team #

## Project title ##

### 3D Chat 

## Project description ##

Here we introduce a new chat room experience using a 3D Face that blinks, talk and move lips on talking. Not only that, but the face also tracks the user's face and tilt towards it. A user can type or speak and send to the other user in their language (English, French).

## Technologies Used ##

* UI
    * Bootstrap
    * Bootstrap-Select
    * FontAwesome
    * Typed.js
    * Google Fonts
    * ScrollReveal.js
* 3D Face & Tracking
    * Tracking.js
    * Three.js
    * Detector.js
* Translation & Speech
    * ResponsiveVoice.js
    * Yadenx Translation API
    * Google Web Speech API
* Chat Connection
    * Peer.js
* Other
    * Django
    * PostgreSQL


## Project Link & Running Locally ##
https://testthreed-chat.herokuapp.com/

Running Locally? No problem!

* Clone the repo using the following in your terminal
```terminal
git clone https://github.com/zehni/ThreeD-Chat.git
```
* cd into ``` src/threedchat```
* run the following code in your terminal (Make sure you set DEBUG in ```settings.py``` to True if its False
```terminal
python manage.py runserver
```
* Use Google Chrome and browse at: (If you use any other browser you will see a notification saying the app not supported
```terminal
localhost:8000
```

* Happy chatting!!

## Team Members ##

* John Mikhaeil
* Salma Moustafa 
* Zehni Khairullah

## Credits ##
* Styling the select boxes: https://silviomoreto.github.io/bootstrap-select/

* Three.js (Face WebGL): http://threejs.org/examples/#webgl_animation_skinning_morph by apendua

* Add event listener for text box to send: http://stackoverflow.com/questions/14354040/jquery-1-9-live-is-not-a-function

* ResponsiveVoice for talking: http://responsivevoice.org/

* Tracking the facing using: https://trackingjs.com/

* Detector.js (for WebGL) by @author alteredq / http://alteredqualia.com/ @author mr.doob / http://mrdoob.com/

* ScrollReveal https://scrollrevealjs.org/

* Speech Detection: https://www.google.com/intl/en/chrome/demos/speech.html

* Typed.js: https://github.com/mattboldt/typed.js/

* Scaling the UI for any screen using VW and VH: http://snook.ca/archives/html_and_css/vm-vh-units

* Peer js for connecting users: http://peerjs.com/

* Lato:300 font by Google Fonts: https://www.google.com/fonts

* FontAwesome for Icons: https://fortawesome.github.io/Font-Awesome/

* Yandex Translation API: https://tech.yandex.com/translate/

* Background image: http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/swirl_pattern.png

* Checking for what browser is used: http://stackoverflow.com/questions/7944460/detect-safari-browser

* Registration using django forms: http://www.tangowithdjango.com/book/chapters/login.html

