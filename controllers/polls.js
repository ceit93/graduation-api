const { Controller } = require('bak')
const { Vote } = require('../models')
const { User } = require('../models')
const { Qualification } = require('../models')
const Boom = require('boom')

class PollsController extends Controller {
  init (){
    this.post('/poll/submit', this.submitPolls)
    this.get('/polls', this.getSavedPollsByUser)
    // this.get('/polls/{username}', this.getVotesForUser)
  }


  async submitPolls (request, h) {
    let user = request.user
    let votes = request.payload.data.votes
    // console.log(request.payload.data)
    let votesResults = []

    try {

      for(let v of votes){
        let qualObjectId, candidateObjectId
        if(v.std_numbers) {
          candidateObjectId = v.std_numbers.objectID
        }
        qualObjectId = v._id
        let vote = new Vote()
        vote.candidate = candidateObjectId
        vote.qualification = qualObjectId
        await vote.save()
        votesResults.push(vote)
      }

      user.votes = votesResults
      user.save()

      return votesResults
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  // async getVotesForUser (request, h) {
  //
  //   let voteResults = []
  //
  //   try {
  //     let user = await User.findOne({username:request.params.username})
  //     let allVotes = await Vote.find().populate('candidate')
  //     for(let vote of allVotes){
  //       if(vote.candidate.username === request.params.username){
  //         let tarin = await Qualification.findById(vote.qualification)
  //         voteResults.push(tarin.title)
  //       }
  //     }
  //
  //
  //
  //     return voteResults
  //
  //   } catch (e) {
  //     console.log(e)
  //     throw Boom.badRequest()
  //   }
  // }

  async getSavedPollsByUser (request, h) {

    let voteResults = []
    let user = request.user.populate('votes')

    try {
      // let user = await User.findById(request.user._id).populate('votes')
      for(let voteID of user.votes){
        console.log(voteID)
        let voteResult = {}
        let vote = await Vote.findById(voteID)
        let voteTitle = await Qualification.findById(vote.qualification)
        // voteResult.title = voteQualification.title
        console.log(voteTitle)
      //
      //   let voteCandidate = await User.findById(vote.candidate)
      //   voteResult.username = voteCandidate.username
      //
      //   voteResults.push(voteResult)
      }

      return user

    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }



}

module.exports = PollsController
