var pendingResources = {};

// App constructor
var App = function(canvas, overlay) {

	// set a pointer to our canvas
	this.canvas = canvas;
	this.overlay = overlay;

	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl == null) {
		console.log( ">>> Browser does not support WebGL <<<" );
		return;
	}
	
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

	// create a simple scene
	this.scene = new Scene(this.gl);
	this.scene.camera.setAspectRatio (canvas.width / canvas.height);
	this.keysPressed = {};
	var theApp = this;
	document.onkeydown = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = true;
	};
	document.onkeyup = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = false;
	};
	canvas.onmousedown = function(event) {
		//theApp.scene.mouseDown(event);
	};
	canvas.onmousemove = function(event) {
		event.stopPropagation();
		//theApp.scene.mouseMove(event);
	};
	canvas.onmouseout = function(event) {
		//theApp.scene.mouseUp(event);
	};
	canvas.onmouseup = function(event) {
		//theApp.scene.mouseUp(event);
	};

	window.addEventListener('resize', function() {
		theApp.scene.resize(theApp.canvas);
	});

	window.requestAnimationFrame(function() {
		theApp.update();
	});	
};

// animation frame update
App.prototype.update = function() {

	var pendingResourceNames = Object.keys(pendingResources);
	if(pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl, this.keysPressed);
		overlay.innerHTML = "Ready.";
	} else {
		overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	var theApp = this;
	window.requestAnimationFrame(function() {
		theApp.update();
	});	
};

// entry point from HTML
window.addEventListener('load', function() {

	var canvas = document.getElementById("canvas");
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;

	new App(canvas, overlay);

});