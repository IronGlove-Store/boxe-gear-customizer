
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ProductCustomizer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf5f5f5);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add a boxing glove placeholder (cube for now)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const glove = new THREE.Mesh(geometry, material);
    scene.add(glove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      glove.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-screen">
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Customize Your Gear</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-red-500 hover:ring-2 ring-black transition-all" />
              <button className="w-8 h-8 rounded-full bg-blue-500 hover:ring-2 ring-black transition-all" />
              <button className="w-8 h-8 rounded-full bg-green-500 hover:ring-2 ring-black transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Material</label>
            <select className="w-full p-2 rounded border">
              <option>Leather</option>
              <option>Synthetic</option>
              <option>Canvas</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;
