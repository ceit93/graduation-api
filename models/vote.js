const { Model, Schema } = require('@bakjs/mongo')

class Vote extends Model {
  static get $schema () {
    return {
      voter: {type:Schema.Types.ObjectId, ref: 'User'},
      candidate: {type:Schema.Types.ObjectId, ref: 'User'}
    }
  }
}

module.exports = Vote.$model
