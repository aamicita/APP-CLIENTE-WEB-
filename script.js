/* ==========================================================
   ALMACENAMIENTO
   Guardamos la lista de clientes en localStorage del navegador
   para que no se pierda al recargar la página.
   ========================================================== */
const KEY = 'clientes_v1';

/* ==========================================================
   *** AQUÍ ESTÁN LAS VALIDACIONES ***
   Cada campo tiene una función que recibe el valor escrito
   por el usuario (v) y devuelve:
     - true                -> el valor es válido
     - un texto (string)   -> el valor NO es válido, y ese texto
                              es el mensaje de error que se muestra
   ========================================================== */
const rules = {

  // CÉDULA: exactamente 10 dígitos numéricos.
  // /^\d{10}$/ = "desde el inicio (^) hasta el final ($),
  // solo dígitos (\d), exactamente 10 veces ({10})"
  cedula: v => /^\d{10}$/.test(v)
    || 'La cédula debe tener 10 dígitos.',

  // NOMBRE: no puede estar vacío y máximo 30 caracteres
  // (el maxlength="30" del HTML ya evita escribir de más,
  // pero validamos igual por si el campo llega vacío).
  nombre: v => (v.trim().length > 0 && v.length <= 30)
    || 'Ingresa un nombre (máx. 30 caracteres).',

  // DIRECCIÓN: no puede estar vacía y máximo 50 caracteres
  direccion: v => (v.trim().length > 0 && v.length <= 50)
    || 'Ingresa una dirección (máx. 50 caracteres).',

  // TELÉFONO CELULAR: 10 dígitos y debe iniciar con "09"
  // (formato típico de celulares en Ecuador)
  telefono: v => /^09\d{8}$/.test(v)
    || 'El celular debe tener 10 dígitos e iniciar con 09.',

  // CORREO ELECTRÓNICO: algo@algo.algo, sin espacios
  // [^\s@]+  -> uno o más caracteres que NO sean espacio ni @
  correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    || 'Ingresa un correo válido.'
};

/* ==========================================================
   FUNCIONES DE ALMACENAMIENTO (leer / guardar la lista)
   ========================================================== */
function load(){
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch(e){ return []; }
}
function save(list){
  try { localStorage.setItem(KEY, JSON.stringify(list)); }
  catch(e){}
}

/* ==========================================================
   DIBUJA LA TABLA de clientes en pantalla a partir de lo
   guardado en localStorage.
   ========================================================== */
function render(){
  const list = load();
  const rows = document.getElementById('rows');
  const empty = document.getElementById('empty');
  rows.innerHTML = '';
  empty.style.display = list.length ? 'none' : 'block';

  list.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.cedula}</td><td>${c.nombre}</td><td>${c.direccion}</td><td>${c.telefono}</td><td>${c.correo}</td>
      <td><button class="del" data-i="${i}">Eliminar</button></td>`;
    rows.appendChild(tr);
  });

  // Botón "Eliminar" de cada fila
  rows.querySelectorAll('.del').forEach(b => b.addEventListener('click', () => {
    const list = load();
    list.splice(Number(b.dataset.i), 1); // quita ese cliente del arreglo
    save(list);
    render(); // vuelve a dibujar la tabla sin ese cliente
  }));
}

/* ==========================================================
   CONTADOR DE CARACTERES en vivo (nombre y dirección)
   Se actualiza cada vez que el usuario escribe (evento "input").
   ========================================================== */
['nombre','direccion'].forEach(id => {
  const input = document.getElementById(id);
  const counter = document.getElementById('c-' + id);
  input.addEventListener('input', () => {
    counter.textContent = `${input.value.length}/${input.maxLength}`;
  });
});

/* ==========================================================
   FILTRO AUTOMÁTICO para cédula y teléfono:
   mientras el usuario escribe, se eliminan letras y símbolos,
   dejando solo números, y se corta a 10 caracteres.
   ========================================================== */
['cedula','telefono'].forEach(id => {
  document.getElementById(id).addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    //                                  \D = todo lo que NO sea dígito
  });
});

/* ==========================================================
   ENVÍO DEL FORMULARIO
   Aquí es donde se EJECUTAN las validaciones de "rules" de
   arriba, una por una, y se decide si se guarda el cliente
   o se muestran los errores.
   ========================================================== */
document.getElementById('f').addEventListener('submit', e => {
  e.preventDefault(); // evita que la página se recargue

  const data = {};
  let allOk = true; // se vuelve false si algún campo falla

  // Recorremos cada regla (cedula, nombre, direccion, telefono, correo)
  Object.keys(rules).forEach(id => {
    const field = document.querySelector(`[data-field="${id}"]`);
    const input = document.getElementById(id);

    // Ejecutamos la validación de ESE campo
    const result = rules[id](input.value.trim());

    field.classList.remove('error', 'ok');

    if (result === true) {
      // Validación pasada: marcamos el campo en verde
      field.classList.add('ok');
      const hint = field.querySelector('.hint');
      hint.textContent = hint.dataset.orig || hint.textContent;
      data[id] = input.value.trim(); // guardamos el valor limpio
    } else {
      // Validación fallida: marcamos en rojo y mostramos el motivo
      field.classList.add('error');
      const hint = field.querySelector('.hint');
      if (!hint.dataset.orig) hint.dataset.orig = hint.textContent; // guarda el texto original de ayuda
      hint.textContent = result; // muestra el mensaje de error específico
      allOk = false;
    }
  });

  const msg = document.getElementById('msg');

  // Si CUALQUIER campo falló, no se guarda nada
  if (!allOk) {
    msg.className = 'show bad';
    msg.textContent = 'Revisa los campos marcados antes de guardar.';
    return;
  }

  // Todos los campos pasaron: se guarda el nuevo cliente
  const list = load();
  list.push(data);
  save(list);
  render();

  // Se limpia el formulario para el siguiente registro
  e.target.reset();
  document.querySelectorAll('.counter').forEach(c => c.textContent = c.id === 'c-nombre' ? '0/30' : '0/50');
  document.querySelectorAll('.field').forEach(f => f.classList.remove('ok','error'));

  msg.className = 'show good';
  msg.textContent = 'Cliente guardado correctamente.';
});

// Al cargar la página, dibuja la tabla con lo que ya estaba guardado
render();
