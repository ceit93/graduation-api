const Config = require('config')

module.exports = {
  prefix: '/api',
  routes: [
    './controllers/posts',
    './controllers/polls',
    './controllers/qualifications',
    './controllers/users'
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
