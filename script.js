// --- 1. SCROLL FADE-IN EFFECTS ---
document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        observer.observe(section);
    });
});

// --- 2. PREMIUM 3D CYBER ENVIRONMENT ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

// Create the massive Cyber-Network Sphere
const geometry = new THREE.IcosahedronGeometry(20, 2);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ffcc, // Cyan to match your theme
    wireframe: true,
    transparent: true,
    opacity: 0.1 
});
const cyberSphere = new THREE.Mesh(geometry, material);
scene.add(cyberSphere);

// Add tiny glowing data particles
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 800;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xff2a5f, // Crimson red to match accents
    transparent: true,
    opacity: 0.6
});
const particlesMesh = new THREE.Points(particlesGeo, particleMaterial);
scene.add(particlesMesh);

// Track Mouse and Scroll Movement
let mouseX = 0;
let mouseY = 0;
let scrollY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Smoothly rotate the wireframe sphere
    cyberSphere.rotation.y = time * 0.05;
    cyberSphere.rotation.x = time * 0.02;

    // Particles react to your mouse slightly
    particlesMesh.rotation.y = time * 0.03 + (mouseX * 0.1);
    particlesMesh.rotation.x = (mouseY * 0.1);

    // Camera moves down as you scroll down the page (Parallax)
    camera.position.y = -scrollY * 0.015;
    
    renderer.render(scene, camera);
}
animate();

// Keep it responsive if the window resizes
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
