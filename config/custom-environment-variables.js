module.exports = {

  auth: {
    secret: 'AUTH_SECRET',
    oauth: {
      aut: {
        url: 'AUTH_OAUTH_AUT_URL',
        redirect_uri: ' AUTH_OAUTH_AUT_REDIRECT_URL',
        client_id: 'AUTH_OAUTH_AUT_CLIENT_ID',
        client_secret: 'AUTH_OAUTH_AUTH_CLIENT_SECRET'
      }
    }
  },

  mongo: {
    connections: {
      default: {uri: 'MONGO_CONNECTIONS_DEFAULT'}
    }
  },

  haho: {
    url: 'MQTT_HOST'
  },

  minio: {
    endPoint: 'MINIO_ENDPOINT',
    port: 'MINIO_PORT',
    accessKey: 'MINIO_ACCESSKEY',
    secretKey: 'MINIO_SECRETKEY',
    public_url: 'MINIO_PUBLICURL'
  },

  log: {
    sentry: {
      dsn: 'SENTRY_DSN'
    }
  }

}
