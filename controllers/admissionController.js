const pool = require('../config/database');
const Patient = require('../models/Patient');
const Admission = require('../models/Admission');
const Bed = require('../models/Bed');

exports.registerForm = (req, res) => {
    res.render('admission/register', {
        title: '➕ Registrar Paciente',
        admissionTypes: ['programada', 'emergencia', 'derivacion'],
        formData: null
    });
};

exports.registerPatient = async (req, res) => {
    try {
        const requiredFields = ['dni', 'first_name', 'last_name', 'birth_date', 'gender', 'admission_type', 'reason'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.render('admission/register', {
                    title: '➕ Registrar Paciente',
                    error: `El campo ${field.replace('_', ' ')} es obligatorio`,
                    admissionTypes: ['programada', 'emergencia', 'derivacion'],
                    formData: req.body
                });
            }
        }

        const { dni, first_name, last_name, birth_date, gender, address, phone, email, insurance } = req.body;
        const existingPatient = await Patient.findByDni(dni);
        let patientId;

        if (existingPatient) {
            patientId = existingPatient.id;
        } else {
            patientId = await Patient.create({
                dni, first_name, last_name, birth_date, gender,
                address, phone, email, insurance
            });
        }

        const admissionId = await Admission.create({
            patient_id: patientId,
            admission_date: new Date(),
            admission_type: req.body.admission_type,
            referring_doctor: req.body.referring_doctor,
            reason: req.body.reason,
            created_by: req.session.user.id
        });

        res.redirect(`/admission/assign-bed/${admissionId}`);
    } catch (error) {
        console.error(error);
        res.render('admission/register', {
            title: '➕ Registrar Paciente',
            error: 'Error al registrar paciente',
            admissionTypes: ['programada', 'emergencia', 'derivacion'],
            formData: req.body
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