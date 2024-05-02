import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import Stats from 'Stats';

const scene = new THREE.Scene();

const fov = 45;
const nearPlane = 1;
const farPlane = 1000;

const camera = new THREE.PerspectiveCamera(
  fov, window.innerWidth / window.innerHeight, nearPlane, farPlane
);
camera.position.z = 4;

const canvas = document.getElementById('myCanvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
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


// load 3D model (gltf)
let loadedModel;

const gltfLoader = new GLTFLoader();
gltfLoader.load('./assets/scene.gltf', (gltfscene) => {
  loadedModel = gltfscene;

  gltfscene.scene.rotation.y = Math.PI / 8;
  // gltfscene.scene.position.y = 3;
  // gltfscene.scene.scale.set(10, 10, 10);
  scene.add(gltfscene.scene);
});

const animate2 = () => {
  if(loadedModel) {
    loadedModel.scene.rotation.x += 0.01;
    loadedModel.scene.rotation.y += 0.01;
    loadedModel.scene.rotation.z += 0.01;
  }

  requestAnimationFrame(animate2);
}
animate2();