// Async en el CallBack
// Al declarar la funcion de modo async esto
// Indica que esta funcion trabaje de forma que no bloquea
// El resto del programa mientras se ejecuta, es decir
// se ejecuta de forma paralela a las demas.

// El await suspende la ejecucion del bloque hasta
// que se cumpla la promesa y asigna el resultado
import { callAPI } from "./api.js";

const busquedasRecientes = [];

function guardarBusquedaEnMemoria(palabra) {
  if (!palabra) return;

  // Elimina si ya existe
  const index = busquedasRecientes.indexOf(palabra);
  if (index !== -1) {
    busquedasRecientes.splice(index, 1);
  }

  // Agrega al inicio
  busquedasRecientes.unshift(palabra);

  // Limita a 5
  if (busquedasRecientes.length > 5) {
    busquedasRecientes.pop();
  }

  mostrarHistorial();
}

function mostrarHistorial() {
  const historial = document.getElementById("lista-busquedas");
  historial.innerHTML = ""; // Limpiar

  busquedasRecientes.forEach((palabra) => {
    historial.textContent += `${palabra} \n/\n`;
  });
}

const palabrasFav = [];

const botonFavorito = document.getElementById("favicono");
botonFavorito.addEventListener("click", favoritaPal);

function favoritaPal() {
  const palabraBuscada = document.getElementById("buscarPalabra").value.trim();

  if (!palabraBuscada) {
    return;
  }

  const index = palabrasFav.indexOf(palabraBuscada);
  if (index !== -1) {
    palabrasFav.splice(index, 1);
  } else {
    // Agrega al inicio
    palabrasFav.unshift(palabraBuscada);
  }

  mostraPalabrasFav();
}

function mostraPalabrasFav() {
  const palabrasFavoritas = document.getElementById("lista-favoritos");
  palabrasFavoritas.innerHTML = ""; // Limpiar

  palabrasFav.forEach((palabra) => {
    palabrasFavoritas.textContent += `${palabra} \n/\n`;
  });
}

const btn = document.getElementById("bnt-mostrar");
const tipo = document.getElementById("tipo");
const palabra = document.getElementById("palabra");
const significado = document.getElementById("significado");

btn.addEventListener("click", () => {
  const palabraBuscada = document.getElementById("buscarPalabra").value.trim();

  if (!palabraBuscada) {
    palabra.textContent = "";
    tipo.textContent = "";
    significado.textContent = "Introduce una palabra válida";
    botonFavorito.style.display = 'none';
    return;
  }

  document.getElementById("favicono").style.display = "block";

  callAPI(`/${palabraBuscada}`)
    .then((data) => {
      // Limpiar contenido anterior
      palabra.textContent = "";
      tipo.textContent = "";
      significado.textContent = "";

      if (data.length === 0) {
        palabra.textContent = "Palabra no encontrada.";
        return;
      }

      // Mostrar la palabra una vez
      const mainEntry = data[0];
      palabra.textContent = `📘 Palabra: ${mainEntry.word}`;

      // Reunir todos los significados
      const allMeanings = data.flatMap((entry) => entry.meanings);

      const shownTypes = new Set();

      tipo.textContent += `🗂 Tipo: \n`;
      allMeanings.forEach((meaning) => {
        const part = meaning.partOfSpeech;
        // Mostrar solo una definición por tipo
        if (!shownTypes.has(part) && meaning.definitions.length > 0) {
          shownTypes.add(part);

          const def = meaning.definitions[0]; // Solo la primera definición

          tipo.textContent += `${part}\n`;
          significado.textContent += `• ${def.definition}\n`;

          if (def.example) {
            significado.textContent += `Ejemplo: ${def.example}\n`;
          }

          significado.textContent += "\n";
        }
      });
      guardarBusquedaEnMemoria(palabraBuscada);
    })
    .catch((error) => {
      significado.textContent = "❌ Error: " + error.message;
    });
});
