class User {
    constructor(id, email, password,  active) {
      (this.id = id),
        (this.email = email),
        (this.password = password),
        (this.active = active)
    }
  }
  
  module.exports = User;