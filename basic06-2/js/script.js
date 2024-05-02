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


// PART 2
// Why add width/height segments for a geometry?
// Shader은 WebGL이 이해할 수 있는 C언어를 토대로 작성해야 함
function vertexShader() { // 각 정점의 z좌표를 변화시킴
  return `
    varying float z;
    uniform float u_time;
    void main() {
      z = (cos(position.y + u_time) + sin(position.x + u_time)) / 4.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z + position.z, 1.0);
    }
  `;
}

function fragmentShader() { // 각 픽셀의 색상 결정 (이 경우에는 모두 빨간색)
  return `
    uniform float u_time;
    void main() {
      gl_FragColor = vec4(0.25, 0.5, sin(u_time * 2.0) + 0.75, 1.0).rgba; // R, G, B, A 값
    }
  `;
}

const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  fragmentShader: fragmentShader(),
  vertexShader: vertexShader(),
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = Math.PI / 2;
scene.add(mesh);