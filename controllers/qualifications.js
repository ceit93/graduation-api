const { Controller } = require('bak')
const { Qualification } = require('../models')
const { User } = require('../models')
const Boom = require('boom')

class QualificationsController extends Controller {
  init() {
    this.post('/qualification/create', this.createQualification)
    this.get('/qualifications', this.showAllQualifications)
    this.get('/qualifications/nonapproved', this.showPendingQualifications)
  }

  async showAllQualifications (request, h) {
    let quals
    let { limit, skip } = request.query || {}
    try {
      quals = Qualification.find({ approved: true })
      quals.limit(parseInt(limit) || 200)
      quals.skip(parseInt(skip) || 0)
      quals = await quals
      return { quals }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async showPendingQualifications (request, h) {
    let quals
    let results = []
    try {
      quals = await Qualification.find({ approved: false})
      for(let qual of quals){
        let result = {}
        result.tarin = qual.title
        result.approved = qual.approved
        let creator = await User.findById(qual.creator)
        if(creator) {
          result.creator = creator.name
        }
        results.push(result)
      }
      return { results }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async createQualification (request, h) {
    let subject = request.payload.subject
    let user = request.user
    try{
      let qualifications = await Qualification.find()
      let isNewTarin = true
      for (let qual of qualifications) {
        if (qual.title === subject) {
          isNewTarin = false
        }
      }
      if (isNewTarin) {
        let newQualification = new Qualification()
        newQualification.title = subject
        newQualification.approved = false
        newQualification.creator = user._id
        console.log(user._id)
        await newQualification.save()
        request.audit('SUBMIT_QUALIFICATION', newQualification)
      }
      return qualifications
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }


}

module.exports = QualificationsController
