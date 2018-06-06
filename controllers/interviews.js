const { Controller } = require('bak')
const { Interview } = require('../models')
const { Question } = require('../models')
const { User } = require('../models')
const Boom = require('boom')

class InterviewsController extends Controller {
  init() {
    this.get('/interviews', this.getSavedInterviewsByUser)
    this.post('/interviews/submit', this.submitInterviews)
  }

  async submitInterviews (request, h) {
    try {
      let user = await User.findById(request.user._id)
      let interviews = request.payload.interviews
      user.interviews = interviews
      await user.save()
      return { saved: true }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getSavedInterviewsByUser (request, h) {
    let user
    try {
      user = await User.findById(request.user._id)
      let userInterviews = user.interviews.toObject()
      if (!user.locked){
        user.locked = true
        await user.save()
        let questions = await Question.find({approved: true})
        // Find the new approved question
        for(let q of questions){
          let found = false
          for (let interview of userInterviews){
            if(q._id.equals(interview.question._id))
              found = true
          }
          if (!found){
            console.log(i + ': NOT FOUND')
            let newInterview = new Interview()
            newInterview.question = q
            newInterview.answer = ''
            userInterviews.push(newInterview)
          }
        }
        user.locked = false
        user.interviews = userInterviews
        await user.save()
        return user.interviews
      } else {
        throw Boom.badRequest()
      }
    } catch (e) {
      console.log(e)
      user.locked = false
      await user.save()
      throw Boom.badRequest()
    }
  }

}

module.exports = InterviewsController
