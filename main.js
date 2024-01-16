import "./style.css";
import * as THREE from "three";

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#background"),
});
const spaceTexture = new THREE.TextureLoader().load("images/space.jpg");
const armanTexture = new THREE.TextureLoader().load("images/arman.jpg");
const marsTexture = new THREE.TextureLoader().load("images/mars.jpg");
const normalTexture = new THREE.TextureLoader().load("images/marsNormal.png");

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);
renderer.render(scene, camera);

const screenSizeChange = () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(30);
  camera.position.setX(-3);
  renderer.render(scene, camera);
};
window.addEventListener("resize", screenSizeChange);

const createStar = () => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const colors = [
    0xff0000, 0x0000ff, 0xffff00, 0xffffff, 0x00008b, 0xadd8e6, 0xffa500,
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const material = new THREE.MeshStandardMaterial({ color: randomColor });
  const star = new THREE.Mesh(geometry, material);

  const pointLight = new THREE.PointLight(randomColor, 100);
  const [x, y, z] = Array.from({ length: 3 }, () =>
    THREE.MathUtils.randFloatSpread(100)
  );

  pointLight.position.set(x, y, z);
  star.position.set(x, y, z);

  scene.add(star, pointLight);
};

const createObject = (geometry, material, position, rotation) => {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.rotation.set(...rotation);
  scene.add(object);
  return object;
};

// Torus
const torus = createObject(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0x4682b4 }),
  [0, 0, 0],
  [0, 0, 0]
);

// Lights
scene.add(new THREE.AmbientLight(0xffffff));
Array(100).fill().forEach(createStar);

// Background
scene.background = spaceTexture;

// Avatar
const arman = createObject(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: armanTexture }),
  [2, 0, -5],
  [0, 0, 0]
);

// Mars
const mars = createObject(
  new THREE.SphereGeometry(3, 16, 16), // Adjust the number of segments
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: normalTexture,
  }),
  [-10, 0, 30],
  [0, 0, 0]
);

// Throttle function to limit the rate of function execution
function throttle(callback, delay) {
  let lastCall = 0;
  return function () {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback.apply(null, arguments);
    }
  };
}

const throttledMoveCamera = throttle(moveCamera, 16); // 60 frames per second

document.body.onscroll = throttledMoveCamera;

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
  renderer.render(scene, camera); // Render the scene after updating the camera position
}

// Animation Loop
// Limit the rendering frequency
let frameCount = 0;
function animate() {
  requestAnimationFrame(animate);

  // Limit rendering to every 2 frames
  if (frameCount % 2 === 0) {
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    mars.rotation.x += 0.005;

    arman.rotation.y += 0.001;
    arman.rotation.z += 0.001;

    renderer.render(scene, camera);
  }

  frameCount++;
}

animate();

animate();
