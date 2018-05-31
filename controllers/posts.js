const { Controller } = require('bak')
const { Post, User } = require('../models')
const Boom = require('boom')

class PostsController extends Controller {
  init () {
    this.get('/posts', this.showAllPosts)
    this.get('/posts/wall', this.showAllWall)
    this.post('/posts/wall/{user}', this.createPostWall)
    this.get('/posts/{post}', this.showPost)
    this.post('/posts/{post}', this.updatePost)
    this.post('/posts', this.createPost)
    this.delete('/posts/{post}', this.deletePost)
  }

  async showAllPosts (request, h) {
    try {
      let user = await User.findById(request.user._id).populate('posts')
      let posts = []
      for (let post of user.posts) {
        if (post.user.equals(request.user._id)) {
          posts.push(post)
        }
      }


      return { posts }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async showAllWall(request, h) {
    try {
      let user = await User.findById(request.user._id).populate('posts')
      let posts = []
      for (let post of user.posts) {
        if (!post.user.equals(request.user._id)) {
          posts.push(post)
        }
      }


      return { posts }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async showPost (request, h) {
    let post = request.params.post

    try {
      post = await Post.findById(post)
      if (post) {
        return post
      } else {
        return Boom.notFound()
      }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async createPost (request, h) {
    let post

    try {
      post = new Post(request.payload)
      post.user = request.user._id
      await post.save()
      let user = await User.findById(request.user._id)
      user.posts.push(post)
      await user.save()
      return post
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async createPostWall (request, h) {
    let post
    try {
      post = new Post(request.payload)
      post.user = request.user._id
      await post.save()
      let user = await User.findById(request.params.user)
      user.posts.push(post)
      await user.save()
      return post
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async updatePost (request, h) {
    let post = request.params.post

    try {
      post = await Post.findById(post)
      post.set(request.payload)
      await post.save()
      return { updated: true }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async deletePost (request, h) {
    let post = request.params.post

    try {
      post = await Post.findByIdAndRemove(post)
      return { deleted: true }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }
}

module.exports = PostsController
