const { Controller } = require('bak')
const { Vote } = require('../models')
const Boom = require('boom')

class VotesController extends Controller {
  init() {
    this.post('/votes/submit', this.createVote)
  }

  async createVote (request, h) {
    let vote
    try {
      vote = new Vote(request.payload)
      await vote.save()
      return vote
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }


}

module.exports = VotesController