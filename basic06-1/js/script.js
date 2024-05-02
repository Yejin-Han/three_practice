import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.0/three.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';

const scene = new THREE.Scene();

const fov = 45;
const nearPlane = 1;
const farPlane = 1000;

const camera = new THREE.PerspectiveCamera(
  fov, window.innerWidth / window.innerHeight, nearPlane, farPlane
);
camera.position.z = 4;

const canvas = document.getElementById('myCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();
const controls = new OrbitControls(camera, renderer.domElement);
const stats = new Stats();
document.body.appendChild(stats.dom);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.castShadow = true;
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.castShadow = true;
spotLight.position.set(0, 64, 32);
scene.add(spotLight);

window.addEventListener('resize', () => onResize(), false);

const uniforms = {
  u_time: { type: 'f', value: 1.0 },
  colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
  colorA: { type: 'vec3', value: new THREE.Color(0xffffff) },
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
  stats.update();
  controls.update();
}
animate();

function render() {
  uniforms.u_time.value += clock.getDelta();
  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


// PART 1
// Adding geometries to a Three.js scene
const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 16);
const boxMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.x = -1;
scene.add(boxMesh);

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 16);
const cylinderMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.position.x = 1;
scene.add(cylinderMesh);

const torusGeometry = new THREE.TorusGeometry(0.5, 0.25, 20, 20);
const torusMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torusMesh);