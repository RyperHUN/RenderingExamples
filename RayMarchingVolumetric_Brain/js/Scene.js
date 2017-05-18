var Scene = function(gl) {
	this.noiseTexture = new Texture2D(gl, "media/lab4_noise.png");
	this.brainTexture = new Texture2D(gl, "media/brain-at_1024.jpg");
	this.brainTextureHD = new Texture2D(gl, "media/brain-at_4096.jpg");
	this.matcapGreen = new Texture2D(gl, "media/Matcap/matcap4.jpg");
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

  this.brainMaterial = new Material (gl, this.noiseProgram);
  this.brainMaterial.background.set (this.skyCubeTexture);
  this.brainMaterial.noiseTexture.set (this.noiseTexture);
  this.brainMaterial.brainTex.set (this.brainTextureHD);
	//this.brainMaterial.brainTex.set (this.brainTexture);
	this.brainMaterial.matcapTex.set (this.matcapGreen);
  this.NoiseMaterial = new Material(gl, this.noiseProgram);
  this.NoiseMaterial.background.set (this.skyCubeTexture);
  this.NoiseMaterial.noiseTexture.set (this.noiseTexture);
  this.NoiseMesh = new Mesh (this.quadGeometry, this.brainMaterial);	
  this.NoiseObj = new GameObject2D(this.NoiseMesh);
  
  this.cubeMaterial = new Material(gl, this.cubeEnvirProgram);
  this.cubeMaterial. envMapTexture.set ( 
						this.skyCubeTexture);	
  this.envirMesh = new Mesh (this.quadGeometry, this.cubeMaterial);
  this.environment = new GameObject2D (this.envirMesh);
  

  this.gameObjects = [this.NoiseObj /*, this.environment*/];
  
  this.camera = new PerspectiveCamera();


  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);
	this.elapsedTime = 0.0;
	this.zSetTime = 0.0;
	this.zValue = 0;
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.elapsedTime += dt;
  this.timeAtLastFrame = timeAtThisFrame;
  this.zSetTime += dt;
  if (this.zSetTime > 0.03)
  {
	  this.zSetTime = 0.0
	  //this.brainMaterial.z.set (this.zValue);
	  this.zValue += 1;
  }
  

  // clear the screen
  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
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