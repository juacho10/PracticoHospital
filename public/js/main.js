document.addEventListener('DOMContentLoaded', function() {
  // Mejorar validación de formularios
  const validateForm = (form) => {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        
        if (!field.nextElementSibling?.classList.contains('invalid-feedback')) {
          const errorMsg = document.createElement('div');
          errorMsg.classList.add('invalid-feedback');
          
          if (field.id === 'password') {
            errorMsg.textContent = 'La contraseña es obligatoria';
          } else if (field.id === 'confirm_password') {
            errorMsg.textContent = 'Por favor confirme la contraseña';
          } else {
            const label = form.querySelector(`label[for="${field.id}"]`);
            errorMsg.textContent = label ? `${label.textContent} es obligatorio` : 'Este campo es obligatorio';
          }
          
          field.parentNode.appendChild(errorMsg);
        }
        
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
        if (field.nextElementSibling?.classList.contains('invalid-feedback')) {
          field.nextElementSibling.remove();
        }
      }
    });

    // Validación de contraseñas coincidentes
    if (form.querySelector('#password') && form.querySelector('#confirm_password')) {
      const password = form.querySelector('#password').value;
      const confirmPassword = form.querySelector('#confirm_password').value;
      
      if (password !== confirmPassword) {
        const confirmField = form.querySelector('#confirm_password');
        confirmField.classList.add('is-invalid');
        
        if (!confirmField.nextElementSibling?.classList.contains('invalid-feedback')) {
          const errorMsg = document.createElement('div');
          errorMsg.classList.add('invalid-feedback');
          errorMsg.textContent = 'Las contraseñas no coinciden';
          confirmField.parentNode.appendChild(errorMsg);
        }
        
        isValid = false;
      }
    }

    return isValid;
  };

  // Aplicar validación a todos los formularios
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
        
        // Mostrar alerta general si no existe
        if (!this.querySelector('.alert.alert-danger')) {
          const alert = document.createElement('div');
          alert.classList.add('alert', 'alert-danger', 'mt-3');
          alert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Error:</strong> Por favor complete todos los campos obligatorios correctamente.
          `;
          this.prepend(alert);
          
          // Desplazarse al primer error
          const firstInvalid = this.querySelector('.is-invalid');
          if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalid.focus();
          }
          
          setTimeout(() => alert.remove(), 5000);
        }
      }
    });

    // Validación en tiempo real
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', function() {
        if (this.value.trim()) {
          this.classList.remove('is-invalid');
          if (this.nextElementSibling?.classList.contains('invalid-feedback')) {
            this.nextElementSibling.remove();
          }
        }
      });
    });
  });

  // Confirmación para acciones importantes
  document.querySelectorAll('.btn-danger, .delete-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (!confirm('¿Está seguro que desea realizar esta acción? Esta operación no se puede deshacer.')) {
        e.preventDefault();
      }
    });
  });

  // Mejorar experiencia en selects
  document.querySelectorAll('select').forEach(select => {
    select.addEventListener('focus', function() {
      this.style.backgroundColor = '#f8f9fa';
    });
    
    select.addEventListener('blur', function() {
      this.style.backgroundColor = '';
    });
  });

  // Tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Auto-ocultar alertas después de 5 segundos
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.add('fade');
      setTimeout(() => alert.remove(), 150);
    }, 5000);
  });

  // Mejorar tablas responsivas
  if (window.innerWidth < 768) {
    document.querySelectorAll('table').forEach(table => {
      const headers = [].slice.call(table.querySelectorAll('th'));
      const rows = [].slice.call(table.querySelectorAll('tbody tr'));
      
      headers.forEach((header, index) => {
        const text = header.textContent.trim();
        rows.forEach(row => {
          const cell = row.children[index];
          if (cell) {
            cell.setAttribute('data-label', text);
          }
        });
      });
    });
  }
});

// Funciones utilitarias globales
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function formatDateTime(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}