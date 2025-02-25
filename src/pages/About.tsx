
import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Sobre a PUGIL</h1>
        
        <section className="space-y-6 mb-12">
          <p className="text-lg text-gray-700">
            A PUGIL é uma marca brasileira especializada em equipamentos de alta qualidade para artes marciais. 
            Nossa missão é fornecer aos atletas e entusiastas os melhores produtos, combinando tecnologia, 
            design e durabilidade.
          </p>
          
          <p className="text-lg text-gray-700">
            Fundada por praticantes de artes marciais, entendemos as necessidades específicas dos atletas 
            e nos dedicamos a criar produtos que atendam aos mais altos padrões de qualidade e desempenho.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Nossa Missão</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-3">Qualidade</h3>
              <p className="text-gray-600">
                Utilizamos os melhores materiais e processos de fabricação para garantir produtos duráveis e confiáveis.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-3">Inovação</h3>
              <p className="text-gray-600">
                Investimos em tecnologia e design para criar produtos que se destacam no mercado.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-3">Sustentabilidade</h3>
              <p className="text-gray-600">
                Comprometidos com práticas sustentáveis em nossa produção e logística.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Contato</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600 mb-4">
              Entre em contato conosco para dúvidas, sugestões ou parcerias:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Email: contato@pugil.com.br</li>
              <li>Telefone: (11) 9999-9999</li>
              <li>Horário: Segunda a Sexta, 9h às 18h</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
