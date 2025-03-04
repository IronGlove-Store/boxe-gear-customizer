
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import productsData from '@/data/customizableProducts.json';

interface CustomizationState {
  category: string;
  color: string;
  material: string;
  size: string;
}

const ProductCustomizer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Mesh | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const { addItem } = useCart();

  const [customization, setCustomization] = useState<CustomizationState>({
    category: productsData.categories[0].id,
    color: productsData.colors[0].value,
    material: productsData.materials[0].value,
    size: productsData.categories[0].sizes[0]
  });

  const currentCategory = productsData.categories.find(c => c.id === customization.category);

  const updateMaterial = () => {
    if (!modelRef.current) return;

    const materialConfig = productsData.materials.find(m => m.value === customization.material);
    if (!materialConfig) return;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(customization.color),
      roughness: materialConfig.roughness,
      metalness: materialConfig.metalness,
    });

    modelRef.current.material = material;
  };

  const handleAddToCart = () => {
    if (!currentCategory) return;
    
    const selectedMaterial = productsData.materials.find(m => m.value === customization.material);
    const colorName = productsData.colors.find(c => c.value === customization.color)?.name || 'Personalizado';
    
    if (!selectedMaterial) return;

    const price = currentCategory.basePrice * selectedMaterial.priceMultiplier;
    
    addItem({
      id: Date.now().toString(), // Convert number to string to match CartItem.id type
      name: `${colorName} ${selectedMaterial.name} ${currentCategory.name}`,
      price: `€ ${price.toFixed(2)}`,
      image: currentCategory.image,
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

    // Add initial model
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(customization.color),
      roughness: 0.5,
      metalness: 0.0
    });
    const model = new THREE.Mesh(geometry, material);
    modelRef.current = model;
    scene.add(model);

    // Mouse controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !modelRef.current) return;

      const deltaMove = {
        x: e.clientX - previousMousePositionRef.current.x,
        y: e.clientY - previousMousePositionRef.current.y
      };

      modelRef.current.rotation.y += deltaMove.x * 0.01;
      modelRef.current.rotation.x += deltaMove.y * 0.01;

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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  useEffect(() => {
    updateMaterial();
  }, [customization]);

  return (
    <div ref={mountRef} className="w-full h-screen">
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold mb-6">Personaliza o teu Equipamento</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Produto</label>
            <div className="grid grid-cols-2 gap-3">
              {productsData.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCustomization(prev => ({
                    ...prev,
                    category: category.id,
                    size: category.sizes[0]
                  }))}
                  className={`p-4 rounded-lg border transition-all ${
                    customization.category === category.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Cor</label>
            <div className="flex gap-3">
              {productsData.colors.map((color) => (
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
              {productsData.materials.map((material) => (
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
                  {currentCategory && (
                    <div className="text-sm opacity-75">
                      € {(currentCategory.basePrice * material.priceMultiplier).toFixed(2)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {currentCategory && (
            <div>
              <label className="block text-sm font-medium mb-3">Tamanho</label>
              <div className="flex flex-wrap gap-3">
                {currentCategory.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setCustomization(prev => ({ ...prev, size }))}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      customization.size === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t space-y-4">
          <p className="text-sm text-gray-500">
            Arraste para girar • Use o scroll para zoom
          </p>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;
