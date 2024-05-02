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

/* const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.castShadow = true;
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.castShadow = true;
spotLight.position.set(0, 64, 32);
scene.add(spotLight); */

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

// initialize gui
const gui = new dat.GUI();

// main group
const mainGroup = new THREE.Group();
mainGroup.position.y = 0.5;
scene.add(mainGroup);

// setup ground
const groundGeometry = new THREE.BoxGeometry(8, 0.5, 8);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.y = -2;
mainGroup.add(groundMesh);

// setup red box mesh
const bg1 = new THREE.BoxGeometry(1, 1, 1);
const bm1 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const boxMesh1 = new THREE.Mesh(bg1, bm1);
boxMesh1.castShadow = true;
boxMesh1.position.x = -2;
mainGroup.add(boxMesh1);

// setup green box mesh
const bg2 = new THREE.BoxGeometry(1, 1, 1);
const bm2 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const boxMesh2 = new THREE.Mesh(bg2, bm2);
boxMesh2.castShadow = true;
boxMesh2.position.x = 0;
mainGroup.add(boxMesh2);

// setup blue box mesh
const bg3 = new THREE.BoxGeometry(1, 1, 1);
const bm3 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const boxMesh3 = new THREE.Mesh(bg3, bm3);
boxMesh3.castShadow = true;
boxMesh3.position.x = 2;
mainGroup.add(boxMesh3);

// setup ambient light
const al = new THREE.AmbientLight(0xffffff, 0.5);
mainGroup.add(al);

// setup ambient light gui
const alFolder = gui.addFolder('ambient light');
const alSettings = { color: al.color.getHex() };
alFolder.add(al, 'visible');
alFolder.add(al, 'intensity', 0, 1, 0.1);
alFolder.addColor(alSettings, 'color').onChange((value) => al.color.set(value));
// alFolder.open();

// setup directional light + helper
const dl = new THREE.DirectionalLight(0xffffff, 0.5);
dl.position.set(0, 2, 2);
dl.castShadow = true;

const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
mainGroup.add(dl, dlHelper);

// setup directional light gui
const dlFolder = gui.addFolder('directional light');
const dlSettings = { visible: true, color: dl.color.getHex() };
dlFolder.add(dlSettings, 'visible').onChange(value => {
  dl.visible = value;
  dlHelper.visible = value;
});
dlFolder.add(dl, 'intensity', 0, 1, 0.25);
dlFolder.add(dl.position, 'y', 1, 4, 0.5);
dlFolder.add(dl, 'castShadow');
dlFolder.addColor(dlSettings, 'color').onChange(value => dl.color.set(value));
// dlFolder.open();

// setup spot light + helper
const sl = new THREE.SpotLight(0x00ff00, 1, 8, Math.PI / 8, 0);
sl.position.set(0, 2, 2);
const slHelper = new THREE.SpotLightHelper(sl);
mainGroup.add(sl, slHelper);

// setup spot light gui
const slFolder = gui.addFolder('spot light');
const slSettings = { visible: true };
slFolder.add(slSettings, 'visible').onChange(value => {
  sl.visible = value;
  slHelper.visible = value;
});
slFolder.add(sl, 'intensity', 0, 4, 0.5);
slFolder.add(sl, 'angle', Math.PI / 16, Math.PI / 2, Math.PI / 16);
slFolder.add(sl, 'castShadow');
// slFolder.open();

// setup point light + helper
const pl = new THREE.PointLight(0xffffff, 1, 8, 2);
pl.position.set(2, 2, 2);
const plHelper = new THREE.PointLightHelper(pl, 0.5);
mainGroup.add(pl, plHelper);

// setup point light gui
const plFolder = gui.addFolder('point light');
const plSettings = { visible: true, color: pl.color.getHex() };
plFolder.add(plSettings, 'visible').onChange(value => {
  pl.visible = value;
  plHelper.visible = value;
});
plFolder.add(pl, 'intensity', 0, 2, 0.25);
plFolder.add(pl.position, 'x', -2, 4, 0.5);
plFolder.add(pl.position, 'y', -2, 4, 0.5);
plFolder.add(pl.position, 'z', -2, 4, 0.5);
plFolder.add(pl, 'castShadow');
plFolder.addColor(plSettings, 'color').onChange(value => pl.color.set(value));
plFolder.open();