
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'tqd9ays1',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
  token: '', // Você precisará de um token para gravação de dados
});

// Helper para gerar URLs de imagens do Sanity
export const urlFor = (source: any) => {
  if (!source) return '';
  return `https://cdn.sanity.io/images/tqd9ays1/production/${source}`;
};

// Função para buscar todos os documentos de um tipo específico
export async function fetchAllDocuments(type: string) {
  try {
    return await sanityClient.fetch(`*[_type == "${type}"]{
      ...,
    }`);
  } catch (error) {
    console.error(`Erro ao buscar documentos do tipo ${type}:`, error);
    return [];
  }
}

// Função para buscar um documento específico por ID
export async function fetchDocumentById(type: string, id: string) {
  try {
    return await sanityClient.fetch(`*[_type == "${type}" && _id == "${id}"][0]`);
  } catch (error) {
    console.error(`Erro ao buscar documento ${id} do tipo ${type}:`, error);
    return null;
  }
}

// Função para buscar pedidos de um usuário específico
export async function fetchOrdersByUserId(userId: string) {
  try {
    return await sanityClient.fetch(`*[_type == "order" && userId == "${userId}"] | order(createdAt desc)`);
  } catch (error) {
    console.error(`Erro ao buscar pedidos do usuário ${userId}:`, error);
    return [];
  }
}

// Função para criar um novo documento
export async function createDocument(document: any) {
  try {
    return await sanityClient.create(document);
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    throw error;
  }
}

// Função para atualizar um documento existente
export async function updateDocument(id: string, document: any) {
  try {
    return await sanityClient.patch(id).set(document).commit();
  } catch (error) {
    console.error(`Erro ao atualizar documento ${id}:`, error);
    throw error;
  }
}
