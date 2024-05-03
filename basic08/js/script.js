import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.0/three.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';

const scene = new THREE.Scene();

const fov = 70;
const nearPlane = 1;
const farPlane = 1000;

const camera = new THREE.PerspectiveCamera(
  fov, window.innerWidth / window.innerHeight, nearPlane, farPlane
);
camera.position.y = 9;
camera.position.z = 36;

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

// autoRotate
controls.autoRotate = true;

// Part 0
const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
const boxMaterial = new THREE.MeshNormalMaterial(); // 면의 방향에 따라 색상을 부여하는 재질
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

const spaceTexture = new THREE.TextureLoader().load('./assets/space.jpeg');
spaceTexture.wrapS = THREE.RepeatWrapping;
spaceTexture.wrapT = THREE.RepeatWrapping;
spaceTexture.repeat.set(2, 2);
scene.background = spaceTexture;

// Part 1
const uvTexture = new THREE.TextureLoader().load('./assets/uv.png');
const crateTexture = new THREE.TextureLoader().load('./assets/crate.png');
const earthTexture = new THREE.TextureLoader().load('./assets/earth.jpeg');
const brickTexture = new THREE.TextureLoader().load('./assets/brick.jpeg');

const ge0 = new THREE.BoxGeometry(7, 7, 7);
const me0 = new THREE.MeshStandardMaterial({ map: uvTexture });
const boxMe0 = new THREE.Mesh(ge0, me0);
boxMe0.position.x = -9;
boxMe0.position.y = -5;
scene.add(boxMe0);

const ge1 = new THREE.BoxGeometry(7, 7, 7);
const me1 = new THREE.MeshStandardMaterial({ map: crateTexture });
const boxMe1 = new THREE.Mesh(ge1, me1);
boxMe1.position.x = 0;
boxMe1.position.y = -5;
scene.add(boxMe1);

const ge2 = new THREE.BoxGeometry(7, 7, 7);
const me2 = new THREE.MeshStandardMaterial({ map: brickTexture });
const boxMe2 = new THREE.Mesh(ge2, me2);
boxMe2.position.x = 9;
boxMe2.position.y = -5;
scene.add(boxMe2);

const ge3 = new THREE.SphereGeometry(4);
const me3 = new THREE.MeshStandardMaterial({ map: uvTexture });
const sphereMe3 = new THREE.Mesh(ge3, me3);
sphereMe3.position.x = -9;
sphereMe3.position.y = 5;
scene.add(sphereMe3);

const ge4 = new THREE.SphereGeometry(2);
const me4 = new THREE.MeshStandardMaterial({ map: crateTexture });
const sphereMe4 = new THREE.Mesh(ge4, me4);
sphereMe4.position.x = 0;
sphereMe4.position.y = 5;
sphereMe4.rotation.y = -Math.PI / 2;
scene.add(sphereMe4);

const ge5 = new THREE.SphereGeometry(4);
const me5 = new THREE.MeshStandardMaterial({ map: brickTexture });
const sphereMe5 = new THREE.Mesh(ge5, me5);
sphereMe5.position.x = 9;
sphereMe5.position.y = 5;
scene.add(sphereMe5);