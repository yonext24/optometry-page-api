const { db } = require('./firebase')

const getPatientTemplate = ({ email, nombre, apellido, image, role, active, deberes, historia_clinica, medico_asignado, documento }) => {
  return {
    email,
    nombre,
    apellido,
    image: image || '',
    role,
    documento: documento || '',
    active: active || true,
    deberes: deberes || {},
    medico_asignado: medico_asignado || null,
    historia_clinica: historia_clinica || {}
  }
}
const getDoctorTemplate = ({ email, role, nombre, apellido, image, pacientes_asignados }) => {
  return {
    email, image: image || '', role, nombre, apellido, pacientes_asignados: pacientes_asignados || []
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
