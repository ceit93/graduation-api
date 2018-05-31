const { Controller } = require('bak')
const { Qualification } = require('../models')
const Boom = require('boom')

class QualificationsController extends Controller {
  init() {
    this.post('/qualifications/submit', this.createQualification)
    this.get('/qualifications', this.showAllQualifications)
  }

  async showAllQualifications (request, h) {
    let quals
    try {
      quals = await Qualification.find()
      return { quals }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async createQualification (request, h) {
    let qual
    try {
      qual = new Qualification(request.payload)
      await qual.save()
      return qual
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }


}

module.exports = QualificationsController