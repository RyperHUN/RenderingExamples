var Scene = function(gl) {
	this.noiseTexture = new Texture2D(gl, "media/lab4_noise.png");
	this.skyCubeTexture = new
	  TextureCube(gl, [
		"media/posx.jpg",
		"media/negx.jpg",
		"media/posy.jpg",
		"media/negy.jpg",
		"media/posz.jpg",
		"media/negz.jpg",]
		);
    this.timeAtLastFrame = new Date().getTime();
	
  this.vsEnvirCube = new Shader(gl, gl.VERTEX_SHADER, "cube_vs.essl");
  this.fsEnvirCube = new Shader(gl, gl.FRAGMENT_SHADER, "cube_fs.essl");
  this.vsNoiseShader = new Shader(gl, gl.VERTEX_SHADER, "vsNoiseShader.essl");
  this.fsNoiseShader = new Shader(gl, gl.FRAGMENT_SHADER, "fsNoiseShader.essl");
  

  this.cubeEnvirProgram = new Program (gl, this.vsEnvirCube, this.fsEnvirCube);
  this.noiseProgram = new Program (gl, this.vsNoiseShader, this.fsNoiseShader);
  
  this.quadGeometry = new QuadGeometry(gl);

	
  this.NoiseMaterial = new Material(gl, this.noiseProgram);
  this.NoiseMaterial.background.set (this.skyCubeTexture);
  this.NoiseMaterial.noiseTexture.set (this.noiseTexture);
  this.NoiseMesh = new Mesh (this.quadGeometry, this.NoiseMaterial);	
  this.NoiseObj = new GameObject2D(this.NoiseMesh);
  
  this.cubeMaterial = new Material(gl, this.cubeEnvirProgram);
  this.cubeMaterial. envMapTexture.set ( 
						this.skyCubeTexture);	
  this.envirMesh = new Mesh (this.quadGeometry, this.cubeMaterial);
  this.environment = new GameObject2D (this.envirMesh);

  this.gameObjects = [this.NoiseObj /*, this.environment*/];
  
  this.camera = new PerspectiveCamera();
  
  var circleCenter1 = new Vec3 (0.0,3.0, -23.0);
  var radius1 = 3.0;
  var circleCenter2 = new Vec3 (10.5, 2.5, -22.0);
  var radius2 = 2.0;
  this.circleCenters = [circleCenter1, circleCenter2, new Vec3 (-10.0, 1.0, -24.0)];
  this.radiuses = [radius1, radius2, 1.0];

  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);
	this.elapsedTime = 0.0;
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.elapsedTime += dt;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
  for (var i = 0; i < this.circleCenters.length; i++) {
	this.NoiseMaterial.circleCenter[i].set (this.circleCenters[i]);
	this.NoiseMaterial.radiuses[i].set (this.radiuses[i]);
  }
  
  this.circleCenters[1].add(Math.sin(this.elapsedTime)*dt * 5.0); 
  this.circleCenters[2].add(0, Math.cos(this.elapsedTime)*dt/2 * 5.0, 0); 
  
  
  this.camera.move(dt, keysPressed);
  for(var i=0; i<this.gameObjects.length; i++) {
	this.gameObjects[i].move (dt);
	this.gameObjects[i].updateModelTransformation ();
    this.gameObjects[i].draw(this.camera);
  }
	
};


Scene.prototype.mouseMove = function(event) {
	this.camera.mouseMove(event);
}

Scene.prototype.mouseDown = function(event) {
	this.camera.mouseDown(event);
}

Scene.prototype.mouseUp = function(event) {
	this.camera.mouseUp(event);
}