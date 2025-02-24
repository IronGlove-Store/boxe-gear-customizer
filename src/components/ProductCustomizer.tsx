
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface CustomizationState {
  color: string;
  material: string;
  size: string;
}

const ProductCustomizer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gloveRef = useRef<THREE.Mesh | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const { addItem } = useCart();

  const [customization, setCustomization] = useState<CustomizationState>({
    color: '#ff0000',
    material: 'leather',
    size: '12oz'
  });

  const colors = [
    { name: 'Red', value: '#ff0000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' },
    { name: 'Gold', value: '#ffd700' }
  ];

  const materials = [
    { name: 'Leather', value: 'leather', roughness: 0.5, metalness: 0.0, price: 199.99 },
    { name: 'Patent Leather', value: 'patent', roughness: 0.1, metalness: 0.3, price: 249.99 },
    { name: 'Canvas', value: 'canvas', roughness: 0.9, metalness: 0.0, price: 149.99 },
    { name: 'Synthetic', value: 'synthetic', roughness: 0.3, metalness: 0.1, price: 179.99 }
  ];

  const sizes = [
    { name: '12oz', value: '12oz' },
    { name: '14oz', value: '14oz' },
    { name: '16oz', value: '16oz' }
  ];

  const updateMaterial = () => {
    if (!gloveRef.current) return;

    const materialConfig = materials.find(m => m.value === customization.material);
    if (!materialConfig) return;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(customization.color),
      roughness: materialConfig.roughness,
      metalness: materialConfig.metalness,
    });

    gloveRef.current.material = material;
  };

  const handleAddToCart = () => {
    const selectedMaterial = materials.find(m => m.value === customization.material);
    if (!selectedMaterial) return;

    const colorName = colors.find(c => c.value === customization.color)?.name || 'Custom';
    
    addItem({
      id: Date.now(), // Unique ID for custom items
      name: `Custom ${colorName} ${selectedMaterial.name} Boxing Gloves`,
      price: `$${selectedMaterial.price.toFixed(2)}`,
      image: "https://i.pinimg.com/736x/dc/80/d2/dc80d2e7e16b190879ba968e9a364705.jpg",
      quantity: 1,
      size: customization.size
    });
  };

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
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add a boxing glove (using a more complex geometry)
    const geometry = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(customization.color),
      roughness: 0.5,
      metalness: 0.0
    });
    const glove = new THREE.Mesh(geometry, material);
    gloveRef.current = glove;
    scene.add(glove);

    // Mouse controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !gloveRef.current) return;

      const deltaMove = {
        x: e.clientX - previousMousePositionRef.current.x,
        y: e.clientY - previousMousePositionRef.current.y
      };

      gloveRef.current.rotation.y += deltaMove.x * 0.01;
      gloveRef.current.rotation.x += deltaMove.y * 0.01;

      previousMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Zoom control
    const handleWheel = (e: WheelEvent) => {
      if (!cameraRef.current) return;
      
      cameraRef.current.position.z = Math.max(
        3,
        Math.min(8, cameraRef.current.position.z + e.deltaY * 0.005)
      );
    };

    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, []);

  useEffect(() => {
    updateMaterial();
  }, [customization]);

  return (
    <div ref={mountRef} className="w-full h-screen">
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Personaliza o teu equipamento</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Cor</label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setCustomization(prev => ({ ...prev, color: color.value }))}
                  className={`w-10 h-10 rounded-full transition-all duration-200 ${
                    customization.color === color.value 
                      ? 'ring-2 ring-offset-2 ring-black scale-110' 
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">Material</label>
            <div className="grid grid-cols-2 gap-3">
              {materials.map((material) => (
                <button
                  key={material.value}
                  onClick={() => setCustomization(prev => ({ ...prev, material: material.value }))}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    customization.material === material.value
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div>{material.name}</div>
                  <div className="text-sm opacity-75">${material.price}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Tamanho</label>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setCustomization(prev => ({ ...prev, size: size.value }))}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    customization.size === size.value
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t space-y-4">
          <p className="text-sm text-gray-500">
            Puxa para mover • Scroll para zoom
          </p>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;
