const Patient = require('../models/Patient');
const Admission = require('../models/Admission');
const Bed = require('../models/Bed');

exports.registerForm = (req, res) => {
  res.render('admission/register', {
    title: '➕ Registrar Paciente',
    admissionTypes: ['programada', 'emergencia', 'derivacion'],
    formData: null,
    errors: null
  });
};

exports.registerPatient = async (req, res) => {
  try {
    const requiredFields = [
      'dni', 'first_name', 'last_name', 'birth_date',
      'gender', 'admission_type', 'reason'
    ];
    
    const errors = {};
    let hasErrors = false;
    
    requiredFields.forEach(field => {
      if (!req.body[field]?.trim()) {
        errors[field] = `El campo ${field.replace('_', ' ')} es obligatorio`;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      return res.render('admission/register', {
        title: '➕ Registrar Paciente',
        admissionTypes: ['programada', 'emergencia', 'derivacion'],
        formData: req.body,
        errors
      });
    }
    
    const { dni, first_name, last_name, birth_date, gender, address, phone, email, insurance } = req.body;
    
    // Verificar si el paciente ya existe
    const existingPatient = await Patient.findByDni(dni);
    let patientId;
    
    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      // Crear nuevo paciente
      patientId = await Patient.create({
        dni: dni.trim(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        birth_date: new Date(birth_date),
        gender,
        address: address?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        insurance: insurance?.trim() || null
      });
    }
    
    // Crear registro de admisión
    const admissionData = {
      patient_id: patientId,
      admission_date: new Date(),
      admission_type: req.body.admission_type,
      referring_doctor: req.body.referring_doctor?.trim() || null,
      reason: req.body.reason.trim(),
      created_by: req.session.user.id,
      status: 'activa',
      bed_id: null
    };
    
    const admissionId = await Admission.create(admissionData);
    
    // Redirigir a asignación de cama
    req.flash('success', 'Paciente registrado correctamente');
    res.redirect(`/admission/assign-bed/${admissionId}`);
    
  } catch (error) {
    console.error('Error en registerPatient:', error);
    
    if (error.message.includes('duplicate key value')) {
      return res.render('admission/register', {
        title: '➕ Registrar Paciente',
        admissionTypes: ['programada', 'emergencia', 'derivacion'],
        formData: req.body,
        errors: { dni: 'Este DNI ya está registrado' }
      });
    }
    
    res.render('admission/register', {
      title: '➕ Registrar Paciente',
      admissionTypes: ['programada', 'emergencia', 'derivacion'],
      formData: req.body,
      errors: { general: 'Error al registrar paciente' }
    });
  }
};

exports.assignBedForm = async (req, res) => {
  try {
    const admissionId = req.params.id;
    const admission = await Admission.findById(admissionId);
    
    if (!admission) {
      req.flash('error', 'Admisión no encontrada');
      return res.redirect('/admission/list');
    }
    
    const patient = await Patient.findById(admission.patient_id);
    const departments = ['medicina', 'cirugia', 'icu', 'pediatria', 'maternidad'];
    
    // Obtener camas disponibles por departamento
    const availableBeds = {};
    for (const dept of departments) {
      availableBeds[dept] = await Bed.findAvailableByDepartment(dept, patient.gender);
    }
    
    res.render('admission/assignBed', {
      title: '🛏️ Asignar Cama',
      admissionId,
      availableBeds,
      departments,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al cargar el formulario de asignación de cama');
    res.redirect('/admission/list');
  }
};

exports.assignBed = async (req, res) => {
  try {
    const { admissionId, bedId } = req.body;
    await Bed.assignBed(bedId, admissionId);
    req.flash('success', 'Cama asignada correctamente');
    res.redirect('/admission/list');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al asignar cama: ' + error.message);
    res.redirect(`/admission/assign-bed/${admissionId}`);
  }
};

exports.listAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.getAllActive();
    res.render('admission/list', {
      title: '🏥 Pacientes Admitidos',
      admissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al obtener la lista de admisiones'
    });
  }
};

exports.dischargePatient = async (req, res) => {
  try {
    const admissionId = req.params.id;
    await Admission.discharge(admissionId);
    req.flash('success', 'Paciente dado de alta correctamente');
    
    // Actualizar estadísticas de camas
    await Bed.countByStatus();
    
    res.redirect('/admission/list');
  } catch (error) {
    console.error('Error en dischargePatient:', error);
    req.flash('error', `Error al dar de alta: ${error.message}`);
    res.redirect('/admission/list');
  }
};