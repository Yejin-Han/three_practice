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


// PART 1: set up world physics with a few objects
const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});

// create a ground body with a static plane
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane() // infinite geometric plane
});

// rotate ground body by 90 deg
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

// create a sphere and set it at y = 10
const rad = 1;
const sphereBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(rad),
});
sphereBody.position.set(0, 7, 0);
physicsWorld.addBody(sphereBody);

// PART 2: bind cannon debugger to the three.js scene + physics world
const cannonDebugger = new CannonDebugger(test.scene, physicsWorld);

// PART 3: combine the three.js game world with the physics world
const geometry = new THREE.SphereGeometry(rad);
const material = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(geometry, material);
test.scene.add(sphereMesh);

// PART 4: add a box object
const boxBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
});
boxBody.position.set(1, 10, 0);
physicsWorld.addBody(boxBody);

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
test.scene.add(boxMesh);

// animate
const animate = () => {
  physicsWorld.fixedStep(); // 이 코드가 있어야 run simulation 가능
  cannonDebugger.update();
  // 물리세계의 boxBody, sphereMesh가 움직이는 대로(물리세계에서 계산한대로) boxMesh, sphereMesh가 움직이도록 함
  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);
  window.requestAnimationFrame(animate);
}
animate();