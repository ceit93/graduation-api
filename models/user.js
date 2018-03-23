const {Model} = require('@bakjs/mongo')
const Auth = require('@bakjs/auth')

class User extends Auth.User {
  static get $schema () {
    return Object.assign({}, Auth.User.$schema)
  }
}

module.exports = User.$model
