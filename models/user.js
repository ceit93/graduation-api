const {Model} = require('@bakjs/mongo')
const Auth = require('@bakjs/auth')
const {Schema} = require('@bakjs/mongo')

const registerSchema = new Schema({
  selfPayed: {type: Boolean},
  family: {type: Number},
  cost: {type: Number},
  Authority: {type: String},
  phone: {type: String},
  email: {type: String},
  status: {type: Boolean}
})

class User extends Auth.User {
  static get $visible() {
    return ['_id', 'name', 'email', 'username', 'posts', 'votes', 'std_numbers','avatar', 'gender', 'authorized', 'interviews', 'is_admin', 'modified_name','addFamily', 'grad_photo']
  }

  static get $schema() {
    return Object.assign({}, Auth.User.$schema, {
      posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
      avatar: String,
      votes: [],
      topTarins: [],
      registration: registerSchema,
      modified_name: String,
      interviews: [{type: Schema.Types.ObjectId, ref: 'Interview'}],
      locked: Boolean,
      gender: String,
      authorized: Boolean,
      modified: String,
      addFamily: [],
    })
  }
}

module.exports = User.$model
