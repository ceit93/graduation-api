module.exports = {

  auth: {
    secret: 'AUTH_SECRET',
    client: {
      client_secret: 'AUTH_CLIENT_SECRET'
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
