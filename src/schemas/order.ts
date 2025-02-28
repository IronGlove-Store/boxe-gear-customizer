
export default {
  name: 'order',
  title: 'Pedidos',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'ID do Usuário',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pendente', value: 'pending' },
          { title: 'Processando', value: 'processing' },
          { title: 'Concluído', value: 'completed' },
          { title: 'Cancelado', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
      validation: Rule => Rule.required(),
    },
    {
      name: 'totalAmount',
      title: 'Valor Total',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'paymentMethod',
      title: 'Método de Pagamento',
      type: 'string',
      options: {
        list: [
          { title: 'Cartão', value: 'card' },
          { title: 'Cartão de Teste', value: 'test_card' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'shippingMethod',
      title: 'Método de Envio',
      type: 'reference',
      to: [{ type: 'shipping' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'address',
      title: 'Endereço',
      type: 'reference',
      to: [{ type: 'address' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'items',
      title: 'Itens do Pedido',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'orderItem' }] }],
    },
    {
      name: 'createdAt',
      title: 'Criado em',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    },
    {
      name: 'updatedAt',
      title: 'Atualizado em',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: '_id',
      subtitle: 'status',
    },
    prepare: ({ title, subtitle }) => {
      return {
        title: `Pedido #${title.substring(0, 8)}`,
        subtitle: `Status: ${subtitle}`,
      };
    },
  },
};
