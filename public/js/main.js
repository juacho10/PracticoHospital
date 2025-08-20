document.addEventListener('DOMContentLoaded', function() {
  // Validación de formularios
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          isValid = false;
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
    
    // Validación en tiempo real
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', function() {
        if (this.value.trim()) {
          this.classList.remove('is-invalid');
        }
      });
    });
  });

  // Confirmación para acciones importantes
  document.querySelectorAll('.btn-danger, .delete-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (!confirm('¿Está seguro que desea realizar esta acción?')) {
        e.preventDefault();
      }
    });
  });

  // Auto-ocultar alertas después de 5 segundos
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.add('fade');
      setTimeout(() => alert.remove(), 150);
    }, 5000);
  });

  // Búsqueda de pacientes en el formulario de admisión
  const searchPatientBtn = document.getElementById('searchPatientBtn');
  if (searchPatientBtn) {
    searchPatientBtn.addEventListener('click', function() {
      const container = document.getElementById('patientSearchContainer');
      container.classList.toggle('d-none');
    });
  }

  const patientSearchBtn = document.getElementById('patientSearchBtn');
  if (patientSearchBtn) {
    patientSearchBtn.addEventListener('click', async function() {
      const dni = document.getElementById('patientSearchInput').value.trim();
      const resultsContainer = document.getElementById('patientSearchResults');
      
      if (!dni) {
        showMessage('Por favor ingrese un DNI para buscar', 'warning', resultsContainer);
        return;
      }
      
      try {
        showMessage('<div class="spinner-border spinner-border-sm me-2"></div> Buscando paciente...', 'info', resultsContainer);
        
        const response = await fetch(`/patient/api/search?dni=${dni}`);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error en la búsqueda');
        }
        
        const data = await response.json();
        
        if (data.patient) {
          autocompleteForm(data.patient);
          showMessage(`Paciente encontrado: ${data.patient.last_name}, ${data.patient.first_name}`, 'success', resultsContainer);
        } else {
          showMessage('No se encontró paciente con ese DNI', 'info', resultsContainer);
        }
      } catch (error) {
        console.error('Error:', error);
        showMessage(error.message || 'Error al buscar paciente', 'danger', resultsContainer);
      }
    });
  }

  // Funciones auxiliares
  function showMessage(message, type = 'info', container) {
    const alertTypes = {
      'success': { class: 'alert-success', icon: 'check-circle' },
      'danger': { class: 'alert-danger', icon: 'times-circle' },
      'warning': { class: 'alert-warning', icon: 'exclamation-triangle' },
      'info': { class: 'alert-info', icon: 'info-circle' }
    };
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertTypes[type].class} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      <i class="fas fa-${alertTypes[type].icon} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    container.innerHTML = '';
    container.appendChild(alertDiv);
  }

  function autocompleteForm(patient) {
    const fields = {
      'dni': patient.dni || '',
      'first_name': patient.first_name || '',
      'last_name': patient.last_name || '',
      'birth_date': patient.birth_date ? patient.birth_date.split('T')[0] : '',
      'gender': patient.gender || 'M',
      'address': patient.address || '',
      'phone': patient.phone || '',
      'email': patient.email || '',
      'insurance': patient.insurance || ''
    };
    
    for (const [id, value] of Object.entries(fields)) {
      const field = document.getElementById(id);
      if (field) {
        field.value = value;
      }
    }
  }
});