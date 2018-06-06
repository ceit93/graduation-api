import { builtinModules } from "module";

function is_93 (user) {
  if (user.authorized)
    return true

  for (let std_number of std_numbers) {
    if (std_number.match(/^9331[0-9]{3}$/)) {
      return true
    }
  }

  return false
}

function is_author (user, post) {
  if (user._id.equals(post.user)) {
    return true
  }
  return false
}

function has_post (user, post) {
  if (user.posts.indexOf(post._id) != -1) {
    return true
  }
  return false
}

function can_request_wall(user, userWall) {
  return is_93(userWall)
}

function can_delete_post (user, post) {

}

function can_post_wall (user, userWall) {
  return is_93(userWall)
}

function access_results (user) {
  let std_numbers = user.toObject().std_numbers
  for (let std_number of std_numbers) {

  }

}

module.exports = {
  can_post_wall,
  is_93,
  can_request_wall,
  has_post
}
