class User {
    constructor(id, email, password, confirmPassword) {
      (this.id = id),
        (this.email = email),
        (this.password = password),
        (this.confirmPassword = confirmPassword)
    }
  }
  
  module.exports = User;