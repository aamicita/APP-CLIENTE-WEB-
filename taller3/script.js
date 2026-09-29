// 1. Guardamos en variables los elementos de la página que vamos a usar
const inputNum1 = document.getElementById("num1");
const inputNum2 = document.getElementById("num2");
const boton = document.getElementById("btnCalcular");
const mensaje = document.getElementById("mensaje");
const listaResultados = document.getElementById("resultados");

// 2. Función que se ejecuta cuando se presiona el botón
function calcular() {
  // Limpiamos el mensaje de error y los resultados anteriores
  mensaje.textContent = "";
  listaResultados.innerHTML = "";

  // 3. Leemos los valores y los convertimos de texto a número
  const a = parseFloat(inputNum1.value);
  const b = parseFloat(inputNum2.value);

  // 4. Validamos: si alguno no es número, mostramos error y salimos
  if (isNaN(a) || isNaN(b)) {
    mensaje.textContent = "Ingresa los dos números para continuar.";
    return;
  }

  // 5. BUCLE FOR: se repite 5 veces (i = 1, 2, 3, 4, 5)
  for (let i = 1; i <= 5; i++) {
    let operacion = ""; // texto de la operación (ej: 10 + 3)
    let resultado = ""; // resultado de la operación

    // 6. SWITCH: según el número de iteración, hacemos una operación distinta
    switch (i) {
      case 1: // PRIMERA iteración: SUMA
        operacion = a + " + " + b;
        resultado = a + b;
        break;

      case 2: // SEGUNDA iteración: RESTA
        operacion = a + " − " + b;
        resultado = a - b;
        break;

      case 3: // TERCERA iteración: MULTIPLICACIÓN
        operacion = a + " × " + b;
        resultado = a * b;
        break;

      case 4: // CUARTA iteración: DIVISIÓN
        operacion = a + " ÷ " + b;
        // No se puede dividir para cero, lo controlamos con un if
        if (b === 0) {
          resultado = "No se puede dividir para 0";
        } else {
          resultado = a / b;
        }
        break;

      case 5: // QUINTA iteración: MÓDULO (residuo de la división)
        operacion = a + " % " + b;
        if (b === 0) {
          resultado = "No se puede hacer módulo con 0";
        } else {
          resultado = a % b;
        }
        break;
    }

    // 7. Creamos un elemento de lista <li> y lo mostramos en la página
    const item = document.createElement("li");
    item.innerHTML =
      '<span class="op">Iteración ' + i + ": " + operacion + "</span>" +
      '<span class="valor">' + resultado + "</span>";
    listaResultados.appendChild(item);
  }
}

// 8. Le decimos al botón que ejecute "calcular" cuando le den clic
boton.addEventListener("click", calcular);
