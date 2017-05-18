var Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.vsCube = new Shader(gl, gl.VERTEX_SHADER, "cube_vs.essl");
  this.fsCube = new Shader(gl, gl.FRAGMENT_SHADER, "cube_fs.essl");
  this.vsCircle = new Shader(gl, gl.VERTEX_SHADER, "circle_vs.essl");
  this.fsCircle = new Shader(gl, gl.FRAGMENT_SHADER, "circle_fs.essl");
  this.cubeProgram = new Program (gl, this.vsCube, this.fsCube);
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.circleProgram = new Program(gl, this.vsCircle, this.fsCircle);
  this.quadGeometry = new QuadGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();

  this.asteroidMaterial = new Material(gl, this.circleProgram);
  this.asteroidMaterial.colorTexture.set(
    new Texture2D(gl, 'media/asteroid.png'));

  //this.landerMaterial = new Material(gl, this.solidProgram);
  //this.landerMaterial.colorTexture.set(
   // new Texture2D(gl, 'media/lander.png')); 

  this.asteroidMesh = new Mesh(this.quadGeometry, this.asteroidMaterial);
  this.landerMesh = new Mesh(this.quadGeometry, this.landerMaterial);

  this.slowpokeMaterial = new Material(gl, this.solidProgram);
  //this.slowpokeMaterial2 = new Material(gl, this.solidProgram);
  //this.slowpokeMaterial.colorTexture.set(
  //  new Texture2D(gl, 'media/slowpoke/YadonDh.png'));
this.skyCubeTexture = new
  TextureCube(gl, [
    "media/posx.jpg",
    "media/negx.jpg",
    "media/posy.jpg",
    "media/negy.jpg",
    "media/posz.jpg",
    "media/negz.jpg",]
    );
	
this.slowpokeMaterial. envMapTexture.set ( 
  this.skyCubeTexture);	
  //this.slowpokeMaterial2.colorTexture.set(
  //  new Texture2D(gl, 'media/slowpoke/YadonEyeDh.png')); 
  var multiMeshMaterials = [this.slowpokeMaterial, this.slowpokeMaterial/*, this.slowpokeMaterial2*/];
  this.multiMesh = new MultiMesh (gl , "media/slowpoke/Slowpoke.json", multiMeshMaterials);
  this.MultiGame = new GameObject2D(this.multiMesh);
  this.MultiGame.position.set (5, -2, -5);
  //this.MultiGame.scale.set (1,1,1);
  ///TODO Not working set position
  this.cubeMaterial = new Material(gl, this.cubeProgram);
  this.cubeMaterial. envMapTexture.set ( 
  this.skyCubeTexture);	
  this.envirMesh = new Mesh (this.quadGeometry, this.cubeMaterial);
  this.environment = new GameObject2D (this.envirMesh);
  
  this.lightSource = new GameObject2D (new Mesh(this.quadGeometry, this.asteroidMaterial));
  this.lightSource.parent = this.MultiGame;
  this.lightSource.position.set (-7, -5, 0);
  this.lightSource.speedCircular = 1.0;
  this.lightSource.move = function (dt) {
	  this.orientation += this.speedCircular*dt;
	  Material.shared.wLightPos = new Vec4(this.position.x, this.position.y, this.position.z, 1);
	  Material.shared.wLightPos.mul (this.modelMatrix);
  }
  this.lightSource.updateModelTransformation = function(){
	  this.modelMatrix.set().
		scale(this.scale).
		translate(this.position).
		rotate(this.orientation);
	  if(this.parent !== undefined) {
		this.parent.updateModelTransformation();
		this.modelMatrix.mul(this.parent.modelMatrix);
	  }
	};
  
  this.gameObjects = [];
  /*
  for(var i=0; i<64; i++) {
    var asteroid = new GameObject2D(this.asteroidMesh);
    asteroid.position.setRandom({x:-30, y:-30}, {x:30, y:30});
    asteroid.updateModelTransformation();
    this.gameObjects.push(asteroid);
  }
  */
  this.gameObjects.push (this.MultiGame);
  this.gameObjects.push(this.environment);
  this.gameObjects.push(this.lightSource);

  var lander = new GameObject2D(this.landerMesh);
  lander.position.set(-1, 1);
  lander.updateModelTransformation();
  //this.gameObjects.push(lander);

  this.camera = new PerspectiveCamera();

  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

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