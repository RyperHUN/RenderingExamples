var GameObject2D = function(mesh) {
  this.alive = true;
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0;
  this.speedCircular = 0.5;
  this.scale = new Vec3(1, 1, 1); 

  this.modelMatrix = new Mat4(); 
  this.updateModelTransformation(); 
  
  this.move = function (dt) {
	  
  }
};

GameObject2D.prototype.updateModelTransformation =
                              function(){ 
  this.modelMatrix.set(). 
    scale(this.scale). 
    rotate(this.orientation). 
    translate(this.position);

};

GameObject2D.prototype.hitByProjectile = function () {
	
}

GameObject2D.prototype.draw = function(camera){ 

  Material.shared.modelViewProjMatrix.set(). 
    mul(this.modelMatrix).
    mul(camera.viewProjMatrix);

  this.mesh.draw(); 
};
