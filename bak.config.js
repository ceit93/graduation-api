const Config = require('config')

module.exports = {
  prefix: '/api',
  routes: [
    './controllers/posts',
    './controllers/qualifications',
    './controllers/polls',
    './controllers/users',
    './controllers/notifications',
    './controllers/interviews'
  ],
  registrations: [
    '@bakjs/mongo',
    '@bakjs/audit',
    '@bakjs/auth',
    '@bakjs/policy'
  ],
  mongo: Config.get('mongo'),
  auth: Config.get('auth'),
  minio: Config.get('minio'),
  policy: Config.get('policy')
}
