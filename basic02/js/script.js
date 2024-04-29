import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.0/three.module.min.js';

const scene = new THREE.Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const camera = new THREE.PerspectiveCamera(
  85,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 2;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
// canvas의 흐릿한 출력을 막음
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// 배경색 지정
renderer.setClearColor(new THREE.Color('#21282a'), 1);
// html에 canvas 삽입
document.body.appendChild(renderer.domElement);


// 도넛모양 만들기
const geometry = new THREE.TorusGeometry(0.7, 0.2, 50, 100); // TorusGeometry(전체 반지름, 빈 공간 반지름-작으면 커짐, 세로 점 개수, 가로 점 개수)
const material = new THREE.PointsMaterial({
  size: 0.005,
  color: 0x87a7ca,
});
const sphere = new THREE.Points(geometry, material); // 점으로 만드는거라 Points 이용
scene.add(sphere);


// Particles
const particlesGeometry = new THREE.BufferGeometry(); // 사용자 정의 도형
const loader = new THREE.TextureLoader();
const star = loader.load('./img/star.png'); // 별 모양 material 없어서 이미지 로드
const particlesmaterial = new THREE.PointsMaterial({
  size: 0.005,
  map: star,
  transparent: true
});
const particlesCnt = 2000;

const posArray = new Float32Array(particlesCnt * 3);
for(let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(posArray, 3)
);

const particlesMesh = new THREE.Points(particlesGeometry, particlesmaterial);
scene.add(particlesMesh);


// drag
let isDragging = false;

let mouseX = 0;
let mouseY = 0;

const animateParticles = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

document.addEventListener('mousedown', () => { isDragging = true; });
document.addEventListener('mousemove', (e) => {
  if(isDragging) {
    animateParticles(e);
  }
});
document.addEventListener('mouseup', () => {
  isDragging = false;
  particlesMesh.rotation.y = -1;
});


// Animate
const clock = new THREE.Clock();

const animate = () => {
  window.requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  console.log('elapsedTime', elapsedTime);

  sphere.rotation.y = 0.5 * elapsedTime;
  particlesMesh.rotation.y = -1 * (elapsedTime * 0.1);

  if(mouseX > 0) {
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00005);
    particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00005);
  }

  renderer.render(scene, camera);
}

animate();



window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});