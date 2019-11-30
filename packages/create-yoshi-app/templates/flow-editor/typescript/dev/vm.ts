import { Engine } from 'velocity';

import velocityData from '../velocity.data.json';
import velocityDataPrivate from '../velocity.private.data.json';

export default (url: string, data = {}) =>
  new Engine({ template: url }).render({
    ...velocityData,
    ...velocityDataPrivate,
    ...data,
  });
