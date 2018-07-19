const { Model, Schema } = require('@bakjs/mongo')

class TopTarin extends Model {
  static get $schema () {
    return {
      user: {type:Schema.Types.ObjectId, ref: 'User', required: true},
      topTarins: []
    }
  }
}

module.exports = TopTarin.$model
