const pool = require('../config/database');
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
        console.log('Datos del formulario:', req.body);
        
        // Campos obligatorios
        const requiredFields = [
            'dni', 
            'first_name', 
            'last_name', 
            'birth_date', 
            'gender', 
            'admission_type', 
            'reason'
        ];
        
        // Validar campos requeridos
        const errors = {};
        let hasErrors = false;
        
        requiredFields.forEach(field => {
            if (!req.body[field] || !req.body[field].trim()) {
                errors[field] = `El campo ${field.replace('_', ' ')} es obligatorio`;
                hasErrors = true;
            }
        });
        
        // Validar formato de fecha
        if (req.body.birth_date && isNaN(new Date(req.body.birth_date).getTime())) {
            errors.birth_date = 'Fecha de nacimiento no válida';
            hasErrors = true;
        }
        
        if (hasErrors) {
            return res.render('admission/register', {
                title: '➕ Registrar Paciente',
                admissionTypes: ['programada', 'emergencia', 'derivacion'],
                formData: req.body,
                errors
            });
        }
        
        const { 
            dni, 
            first_name, 
            last_name, 
            birth_date, 
            gender, 
            address, 
            phone, 
            email, 
            insurance 
        } = req.body;
        
        // Verificar si el paciente ya existe
        const existingPatient = await Patient.findByDni(dni);
        let patientId;
        
        if (existingPatient) {
            patientId = existingPatient.id;
            console.log(`Paciente existente encontrado con ID: ${patientId}`);
        } else {
            // Crear nuevo paciente
            patientId = await Patient.create({
                dni: dni.trim(),
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                birth_date: new Date(birth_date),
                gender,
                address: address ? address.trim() : null,
                phone: phone ? phone.trim() : null,
                email: email ? email.trim() : null,
                insurance: insurance ? insurance.trim() : null
            });
            console.log(`Nuevo paciente creado con ID: ${patientId}`);
        }
        
        // Crear registro de admisión
        const admissionData = {
            patient_id: patientId,
            admission_date: new Date(),
            admission_type: req.body.admission_type,
            referring_doctor: req.body.referring_doctor ? req.body.referring_doctor.trim() : null,
            reason: req.body.reason.trim(),
            created_by: req.session.user.id,
            status: 'activa'
        };
        
        const admissionId = await Admission.create(admissionData);
        console.log(`Admisión creada con ID: ${admissionId}`);
        
        // Redirigir a asignación de cama
        res.redirect(`/admission/assign-bed/${admissionId}`);
        
    } catch (error) {
        console.error('Error en registerPatient:', error);
        
        // Manejar error de DNI duplicado
        if (error.code === 'ER_DUP_ENTRY' || error.message.includes('Duplicate entry')) {
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
            errors: { general: 'Error al registrar paciente: ' + error.message }
        });
    }
};

exports.assignBedForm = async (req, res) => {
    try {
        const admissionId = req.params.id;
        const admission = await Admission.findById(admissionId);
        if (!admission) {
            return res.status(404).send('Admisión no encontrada');
        }

        const [patient] = await pool.query('SELECT gender FROM patients WHERE id = ?', [admission.patient_id]);
        const departments = ['medicina', 'cirugia', 'icu', 'pediatria', 'maternidad'];
        const availableBeds = {};

        for (const dept of departments) {
            availableBeds[dept] = await Bed.findAvailableByDepartment(dept, patient[0].gender);
        }

        res.render('admission/assignBed', {
            title: '🛏️ Asignar Cama',
            admissionId,
            availableBeds,
            departments
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el formulario de asignación de cama');
    }
};

exports.assignBed = async (req, res) => {
    try {
        const { admissionId, bedId } = req.body;
        await Bed.assignBed(bedId, admissionId);
        res.redirect('/admission/list');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al asignar cama');
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
        res.status(500).send('Error al obtener la lista de admisiones');
    }
};

exports.dischargePatient = async (req, res) => {
    try {
        const admissionId = req.params.id;
        await Admission.discharge(admissionId);
        
        const [admission] = await pool.query('SELECT bed_id FROM admissions WHERE id = ?', [admissionId]);
        if (admission[0].bed_id) {
            await Bed.freeBed(admission[0].bed_id);
        }
        
        res.redirect('/admission/list');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al dar de alta al paciente');
    }
};