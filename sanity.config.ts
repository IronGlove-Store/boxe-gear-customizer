
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import schemas from './src/schemas';

export default defineConfig({
  name: 'default',
  title: 'Gym Equipment Store',
  
  projectId: 'tqd9ays1',
  dataset: 'production',
  
  plugins: [deskTool()],
  
  schema: {
    types: schemas,
  },
  
  basePath: '/admin',
});
