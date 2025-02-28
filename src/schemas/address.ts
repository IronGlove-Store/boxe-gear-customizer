
export default {
  name: 'address',
  title: 'Endereços',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'ID do Usuário',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'street',
      title: 'Rua',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'city',
      title: 'Cidade',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'postalCode',
      title: 'Código Postal',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'country',
      title: 'País',
      type: 'string',
      initialValue: 'Portugal',
      validation: Rule => Rule.required(),
    },
    {
      name: 'createdAt',
      title: 'Criado em',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'street',
      subtitle: 'city',
    },
  },
};
