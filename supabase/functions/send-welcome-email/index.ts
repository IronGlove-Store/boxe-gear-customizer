
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Bem-vindo à nossa loja!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Bem-vindo à Nossa Loja!</h1>
          
          <div style="text-align: center; margin: 20px 0;">
            <img src="https://images.pexels.com/photos/6296058/pexels-photo-6296058.jpeg" 
                alt="Produtos em Destaque" 
                style="max-width: 100%; border-radius: 8px;">
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Olá ${name || "cliente"},
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Obrigado por se inscrever em nossa newsletter! Estamos animados para compartilhar
            nossas últimas ofertas e produtos com você.
          </p>
          
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #333; font-weight: bold;">Como agradecimento, aqui está um cupom de 10% de desconto:</p>
            <p style="margin: 10px 0 0; font-size: 24px; text-align: center; color: #e63946; font-weight: bold;">BEMVINDO10</p>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Visite nossa loja hoje mesmo e descubra produtos incríveis para seu esporte favorito!
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
            <p>© 2024 Nossa Loja de Esportes. Todos os direitos reservados.</p>
            <p>Se você não deseja mais receber nossos emails, <a href="#" style="color: #999;">clique aqui</a>.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Erro ao enviar email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email enviado com sucesso", 
        data 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro no serviço de email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
