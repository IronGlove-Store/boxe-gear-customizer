
export default {
  name: 'product',
  title: 'Produtos',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{type: 'category'}],
      validation: Rule => Rule.required(),
    },
    {
      name: 'price',
      title: 'Preço',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'originalPrice',
      title: 'Preço Original',
      type: 'number',
    },
    {
      name: 'imageUrl',
      title: 'URL da Imagem',
      type: 'url',
    },
    {
      name: 'color',
      title: 'Cor',
      type: 'string',
    },
    {
      name: 'size',
      title: 'Tamanho',
      type: 'string',
    },
    {
      name: 'rating',
      title: 'Classificação',
      type: 'number',
      validation: Rule => Rule.min(0).max(5),
    },
    {
      name: 'reviewsCount',
      title: 'Número de Avaliações',
      type: 'number',
      validation: Rule => Rule.min(0),
    },
    {
      name: 'createdAt',
      title: 'Criado em',
      type: 'datetime',
      validation: Rule => Rule.required(),
    },
    {
      name: 'updatedAt',
      title: 'Atualizado em',
      type: 'datetime',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'imageUrl',
    },
  },
};
