
export default {
  name: 'orderItem',
  title: 'Itens de Pedido',
  type: 'document',
  fields: [
    {
      name: 'product',
      title: 'Produto',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'quantity',
      title: 'Quantidade',
      type: 'number',
      validation: Rule => Rule.required().min(1),
    },
    {
      name: 'price',
      title: 'Preço',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'size',
      title: 'Tamanho',
      type: 'string',
    },
  ],
  preview: {
    select: {
      productName: 'product.name',
      quantity: 'quantity',
    },
    prepare: ({ productName, quantity }) => {
      return {
        title: productName || 'Produto',
        subtitle: `Quantidade: ${quantity}`,
      };
    },
  },
};
