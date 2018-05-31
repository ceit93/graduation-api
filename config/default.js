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
    user_model: require('../models/user'),
    oauth: {
      aut: {
        url: 'AUTH_OAUTH_AUT_URL',
        redirect_uri: ' AUTH_OAUTH_AUT_REDIRECT_URL',
        client_id: 'AUTH_OAUTH_AUT_CLIENT_ID',
        client_secret: 'AUTH_OAUTH_AUTH_CLIENT_SECRET'
      }
    }
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
