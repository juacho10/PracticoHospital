document.addEventListener('DOMContentLoaded', function() {
  // Validación de formularios
  const validateForm = (form) => {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
          if (!field.value.trim()) {
              field.classList.add('is-invalid');
              isValid = false;
              
              if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                  const errorMsg = document.createElement('div');
                  errorMsg.classList.add('invalid-feedback');
                  errorMsg.textContent = 'Este campo es obligatorio';
                  field.parentNode.appendChild(errorMsg);
              }
          } else {
              field.classList.remove('is-invalid');
              if (field.nextElementSibling && field.nextElementSibling.classList.contains('invalid-feedback')) {
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
              
              if (!confirmField.nextElementSibling || !confirmField.nextElementSibling.classList.contains('invalid-feedback')) {
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

  // Aplicar a todos los formularios
  document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
          if (!validateForm(this)) {
              e.preventDefault();
              
              // Mostrar alerta general
              if (!this.querySelector('.alert.alert-danger')) {
                  const alert = document.createElement('div');
                  alert.classList.add('alert', 'alert-danger');
                  alert.innerHTML = '<strong>Error:</strong> Por favor complete todos los campos obligatorios correctamente.';
                  this.prepend(alert);
                  
                  setTimeout(() => alert.remove(), 5000);
              }
          }
      });

      // Validación en tiempo real
      form.querySelectorAll('[required]').forEach(field => {
          field.addEventListener('input', function() {
              if (this.value.trim()) {
                  this.classList.remove('is-invalid');
                  if (this.nextElementSibling && this.nextElementSibling.classList.contains('invalid-feedback')) {
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
});