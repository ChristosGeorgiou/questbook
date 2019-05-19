import 'zone.js/dist/zone-error';
import { versions } from './versions';

export const environment = {
  production: false,
  database: 'https://db.cgeosoft.com',
  versions: versions,
  funcs: 'http://localhost:8101/.netlify/functions'
};
