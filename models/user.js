const {Model} = require('@bakjs/mongo')
const Auth = require('@bakjs/auth')
const { Schema } = require('@bakjs/mongo')


class User extends Auth.User {
  static get $visible() {
    return ['_id', 'name', 'email', 'username', 'posts', 'votes', 'std_numbers','avatar', 'gender', 'authorized']
  }

  static get $schema () {
    return Object.assign({}, Auth.User.$schema, {
      posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
      avatar: String,
      votes: [],
      locked: Boolean,
      gender: String,
      authorized: Boolean
    })
  }
}

module.exports = User.$model
