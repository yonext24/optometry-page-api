/* eslint-disable n/handle-callback-err */
const { auth, db } = require('./firebase')
const { getUserByEmail, getDoctorTemplate, getPatientTemplate } = require('./utils')

module.exports = {
  async createUser (req, res, next) {
    const { email, password, nombre, apellido, role, active } = req.body

    const collection = role === 'admin'
      ? 'admins'
      : role === 'doctor'
        ? 'doctors'
        : 'patients'

    const existsAuth = await auth.getUserByEmail(email).catch(() => false)
    const existsFirestore = await getUserByEmail(collection, email)

    console.log({ existsAuth, existsFirestore })

    try {
      // Si la cuenta de Auth no existe hay que crearla
      if (!existsAuth) {
        console.log('El usuario no existe')
        const user = await auth.createUser({
          email,
          emailVerified: false,
          password,
          displayName: nombre
        })
        await auth.setCustomUserClaims(user.uid, { role })

        // Si el documento en firestore existe, no se crea y se devuelve el que ya existe
        if (existsFirestore) return res.status(200).json(existsFirestore)

        const template = role === 'admin'
          ? { role, email, nombre, apellido, photo: '' }
          : role === 'doctor'
            ? getDoctorTemplate({ email, role, nombre, apellido })
            : getPatientTemplate({ email, role, nombre, apellido, active })

        const docRef = db.collection(collection).doc()
        await docRef.set(template)
        const userFromFirestore = await docRef.get()
          .then((doc) => {
            return doc.data()
          })

        return res.status(200).json(userFromFirestore)
      }

      if (existsFirestore) return res.status(200).json(existsFirestore)

      const template = role === 'admin'
        ? { role, email, nombre, apellido }
        : role === 'doctor'
          ? getDoctorTemplate({ email, role, nombre, apellido })
          : getPatientTemplate({ email, role, nombre, apellido, active })

      try {
        const docRef = db.collection(collection).doc()
        await docRef.set(template)
        const userFromFirestore = await docRef.get()
          .then((doc) => {
            return doc.data()
          })

        return res.status(200).json(userFromFirestore)
      } catch (err) {
        console.log({ err })
        return res.status(404).json({ error: 'Error al crear el usuario.' })
      }
    } catch (err) {
      console.log(err)
      return res.status(404).json({ error: 'Error al crear el usuario' })
    }
  }
}
