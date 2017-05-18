var quadricMatrix = function (M, Q)
{
  var Minv = new Mat4();
  Minv.set(M.invert());
  Minv.mul(Q);
  M.transpose();
  Minv.mul(M);
  return Minv;
}

var Scene = function(gl) {
	this.frameBuffers = [gl.createFramebuffer(), gl.createFramebuffer()];
	this.rtts = [gl.createTexture(), gl.createTexture()];
	for(var i=0; i<2; i++) {
	  gl.bindTexture(gl.TEXTURE_2D, this.rtts[i]);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, canvas.width,
					canvas.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);

	  gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[i]);
	  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
							  this.rtts[i], 0);

	  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	
  this.randomTexture = new Texture2D (gl, "media/RandomTexture.png");
	
  this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
  this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace_fs.essl");
  this.program = new Program(gl, this.vsQuad, this.fsTrace);
  this.vsTexture = new Shader(gl, gl.VERTEX_SHADER, "texture_vs.essl");
  this.fsTexture = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");
  this.textureProg = new Program(gl, this.vsTexture, this.fsTexture);
  this.quadGeometry = new QuadGeometry(gl);
  
  this.camera =  new PerspectiveCamera ();
  
  // Scene constructor
  this.program.randomTex.set(this.randomTexture);
  this.timeAtLastFrame = new Date().getTime();
  
  var SphereMatrix = new Mat4;
  SphereMatrix.set(1, 0, 0, 0,
					  0, 1, 0, 0,
					  0, 0, 1, 0,
					  0, 0, 0, -1);
   var emptyClipper = new Mat4;
   emptyClipper.set(0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0);
								  					  
  var SphereTranslated = quadricMatrix (new Mat4().translate(-1.1,1.0,0.0).scale(0.7,0.7,0.7), SphereMatrix);
  var SphereTranslated2 = quadricMatrix (new Mat4().translate(1.1,1.0,0.0).scale(0.7,0.7,0.7), SphereMatrix);
  
  var colorConst = 0.3;
  var whiteConst = 0.3;
  
  this.program.quadrics[0].set(SphereTranslated);
 this.program.quadrics[1].set(emptyClipper);
	this.program.materials[0].set(whiteConst, whiteConst, whiteConst, 0.0);
  this.program.quadrics[8].set(SphereTranslated2);
  this.program.quadrics[9].set(emptyClipper);
  this.program.materials[4].set(colorConst,0.0,0.0,0.0);
  
this.program.quadrics[2].set(
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -10); //sqrt(10) ben levo sik
this.program.quadrics[3].set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -10); //sqrt(10) ben levo sik
this.program.materials[1].set(colorConst, colorConst, 0.0, 0.0);

this.program.quadrics[4].set(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -10); //sqrt(10) ben levo sik
this.program.quadrics[5].set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -10); //sqrt(10) ben levo sik
this.program.materials[2].set(0.0, colorConst, colorConst, 0.0);
this.program.quadrics[6].set(
    0, 0, 0, 0,
    0, 1, 0, 0.5,
    0, 0, 0, 0,
    0, 0.5, 0, 0); //sqrt(10) ben levo sik
this.program.quadrics[7].set(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -10); //sqrt(10) ben levo sik
this.program.materials[3].set(colorConst, colorConst, colorConst, 0.0);
	
this.background = new TextureCube(gl, [
    "media/posx.jpg",
    "media/negx.jpg",
    "media/posy.jpg",
    "media/negy.jpg",
    "media/posz.jpg",
    "media/negz.jpg",]);
	this.program.background.set(this.background);
	//this.program.commit();
	this.frameCount = 0;
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

  if (this.camera.move(dt, keysPressed))
	  this.frameCount = 0;
  
  this.frameCount += 1;
  this.frameContrib = 1.0 / this.frameCount;
  //this.program.contribTex.set(this.frameContrib);
  this.program.frameCount.set(this.frameCount);
  
  this.program.background.set(this.background);
  this.program.rayDirMatrix.set(this.camera.rayDirMatrix);
  this.program.cameraPos.set(this.camera.position);

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[0]);
  this.program.prevImage.set(this.rtts[1]);
  this.program.commit();
  
  this.quadGeometry.draw();

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  this.textureProg.showTexture.set(this.rtts[0]);
  this.textureProg.commit();
  this.quadGeometry.draw(); 

  this.rtts.reverse();
  this.frameBuffers.reverse();

};

Scene.prototype.resize = function(canvas) {
	this.camera.resize(canvas.width, canvas.height);
}

Scene.prototype.mouseMove = function(event) {
	if (this.camera.isDragging)
		this.frameCount = 0;
	this.camera.mouseMove(event);
}

Scene.prototype.mouseDown = function(event) {
	this.camera.mouseDown();
}
Scene.prototype.mouseUp = function(event) {
	this.camera.mouseUp();
}