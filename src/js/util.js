import {TrackballControls} from "../../libs/three/three.js-master/examples/jsm/controls/TrackballControls.js";

/**
 * Initialize trackball controls to control the scene
 *
 * @param {THREE.Camera} camera
 * @param {THREE.Renderer} renderer
 */
export function initTrackballControls(camera, renderer) {
    var trackballControls = new TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.2;
    trackballControls.panSpeed = 0.8;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    trackballControls.keys = [65, 83, 68];

    return trackballControls;
}