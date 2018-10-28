module.exports = {

  /**
   * Configure mongodb
   */
  mongo: {
    connections: {
      default: {uri: 'MONGO_CONNECTIONS_DEFAULT'}
    }
  },
  auth: {
    secret: 'AUTH_SECRET',
    oauth: {
      aut: {
        url: 'AUTH_OAUTH_AUT_URL',
        redirect_uri: 'AUTH_OAUTH_AUT_REDIRECT_URL',
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
    endPoint: 'MINIO_ENDPOINT',
    port: 'MINIO_PORT',
    accessKey: 'MINIO_ACCESSKEY',
    secretKey: 'MINIO_SECRETKEY',
    public_url: 'MINIO_PUBLICURL'
  },
  
  zarinpal: {
    merchant_id: 'ZARINPAL_ID',
  },
  
  log: {
    sentry: {
      dsn: 'SENTRY_DSN'
    }
  },

  zarinpal: {
    merchant_id: 'ZARINPAL_ID',
    base_url: 'ZARINPAL_BASEURL'
  },


  //log: {
  //  sentry: {
  //    dsn: null
  //  },
  //  audit: {}
  //},
  policy: {
     policies:''
  }
}
