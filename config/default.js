module.exports = {

  /**
   * Configure mongodb
   */
  mongo: {
    connections: {
      default: {uri: 'mongodb://localhost:27017/ceit93'}
    }
  },
  auth: {
    secret: 'secret',
    user_model: require('../models/user')
  },

  minio: {
    endPoint: '',
    port: '',
    accessKey: '',
    secretKey: '',
    public_url: ''
  },

  log: {
    sentry: {
      dsn: null
    },
    audit: {}
  }
}
