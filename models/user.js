const {Model} = require('@bakjs/mongo')
const Auth = require('@bakjs/auth')
const {Schema} = require('@bakjs/mongo')

const registerSchema = new Schema({
  selfPayed: {type: Boolean},
  family: {type: Number, required: true},
  cost: {type: Number, required: true},
  Authority: {type: String},
  phone: {type: String, required: true},
  email: {type: String, required: true},
  status: {type: Boolean}
})

class User extends Auth.User {
  static get $visible() {
    return ['_id', 'name', 'email', 'username', 'posts', 'votes', 'std_numbers', 'avatar', 'gender', 'authorized']
  }

  static get $schema() {
    return Object.assign({}, Auth.User.$schema, {
      posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
      avatar: String,
      votes: [],
      registration: registerSchema,
      locked: Boolean,
      gender: String,
      authorized: Boolean
    })
  }
}

module.exports = User.$model
