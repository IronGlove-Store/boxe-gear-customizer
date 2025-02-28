
import { useEffect } from "react";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { Studio } from "sanity";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import schemas from "../schemas";

const Admin = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  // Verificar se o usuário está autenticado e tem permissão de admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (!isSignedIn) {
        navigate("/auth");
        return;
      }

      // Aqui você pode adicionar uma verificação para garantir que apenas admins possam acessar
      // Por exemplo, verificar se o usuário tem a role "admin" no Sanity
    }

    checkAdminStatus();
  }, [isSignedIn, navigate]);

  if (!isSignedIn) {
    return <div className="p-8">Redirecionando para autenticação...</div>;
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
