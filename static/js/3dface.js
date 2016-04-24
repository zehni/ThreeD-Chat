var threed = (function(){
  "use strict";

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var FLOOR = -250;

	var container,stats;

	var camera, scene;
	var renderer;

	var mesh, mesh2, helper;

	var mixer, mouthClip, eyesClip, bonesClip;

	// values for the camera for the webGL face
	var mouseX = 0, mouseY = 0;

	// get the value of the half of the window for the x and y values
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var clock = new THREE.Clock();

	// an init funciton, called in the beginning to initialize the face
	var init =function() {
		container = document.getElementById( 'container-face' );

		camera = new THREE.PerspectiveCamera( 10, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 9000 );
		camera.position.z = 3500;

		scene = new THREE.Scene();

		scene.fog = new THREE.Fog( 0x3f3f3f, 2000, 10000 );

		scene.add( camera );

		// LIGHTS
		scene.add( new THREE.HemisphereLight( 0x111111, 0x444444 ) );

		var light = new THREE.DirectionalLight( 0xebf0cc, 1 );
		light.position.set( 0, 140, 500 ).multiplyScalar( 1.1 );
		scene.add( light );


		// RENDERER
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setClearColor( scene.fog.color );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.5);
		renderer.domElement.style.position = "relative";

		container.appendChild( renderer.domElement );

		renderer.gammaInput = true;
		renderer.gammaOutput = true;


		var loader = new THREE.JSONLoader();
		loader.load( "/static/models/knight.js", function ( geometry, materials ) {

			var y = -1500;

			// start creating the scene based on the y value
			createScene( geometry, materials, 0, y, 100, 145 );

			// GUI
			initGUI();  // init the GUI values (create the face...etc)

		} );

	
		reco.connectToPeer();  //call connect to Peer (which will either connect if i am the joiner or do nothing if i am the creator)
		window.addEventListener( 'resize', onWindowResize, true );

	};

	// if the window has been resized update the size of the model 
	var onWindowResize = function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( 0.5 * window.innerWidth, 0.5 * window.innerHeight );
	};

	// creating the scene
	var createScene = function ( geometry, materials, x, y, z, s ) {
		geometry.computeBoundingBox();
		var bb = geometry.boundingBox;

		var path = "textures/Park2/";
		var format = '.jpg';
		var urls = [
				path + 'posx' + format, path + 'negx' + format,
				path + 'posy' + format, path + 'negy' + format,
				path + 'posz' + format, path + 'negz' + format
			];

		for ( var i = 0; i < materials.length; i ++ ) {

			var m = materials[ i ];
			m.skinning = true;
			m.morphTargets = true;

			var r = 255;
			var g = 224;
			var b = 189;
			m.color.setRGB(r/255, g/255, b/255);  // setting the color of the 3D model

		}

		mesh = new THREE.SkinnedMesh( geometry, new THREE.MultiMaterial( materials ) );
		mesh.name = "Knight Mesh";
		mesh.position.set( x, y - bb.min.y * s, z );
		mesh.scale.set( s,  s, 2.5 * s );  // setting the scales for the model (values to be * by the values for the model)
		scene.add( mesh );

		mesh.castShadow = false;
		mesh.receiveShadow = false;

		mixer = new THREE.AnimationMixer( mesh );

		// build a list of the animations 
		var morph1 = [mesh.geometry.morphTargets[0], mesh.geometry.morphTargets[1], mesh.geometry.morphTargets[0],  mesh.geometry.morphTargets[1]];
		var morph2 = [mesh.geometry.morphTargets[2], mesh.geometry.morphTargets[3], mesh.geometry.morphTargets[2], mesh.geometry.morphTargets[2]];

		// setting the animation for the mouth animation (the movement of the mouth)
		mouthClip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'mouthClip', morph1, 3 );

		// setting the animation for the eye animation (the movement of the eyes (blinking))
		eyesClip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'eyesClip', morph2, 2 );

	};

	// creates gui folder with tests / examples for the action API
	var clipControl = function ( mixer, clip, rootObjects, shouldPlay ) {
		var	root = rootObjects[ 0 ],

			action = null,

			API = {

				'play()': function play() {

					action = mixer.clipAction( clip, root );
					action.play();

				},

				'stop()': function() {

					action = mixer.clipAction( clip, root );
					action.stop();

				},

				'reset()': function() {

					action = mixer.clipAction( clip, root );
					action.reset();

				},

				'play delayed': function() {

					action = mixer.clipAction( clip, root );
					action.startAt( mixer.time + 0.5 ).play();

				},

				'fade in': function() {

					action = mixer.clipAction( clip, root );
					action.reset().fadeIn( 0.25 ).play();

				},

				'fade out': function() {

					action = mixer.clipAction( clip, root );
					action.fadeOut( 0.25 ).play();

				},


				'time warp': function() {

					action = mixer.clipAction( clip, root );
					var timeScaleNow = action.getEffectiveTimeScale();
					var destTimeScale = timeScaleNow > 0 ? -1 : 1;
					action.warp( timeScaleNow, destTimeScale, 4 ).play();

				},

			};


		if (shouldPlay == 1)
			API[ 'play()' ](); // call the play function (to start running the animation)
		else{
			API[ 'stop()' ](); // call the stop funciton to stop the animation
		}

	}; // function clipControl


	// function to init the GUI and animate
	var initGUI = function() {

		var API = {
			'show model'    	: true,
			'show skeleton'		: false,
			'show mem. info'	: false
		};
		animate();

		clipControl( mixer, eyesClip, [ null, mesh ], 1 );

		clipControl( mixer, mouthClip, [ null, mesh ], 0);

	};

	var animate = function() {

		requestAnimationFrame( animate );
		render();
	};

	var render = function() {

		var delta =	 clock.getDelta();

		camera.position.x += ( mouseX - camera.position.x ) * 0.25;
		// camera.position.y = THREE.Math.clamp( camera.position.y + ( - mouseY - camera.position.y ) * .05, 0, 1000 );
		camera.position.y =  camera.position.y + ( - mouseY - camera.position.y ) * 0.25;

		camera.lookAt( scene.position );

		if( mixer ) {
			mixer.update( delta );
		}

		renderer.render( scene, camera );

	};

	// this function start the mouth movement when it is called
	var startSpeaking = function(){
		clipControl( mixer, mouthClip, [ null, mesh ], 1);
	};

	// it stops the mouth movement when it is called 
	var stopSpeaking = function(){
		clipControl( mixer, mouthClip, [ null, mesh ], 0);
	};
	// both of function depend on the last value that is being passed to the funciton (1 should play and 0 will stop it)


	// TRACKING ////
	// this portion of the code is responsible for the tracking of the face and make the face rotates to look at the user's face

	// video stuff
	window.onload = function() {
		var video = document.getElementById('video');

		// setting values for the tracking.js api
		var tracker = new tracking.ObjectTracker('face');
		tracker.setInitialScale(1);
		tracker.setStepSize(1);
		tracker.setEdgesDensity(0.1);

		// get the mid line for the x and y axis
		var videoHalfX = video.width / 2;
		var videoHalfY = video.height / 2;

		// start the tracking 
		tracking.track('#video', tracker, { camera: true });

		// on the tracking
		tracker.on('track', function(event) {
			event.data.forEach(function(rect) { // for the face
 			  var x = rect.x + rect.width / 2;  // get the middle point of the rect (x-axis)
			  var y = rect.y + rect.height / 2; // get the middle point of the rect( y-axis)
			  mouseX =  ( x - videoHalfX ) * (video.width / rect.width); // update the face model X
			  mouseY =  ( y - videoHalfY ) * -1 * (video.height / rect.height); // update the face model Y

			});
		});

	};

	return {init: init, startSpeaking: startSpeaking, stopSpeaking: stopSpeaking };
})();
