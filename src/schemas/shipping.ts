
export default {
  name: 'shipping',
  title: 'Métodos de Envio',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'price',
      title: 'Preço',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'estimatedDays',
      title: 'Dias Estimados',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'isTest',
      title: 'É Teste',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
    },
  },
};
