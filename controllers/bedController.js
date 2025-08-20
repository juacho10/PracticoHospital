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
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al obtener la lista de camas'
    });
  }
};

exports.updateBedStatus = async (req, res) => {
  try {
    const { bedId, status } = req.body;
    await Bed.updateStatus(bedId, status);
    req.flash('success', 'Estado de cama actualizado correctamente');
    res.redirect('/bed/list');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al actualizar el estado de la cama');
    res.redirect('/bed/list');
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
    req.flash('success', 'Cama creada correctamente');
    res.redirect('/bed/list');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al crear la cama: ' + error.message);
    res.redirect('/bed/create');
  }
};

exports.deleteBed = async (req, res) => {
  try {
    await Bed.delete(req.params.id);
    req.flash('success', 'Cama eliminada correctamente');
    res.redirect('/bed/list');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al eliminar la cama: ' + error.message);
    res.redirect('/bed/list');
  }
};