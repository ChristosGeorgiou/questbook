import 'zone.js/dist/zone-error';
import { versions } from './versions';

export const environment = {
  production: false,
  database: 'http://localhost:5984/',
  versions: versions
};
