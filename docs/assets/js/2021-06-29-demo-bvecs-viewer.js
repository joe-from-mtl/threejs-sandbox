import * as THREE from 'https://cdn.skypack.dev/three@0.129.0'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth/canvas.clientHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

// Create an object to receive the sphere and bvecs
const construct = new THREE.Object3D()

// Add a sphere
const radius = 2;
const widthSegments = 16;
const heightSegments = 16;
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const material = new THREE.MeshStandardMaterial();
material.opacity = 0.5;
material.transparent = true;
const wireframeMaterial = new THREE.MeshStandardMaterial()
wireframeMaterial.wireframe = true;
const sphere = new THREE.Mesh( geometry, material );
const sphereWireframe = new THREE.Mesh(geometry, wireframeMaterial)
construct.add(sphere)
construct.add(sphereWireframe)
scene.add( construct );

// Add a vector
// Output of the scilpy multiple_shell function call with 1 shell, 15 directions, weight=1 and 100 iteration
const bvecs = [[ 0.51643967,  0.82634399, -0.22460116],
    [-0.62443259,  0.74878791,  0.22226248],
    [ 0.21069514, -0.68247385, -0.69988356],
    [-0.93518221,  0.31530597, -0.16129595],
    [-0.94510711, -0.31357308,  0.09189384],
    [ 0.8237379 ,  0.20051334,  0.53033034],
    [-0.22148611, -0.0012707 ,  0.9751627 ],
    [ 0.49132317, -0.76513522,  0.41613657],
    [ 0.78647326, -0.24130678, -0.56853396],
    [ 0.04398733, -0.9981485 , -0.04200828],
    [-0.07061433, -0.68903697,  0.7212778 ],
    [-0.45896158,  0.28327027, -0.84208801],
    [ 0.47566401,  0.77503602,  0.41600831],
    [-0.29896081, -0.35232859, -0.88684102],
    [ 0.64206867,  0.36869774, -0.67216799]];

// Add lines to represent each vector
const color = new THREE.Color();
color.setRGB(0.5,0.5,0.5);
const lineMaterial = new THREE.LineBasicMaterial({color: color, linewidth: 5})

const vertices = [];
for (let i = 0; i < bvecs.length; i++){
    const points = [];
    const start = new THREE.Vector3(-bvecs[i][0]*radius, -bvecs[i][1]*radius, -bvecs[i][2]*radius);
    const end = new THREE.Vector3(bvecs[i][0]*radius, bvecs[i][1]*radius, bvecs[i][2]*radius);
    points.push(start);
    points.push(end);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    construct.add(new THREE.Line(lineGeometry, lineMaterial));

    // Add points centered on the end of lines
    vertices.push(start.x, start.y, start.z);
    vertices.push(end.x, end.y, end.z);
}

// Adding red points
const pointsGeometry = new THREE.BufferGeometry();
pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const pointsMaterial = new THREE.PointsMaterial(({color: 0xFF0000, size:0.05}));
const points = new THREE.Points(pointsGeometry, pointsMaterial)
construct.add(points);

camera.position.z = 5;

// Add light sources
const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
const spotLight = new THREE.SpotLight({color: 0xf0f0f0});
spotLight.position.set(0,0,5);
spotLight.target = sphere;

scene.add(ambientLight);
camera.add(spotLight)
scene.add(camera);

// Creating the orbit control
const controls = new OrbitControls( camera, renderer.domElement );
controls.update()

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width ||canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // set render target sizes here
    }
}

const animate = function () {
    resizeCanvasToDisplaySize();

    construct.rotation.x += 0.005;
    construct.rotation.y += 0.005;

    controls.update()
    renderer.render( scene, camera );
    requestAnimationFrame( animate );

};
animate();