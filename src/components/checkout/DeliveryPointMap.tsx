
import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Map as MapIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DeliveryPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface DeliveryPointMapProps {
  onSelectDeliveryPoint: (point: DeliveryPoint | null) => void;
  selectedDeliveryPoint: DeliveryPoint | null;
  isRequired: boolean;
}

// Mock delivery points data (in real app, this would come from an API)
const MOCK_DELIVERY_POINTS: DeliveryPoint[] = [
  {
    id: "dp1",
    name: "Ponto de Entrega Lisboa Centro",
    address: "Av. da Liberdade 10, Lisboa",
    lat: 38.7166,
    lng: -9.1369
  },
  {
    id: "dp2",
    name: "Ponto de Entrega Parque das Nações",
    address: "R. do Bojador 15, Lisboa",
    lat: 38.7633,
    lng: -9.0950
  },
  {
    id: "dp3",
    name: "Ponto de Entrega Cascais",
    address: "Av. Marginal 45, Cascais",
    lat: 38.6979,
    lng: -9.4215
  },
  {
    id: "dp4",
    name: "Ponto de Entrega Porto",
    address: "Av. dos Aliados 20, Porto",
    lat: 41.1496,
    lng: -8.6110
  }
];

const DeliveryPointMap = ({ 
  onSelectDeliveryPoint, 
  selectedDeliveryPoint,
  isRequired 
}: DeliveryPointMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapApiKey, setMapApiKey] = useState<string | null>(localStorage.getItem('googleMapsApiKey'));
  const [showApiKeyInput, setShowApiKeyInput] = useState(!mapApiKey);
  const { toast } = useToast();
  
  const initMap = () => {
    if (!mapRef.current || !mapApiKey) return;
    
    // This is a mockup implementation. In a real app, we would use the Google Maps API
    setMapLoaded(true);
    
    // For demonstration purposes, we're not actually loading Google Maps
    // Instead, we'll show a list of mock delivery points
    console.log("Map initialized with API key:", mapApiKey);
  };
  
  useEffect(() => {
    if (mapApiKey && !mapLoaded) {
      initMap();
    }
  }, [mapApiKey, mapLoaded]);
  
  const handleSelectPoint = (point: DeliveryPoint) => {
    onSelectDeliveryPoint(point);
    toast({
      title: "Ponto de entrega selecionado",
      description: `${point.name} foi selecionado como ponto de entrega.`,
    });
  };
  
  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const apiKey = formData.get('apiKey') as string;
    
    if (apiKey) {
      localStorage.setItem('googleMapsApiKey', apiKey);
      setMapApiKey(apiKey);
      setShowApiKeyInput(false);
      toast({
        title: "Chave API salva",
        description: "A chave de API do Google Maps foi salva com sucesso.",
      });
    }
  };
  
  if (!isRequired) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="w-5 h-5" />
          Selecionar Ponto de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showApiKeyInput ? (
          <div className="p-4 border rounded-lg">
            <p className="mb-2 text-sm">
              Para utilizar o mapa, é necessário fornecer uma chave de API do Google Maps.
            </p>
            <form onSubmit={handleApiKeySubmit} className="flex gap-2">
              <input 
                type="text" 
                name="apiKey"
                placeholder="Insira sua chave de API"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button type="submit">Salvar</Button>
            </form>
            <p className="mt-2 text-xs text-gray-500">
              Nota: Esta é uma implementação de demonstração. Em uma aplicação real, a chave seria armazenada de forma segura no backend.
            </p>
          </div>
        ) : (
          <>
            <div 
              ref={mapRef}
              className="h-48 mb-4 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <p className="text-gray-500 text-sm text-center p-4">
                [Este é um mapa simulado para demonstração]<br/>
                Em uma aplicação real, aqui seria exibido um mapa interativo do Google Maps.
              </p>
            </div>
            
            <div className="space-y-3 mt-4">
              <p className="text-sm font-medium">Selecione um ponto de entrega:</p>
              
              {MOCK_DELIVERY_POINTS.map((point) => (
                <div 
                  key={point.id}
                  className={`p-3 border rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                    selectedDeliveryPoint?.id === point.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectPoint(point)}
                >
                  <MapPin className={`mt-0.5 w-4 h-4 ${selectedDeliveryPoint?.id === point.id ? 'text-black' : 'text-gray-400'}`} />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{point.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{point.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryPointMap;
