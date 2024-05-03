import * as THREE from 'three';
import SceneInit from './lib/SceneInit.js';

const test = new SceneInit('myCanvas');
test.initialize();
test.animate();

const axesHelper = new THREE.AxesHelper(16);
test.scene.add(axesHelper);

const uniformData = {
  u_time: {
    type: 'f',
    value: test.clock.getElapsedTime(),
  }
}

const render = () => {
  uniformData.u_time.value = test.clock.getElapsedTime();
  window.requestAnimationFrame(render);
}
render();


// varying variables
const boxGeometry = new THREE.BoxGeometry(24, 4, 24, 24, 4, 24);
const boxMaterial = new THREE.ShaderMaterial({
  wireframe: true,
  uniforms: uniformData,
  vertexShader: `
    varying vec3 pos;
    uniform float u_time;

    void main() {
      vec4 result;
      pos = position;

      result = vec4(position.x, 4.0 * sin(position.z / 4.0 + u_time) + position.y, position.z, 1.0);

      gl_Position = projectionMatrix * modelViewMatrix * result;
    }
  `,
  fragmentShader: `
    varying vec3 pos;
    uniform float u_time;

    void main() {
      if(pos.x >= 0.0) {
        gl_FragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
      } else {
        gl_FragColor = vec4(0.0, abs(cos(u_time)), 0.0, 1.0);
      }
    }
  `
});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
test.scene.add(boxMesh);