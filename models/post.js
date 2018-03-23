const {Model, Schema} = require('@bakjs/mongo')

class Post extends Model {
  static get $schema () {
    return {
      title: String,
      body: String,
      images: [String],
      user: {type:S Schema.Types.ObjectId, ref: 'User', required: true}
    }
  }
}

module.exports = Post.$model
