import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.0/three.module.min.js';

// scene
const scene = new THREE.Scene();

// car
const car = createCar();
scene.add(car);

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // 모든 방향에 빛을 주기 때문에 base color를 제공함
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); // sun과 같은 역할
dirLight.position.set(0, 100, 100);
dirLight.target.position.set(0, 10, 0);
/* dirLight.castShadow = true;
scene.add(dirLight); */
scene.add(dirLight.target);

const helper = new THREE.DirectionalLightHelper(dirLight, 5);
scene.add(helper);

// camera
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera( // 시점, 공간감, 원근감을 배제한 형태, 모든 요소들이 같은 사이즈로 렌더링됨. -> 약간 고전게임 맵 같음
  cameraWidth / -2, // left
  cameraWidth / 2, // right
  cameraHeight / 2, // top
  cameraHeight / -2, // bottom
  0, // near plane
  1000 // far plane
);

camera.position.set(200, 200, 200);
camera.lookAt(0, 10, 0);

/* const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper); */

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

renderer.setAnimationLoop(() => {
  car.rotation.y -= 0.007;
  renderer.render(scene, camera);
});

document.body.appendChild(renderer.domElement);

// createCar
function createCar() {
  const car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);

  const main = new THREE.Mesh(
    new THREE.BoxGeometry(60, 15, 30),
    new THREE.MeshLambertMaterial({ color: 0xa52523 })
  );
  main.position.y = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();

  const carBackTexture = getCarFrontTexture();

  const carRightSideTexture = getCarSideTexture();

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
  carLeftSideTexture.rotation = Math.PI;
  carLeftSideTexture.flipY = false;

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 12, 24), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom,
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
  ]);
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);

  return car;
}

function createWheels() {
  const geometry = new THREE.BoxGeometry(12, 12, 33);
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wheel = new THREE.Mesh(geometry, material);

  return wheel;
}

function getCarFrontTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 64, 32);

  ctx.fillStyle = '#666666';
  ctx.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 128, 32);

  ctx.fillStyle = '#666666';
  ctx.fillRect(10, 8, 38, 24);
  ctx.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}