
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
  PlusCircle,
  Edit,
  Trash
} from "lucide-react";

// Interfaces para os dados
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  shipping_method: string;
  shipping_days: string;
  user_id?: string;
}

// Mock data inicial
const initialProducts: Product[] = [
  {
    id: "prod_1",
    name: "Sapatos de Corrida",
    description: "Sapatos leves e confortáveis para corrida",
    price: 89.99,
    category: "calçados",
    image_url: "/placeholder.svg",
    created_at: new Date().toISOString()
  },
  {
    id: "prod_2",
    name: "Camiseta Sports",
    description: "Camiseta respirável para prática esportiva",
    price: 29.99,
    category: "roupas",
    image_url: "/placeholder.svg",
    created_at: new Date().toISOString()
  }
];

const initialOrders: Order[] = [
  {
    id: "ord_1",
    status: "completed",
    total_amount: 119.98,
    created_at: new Date().toISOString(),
    payment_method: "card",
    shipping_method: "Entrega Padrão",
    shipping_days: "3-5 dias úteis"
  }
];

const Admin = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state para adicionar/editar produto
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image_url: "/placeholder.svg"
  });
  
  // Verificar se o usuário está autenticado e tem permissão de admin
  useEffect(() => {
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

    // Carregar dados do localStorage ou usar dados iniciais
    loadData();
  }, [isSignedIn, navigate, user, toast]);

  // Carregar dados do localStorage
  const loadData = () => {
    setIsLoading(true);
    try {
      // Carregar produtos
      const storedProducts = localStorage.getItem('admin_products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // Se não existir, usar dados iniciais e salvar
        setProducts(initialProducts);
        localStorage.setItem('admin_products', JSON.stringify(initialProducts));
      }
      
      // Carregar pedidos
      const storedOrders = localStorage.getItem('admin_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        // Se não existir, usar dados iniciais e salvar
        setOrders(initialOrders);
        localStorage.setItem('admin_orders', JSON.stringify(initialOrders));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados. Usando dados padrão.",
        variant: "destructive",
      });
      
      // Em caso de erro, usar dados iniciais
      setProducts(initialProducts);
      setOrders(initialOrders);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Salvar produtos no localStorage
  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };
  
  // Salvar pedidos no localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    localStorage.setItem('admin_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };
  
  // Adicionar novo produto
  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    const newProduct: Product = {
      id: "prod_" + Date.now(),
      created_at: new Date().toISOString(),
      ...productForm
    };
    
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    
    // Resetar formulário
    setProductForm({
      name: "",
      description: "",
      price: 0,
      category: "",
      image_url: "/placeholder.svg"
    });
    
    toast({
      title: "Sucesso",
      description: "Produto adicionado com sucesso!",
    });
  };
  
  // Editar produto
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category || "",
      image_url: product.image_url || "/placeholder.svg"
    });
  };
  
  // Salvar edição de produto
  const handleSaveEdit = () => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? { ...editingProduct, ...productForm } 
        : p
    );
    
    saveProducts(updatedProducts);
    
    // Resetar estado de edição
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: 0,
      category: "",
      image_url: "/placeholder.svg"
    });
    
    toast({
      title: "Sucesso",
      description: "Produto atualizado com sucesso!",
    });
  };
  
  // Excluir produto
  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    saveProducts(updatedProducts);
    
    toast({
      title: "Sucesso",
      description: "Produto excluído com sucesso!",
    });
  };
  
  // Atualizar status do pedido
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    );
    
    saveOrders(updatedOrders);
    
    toast({
      title: "Sucesso",
      description: `Status do pedido atualizado para: ${newStatus}`,
    });
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
              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    description: "",
                    price: 0,
                    category: "",
                    image_url: "/placeholder.svg"
                  });
                }}
              >
                <PlusCircle className="h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>
            
            {/* Formulário para adicionar/editar produto */}
            <Card>
              <CardHeader>
                <CardTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
                <CardDescription>
                  {editingProduct 
                    ? `Editando: ${editingProduct.name}`
                    : 'Preencha os detalhes para adicionar um novo produto'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome*</label>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <textarea 
                      className="w-full p-2 border rounded"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Preço*</label>
                    <input 
                      type="number"
                      className="w-full p-2 border rounded"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded"
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                    />
                  </div>
                  <div className="mt-2">
                    <Button 
                      onClick={editingProduct ? handleSaveEdit : handleAddProduct}
                      className="mr-2"
                    >
                      {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
                    </Button>
                    {editingProduct && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: "",
                            description: "",
                            price: 0,
                            category: "",
                            image_url: "/placeholder.svg"
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Nome</th>
                          <th className="px-4 py-2 text-left">Preço</th>
                          <th className="px-4 py-2 text-left">Categoria</th>
                          <th className="px-4 py-2 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id} className="border-b">
                            <td className="px-4 py-2">{product.name}</td>
                            <td className="px-4 py-2">€{product.price.toFixed(2)}</td>
                            <td className="px-4 py-2">{product.category}</td>
                            <td className="px-4 py-2 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">ID</th>
                          <th className="px-4 py-2 text-left">Data</th>
                          <th className="px-4 py-2 text-left">Total</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => {
                          const date = new Date(order.created_at);
                          const formattedDate = date.toLocaleDateString('pt-PT');
                          
                          return (
                            <tr key={order.id} className="border-b">
                              <td className="px-4 py-2">#{order.id.substring(0, 8)}</td>
                              <td className="px-4 py-2">{formattedDate}</td>
                              <td className="px-4 py-2">€{order.total_amount.toFixed(2)}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {order.status === 'completed' ? 'Concluído' : 
                                  order.status === 'processing' ? 'Em processamento' :
                                  order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right">
                                <select 
                                  className="p-1 border rounded text-sm"
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                >
                                  <option value="pending">Pendente</option>
                                  <option value="processing">Em Processamento</option>
                                  <option value="completed">Concluído</option>
                                  <option value="cancelled">Cancelado</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
                <div className="text-center p-4">
                  <p className="text-gray-500 mb-4">
                    As informações dos clientes estão sendo gerenciadas pelo Clerk.
                  </p>
                  <p className="text-sm text-gray-400">
                    Acesse o dashboard do Clerk para gerenciar usuários.
                  </p>
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
                  
                  <div>
                    <h3 className="font-medium mb-2">Armazenamento Local</h3>
                    <p className="text-sm text-gray-500">
                      Gerenciar dados armazenados localmente
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => {
                        localStorage.removeItem('admin_products');
                        localStorage.removeItem('admin_orders');
                        localStorage.removeItem('latestOrder');
                        loadData();
                        toast({
                          title: "Dados resetados",
                          description: "Os dados locais foram resetados para os valores padrão.",
                        });
                      }}
                    >
                      Resetar Dados
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
