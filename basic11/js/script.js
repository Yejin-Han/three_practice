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
/* 
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 10);
scene.add(spotLightHelper); */

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


// addNewBoxMesh
const addNewBoxMesh = (x, y, z) => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.set(x, y, z);
  scene.add(boxMesh);
}

// top rows
addNewBoxMesh(0, 2, 0);
addNewBoxMesh(2, 2, 0);
addNewBoxMesh(-2, 2, 0);
addNewBoxMesh(0, 2, -2);
addNewBoxMesh(2, 2, -2);
addNewBoxMesh(-2, 2, -2);
addNewBoxMesh(0, 2, 2);
addNewBoxMesh(2, 2, 2);
addNewBoxMesh(-2, 2, 2);

// middle rows
addNewBoxMesh(0, 0, 0);
addNewBoxMesh(2, 0, 0);
addNewBoxMesh(-2, 0, 0);
addNewBoxMesh(0, 0, -2);
addNewBoxMesh(2, 0, -2);
addNewBoxMesh(-2, 0, -2);
addNewBoxMesh(0, 0, 2);
addNewBoxMesh(2, 0, 2);
addNewBoxMesh(-2, 0, 2);

// bottom rows
addNewBoxMesh(0, -2, 0);
addNewBoxMesh(2, -2, 0);
addNewBoxMesh(-2, -2, 0);
addNewBoxMesh(0, -2, -2);
addNewBoxMesh(2, -2, -2);
addNewBoxMesh(-2, -2, -2);
addNewBoxMesh(0, -2, 2);
addNewBoxMesh(2, -2, 2);
addNewBoxMesh(-2, -2, 2);

// add shiba model
const gltfLoader = new GLTFLoader();
gltfLoader.load('./assets/scene.gltf', (gltfscene) => {
  gltfscene.scene.position.y = 0.5;
  gltfscene.scene.position.z = 4;
  gltfscene.scene.scale.set(1, 1, 1);
  scene.add(gltfscene.scene);
});

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster(); // 특정 방향으로 광선을 쏘고 해당 광선과 교차하는 물체를 찾을 때 사용

const onMouseMove = (e) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  // change color of objects intersecting the raycaster -> 이렇게 하면 좌표가 교차하는 모든 물체가 색이 변함
  /* for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000);
  } */

  // change color of the closest object intersecting the raycaster -> 이렇게 해야 제일 가까운 하나만 색이 변함
  if(intersects.length > 0) {
    intersects[0].object.material.color.set(0xff0000);
  }
}

window.addEventListener('mousemove', onMouseMove);