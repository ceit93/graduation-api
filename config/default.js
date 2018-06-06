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
        url: 'https://account.aut.ac.ir/api/oauth',
        redirect_uri: 'https://ceit93.ir/login',
        client_id: 'AUTH_OAUTH_AUT_CLIENT_ID',
        client_secret: 'AUTH_OAUTH_AUT_CLIENT_SECRET'
      },
      google: {
        url: 'AUTH_OAUTH_GOOGLE_URL',
        redirect_uri: ' AUTH_OAUTH_GOOGLE_REDIRECT_URL',
        client_id: 'AUTH_OAUTH_GOOGLE_CLIENT_ID',
        client_secret: 'AUTH_OAUTH_GOOGLE_CLIENT_SECRET'
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
  },
  policy: {
    // policies:''
  }
}
