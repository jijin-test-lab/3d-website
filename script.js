// --- 1. SETUP CINEMATIC SCENE ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
// Deep winter blue fog just like the video
scene.fog = new THREE.FogExp2(0x0b101a, 0.03);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0b101a, 1);

// --- 2. LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xaaccff, 2);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// --- 3. THE WATER REFLECTION FLOOR ---
const floorGeo = new THREE.PlaneGeometry(200, 200);
const floorMat = new THREE.MeshStandardMaterial({ 
    color: 0x050a12, roughness: 0.1, metalness: 0.8,
    transparent: true, opacity: 0.8
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -5;
scene.add(floor);

// --- 4. THE MONUMENT (PLACEHOLDER) ---
// When you have a .glb file, you will replace this with GLTFLoader
const monument = new THREE.Group();
const coreGeo = new THREE.OctahedronGeometry(4, 1);
const coreMat = new THREE.MeshStandardMaterial({ color: 0x64ffda, wireframe: true });
const core = new THREE.Mesh(coreGeo, coreMat);
monument.add(core);

const outerGeo = new THREE.IcosahedronGeometry(5.5, 0);
const outerMat = new THREE.MeshStandardMaterial({ color: 0x1a2b4c, transparent: true, opacity: 0.7, flatShading: true });
const outer = new THREE.Mesh(outerGeo, outerMat);
monument.add(outer);
scene.add(monument);

// --- 5. FALLING SNOW PARTICLES ---
const snowGeo = new THREE.BufferGeometry();
const snowCount = 2000;
const snowPos = new Float32Array(snowCount * 3);
for(let i=0; i < snowCount * 3; i++) {
    snowPos[i] = (Math.random() - 0.5) * 100;
}
snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
const snowMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.6 });
const snow = new THREE.Points(snowGeo, snowMat);
scene.add(snow);

// --- 6. SCROLL-LINKED CAMERA TRANSITIONS ---
// The exact camera positions for the 4 sections
const cameraPositions = [
    { x: 0, y: 2, z: 20 },      // 01 Approach (Front View)
    { x: 15, y: -2, z: 15 },    // 02 Reflection (Low Side View)
    { x: 0, y: 15, z: 10 },     // 03 Layers (Top Down View)
    { x: -10, y: 5, z: 18 }     // 04 Contact (Side Angle)
];

let currentScroll = 0;
window.addEventListener('scroll', () => {
    currentScroll = window.scrollY;
    // Fade in text
    document.querySelectorAll('.content').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.75) el.classList.add('visible');
    });
});
window.dispatchEvent(new Event('scroll'));

// --- 7. MOUSE PARALLAX ---
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// --- 8. ANIMATION LOOP ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Rotate monument
    monument.rotation.y = time * 0.1;
    
    // Make snow fall
    const positions = snow.geometry.attributes.position.array;
    for(let i=1; i < snowCount * 3; i+=3) {
        positions[i] -= 0.05;
        if(positions[i] < -10) positions[i] = 40; // loop snow to top
    }
    snow.geometry.attributes.position.needsUpdate = true;

    // Smoothly fly camera to new position based on scrolling
    const totalSections = cameraPositions.length - 1;
    const scrollProgress = currentScroll / (document.body.scrollHeight - window.innerHeight || 1);
    
    let sectionIndex = Math.floor(scrollProgress * totalSections);
    if (sectionIndex >= totalSections) sectionIndex = totalSections - 1;
    
    const nextIndex = sectionIndex + 1;
    const sectionProgress = (scrollProgress * totalSections) - sectionIndex;

    const targetX = THREE.MathUtils.lerp(cameraPositions[sectionIndex].x, cameraPositions[nextIndex].x, sectionProgress);
    const targetY = THREE.MathUtils.lerp(cameraPositions[sectionIndex].y, cameraPositions[nextIndex].y, sectionProgress);
    const targetZ = THREE.MathUtils.lerp(cameraPositions[sectionIndex].z, cameraPositions[nextIndex].z, sectionProgress);

    // Add mouse parallax on top of scroll movement
    camera.position.x += ((targetX + mouseX * 2) - camera.position.x) * 0.05;
    camera.position.y += ((targetY - mouseY * 2) - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    camera.lookAt(0, 0, 0); // Always point camera at the monument
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
