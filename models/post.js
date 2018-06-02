const { Model, Schema } = require('@bakjs/mongo')

class Post extends Model {
  static get $schema () {
    return {
      title: String,
      body: String,
      images: [String],
      user: {type:Schema.Types.ObjectId, ref: 'User', required: true}
    }
  }
}

module.exports = Post.$model
