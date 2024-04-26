import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.0/three.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';

// 장면 생성
const scene = new THREE.Scene();
// 카메라 세부 설정
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// renderer 설정
const renderer = new THREE.WebGLRenderer({ antialias: true });
// 화면 사이즈 설정
renderer.setSize(window.innerWidth, window.innerHeight);
// html 화면에 구현
document.body.appendChild(renderer.domElement);

// BoxGeometry 생성, 이 안에 vertices(꼭지점)과 faces(면)이 포함
const geometry = new THREE.BoxGeometry();
// MeshBasicMaterial 생성
const material = new THREE.MeshBasicMaterial({ color: 0x00ff80 });
// Mesh를 이용하여 geometry에 material을 적용하고 자유롭게 움직일 수 있도록 함
const cube = new THREE.Mesh(geometry, material);
// scene에 cube 추가
scene.add(cube);

// 카메라 세팅(기본세팅은 (0, 0, 0)이므로 z 값을 5로 함)
camera.position.z = 5;


// Orbit Controls 생성
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 500;

// animation
const animate = () => {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();