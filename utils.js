const { db } = require("./firebase")

module.exports = {
  async getUserByEmail (collection, email) {
    return db.collection(collection).where('email', '==', email)
  }
}