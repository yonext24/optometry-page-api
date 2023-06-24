const { db } = require('./firebase')

const getPatientTemplate = ({ email, nombre, apellido, photo, role, active, deberes, historia_clinica }) => {
  return {
    email,
    nombre,
    apellido,
    photo: photo || '',
    role,
    active: active || true,
    deberes: deberes || {},
    historia_clinica: historia_clinica || {}
  }
}
const getDoctorTemplate = ({ email, role, nombre, apellido, photo, pacientes_asignados }) => {
  return {
    email, photo: photo || '', role, nombre, apellido, pacientes_asignados: pacientes_asignados || {}
  }
}

module.exports = {
  async getUserByEmail (collection, email) {
    return db.collection(collection).where('email', '==', email).limit(1).get()
      .then(docs => {
        if (docs.empty) return false
        const parsedDocs = docs.docs

        return parsedDocs[0].data()
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  },
  getDoctorTemplate,
  getPatientTemplate
}
