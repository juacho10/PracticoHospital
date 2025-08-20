const Patient = require('../models/Patient');

exports.listPatients = async (req, res) => {
  try {
    const patients = await Patient.getAll();
    res.render('patient/list', {
      title: '👥 Lista de Pacientes',
      patients
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al obtener la lista de pacientes'
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Paciente no encontrado'
      });
    }
    
    res.render('patient/edit', {
      title: '✏️ Editar Paciente',
      patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el formulario de edición'
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    await Patient.update(req.params.id, req.body);
    req.flash('success', 'Paciente actualizado correctamente');
    res.redirect('/patient/list');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al actualizar el paciente: ' + error.message);
    res.redirect(`/patient/edit/${req.params.id}`);
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.delete(req.params.id);
    req.flash('success', 'Paciente eliminado correctamente');
    res.redirect('/patient/list');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al eliminar el paciente: ' + error.message);
    res.redirect('/patient/list');
  }
};