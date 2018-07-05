const { Controller } = require('bak')
const { Notification } = require('../models')
const Boom = require('boom')

class NotificationsController extends Controller {
  init () {
    this.get('/notifications', this.showAllNotifications)
    // this.post('/notifications', this.createNotification)
    // this.delete('/notifications/{notification}', this.deleteNotification)
  }

  async showAllNotifications (request, h) {
    let notifications
    try {
      notifications = await Notification.find()
      return { notifications }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async createNotification (request, h) {
    let notification

    try {
      notification = new Notification(request.payload)
      await notification.save()
      return notification
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async deleteNotification (request, h) {
    let notification = request.params.notification

    try {
      notification = await Notification.findByIdAndRemove(notification)
      return { deleted: true }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }
}

module.exports = NotificationsController
