function validatePassword({password, confirmPassword}) {
  if (!password){
    return [400, "Password is required"]
  }

  if (!confirmPassword) {
    return [400, "Password Confirmation is required"]
  }

  if (password.length < 8){
    return [403, "Password must have atleast 8 characters"]
  }

  if (password !== confirmPassword) {
    return [403, "Passwords don't match"]
  }

  return [200, ""]
}

module.exports = {validatePassword}