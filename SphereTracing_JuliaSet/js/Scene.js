var Scene = function(gl) {
  this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
  this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace_fs.essl");
  this.program = new Program(gl, this.vsQuad, this.fsTrace);
  this.quadGeometry = new QuadGeometry(gl);
  
  this.camera =  new PerspectiveCamera ();
  
  // Scene constructor
  this.timeAtLastFrame = new Date().getTime();
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  
	// Scene update
 
  // clear the screen
  gl.clearColor(0.2, 0.0, 0.2, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.camera.move(dt, keysPressed);
  this.program.commit();
  //this.program.background.set(this.background);
  this.program.rayDirMatrix.set(this.camera.rayDirMatrix);
  this.program.cameraPos.set(this.camera.position);
  
  this.quadGeometry.draw();
};

Scene.prototype.resize = function(canvas) {
	this.camera.resize(canvas.width, canvas.height);
}

Scene.prototype.mouseMove = function(event) {
	this.camera.mouseMove(event);
}

Scene.prototype.mouseDown = function(event) {
	this.camera.mouseDown();
}
Scene.prototype.mouseUp = function(event) {
	this.camera.mouseUp();
}