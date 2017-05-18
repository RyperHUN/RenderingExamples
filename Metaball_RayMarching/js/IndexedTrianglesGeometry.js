var IndexedTrianglesGeometry = function(gl, jsonObject){
  this.gl = gl;
  // vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(jsonObject.vertices),
    gl.STATIC_DRAW);

  this.vertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(jsonObject.normals),
    gl.STATIC_DRAW);

  this.vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(jsonObject.texturecoords[0]),
    gl.STATIC_DRAW);  

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  //var t = new Uint16Array([].concat.apply([], jsonObject.faces));
  var indexArray = new Uint16Array(jsonObject.faces.length*3);
  for(var iFace=0; iFace<jsonObject.faces.length; iFace++){
    indexArray[iFace*3] = jsonObject.faces[iFace][0];
    indexArray[iFace*3+1] = jsonObject.faces[iFace][1];
    indexArray[iFace*3+2] = jsonObject.faces[iFace][2];
  }

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    indexArray,
    gl.STATIC_DRAW);

  this.nIndices = indexArray.length;
};

IndexedTrianglesGeometry.prototype.draw = function() {
  if(this.nIndices === 0) {
    return;
  }
  var gl = this.gl;
  // set vertex buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2,
    2, gl.FLOAT, //< two pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );  

  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.drawElements(gl.TRIANGLES, this.nIndices, gl.UNSIGNED_SHORT, 0);
	
};
