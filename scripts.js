document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const mostrarBtn = document.getElementById('mostrarDatosBtn');
  const ocultarBtn = document.getElementById('ocultarDatosBtn');
  const listaDiv = document.getElementById('lista-ingresos');
  const listaUl = document.getElementById('ingresos-ul');
  
  // Elementos específicos para bienvenida.html
  const userMenu = document.getElementById('userMenu');
  const userMenuBtn = document.getElementById('userMenuBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // VALIDACIÓN DE FORMULARIOS (para index.html y login.html)
  if (form) {
    form.addEventListener('submit', function (e) {
      const usuario = form.usuario?.value.trim();
      const numeroDocumento = form.numeroDocumento?.value.trim();
      const tipoDocumento = form.tipoDocumento?.value?.trim();
      const habitacion = form.habitacion?.value?.trim();
      const servicio = form.servicio?.value?.trim();

      // Validación base
      if (!usuario || !numeroDocumento) {
        e.preventDefault();
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor completa los campos obligatorios.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#f57c00'
        });
        return;
      }

      if (!/^\d+$/.test(numeroDocumento)) {
        e.preventDefault();
        Swal.fire({
          icon: 'error',
          title: 'Documento inválido',
          text: 'El número de documento debe ser numérico.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#d33'
        });
        return;
      }

      const ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];

      // Si es login.html (no tiene habitación ni servicio)
      if (!tipoDocumento && !habitacion && !servicio) {
        const existe = ingresos.some(i =>
          i.usuario === usuario && i.numeroDocumento === numeroDocumento
        );

        if (!existe) {
          e.preventDefault();
          Swal.fire({
            icon: 'error',
            title: 'Usuario no registrado',
            text: 'Por favor regístrate primero.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33'
          });
          return;
        }

        // Guardar datos del usuario logueado para mostrar en bienvenida
        const usuarioLogueado = ingresos.find(i =>
          i.usuario === usuario && i.numeroDocumento === numeroDocumento
        );
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioLogueado));
        return; // Login válido, dejar enviar
      }

      // Si es index.html (registro), verificar duplicados
      const yaExiste = ingresos.some(i =>
        i.usuario === usuario && i.numeroDocumento === numeroDocumento
      );

      if (yaExiste) {
        e.preventDefault();
        Swal.fire({
          icon: 'warning',
          title: 'Ya registrado',
          text: 'Este usuario ya ha sido registrado anteriormente.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#f57c00'
        });
        return;
      }

      // Crear objeto de ingreso
      const nuevoIngreso = {
        usuario,
        numeroDocumento,
        fecha: new Date().toLocaleString()
      };

      if (tipoDocumento && habitacion && servicio) {
        nuevoIngreso.tipoDocumento = tipoDocumento;
        nuevoIngreso.habitacion = habitacion;
        nuevoIngreso.servicio = servicio;
      }

      ingresos.push(nuevoIngreso);
      localStorage.setItem('ingresos', JSON.stringify(ingresos));
      // Guardar también como usuario actual para bienvenida
      localStorage.setItem('usuarioActual', JSON.stringify(nuevoIngreso));
      // formulario se envía normalmente
    });
  }

  // MOSTRAR DATOS DE USUARIOS
  if (mostrarBtn && ocultarBtn) {
    mostrarBtn.addEventListener('click', function () {
      // Si estamos en bienvenida.html, mostrar solo datos del usuario actual
      if (window.location.pathname.includes('bienvenida.html')) {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        const datosDiv = document.getElementById('lista-ingresos') || document.getElementById('datosUsuario');
        
        if (usuarioActual && datosDiv) {
          datosDiv.innerHTML = `
            <div style="padding: 10px; background: #f0f0f0; border-radius: 5px; margin-top: 10px;">
              <strong>Usuario:</strong> ${usuarioActual.usuario}<br>
              <strong>Número de documento:</strong> ${usuarioActual.numeroDocumento}<br>
              ${usuarioActual.tipoDocumento ? `<strong>Tipo de documento:</strong> ${usuarioActual.tipoDocumento}<br>` : ''}
              ${usuarioActual.habitacion ? `<strong>Habitación:</strong> ${usuarioActual.habitacion}<br>` : ''}
              ${usuarioActual.servicio ? `<strong>Servicio:</strong> ${usuarioActual.servicio}<br>` : ''}
              ${usuarioActual.fecha ? `<strong>Fecha de registro:</strong> ${usuarioActual.fecha}` : ''}
            </div>
          `;
          datosDiv.style.display = 'block';
          ocultarBtn.style.display = 'inline-block';
        } else {
          if (datosDiv) {
            datosDiv.innerHTML = '<div style="padding: 10px;">No hay datos del usuario actual.</div>';
            datosDiv.style.display = 'block';
            ocultarBtn.style.display = 'none';
          }
        }
        return;
      }

      // Si estamos en otra página, mostrar todos los usuarios (funcionalidad original)
      if (listaDiv && listaUl) {
        const ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
        listaUl.innerHTML = '';

        if (ingresos.length > 0) {
          ingresos.forEach((dato, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
              <strong>${index + 1}.</strong> ${dato.usuario} - ${dato.numeroDocumento}
              ${dato.tipoDocumento ? ` (${dato.tipoDocumento})` : ''}
              ${dato.habitacion ? ` - Habitación ${dato.habitacion}` : ''}
              ${dato.servicio ? ` - Servicio: ${dato.servicio}` : ''}
              <br><small>Fecha: ${dato.fecha || 'N/D'}</small>
              <br>
              <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
            listaUl.appendChild(li);
          });

          listaDiv.style.display = 'block';
          ocultarBtn.style.display = 'inline-block';

          // Botones de eliminar
          document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function () {
              const index = parseInt(this.getAttribute('data-index'));

              Swal.fire({
                title: '¿Eliminar usuario?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  const ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
                  ingresos.splice(index, 1);
                  localStorage.setItem('ingresos', JSON.stringify(ingresos));

                  Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El usuario ha sido eliminado correctamente',
                    confirmButtonColor: '#3085d6'
                  }).then(() => {
                    mostrarBtn.click(); // Recarga la lista
                  });
                }
              });
            });
          });
        } else {
          listaUl.innerHTML = '<li>No hay ingresos guardados.</li>';
          listaDiv.style.display = 'block';
          ocultarBtn.style.display = 'none';
        }
      }
    });

    // Botón ocultar lista
    ocultarBtn.addEventListener('click', function () {
      const datosDiv = document.getElementById('lista-ingresos') || document.getElementById('datosUsuario');
      if (listaDiv) listaDiv.style.display = 'none';
      if (datosDiv) datosDiv.style.display = 'none';
      ocultarBtn.style.display = 'none';
    });
  }

  // FUNCIONES ESPECÍFICAS PARA BIENVENIDA.HTML
  
  // Mostrar/ocultar menú de usuario
  if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', function () {
      userMenu.style.display =
        userMenu.style.display === 'none' || userMenu.style.display === ''
          ? 'block'
          : 'none';
    });
  }

  // Botón de cerrar sesión
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('usuarioActual');
      if (userMenu) userMenu.style.display = 'none';
      window.location.href = 'index.html';
    });
  }

  // Animaciones para bienvenida.html
  const opcionesLinks = document.querySelectorAll('.opciones a');
  if (opcionesLinks.length > 0) {
    opcionesLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const contenedor = document.querySelector('.contenedor');
        if (contenedor) {
          contenedor.classList.add('fade-out');
          setTimeout(() => {
            window.location.href = this.href;
          }, 500);
        } else {
          window.location.href = this.href;
        }
      });
    });
  }
});