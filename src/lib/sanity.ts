
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'your-project-id', // Substitua com seu ID real do Sanity
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03', // Use a data atual ou a versão desejada da API
  token: '', // Você precisará de um token para gravação de dados
});

// Helper para gerar URLs de imagens do Sanity
export const urlFor = (source: any) => {
  return `https://cdn.sanity.io/images/your-project-id/production/${source}`;
};

// Função para buscar todos os documentos de um tipo específico
export async function fetchAllDocuments(type: string) {
  return sanityClient.fetch(`*[_type == "${type}"]{
    ...,
  }`);
}

// Função para buscar um documento específico por ID
export async function fetchDocumentById(type: string, id: string) {
  return sanityClient.fetch(`*[_type == "${type}" && _id == "${id}"][0]`);
}

// Função para buscar pedidos de um usuário específico
export async function fetchOrdersByUserId(userId: string) {
  return sanityClient.fetch(`*[_type == "order" && userId == "${userId}"] | order(createdAt desc)`);
}

// Função para criar um novo documento
export async function createDocument(document: any) {
  return sanityClient.create(document);
}

// Função para atualizar um documento existente
export async function updateDocument(id: string, document: any) {
  return sanityClient.patch(id).set(document).commit();
}
