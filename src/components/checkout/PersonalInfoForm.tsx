
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface PersonalInfoFormProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  onPersonalInfoChange: (field: string, value: string) => void;
}

const PersonalInfoForm = ({ personalInfo, onPersonalInfoChange }: PersonalInfoFormProps) => {
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
          <Input 
            id="phone" 
            value={personalInfo.phone} 
            onChange={(e) => onPersonalInfoChange('phone', e.target.value)}
            placeholder="Ex: 912345678"
            type="tel"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
