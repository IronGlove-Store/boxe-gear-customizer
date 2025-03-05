
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Map as MapIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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

// Component to set map view based on selected delivery point
const SetViewOnSelect = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  map.setView(coords, 14);
  return null;
};

const DeliveryPointMap = ({ 
  onSelectDeliveryPoint, 
  selectedDeliveryPoint,
  isRequired 
}: DeliveryPointMapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setMapLoaded(true);
  }, []);
  
  const handleSelectPoint = (point: DeliveryPoint) => {
    onSelectDeliveryPoint(point);
    toast({
      title: "Ponto de entrega selecionado",
      description: `${point.name} foi selecionado como ponto de entrega.`,
    });
  };
  
  if (!isRequired) {
    return null;
  }
  
  // Default center position (Lisboa)
  const defaultPosition: [number, number] = [38.7223, -9.1393];
  const selectedPosition: [number, number] = selectedDeliveryPoint 
    ? [selectedDeliveryPoint.lat, selectedDeliveryPoint.lng] 
    : defaultPosition;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="w-5 h-5" />
          Selecionar Ponto de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-4 rounded-lg overflow-hidden">
          <MapContainer 
            center={defaultPosition} 
            zoom={11} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {MOCK_DELIVERY_POINTS.map((point) => (
              <Marker 
                key={point.id} 
                position={[point.lat, point.lng]}
                eventHandlers={{
                  click: () => handleSelectPoint(point),
                }}
              >
                <Popup>
                  <div>
                    <h3 className="font-medium text-sm">{point.name}</h3>
                    <p className="text-xs">{point.address}</p>
                    <Button 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => handleSelectPoint(point)}
                    >
                      Selecionar
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {selectedDeliveryPoint && (
              <SetViewOnSelect coords={selectedPosition} />
            )}
          </MapContainer>
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
      </CardContent>
    </Card>
  );
};

export default DeliveryPointMap;
