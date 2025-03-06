
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface PersonalInfoFormProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  onPersonalInfoChange: (field: string, value: string) => void;
}

const COUNTRY_CODES = [
  { code: "+351", country: "Portugal" },
  { code: "+55", country: "Brasil" },
  { code: "+34", country: "Espanha" },
  { code: "+33", country: "França" },
  { code: "+44", country: "Reino Unido" },
  { code: "+1", country: "EUA/Canadá" },
  { code: "+49", country: "Alemanha" },
  { code: "+39", country: "Itália" },
];

const PersonalInfoForm = ({ personalInfo, onPersonalInfoChange }: PersonalInfoFormProps) => {
  const [countryCode, setCountryCode] = useState("+351"); // Default: Portugal
  
  // Função para lidar com mudanças no número de telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover todos os caracteres não numéricos
    let phoneNumber = e.target.value.replace(/\D/g, '');
    
    // Limitar a 9 dígitos (padrão português)
    phoneNumber = phoneNumber.substring(0, 9);
    
    // Atualizar o valor do telefone no estado do componente pai
    onPersonalInfoChange('phone', phoneNumber);
  };
  
  // Função para atualizar o código do país
  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    
    // Se o usuário mudar o código do país, preservamos o número atual
    // e atualizamos o formato de armazenamento (código+número)
    const phoneNumber = personalInfo.phone.replace(/\D/g, '').substring(0, 9);
    onPersonalInfoChange('phone', phoneNumber);
  };
  
  // Função para formatação visual do número conforme digita
  const formatPhone = (phone: string) => {
    if (!phone) return '';
    
    // Formato português: XXX XXX XXX
    if (phone.length <= 3) {
      return phone;
    } else if (phone.length <= 6) {
      return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    } else {
      return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium mb-1 block">
            Nome
          </label>
          <Input 
            id="firstName" 
            value={personalInfo.firstName} 
            onChange={(e) => onPersonalInfoChange('firstName', e.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="text-sm font-medium mb-1 block">
            Sobrenome
          </label>
          <Input 
            id="lastName" 
            value={personalInfo.lastName} 
            onChange={(e) => onPersonalInfoChange('lastName', e.target.value)}
            placeholder="Seu sobrenome"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="text-sm font-medium mb-1 block">
            Telefone
          </label>
          <div className="flex gap-2">
            <div className="w-1/3">
              <Select value={countryCode} onValueChange={handleCountryCodeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="+351" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input 
                id="phone" 
                value={formatPhone(personalInfo.phone)} 
                onChange={handlePhoneChange}
                placeholder="912 345 678"
                type="tel"
                required
                pattern="[0-9]{9}"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Ex: 912 345 678</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
