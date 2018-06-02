const { Model, Schema } = require('@bakjs/mongo')

class Vote extends Model {
  static get $schema () {
    return {
      candidate: { type: Schema.Types.ObjectId, ref: 'User'},
      qualification: { type: Schema.Types.ObjectId, ref: 'Qualification'}
    }
  }
}

module.exports = Vote.$model
