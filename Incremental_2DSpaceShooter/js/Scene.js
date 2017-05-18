function createBox (gameObj) {
	var pos = gameObj.position;
	var scale = gameObj.scale;
	var Box = {};
	Box.x = pos.x - 1*scale.x;
	Box.y = pos.y + 1*scale.y;
	Box.w = 2 * scale.x;
	Box.h = 2 * scale.y;
	return Box;
}

function isColliding (lhsBox, rhsBox) {
	if (lhsBox.x < rhsBox.x + rhsBox.w &&
		lhsBox.x + lhsBox.w > rhsBox.x &&
		lhsBox.y < rhsBox.y + rhsBox.h &&
		lhsBox.h + lhsBox.y > rhsBox.y) {
		return true;
	}
	return false;
}

/*
bool BoxCollision(Box lhs, Box rhs)
{
	if (lhs.pos.x < rhs.pos.x + rhs.size.x &&
		lhs.pos.x + lhs.size.x > rhs.pos.x &&
		lhs.pos.y < rhs.pos.y + rhs.size.y &&
		lhs.size.y + lhs.pos.y > rhs.pos.y) {
		return true;
	}
	return false;
}
*/

function projectileCreator (mesh, parentObj) {
	var gameObj = new GameObject2D(mesh);
	gameObj.moveSpeed = 1.0;
	var yScale = 0.05;
	gameObj.position.set(parentObj.position);
	gameObj.scale.set(yScale/4.0,yScale,yScale);
	gameObj.move = function (dt, elapsedTime, keysPressed, otherObjects) {
		this.position.add (0, this.moveSpeed * dt, 0);
		if (this.position.y > 1.5) {//Out of picture
			return false;
		}
		this.returnValue = true;
		otherObjects.forEach (function (otherGameObj)
		  {
			  var isHit = isColliding(createBox(this),createBox(otherGameObj));
				if (isHit)
				{
					if(otherGameObj.hitByProjectile ()) {
						this.returnValue = false;
					}
				}
		  },this);
		
		return this.returnValue;
	}
	return gameObj;
}


function enemyCreator (mesh) {
	var gameObj = new GameObject2D(mesh);
	gameObj.hit = false;
	gameObj.position = new Vec3(1.0, 0.8, 0); 
    gameObj.scale = new Vec3(0.1, 0.1, 0.1); 
    gameObj.move = function (dt, elapsedTime) {
	  this.position.add (Math.sin(elapsedTime)*dt*0.4,-0.05*dt,0);
	  return this.alive;
   }
   gameObj.hitByProjectile = function () {
	   if (!this.hit) {
		   this.position.add(0,0.3, 0);
		   this.hit = true;
	   }
	   else
	   {
		   this.alive = false;
	   }
	   return true;
   }
   
   return gameObj;
}

var Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.quadGeometry = new QuadGeometry(gl);
  this.camera = new OrthoCamera();
  
  this.quadGeometry2 = new QuadGeometry(gl);
  
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  this.timeAtLastFrame = new Date().getTime();

  this.material = new Material(gl, this.solidProgram);
  var spaceShipMaterial = new Material(gl, this.solidProgram);
  spaceShipMaterial.colorTexture.set(
  new Texture2D(gl, 'media/spaceshipTransparentScaled.png'));
  
  var projectileMaterial = new Material(gl, this.solidProgram);
  projectileMaterial.colorTexture.set(new Texture2D(gl, 'media/bullet2.png'));
  
  
  var gameObj2 = new GameObject2D(new Mesh(this.quadGeometry, spaceShipMaterial));
  gameObj2.projectileMesh = new Mesh(this.quadGeometry, projectileMaterial);
  gameObj2.scale.set(0.15,0.15,0.15);
  gameObj2.moveSpeed = 0.4;
  gameObj2.position.set(0.5,-0.7,0);
  gameObj2.move = function (dt, elapsedTime, keysPressed) {
	  if (keysPressed["W"]) {
		this.position.add (0, this.moveSpeed * dt, 0);
	  }
	  if (keysPressed["S"]) {
		this.position.add (0, this.moveSpeed * dt * -1, 0);
	  }
	  if (keysPressed["A"]) {
		this.position.add (this.moveSpeed * dt * -1, 0, 0);
	  }
	  if (keysPressed["D"]) {
		this.position.add (this.moveSpeed * dt, 0, 0);
	  }
	  return true;
  }
  var enemyMesh = new Mesh(this.quadGeometry, this.material);
  this.gameObj = new GameObject2D(enemyMesh);
  this.gameObj.position = new Vec3(1.5, 0, 0); 
  this.gameObj.scale = new Vec3(0.2, 0.2, 0.2); 
  this.gameObj.originalPos = this.gameObj.position;
  this.gameObj.parentObj = gameObj2;
  this.gameObj.move = function (dt) {
	  this.orientation += this.speedCircular*dt;
	  this.updateModelTransformation = function(){
			  this.modelMatrix.set(). 
				scale(this.scale).
				//scale(this.parentObj.scale).
				translate(this.position).
				rotate(this.orientation);
			  this.parentObj.updateModelTransformation ();
			  this.modelMatrix.mul(this.parentObj.modelMatrix);
			  //var matrix = new Mat4(this.parentObj.modelMatrix);
			  //matrix.mul (this.modelMatrix);
			  //this.modelMatrix.set(matrix);
			};
	   return true;
  }
  var gameObjProjectile = projectileCreator (gameObj2.projectileMesh, gameObj2);
  var enemy = enemyCreator (enemyMesh);
  
  //this.gameObjects = [this.gameObj, gameObj2];
  this.gameObjects = [this.gameObj];
  this.gameObjects.push(gameObj2);
  this.gameObjects.push(enemy);
  
  //THIS WAY YOU CAN REMOVE ELEMENT FROM ARRAY
  //this.gameObjects.splice(this.gameObjects.indexOf(enemy),1);
  
  //this.gameObjects.push(gameObjProjectile);
  //this.gameObjects.push (gameObjProjectile);
  this.spaceShip = gameObj2;
  
  this.material.colorTexture.set(
  new Texture2D(gl, 'media/asteroid.png'));
  //this.material.texOffset.set(0.1, 0.4);
  this.elapsedTime = 0;
  this.shootTimer = 0.2;
};

Scene.prototype.update = function(gl, keysPressed) {
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.elapsedTime += dt;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var modelMatrix = new Mat4();
  
  
  this.solidProgram.commit();
  //this.gameObjects[0].updateModelTransformation();
  //this.gameObjects[0].draw(this.camera)
  this.shootTimer += dt;
  	  if (keysPressed["SPACE"]) {
		  if (this.shootTimer > 0.4) {
			var newProjectile = projectileCreator (this.spaceShip.projectileMesh, this.spaceShip);//Create cuccli
			this.gameObjects.push (newProjectile);
			this.shootTimer = 0.0;
		  }
		  
	  }
  this.gameObjects.forEach (function (gameObj,index, gameObjArray)
  {
	    var isValid = gameObj.move(dt, this.elapsedTime, keysPressed, gameObjArray);
		if (isValid) {
			gameObj.updateModelTransformation();
			gameObj.draw(this.camera);
		} else {
			gameObjArray.splice(index,1);
		}
  },this);
};


Scene.prototype.resize = function(canvas) {
	this.camera.setAspectRatio (canvas.width / canvas.height);
}