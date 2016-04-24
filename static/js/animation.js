(function(){
	"use strict";


//Checking for the browser if its not Chrome and show error message
var ua = navigator.userAgent.toLowerCase(); 
if (!(ua.indexOf('chrome') > -1)) {
	$("#not-chrome-error").show();
} 


//Animtion for the top side of the intro screen using typed.js
$(function(){
  $("#typed").typed({
    strings: ["Global Chat", "Faceless Chat", "3D Chat"],
    typeSpeed: 100, 
  });

});

//Fadein Animation for the UI in all parts based on class and id
var sr = ScrollReveal({ duration: 2000 });
sr.reveal('.intro-section', {duration:30});
sr.reveal('.why-section');
sr.reveal('#chatNow-btn', {duration:5000});
sr.reveal('.jumbotron');
sr.reveal('.active-chat');


//Flip for the available chatrooms
$('.hover').hover(function(){
	$(this).addClass('flip');
},function(){
	$(this).removeClass('flip');
});

})();

