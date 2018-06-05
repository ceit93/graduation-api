const { Model, Schema } = require('@bakjs/mongo')

class Post extends Model {
  static get $schema () {
    return {
      title: String,
      body: String,
      image: String,
      date: String,
      approved: Boolean,
      user: {type:Schema.Types.ObjectId, ref: 'User', required: true}
    }
  }
}

module.exports = Post.$model
