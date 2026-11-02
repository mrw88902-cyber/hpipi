let scene, camera, renderer, galaxyParticles, heartGroup;
let planetsGroup;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let interactiveSprites = [];
let isEntered = false;
let droneAngle = 0;
let bgMusic;

const planetsData = [
  // إيطالي
  { text: "Sei Il Mio Universo", lang: "🇮🇹 Italian", desc: "أنتِ كوكبي الخاص وعالمي بأكمله ✨", color: "#ff3399" },
  { text: "Ti Amo Per Sempre", lang: "🇮🇹 Italian", desc: "أحبك إلى الأبد وبلا حدود ❤️", color: "#ff66cc" },
  { text: "Sei La Mia Vita", lang: "🇮🇹 Italian", desc: "أنتِ حياتي والسبب في ابتسامتي 🌸", color: "#ff99e6" },
  
  // عربي
  { text: "أنتِ كل عالمي", lang: "🇦🇪 Arabic", desc: "لا توجد كلمات تكفي لوصف مكانتك في قلبي 💖", color: "#00f2fe" },
  { text: "حب أبدي لا ينتهي", lang: "🇦🇪 Arabic", desc: "قصتنا مكتوبة بين النجوم ✨", color: "#4facfe" },
  { text: "عيد ميلاد سعيد يا روحي", lang: "🇦🇪 Arabic", desc: "كل عام وأنتِ أجمل ما في حياتي 🎉", color: "#00c6ff" },

  // إنجليزي
  { text: "My Entire World", lang: "🇬🇧 English", desc: "You make every moment brighter 🌟", color: "#ff007f" },
  { text: "You Are Magic", lang: "🇬🇧 English", desc: "Pure enchantment in human form 🔮", color: "#a855f7" },
  { text: "Forever & Always", lang: "🇬🇧 English", desc: "Bound together across space and time ♾️", color: "#ec4899" }
];

function init() {
  const container = document.getElementById('canvas-container');
  bgMusic = document.getElementById('bg-music');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 35, 55);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  planetsGroup = new THREE.Group();
  scene.add(planetsGroup);

  createGalaxy();
  createHeartCenter();
  createLanguagePlanets();

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('click', onClick);

  animate();
}

function createGalaxy() {
  const count = 20000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const colorInside = new THREE.Color('#ff00aa');
  const colorOutside = new THREE.Color('#110022');

  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 25 + 2;
    const spinAngle = radius * 1.5;
    const branchAngle = ((i % 3) * 2 * Math.PI) / 3;

    const rx = (Math.random() - 0.5) * 1.5;
    const ry = (Math.random() - 0.5) * 0.5;
    const rz = (Math.random() - 0.5) * 1.5;

    const x = Math.cos(branchAngle + spinAngle) * radius + rx;
    const y = ry;
    const z = Math.sin(branchAngle + spinAngle) * radius + rz;

    positions[i*3] = x;
    positions[i*3+1] = y;
    positions[i*3+2] = z;

    const mixedColor = colorInside.clone().lerp(colorOutside, radius / 27);
    colors[i*3] = mixedColor.r;
    colors[i*3+1] = mixedColor.g;
    colors[i*3+2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
  });

  galaxyParticles = new THREE.Points(geometry, material);
  scene.add(galaxyParticles);
}

function createHeartCenter() {
  heartGroup = new THREE.Group();
  const count = 1600;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = Math.PI * 2 * Math.random();
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    let z = (Math.random() - 0.5) * 2;

    positions[i*3] = x * 0.25;
    positions[i*3+1] = y * 0.25 + 3.5;
    positions[i*3+2] = z;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xff1493, size: 0.12, transparent: true, blending: THREE.AdditiveBlending });

  heartGroup.add(new THREE.Points(geometry, material));
  scene.add(heartGroup);
}

function createLanguagePlanets() {
  planetsData.forEach((item, index) => {
    const angle = (index / planetsData.length) * Math.PI * 2;
    const radius = 15;

    const planetGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const planetMat = new THREE.MeshBasicMaterial({ color: item.color, wireframe: true });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(index * 1.5) * 2;

    planetMesh.position.set(x, y, z);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512; canvas.height = 128;
    ctx.font = 'Bold 32px Segoe UI, sans-serif';
    ctx.fillStyle = item.color;
    ctx.textAlign = 'center';
    ctx.shadowColor = item.color; ctx.shadowBlur = 12;
    ctx.fillText(item.text, 256, 70);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(0, 1.4, 0);
    sprite.scale.set(5.5, 1.4, 1);

    const singlePlanetGroup = new THREE.Group();
    singlePlanetGroup.position.set(x, y, z);
    singlePlanetGroup.add(planetMesh);
    singlePlanetGroup.add(sprite);

    singlePlanetGroup.userData = { ...item, mesh: planetMesh };

    planetsGroup.add(singlePlanetGroup);
    interactiveSprites.push(planetMesh);
  });
}

// دخول المجرة وتشغيل الصوت وحركة الدرون
function enterGalaxy() {
  isEntered = true;
  document.getElementById('start-card').classList.add('hidden');

  // تشغيل الموسيقى تلقائياً مع زر الدخول
  if (bgMusic) {
    bgMusic.play().catch(e => console.log("تعذر التشغيل التلقائي للصوت:", e));
  }

  // انيميشن هبوط كاميرا الدرون لجوة المجرة
  gsap.to(camera.position, {
    x: Math.cos(droneAngle) * 20,
    y: 10,
    z: Math.sin(droneAngle) * 20,
    duration: 3,
    ease: "power2.inOut"
  });
}

function onClick(e) {
  if (!isEntered) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveSprites);

  if (intersects.length > 0) {
    const selectedGroup = intersects[0].object.parent;
    const data = selectedGroup.userData;

    document.getElementById('card-lang').innerText = data.lang;
    document.getElementById('card-title').innerText = data.text;
    document.getElementById('card-desc').innerText = data.desc;
    document.getElementById('detail-card').classList.add('active');

    const targetPos = selectedGroup.position;
    gsap.to(camera.position, {
      x: targetPos.x * 1.3,
      y: targetPos.y + 2,
      z: targetPos.z * 1.3,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => camera.lookAt(targetPos)
    });
  }
}

function resetCamera() {
  document.getElementById('detail-card').classList.remove('active');
}

function toggleAudio() {
  if (bgMusic.paused) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}

// حركة كاميرا الدرون التي تلف ببطء وسلاسة على الكواكب
function animate() {
  requestAnimationFrame(animate);

  if (galaxyParticles) galaxyParticles.rotation.y += 0.001;
  if (heartGroup) {
    heartGroup.rotation.y += 0.004;
    const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.08;
    heartGroup.scale.set(pulse, pulse, pulse);
  }

  // دوران الكواكب
  planetsGroup.children.forEach(p => {
    if(p.userData.mesh) p.userData.mesh.rotation.y += 0.015;
  });

  // حركة طيران الدرون بزاويتها وشكلها السينمائي حول الكواكب
  if (isEntered && !document.getElementById('detail-card').classList.contains('active')) {
    droneAngle += 0.003; // سرعة الدوران
    camera.position.x = Math.cos(droneAngle) * 22;
    camera.position.z = Math.sin(droneAngle) * 22;
    camera.position.y = 8 + Math.sin(droneAngle * 1.8) * 4; // صعود وهبوط الكاميرا كالدرون
    
    // تجعل الكاميرا متجهة دائماً لمركز المجرة والكواكب التي تدور حولها
    camera.lookAt(0, 1, 0);
  } else if (!isEntered) {
    camera.lookAt(0, 0, 0);
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();