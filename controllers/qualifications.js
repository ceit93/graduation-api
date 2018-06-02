const { Controller } = require('bak')
const { Qualification } = require('../models')
const Boom = require('boom')

class QualificationsController extends Controller {
  init() {
    this.post('/qualification/create', this.createQualification)
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
    let subject = request.payload.subject
    console.log(subject)
    try{
      let qualifications = await Qualification.find()
      let isNewTarin = true
      for(let qual of qualifications){
        if(qual.title === subject){
          isNewTarin = false
        }
      }
      if(isNewTarin){
        let newQualification = new Qualification()
        newQualification.title = subject
        newQualification.approved = true
        await newQualification.save()
      }
      return qualifications
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }


}

module.exports = QualificationsController