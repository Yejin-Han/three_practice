import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.0/three.module.min.js';

let width = window.innerWidth;
let height = window.innerHeight;
const gui = new dat.GUI();

const scene = new THREE.Scene;
scene.background = new THREE.Color(0x262626);

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 환경 조명. 모든 객체에 균일하게 빛 추가
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 0.5); // 특정 위치에서 모든 방향으로 빛 발산
light.position.set(-10, 10, -10);

// for shadow
light.castShadow = true; // 그림자 생성
light.shadow.mapSize.width = 1024; // 그림자 해상도
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 1000;
scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 10, 40);
camera.lookAt(0, 0, 0);

gui.add(camera.position, 'z', 10, 200, 1).name('camera-z');

// plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const plane = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);
plane.rotateX(Math.PI / 2);
plane.position.y = -1.75;
plane.receiveShadow = true; // 그림자 받기
scene.add(plane);

// add cube
const addCube = () => {
  const cubeSize = Math.ceil(Math.random() * 3);
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.name = 'cube-' + scene.children.length;
  cube.position.x = -30 + Math.round(Math.random() * 50);
  cube.position.y = Math.round(Math.random() * 5);
  cube.position.z = -20 + Math.round(Math.random() * 50);

  scene.add(cube);
}

// remove cube
const removeCube = () => {
  const allChildren = scene.children;
  const lastObject = allChildren[allChildren.length - 1];
  if(lastObject.name) {
    scene.remove(lastObject);
  }
}

// button click
const add = document.querySelector('.add');
add.addEventListener('click', addCube);

const rem = document.querySelector('.rem');
rem.addEventListener('click', removeCube);

// resize
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
})

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// animation
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// rendering the scene
const container = document.querySelector('#threejs-container');
container.append(renderer.domElement);
renderer.render(scene, camera);
animate();