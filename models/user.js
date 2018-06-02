const {Model} = require('@bakjs/mongo')
const Auth = require('@bakjs/auth')
const { Schema } = require('@bakjs/mongo')


class User extends Auth.User {
  static get $visible() {
    return ['_id', 'name', 'email', 'username', 'scope', 'posts', 'votes']
  }

  static get $schema () {
    return Object.assign({}, Auth.User.$schema, {
      posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
      votes: [{type:Schema.Types.ObjectId, ref: 'Vote'}]
    })
  }
}

module.exports = User.$model
