
import { useEffect } from "react";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { Studio } from "sanity";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import schemas from "../schemas";

const Admin = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se o usuário está autenticado e tem permissão de admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (!isSignedIn) {
        navigate("/auth");
        return;
      }

      // Verificar se o nome do usuário é "admin"
      if (user?.fullName !== "admin" && user?.username !== "admin") {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel de administração.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
    }

    checkAdminStatus();
  }, [isSignedIn, navigate, user, toast]);

  if (!isSignedIn) {
    return <div className="p-8">Redirecionando para autenticação...</div>;
  }

  // Verificar permissão de admin no render também para evitar flash de conteúdo
  if (user?.fullName !== "admin" && user?.username !== "admin") {
    return <div className="p-8">Sem permissão para acessar esta página.</div>;
  }

  // Configuração do Sanity Studio
  const config = defineConfig({
    name: "default",
    title: "Gym Equipment Store Admin",
    projectId: "tqd9ays1",
    dataset: "production",
    plugins: [deskTool()],
    schema: {
      types: schemas,
    },
    basePath: "/admin",
  });

  return (
    <div className="min-h-screen">
      <Studio config={config} />
    </div>
  );
};

export default Admin;
