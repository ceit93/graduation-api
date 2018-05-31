const { Model, Schema } = require('@bakjs/mongo')

class Notification extends Model {
  static get $schema () {
    return {
      title: String,
      message: String,
      type: String,
      approved: boolean
    }
  }
}

module.exports = Notification.$model
