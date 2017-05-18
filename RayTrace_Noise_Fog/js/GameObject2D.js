var GameObject2D = function(mesh) {
  this.mesh = mesh;
  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(1, 1, 1);
  this.modelMatrix = new Mat4();
  this.updateModelTransformation();

  this.parent = undefined;
};

GameObject2D.prototype.move = function () {
	
}

GameObject2D.prototype.updateModelTransformation = function(){
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation).
    translate(this.position);
  if(this.parent !== undefined) {
    this.parent.updateModelTransformation();
    this.modelMatrix.mul(this.parent.modelMatrix);
  }
};

GameObject2D.prototype.draw = function(camera){
  Material.shared.modelMatrix = this.modelMatrix;
  var transposedModel = new Mat4(this.modelMatrix);
  Material.shared.modelMatrixInverseTranspose = transposedModel.invert ().transpose ();
  Material.shared.rayDirMatrix = camera.rayDirMatrix;
  Material.shared.modelViewProjMatrix.set().
    mul(this.modelMatrix).
    mul(camera.viewProjMatrix);
  this.mesh.draw();
};

