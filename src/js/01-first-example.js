import * as THREE from "../../libs/three/three.js-master/build/three.module.js"
import Stats from "../../libs/three/three.js-master/examples/jsm/libs/stats.module.js"
import {GUI} from "../../libs/three/three.js-master/examples/jsm/libs/dat.gui.module.js";
import * as UTIL from "./util.js"

function init() {
    console.log("Using Three.js version: " + THREE.REVISION);

    // Listen to the resize events
    window.addEventListener("resize", onResize, false);


    var camera;
    var scene;
    var renderer;

    // Initialize  stats
    var stats = Stats();
    document.body.appendChild(stats.dom)

    // Create a scene, that will hold all our elements such as objects, cameras, and lights.
    scene = new THREE.Scene();

    // Create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000)); // black
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // show axes in the screen
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    /*var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xAAAAAA
    });*/
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xAAAAAA
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;

    // add the plane to the scene
    scene.add(plane);

    // Create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    /*var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: true
    });*/
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xFF0000,
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.set(-4, 3, 0);

    // add the cube to the scene
    scene.add(cube);

    // Create a sphere
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    /*var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777FF,
        wireframe: true
    });*/
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff,
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;

    // position the sphere
    sphere.position.set(20, 4, 2);

    // add the sphere to the scene
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // Add a spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;

    // If you want a more detailed shadow you can increase the
    // mapSize used to draw the shadows.
    // spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    scene.add(spotLight);

    // add ambient light
    var ambientLight = new THREE.AmbientLight(0x353535);
    scene.add(ambientLight);

    // add the output of the renderer to the html element
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // render the scene
    var step = 0;

    // Simple GUI controls
    var controls = new function(){
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    };

    // Create the vui
    var gui = new GUI();
    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "bouncingSpeed", 0, 0.5);

    // Create a trackball control
    var trackballControls = UTIL.initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    renderScene();

    function renderScene() {
        // Update the stats and the controls
        trackballControls.update(clock.getDelta());
        stats.update();

        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        // render using requestAnimationFrame
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    function onResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export {init,};