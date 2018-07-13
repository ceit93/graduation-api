const { Controller } = require('bak')
const { Interview } = require('../models')
const { Question } = require('../models')
const { User } = require('../models')
const Boom = require('boom')

class InterviewsController extends Controller {
  init() {
    this.post('/questions', this.createQuestion)
    this.get('/questions', this.getQuestions, {
      auth: {mode: 'try'}
    })
    this.post('/interviews/{question}/submit', this.submitInterviews)
    this.get('/interviews', this.getInterviews)
    this.post('/interviews', this.updateInBulk)
  }

  async submitInterviews (request, h) {
    let answer = request.payload.answer
    try {
      let found = false
      let user = await User.findById(request.user._id).populate('interviews')
      let question = await Question.findById(request.params.question)
      if (question.approved) {
        for (let interview in user.toObject().interviews) {
          if (user.interviews[interview].question.equals(question._id)) {
            interview = await Interview.findById(user.interviews[interview]._id)
            interview.answer = answer
            await interview.save()
            found = true
            break
          }
        }
        if (!found) {
          let interview = new Interview({
            question: question._id,
            answer: answer
          })
          await interview.save()
          user.interviews.push(interview)
        }
      }
      await user.save()
      return { saved: true }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async getQuestions (request, h) {
    try {
      let questions = await Question.find({approved: true})
      return { questions }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getInterviews(request, h) {
    try {
      let user = await User.findById(request.user._id).populate('interviews')
      user = user.toObject()
      for (let interview in user.interviews) {
        user.interviews[interview].question = await Question.findById(user.interviews[interview].question)
      }
      return user
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async updateInBulk(request, h) {
    let user = await User.findById(request.user._id).populate('interviews')
    try {
      let found = false
      let interviews = request.payload.interviews
      for (let interview in interviews) {
        if (interviews[interview]._id) {
          let interviewInDB = await Interview.findById(interviews[interview]._id)
          interviewInDB.answer = interviews[interview].answer
          await interviewInDB.save()
        } else {
          let question = await Question.findById(interviews[interview].question._id)
          if (question.approved) {
            for (let userInterview in user.toObject().interviews) {
              if (user.interviews[userInterview].question.equals(question._id)) {
                let interviewInDB = await Interview.findById(user.interviews[userInterview]._id)
                interviewInDB.answer = interviews[interview].answer
                await interviewInDB.save()
                found = true
                break
              }
            }
            if (!found) {
              let interviewInDB = new Interview({
                question: question._id,
                answer: interviews[interview].answer
              })
              await interviewInDB.save()
              user.interviews.push(interviewInDB)
            }
          }
        }
      }
      await user.save()
      return { saved: true }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async createQuestion(request, h) {
    try {
      let question = request.payload.question
      question = new Question({
        approved: false,
        text: question
      })

      await question.save()

      return {question}

    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

}

module.exports = InterviewsController
