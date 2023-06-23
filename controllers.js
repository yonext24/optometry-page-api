const { auth, db } = require("./firebase")
const { getUserByEmail } = require("./utils")

module.exports = {
  async createUser (req, res, next) {
    const { email, password, username, role } = req.body

    let existsAuth
    let existsFirestore

    const collection = role === 'admin'
    ? 'admins'
    : role === 'doctor' ? 'doctors'
    : 'patient'

    existsAuth = getUserByEmail(email)
    .then(res => true)
    .catch(err => false)
    existsFirestore = getUserByEmail(collection, user.email)
    .then(res => true)
    .catch(err => false)
    
    try {
      if (!existsAuth) {
        const user = await auth.createUser({
          email,
          emailVerified: false,
          password,
          displayName: username,
        })
        await auth.setCustomUserClaims(user.uid, { role })


        if (existsFirestore) return res.status(200).json(user.toJSON())

        await db.collection(collection).add({
          photo: '',
          role
        })


      }

      return res.status(200).json(user.toJSON())
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'Error al crear el usuario' })
  }
    

  }
}