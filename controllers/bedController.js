const Bed = require('../models/Bed');

exports.listBeds = async (req, res) => {
    try {
        const beds = await Bed.getAll();
        res.render('bed/list', {
            title: '🛏️ Gestión de Camas',
            beds,
            bedStatuses: ['disponible', 'ocupada', 'en_mantenimiento'],
            departments: ['medicina', 'cirugia', 'icu', 'pediatria', 'maternidad']
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la lista de camas');
    }
};

exports.updateBedStatus = async (req, res) => {
    try {
        const { bedId, status } = req.body;
        await Bed.updateStatus(bedId, status);
        res.redirect('/bed/list');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el estado de la cama');
    }
};

exports.createBedForm = (req, res) => {
    res.render('bed/create', {
        title: '➕ Agregar Nueva Cama',
        departments: ['medicina', 'cirugia', 'icu', 'pediatria', 'maternidad']
    });
};

exports.createBed = async (req, res) => {
    try {
        await Bed.create(req.body);
        res.redirect('/bed/list');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la cama');
    }
};

exports.deleteBed = async (req, res) => {
    try {
        await Bed.delete(req.params.id);
        res.redirect('/bed/list');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la cama');
    }
};