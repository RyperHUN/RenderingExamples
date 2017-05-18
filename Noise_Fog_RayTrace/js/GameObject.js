var GameObject = function(mesh) {
  this.mesh = mesh;
  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(1, 1, 1);

  this.parent = undefined;
};

GameObject.prototype.applyModelTransformation = function(m){
  m.scale(this.scale);  
  m.rotate(this.orientation);  
  m.translate(this.position);
};

GameObject.prototype.draw = function(camera){
  var mvp = Material.shared.modelViewProjMatrix;
  mvp.set();
  camera.apply(mvp);
  if(this.parent !== undefined) {
    this.parent.applyModelTransformation(mvp);  
  }
  this.applyModelTransformation(mvp);
  Material.shared.rayDirMatrix = camera.rayDirMatrix;

  this.mesh.draw();
};

