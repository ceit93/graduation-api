const { Model, Schema } = require('@bakjs/mongo')

class Vote extends Model {
  static get $schema () {
    return {
      subjectID: {type:Schema.Types.ObjectId, ref: 'Qualification'},
      candidateID: {type:Schema.Types.ObjectId, ref: 'User'}
    }
  }
}

module.exports = Vote.$model
