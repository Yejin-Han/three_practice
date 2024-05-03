import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { FontLoader } from 'FontLoader';
import { TTFLoader } from 'TTFLoader';
import { TextGeometry } from 'TextGeometry';
import Stats from 'Stats';

const scene = new THREE.Scene();

const fov = 45;
const nearPlane = 1;
const farPlane = 1000;

const camera = new THREE.PerspectiveCamera(
  fov, window.innerWidth / window.innerHeight, nearPlane, farPlane
);
camera.position.z = 120;

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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 32, 64);
scene.add(directionalLight);

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


// Part 1 - typeface.json font loader (json 형태로 변환한 폰트 파일 사용)
const fontLoader = new FontLoader();
fontLoader.load(
  './fonts/Droid_Serif_Bold.json',
  (droidFont) => {
    const textGeometry = new TextGeometry('three.js', {
      size: 20,
      depth: 4,
      font: droidFont,
    });
    const textMaterial = new THREE.MeshNormalMaterial();
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = -55;
    textMesh.position.y = 10;
    scene.add(textMesh);
  }
);

// Part 2 - true type font loader
const ttfLoader = new TTFLoader();
ttfLoader.load('./fonts/jet_brains_mono_regular.ttf', (json) => {
  // 1. Parse the font
  const jetBrainsFont = fontLoader.parse(json);
  // 2. Use parsed font as normal
  const textGeometry = new TextGeometry('Hello world', {
    size: 10,
    depth: 2,
    font: jetBrainsFont
  });
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = -46;
  textMesh.position.y = -10;
  scene.add(textMesh);
});