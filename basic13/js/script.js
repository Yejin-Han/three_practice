import * as THREE from 'three';
import SceneInit from './lib/SceneInit.js';

const test = new SceneInit('myCanvas');
test.initialize();
test.animate();

const axesHelper = new THREE.AxesHelper(16);
test.scene.add(axesHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(test.directionalLight, 2);
test.scene.add(directionalLightHelper);

// load textures
const sunTexture = new THREE.TextureLoader().load('./assets/sun.jpeg');
const moonTexture = new THREE.TextureLoader().load('./assets/moon.jpeg');
const earthTexture = new THREE.TextureLoader().load('./assets/earth.jpeg');
const spaceTexture = new THREE.TextureLoader().load('./assets/space.jpeg');

// groups like a solarsystem
const solarSystemGroup = new THREE.Group();
const earthOrbit = new THREE.Group();

const sunGeometry = new THREE.SphereGeometry(4);
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
solarSystemGroup.add(sunMesh);

const earthGeometry = new THREE.SphereGeometry(2);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.x = 12;
earthOrbit.add(earthMesh);

const moonOrbit = new THREE.Group();
const moonGeometry = new THREE.SphereGeometry(1);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonOrbit.add(moonMesh);
moonOrbit.position.x = 12;
moonMesh.position.x = 4;
earthOrbit.add(moonOrbit);

test.scene.add(solarSystemGroup);
test.scene.add(earthOrbit);

test.scene.background = spaceTexture;

// animate earth rotation and moon rotation
const animate = () => {
  earthOrbit.rotation.y += 0.005;
  moonOrbit.rotation.y += 0.05;
  window.requestAnimationFrame(animate);
}
animate();