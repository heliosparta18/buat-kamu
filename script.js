// Setup Scene, Camera, Renderer
const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.002);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 0, 60);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Orbit Controls untuk Interaksi Drag & Zoom
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 1.2;
controls.minDistance = 20;
controls.maxDistance = 150;

// 1. Buat Bola Inti (Red/Pink Core di Tengah)
const coreCount = 45000;

const coreGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(coreCount * 3);

for (let i = 0; i < coreCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  const radius = 9;

  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);

  positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);

  positions[i * 3 + 2] = radius * Math.cos(phi);
}

coreGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Buat tekstur titik/partikel untuk bola inti menggunakan Canvas 2D
function createCoreTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgb(234, 50, 255)");
  grad.addColorStop(0.5, "rgba(255, 100, 229, 0.5)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

const coreMaterial = new THREE.PointsMaterial({
  color: 0x9966ff,

  size: 0.18,

  transparent: true,

  opacity: 0.8,

  blending: THREE.AdditiveBlending,

  depthWrite: false,
});
const coreSphere = new THREE.Points(coreGeometry, coreMaterial);
scene.add(coreSphere);
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(8.8, 64, 64),

  new THREE.MeshBasicMaterial({
    color: 0x9966ff,

    transparent: true,

    opacity: 0.19,

    side: THREE.BackSide,
  }),
);

scene.add(glow);
glow.scale.setScalar(1 + Math.sin(Date.now() * 0.022) * 0.13);

// 2. Buat Galaksi Partikel Bintang di Sekitar
const starsCount = 3000;
const starsGeometry = new THREE.BufferGeometry();
const starsPositions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i += 3) {
  starsPositions[i] = (Math.random() - 0.5) * 200;
  starsPositions[i + 1] = (Math.random() - 0.5) * 200;
  starsPositions[i + 2] = (Math.random() - 0.5) * 200;
}
starsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starsPositions, 3),
);

const starsMaterial = new THREE.PointsMaterial({
  size: 0.2,
  color: 0xffffff,
  transparent: false,
  opacity: 1,
});
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);
const dustCount = 4000;

const dustGeometry = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount; i++) {
  dustPos[i * 3] = (Math.random() - 0.5) * 250;
  dustPos[i * 3 + 1] = (Math.random() - 0.5) * 250;
  dustPos[i * 3 + 2] = (Math.random() - 0.5) * 250;
}

dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));

const dust = new THREE.Points(
  dustGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.5,
  }),
);
starField.rotation.y -= 0.002;
dust.rotation.x += 0.0002;
dust.rotation.y += 0.0004;

scene.add(dust);
const galaxyCount = 15000;

const galaxyGeometry = new THREE.BufferGeometry();

const galaxyPos = new Float32Array(galaxyCount * 3);

for (let i = 0; i < galaxyCount; i++) {
  const angle = Math.random() * Math.PI * 2;

  const radius = 18 + Math.random() * 55;

  galaxyPos[i * 3] = Math.cos(angle) * radius;

  galaxyPos[i * 3 + 1] = (Math.random() - 0.5) * 5;

  galaxyPos[i * 3 + 2] = Math.sin(angle) * radius;
}

galaxyGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(galaxyPos, 3),
);

const galaxy = new THREE.Points(
  galaxyGeometry,
  new THREE.PointsMaterial({
    color: 0x9966ff,
    size: 0.11,
    opacity: 0.9,
    transparent: true,
  }),
);

scene.add(galaxy);

// 3. Buat Foto-Foto Melayang (Ganti link di bawah dengan foto kamu sendiri)
const singlePhotos = Array.from(
  { length: 21 },
  (_, i) => `images/foto (${i + 1}).jpg`,
);
const photoUrls = [].concat(singlePhotos, singlePhotos, singlePhotos);

const photoObjects = [];
const planeGeo = new THREE.PlaneGeometry(4, 5);
function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);

  gradient.addColorStop(0, "rgba(255,120,180,1)");
  gradient.addColorStop(0.4, "rgba(255,120,180,.5)");
  gradient.addColorStop(1, "rgba(255,120,180,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
}
function createFrameTexture(imgUrl, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 320);
    ctx.drawImage(img, 12, 12, 232, 250);

    const texture = new THREE.CanvasTexture(canvas);
    callback(texture);
  };
  img.src = imgUrl;
}

const radiusOrbit = 48;
photoUrls.forEach((url, index) => {
  const angle = (index / photoUrls.length) * Math.PI * 2;
  const x = Math.cos(angle) * (radiusOrbit + Math.random() * 18);
  const z = Math.sin(angle) * (radiusOrbit + Math.random() * 18);
  const y = (Math.random() - 0.5) * 25;

  createFrameTexture(url, (texture) => {
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(planeGeo, material);
    // Glow di belakang foto
    const glowMaterial = new THREE.MeshBasicMaterial({
      map: texture,

      transparent: true,

      opacity: 0.25,

      color: 0xff8db8,

      blending: THREE.AdditiveBlending,

      depthWrite: false,
    });

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 5.4),

      glowMaterial,
    );

    glow.position.z = -0.05;

    mesh.add(glow);
    mesh.position.set(x, y, z);

    const scale = 0.9 + Math.random() * 0.8;
    mesh.scale.set(scale, scale, 1);

    mesh.lookAt(0, y, 0);
    mesh.rotateY(Math.PI);

    mesh.userData = {
      url: url,
      angle: angle,
      radius: Math.sqrt(x * x + z * z),
      speed: 0.001 + Math.random() * 0.0015,
      height: y,
    };
    scene.add(mesh);
    photoObjects.push(mesh);
  });
});

// Raycaster untuk Klik Foto
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(photoObjects);

  if (intersects.length > 0) {
    const selectedMesh = intersects[0].object;
    modalImg.src = selectedMesh.userData.url;
    modal.classList.add("active");
  }
});

modal.addEventListener("click", (e) => {
  // klik background
  if (e.target === modal) {
    modal.classList.remove("active");
  }
  // klik fotonya
  if (e.target === modalImg) {
    modal.classList.remove("active");
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);

  coreSphere.rotation.y += 0.005;
  starField.rotation.y -= 0.002;
  glow.rotation.y += 0.001;
  galaxy.rotation.y += 0.0009;
  photoObjects.forEach((mesh) => {
    mesh.userData.angle += mesh.userData.speed;

    mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;

    mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.radius;

    mesh.position.y =
      mesh.userData.height + Math.sin(mesh.userData.angle * 3) * 0.5;

    mesh.lookAt(camera.position);
    if (mesh.children.length > 0) {
      const glow = mesh.children[0];

      const pulse = 0.18 + Math.sin(Date.now() * 0.003 + mesh.id) * 0.07;

      glow.material.opacity = pulse;

      const scale = 1 + Math.sin(Date.now() * 0.003 + mesh.id) * 0.04;

      glow.scale.set(scale, scale, 1);
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
