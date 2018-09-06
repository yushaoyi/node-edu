'use strict';

import auth from './auth';
import student from './students'
import admin from './admin'

const API_PREFIX = '/api'

export default app => {
  app.use((API_PREFIX + '/admin'), admin);
  app.use((API_PREFIX + '/auth'), auth);
  app.use((API_PREFIX + '/student'), student);
}