const admin = require('firebase-admin')
const credentials = require('./credentials.json')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp({
  credential: admin.credential.cert(credentials)
})

const auth = admin.auth()
const db = getFirestore()

// Middleware para verificar la autenticación del usuario
const verifyUserAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]

  if (!token) {
    // El token no está presente en la solicitud
    return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' })
  }

  try {
    const decodedToken = await auth.verifyIdToken(token)
    const admin = await auth.getUser(decodedToken.uid)
      .then((user) => {
        return user.customClaims.role === 'admin'
      })

    if (!admin) throw new Error('Not admin')
    req.user = decodedToken

    return next()
  } catch (error) {
    console.error('Error al verificar el token de autenticación:', error)
    return res.status(403).json({ message: 'El token de autenticación no es válido.' })
  }
}

module.exports = {
  db,
  auth,
  verifyUserAuth
}
