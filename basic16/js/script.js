import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import SceneInit from './lib/SceneInit.js';

const test = new SceneInit('myCanvas');
test.initialize();
test.animate();

const axesHelper = new THREE.AxesHelper(16);
test.scene.add(axesHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(test.directionalLight, 2);
test.scene.add(directionalLightHelper);


// PART 1: set up world physics with gravity
const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});

// create a ground body with a static plane
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(), // infinite geometric plane
});

// rotate a ground body by 90 degrees
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

// add a green wireframe to each object and visualize the physics world
const cannonDebugger = new CannonDebugger(test.scene, physicsWorld);


// PART 2: add base vehicle body
const carBody = new CANNON.Body({
  mass: 5,
  position: new CANNON.Vec3(0, 6, 0),
  shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2)),
});

const vehicle = new CANNON.RigidVehicle({
  chassisBody: carBody,
});


// PART 3: add wheels to the vehicle
const mass = 1;
const axisWidth = 5;
const wheelShape = new CANNON.Sphere(1);
const wheelMaterial = new CANNON.Material('wheel');
const down = new CANNON.Vec3(0, -1, 0);

const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody1.addShape(wheelShape);
wheelBody1.angularDamping = 0.4; // 1에 가까울수록 Body의 회전은 매우 빨리 감쇠하고 거의 즉시 정지
vehicle.addWheel({
  body: wheelBody1,
  position: new CANNON.Vec3(-2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody2.addShape(wheelShape);
wheelBody2.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody2,
  position: new CANNON.Vec3(-2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody3.addShape(wheelShape);
wheelBody3.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody3,
  position: new CANNON.Vec3(2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody4.addShape(wheelShape);
wheelBody4.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody4,
  position: new CANNON.Vec3(2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

vehicle.addToWorld(physicsWorld);


// PART 4: move car based on user input
document.addEventListener('keydown', e => {
  const maxSteerVal = Math.PI / 8;
  const maxForce = 10;

  switch(e.key) {
    case 'w':
    case 'ArrowUp':
      vehicle.setWheelForce(maxForce, 0); // value, wheelIndex => value > 0이면 전진하는 방향으로 힘 작용, 0이면 정지, < 0이면 후퇴, wheelIndex는 vehicle.wheelBodies 인덱스에서 추가한 순서대로 0부터
      vehicle.setWheelForce(maxForce, 1);
      break;

    case 's':
    case 'ArrowDown':
      vehicle.setWheelForce(-maxForce / 2, 0);
      vehicle.setWheelForce(-maxForce / 2, 1);
      break;
    
    case 'a':
    case 'ArrowLeft':
      vehicle.setSteeringValue(maxSteerVal, 0); //휠의 방향 설정, value > 0이면 휠이 왼쪽으로, 0이면 직진, < 0이면 오른쪽으로
      vehicle.setSteeringValue(maxSteerVal, 1);
      break;

    case 'd':
    case 'ArrowRight':
      vehicle.setSteeringValue(-maxSteerVal, 0);
      vehicle.setSteeringValue(-maxSteerVal, 1);
      break;
  }
});


// PART 5: sync game world with physics world
const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
test.scene.add(boxMesh);

const sphereGeometry1 = new THREE.SphereGeometry(1);
const sphereMaterial1 = new THREE.MeshNormalMaterial();
const sphereMesh1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
test.scene.add(sphereMesh1);

const sphereGeometry2 = new THREE.SphereGeometry(1);
const sphereMaterial2 = new THREE.MeshNormalMaterial();
const sphereMesh2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
test.scene.add(sphereMesh2);

const sphereGeometry3 = new THREE.SphereGeometry(1);
const sphereMaterial3 = new THREE.MeshNormalMaterial();
const sphereMesh3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3);
test.scene.add(sphereMesh3);

const sphereGeometry4 = new THREE.SphereGeometry(1);
const sphereMaterial4 = new THREE.MeshNormalMaterial();
const sphereMesh4 = new THREE.Mesh(sphereGeometry4, sphereMaterial4);
test.scene.add(sphereMesh4);

const animate = () => {
  physicsWorld.fixedStep();
  /* cannonDebugger.update(); */
  boxMesh.position.copy(carBody.position);
  boxMesh.quaternion.copy(carBody.quaternion);
  sphereMesh1.position.copy(wheelBody1.position);
  sphereMesh1.quaternion.copy(wheelBody1.quaternion);
  sphereMesh2.position.copy(wheelBody2.position);
  sphereMesh2.quaternion.copy(wheelBody2.quaternion);
  sphereMesh3.position.copy(wheelBody3.position);
  sphereMesh3.quaternion.copy(wheelBody3.quaternion);
  sphereMesh4.position.copy(wheelBody4.position);
  sphereMesh4.quaternion.copy(wheelBody4.quaternion);
  window.requestAnimationFrame(animate);
}
animate();