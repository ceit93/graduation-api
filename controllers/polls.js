const { Controller } = require('bak')
const { Vote } = require('../models')
const { User } = require('../models')
const { Qualification } = require('../models')
const { TopTarin } = require('../models')
const Boom = require('boom')

class PollsController extends Controller {
  init (){
    this.post('/poll/submit', this.submitPolls)
    this.get('/polls', this.getSavedPollsByUser)
    this.get('/polls/results', this.getAllVoteResults)
    this.get('/polls/tarins', this.getTarins)
    this.get('/polls/{username}', this.getTopTarinsByUser)
  }


  async submitPolls (request, h) {
    try {
      let user = await User.findById(request.user._id)
      let votes = request.payload.votes
      user.votes = votes
      await user.save()
      return user.votes
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getAllVoteResults (request, h) {
    if (request.user.toObject().is_admin) {
      let totalResults = []
      try {
        let targetUsers = await User.find()
        let i = 0
        let users = await User.find()
        for (let targetUser of targetUsers) {
          let voteResults = []
          for (let user of users) {
            for (let vote of user.votes) {
              if (vote.candidate) {
                if (targetUser._id.equals(vote.candidate)) {
                  let voteResult = {}
                  let voter = user
                  voteResult.tarin = vote.qualification.title
                  voteResult.voter = voter.name
                  voteResults.push(voteResult)
                }
              }
            }
          }
          let totalResult = {}
          totalResult.name = targetUser.name
          totalResult.votes = voteResults
          totalResults.push(totalResult)
        }

        return totalResults

      } catch (e) {
        console.log(e)
        throw Boom.badRequest()
      }
    } else {
      return Boom.unauthorized()
    }
  }
  async getTarins (request, h) {
    if (request.user.toObject().is_admin) {
      let totalResults = []
      try {
        let targetUsers = await User.find()
        let qualifications = await Qualification.find({approved: true}).lean()

        let i = 0
        let users = await User.find()
        for (let user of users) {
          for (let vote of user.votes) {
            for (let qualification in qualifications) {
              if (vote.candidate && qualifications[qualification]._id.equals(vote.qualification._id)) {
                for (let targetUser of targetUsers) {
                  if (targetUser._id.equals(vote.candidate)) {
                    if (!qualifications[qualification]['result']) {
                      qualifications[qualification]['result'] = {}
                    }
                    if (qualifications[qualification]['result'][targetUser.name]) {
                      qualifications[qualification]['result'][targetUser.name]++
                    } else {
                      qualifications[qualification]['result'][targetUser.name] = 1
                    }
                    break
                  }
                }
              }
              if (qualifications[qualification]['result']) {
                let winners = [Object.keys(qualifications[qualification]['result'])[0]]
                for (let key in qualifications[qualification]['result'])
                  if (qualifications[qualification]['result'][winners[0]] < qualifications[qualification]['result'][key]) {
                    winners = []
                    winners.push(key)
                  } else if (qualifications[qualification]['result'][winners[0]] == qualifications[qualification]['result'][key] && winners.indexOf(key)== -1) {
                    winners.push(key)
                  }

                qualifications[qualification]['winners'] = winners
              }
            }
          }
        }

        return qualifications

      } catch (e) {
        console.log(e)
        throw Boom.badRequest()
      }
    } else {
      return Boom.unauthorized()
    }
  }

  async getTopTarinsByUser(request, h){
    let username = request.params.username
    let results = []
    try{
      let targetUser = await User.findOne({username:username})
      let users = await User.find()

      let voteResults = []
      for (let user of users) {
        for (let vote of user.votes) {
          if (vote.candidate) {
            if (targetUser._id.equals(vote.candidate)) {
              voteResults.push(vote.qualification._id)
            }
          }
        }
      }
      let voteCounts = []
      let count
      for(let userVote of voteResults) {
        count = voteResults.filter(
          function (id) {
            return id === userVote
          }
        ).length
        let voteCount = {}
        voteCount.id = userVote
        voteCount.count = count
        if (
          (voteCounts.filter(
            function (e) {
              return e.id === userVote
            }
          ).length) === 0
        ) {
          voteCounts.push(voteCount)
        }
      }

      let sorted = voteCounts.sort(function IHaveAName(a, b) {
        return b.count > a.count ?  1
          : b.count < a.count ? -1
            : 0;
      });

      for(let i=0; i<7; i++){
        let result = {}
        let qual = await Qualification.findById(sorted[i].id)
        result.name = qual.title
        result.count = sorted[i].count
        results.push(result)
      }


      return results
    } catch (e){
      console.log(e)
      throw Boom.badRequest()
    }
  }


  async getSavedPollsByUser (request, h) {
    let user
    try {
      user = await User.findById(request.user._id)
      let votes = user.votes.toObject()
      if (!user.locked){
        user.locked = true
        await user.save()
        let quals = await Qualification.find({approved: true})
        // Find the new approved qualification
        for(let i in quals){
          let qual = quals[i]
          let found = false
          for (let j in votes){
            let vote = votes[j]
            if(qual._id.equals(vote.qualification._id))
              found = true
          }
          if (!found){
            let vote = new Vote()
            vote.qualification = qual
            vote.candidate = null
            votes.push(vote)
          }
        }
        user.locked = false
        user.votes = votes
        await user.save()
        return user.votes
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

  async putResultsInCollection(request , h){
    let forbiddenTarins = [
      '5b13d5675f6c8430dc25a0fb',
      '5b178dcdcc274c001a094c5f',
      '5b1932930f1bff001a201d74',
      '5b1e34b8ed40a9001aa33793',
      '5b13d4f55f6c8430dc25a0ee',
      '5b13d4045f6c8430dc25a0d7',
      '5b13d1d25f6c8430dc25a0ab',
      '5b13d25a5f6c8430dc25a0b9',
      '5b13d2bf5f6c8430dc25a0c5',
    ];


    let allUsers = await User.find()
    let partialUsers = allUsers.slice(250,267)
    for(let targetUser of partialUsers) {
      let results = []
      let users = await User.find()
      let voteResults = []
      for (let user of users) {
        for (let vote of user.votes) {
          if (vote.candidate) {
            if (targetUser._id.equals(vote.candidate)) {
              if (!forbiddenTarins.includes(vote.qualification._id)) {
                voteResults.push(vote.qualification._id)
              }
            }
          }
        }
      }
      let voteCounts = []
      let count
      for (let userVote of voteResults) {
        count = voteResults.filter(
          function (id) {
            return id === userVote
          }
        ).length
        let voteCount = {}
        voteCount.id = userVote
        voteCount.count = count
        if (
          (voteCounts.filter(
            function (e) {
              return e.id === userVote
            }
          ).length) === 0
        ) {
          voteCounts.push(voteCount)
        }
      }

      let sorted = voteCounts.sort(function func(a, b) {
        return b.count > a.count ? 1
          : b.count < a.count ? -1
            : 0;
      });

      for (let i = 0; i < 5; i++) {
        let result = {}
        if (sorted.length > i) {
          let qual = await Qualification.findById(sorted[i].id)
          let underlined_title = qual.title.replace(new RegExp(' ', 'g'), "_")
          result.name = underlined_title
          results.push(result)
        }
      }

      user.topTarins = results

      let topTarin = new TopTarin();
      topTarin.user = targetUser._id
      topTarin.topTarins = results
      await topTarin.save()
    }
  }



}

module.exports = PollsController
