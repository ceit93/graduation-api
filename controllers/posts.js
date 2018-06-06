const { Controller } = require('bak')
const { Post, User } = require('../models')
const Boom = require('boom')
const { upload, url } = require('@bakjs/minio')

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
    // request.authorize('is_93')
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
    // request.authorize('is_93')
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
    // request.authorize('is_93')
    let post
    let image = request.payload.image
    delete request.payload.image

    try {
      post = new Post(request.payload)
      post.user = request.user._id
      post.approved = true
      await post.save()
      if (image instanceof Buffer) {
        image = await upload('posts', post._id + '.jpg', image, 'image/jpeg')
        image = url('posts', post._id + '.jpg', image, 'image/jpeg')
      }
      post.image = image
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
    let userWall = await User.findById(request.params.user)
    // request.authorize('can_post_wall', userWall)
    let post

    let image = request.payload.image
    delete request.payload.image

    try {
      post = new Post(request.payload)
      if (image instanceof Buffer) {
        image = await upload('posts', post._id + '.jpg', image, 'image/jpeg')
        image = url('posts', post._id + '.jpg', post.img, 'image/jpeg')
      }
      post.user = request.user._id
      post.approved = false
      post.image = image
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
    let userWall = await User.findById(request.params.user)
    // request.authorize('can_post_wall', userWall)
    let post = request.params.post
    let approved = request.payload ? (request.payload.data ? request.payload.data.approved : null) : null

    try {
      let toBeUpdatedPost = await Post.findById(post)
      if (request.user._id.equals(toBeUpdatedPost.user)) {
        if (request.payload.data.approved)
          delete request.payload.data.approved
        toBeUpdatedPost.set(request.payload.data)
        if (request.payload.image instanceof Buffer) {
          toBeUpdatedPost.image = await upload('posts', item._id + '.jpg', image, 'image/jpeg')
          toBeUpdatedPost.image = url('posts', item._id + '.jpg', item.img, 'image/jpeg')
        }
        await toBeUpdatedPost.save()
      }
      if (request.user.posts.indexOf(post) !== -1) {
        toBeUpdatedPost.approved = approved
        await toBeUpdatedPost.save()
      }
      // return { updated: true }
      return {toBeUpdatedPost}
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async deletePost (request, h) {
    let post = request.params.post

    try {
      let toBeDeletedPost = await Post.findById(post)
      if (request.user._id.equals(toBeDeletedPost.user)) {
        let user = await User.findOne({posts: post})
        for (let post in user.posts) {
          if (user.posts[post].equals(toBeDeletedPost._id)) {
            user.posts.splice(post, 1)
            break
          }
        }
        await user.save()
        post = await Post.findByIdAndRemove(post)
        return { deleted: true }
      } else {
        return Boom.unauthorized()
      }

    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }
}

module.exports = PostsController
