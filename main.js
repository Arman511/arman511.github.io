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
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x4682b4 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

function addStar() {
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

  scene.add(star);
  scene.add(pointLight);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load("images/space.jpg");
scene.background = spaceTexture;

// Avatar

const armanTexture = new THREE.TextureLoader().load("images/arman.jpg");

const arman = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: armanTexture })
);

scene.add(arman);

// Moon

const marsTexture = new THREE.TextureLoader().load("images/mars.jpg");
const normalTexture = new THREE.TextureLoader().load("images/marsNormal.png");

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: normalTexture,
  })
);

scene.add(mars);

mars.position.z = 30;
mars.position.setX(-10);

arman.position.z = -5;
arman.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  mars.rotation.x += 0.05;
  mars.rotation.y += 0.075;
  mars.rotation.z += 0.05;

  arman.rotation.y += 0.01;
  arman.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  mars.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
