"use strict";

let THREECAMERA = null;

// callback: launched if a face is detected or lost
export function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK:
export function init_threeScene(spec) {
  spec.threejsCanvasId = 'threejsCanvas'; // enable 2 canvas mode
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);

   // CREATE A CUBE:
  const cubeGeometry = new THREE.BoxGeometry(1,1,1);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  threeCube.frustumCulled = false;
  threeStuffs.faceObject.add(threeCube);

  // CREATE THE CAMERA:
  THREECAMERA = JeelizThreeHelper.create_camera();
} // end init_threeScene()

// entry point:
export function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
}

export function init_faceFilter(videoSettings){
  JEEFACEFILTERAPI.init({
    antialias: false,
    canvasId: 'jeeFaceFilterCanvas',
      NNCpath: 'models/NNC4Expr0.json', // root of NNC.json file
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. ERR =', errCode);
        return;
      }

      console.log('INFO: JEEFACEFILTERAPI IS READY');
      //init_threeScene(spec);
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
        JEEFACEFILTERAPI.render_video();
        console.log(detectState.rx);
    }
  }); //end JEEFACEFILTERAPI.init call
}


// Sends image
export function SendImage() {
    var canvasElement = document.getElementById('jeeFaceFilterCanvas');
    var im = canvasElement.toDataURL();
    console.log(im);
}