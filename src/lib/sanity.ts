
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'tqd9ays1',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
  token: '', // Você precisará de um token para gravação de dados
});

// Configure o builder de URL de imagem
const builder = imageUrlBuilder(sanityClient);

// Helper para gerar URLs de imagens do Sanity
export const urlFor = (source: any) => {
  if (!source) return '';
  try {
    return builder.image(source).url();
  } catch (error) {
    console.error('Erro ao gerar URL da imagem:', error);
    return '';
  }
};

// Define types for our Sanity documents
export interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  color?: string;
  size?: string;
  rating?: number;
  reviewsCount?: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SanityCategory {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  createdAt?: string;
}

// Função para buscar todos os documentos de um tipo específico
export async function fetchAllDocuments<T>(type: string): Promise<T[]> {
  try {
    return await sanityClient.fetch(`*[_type == "${type}"]{
      ...,
    }`);
  } catch (error) {
    console.error(`Erro ao buscar documentos do tipo ${type}:`, error);
    return [];
  }
}

// Função para buscar produtos com referência à categoria
export async function fetchProducts(): Promise<SanityProduct[]> {
  try {
    return await sanityClient.fetch(`
      *[_type == "product"]{
        _id,
        name,
        slug,
        description,
        price,
        originalPrice,
        imageUrl,
        color,
        size,
        rating,
        reviewsCount,
        "category": category->name,
        createdAt,
        updatedAt
      }
    `);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

// Função para buscar um documento específico por ID
export async function fetchDocumentById<T>(type: string, id: string): Promise<T | null> {
  try {
    return await sanityClient.fetch(`*[_type == "${type}" && _id == "${id}"][0]`);
  } catch (error) {
    console.error(`Erro ao buscar documento ${id} do tipo ${type}:`, error);
    return null;
  }
}

// Função para buscar pedidos de um usuário específico
export async function fetchOrdersByUserId(userId: string): Promise<any[]> {
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

// Função para buscar categorias
export async function fetchCategories(): Promise<SanityCategory[]> {
  try {
    return await sanityClient.fetch(`
      *[_type == "category"]{
        _id,
        name,
        slug,
        description,
        createdAt
      }
    `);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}
