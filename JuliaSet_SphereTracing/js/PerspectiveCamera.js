//Xndc * (P-1) * (U-1) - EyePos

// (U * P)-1 = P-1 * U-1

//Osszessegebe 1 szorzas : (EVP)-1 == RayDir Matrix
//Ahol E az eyePos al valo eltolas
var PerspectiveCamera = function()
{
  this.position = new Vec3(0.0, 0.0, 3.0);
  this.ahead = new Vec3(0.0, 0.0, -1.0); // Elore vec Z (Felem nem kepernyo
  this.right = new Vec3(1.0, 0.0, 0.0);  // Jobbra vecX
  this.up = new Vec3(0.0, 1.0, 0.0);     // Felfele Y
  
  this.yaw = 0.0;   // Balra jobbra 
  this.pitch = 0.0; //Fel le!
  this.fov = 1.0;
  this.aspect = 1.0;
  this.nearPlane = 0.1;
  this.farPlane = 1000.0;

  this.speed = 1.0;

  this.isDragging = false;
  this.mouseDelta = new Vec2(0.0, 0.0);

  this.viewMatrix = new Mat4();
  this.updateViewMatrix();
  this.projMatrix = new Mat4();
  this.updateProjMatrix();
  this.rayDirMatrix = new Mat4();
  this.updateRayDirMatrix();
};

PerspectiveCamera.prototype.resize = function(width, height) {
	this.aspect = width / height;
	this.updateProjMatrix();
	this.updateRayDirMatrix ();
}

PerspectiveCamera.prototype.updateViewMatrix = function(){
  this.viewMatrix.set(
    this.right.x          ,  this.right.y      ,  this.right.z       , 0,
    this.up.x             ,  this.up.y         ,  this.up.z          , 0,
   -this.ahead.x          , -this.ahead.y      ,  -this.ahead.z      , 0,
    0  , 0  , 0   , 1).translate(this.position).invert();
};

//PerspectiveCamera.prototype.updateProjMatrix = function(){
//	var sy = 1 / Math.tan(this.fov / 2 * 3.14 / 180);
//	var alfa = -(this.nearPlane + this.farPlane) / (this.farPlane - this.nearPlane);
//	var beta = -2 * this.nearPlane*this.farPlane / (this.farPlane - this.nearPlane);
//	
// this.projMatrix.set(
 //   sy / this.asp, 0, 0, 0,
//	0, sy, 0, 0,
//	0, 0, alfa, -1,
//	0, 0, beta, 0).invert();
//};

PerspectiveCamera.prototype.updateProjMatrix = function()
{
  var yScale = 1.0 / Math.tan(this.fov * 0.5);
  var xScale = yScale / this.aspect;
  var f = this.farPlane;
  var n = this.nearPlane;
  this.projMatrix.set(
      xScale ,    0    ,      0       ,   0,
        0    ,  yScale ,      0       ,   0,
        0    ,    0    ,  (n+f)/(n-f) ,    -1,
        0    ,    0    ,2*n*f/(n-f),   0);
};




PerspectiveCamera.prototype.updateRayDirMatrix = function(){
	var EyeMatrix = new Mat4();
	EyeMatrix.translate(this.position);
	EyeMatrix.mul(this.viewMatrix).mul(this.projMatrix).invert();
	this.rayDirMatrix = EyeMatrix;
};

PerspectiveCamera.worldUp = new Vec3(0, 1, 0);

PerspectiveCamera.prototype.move = function(dt, keysPressed) {
  if(this.isDragging){
    this.yaw += this.mouseDelta.x * 0.002;
    this.pitch += this.mouseDelta.y * 0.002;
    if(this.pitch > 3.14/2.0) {
      this.pitch = 3.14/2.0;
    }
    if(this.pitch < -3.14/2.0) {
      this.pitch = -3.14/2.0;
    }

    this.mouseDelta = new Vec2(0.0, 0.0);

	this.ahead = new Vec3(Math.sin(this.yaw)*Math.cos(this.pitch), -Math.sin(this.pitch), 
          -Math.cos(this.yaw)*Math.cos(this.pitch) );
    this.right.setVectorProduct( this.ahead, PerspectiveCamera.worldUp );
    this.right.normalize();
    this.up.setVectorProduct(this.right, this.ahead);
  }
   if(keysPressed.W) {
    this.position.addScaled(this.speed * dt, this.ahead);
  }
  if(keysPressed.S) {
    this.position.addScaled(-this.speed * dt, this.ahead);
  }
  if(keysPressed.D) {
    this.position.addScaled(this.speed * dt, this.right);
  }
  if(keysPressed.A) {
    this.position.addScaled(-this.speed * dt, this.right);
  }
  if(keysPressed.E) {
    this.position.addScaled(this.speed * dt, PerspectiveCamera.worldUp);
  }
  if(keysPressed.Q) {
    this.position.addScaled(-this.speed * dt, PerspectiveCamera.worldUp);
  }
  
  this.updateViewMatrix();
  this.updateRayDirMatrix();
};

PerspectiveCamera.prototype.mouseDown = function() {
  this.isDragging = true;
  this.mouseDelta.set();
};

PerspectiveCamera.prototype.mouseMove = function(event) {
  this.mouseDelta.x += event.movementX;
  this.mouseDelta.y += event.movementY;
  event.preventDefault();  
};

PerspectiveCamera.prototype.mouseUp = function() {
  this.isDragging = false;
};

PerspectiveCamera.prototype.setAspectRatio = function(ar)
{
  this.aspect = ar;
  this.updateProjMatrix();
};



