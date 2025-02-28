
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import schemas from './src/schemas';

export default defineConfig({
  name: 'default',
  title: 'Gym Equipment Store',
  
  projectId: 'tqd9ays1',
  dataset: 'production',
  
  plugins: [deskTool(), visionTool()],
  
  schema: {
    types: schemas,
  },
  
  basePath: '/admin',
});
