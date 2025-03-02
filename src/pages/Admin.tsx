
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  PlusCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const Admin = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

      // Fetch initial data
      fetchProducts();
      fetchOrders();
    }

    checkAdminStatus();
  }, [isSignedIn, navigate, user, toast]);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return <div className="p-8">Redirecionando para autenticação...</div>;
  }

  // Verificar permissão de admin no render também para evitar flash de conteúdo
  if (user?.fullName !== "admin" && user?.username !== "admin") {
    return <div className="p-8">Sem permissão para acessar esta página.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Painel de Administração</h1>
          <p className="text-gray-500 mt-1">Gerencie seus produtos, pedidos e configurações</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-auto">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden md:inline">Produtos</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden md:inline">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Produtos</h2>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Produtos ({products.length})</CardTitle>
                <CardDescription>Lista de todos os produtos disponíveis na loja</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">Carregando produtos...</div>
                ) : products.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    Nenhum produto encontrado
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {/* Renderizar lista de produtos quando tiver dados */}
                    <div className="text-center p-4 text-gray-500">
                      Produtos serão exibidos aqui após integração com Supabase
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Pedidos</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recentes ({orders.length})</CardTitle>
                <CardDescription>Últimos pedidos realizados na loja</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">Carregando pedidos...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    Nenhum pedido encontrado
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {/* Renderizar lista de pedidos quando tiver dados */}
                    <div className="text-center p-4 text-gray-500">
                      Pedidos serão exibidos aqui após integração com Supabase
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>Gerencie seus clientes e suas informações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 text-gray-500">
                  Lista de clientes será exibida aqui após integração com Clerk
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Loja</CardTitle>
                <CardDescription>Gerencie as configurações gerais da loja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Stripe</h3>
                    <p className="text-sm text-gray-500">
                      Configure a integração com o Stripe para processamento de pagamentos
                    </p>
                    <Button variant="outline" className="mt-2">
                      Configurar Stripe
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Clerk</h3>
                    <p className="text-sm text-gray-500">
                      Configure as opções de autenticação com Clerk
                    </p>
                    <Button variant="outline" className="mt-2">
                      Configurar Clerk
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
