
export default {
  name: 'profile',
  title: 'Perfis',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'ID do Usuário',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'fullName',
      title: 'Nome Completo',
      type: 'string',
    },
    {
      name: 'avatarUrl',
      title: 'URL do Avatar',
      type: 'url',
    },
    {
      name: 'role',
      title: 'Função',
      type: 'string',
      options: {
        list: [
          { title: 'Usuário', value: 'user' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      initialValue: 'user',
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
      title: 'fullName',
      subtitle: 'email',
    },
  },
};
