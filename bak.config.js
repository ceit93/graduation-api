const Config = require('config')

module.exports = {
  prefix: '/api',
  routes: [
    './controllers/posts',
    './controllers/qualifications',
    './controllers/notifications',
    './controllers/polls',
    './controllers/users',
    './controllers/notifications'
  ],
  registrations: [
    '@bakjs/mongo',
    '@bakjs/audit',
    '@bakjs/auth'
  ],
  mongo: Config.get('mongo'),
  auth: Config.get('auth'),
  minio: Config.get('minio')
}
