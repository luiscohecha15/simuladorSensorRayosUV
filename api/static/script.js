// URL de la API para obtener los datos en tiempo real
const apiUrl = "http://localhost:5000/api/sensores";  // Ajusta esto según la URL de tu API

let datosGraficos = []; // Para almacenar los valores de rayos UV en el gráfico
let fechasGraficas = []; // Para almacenar las fechas en el gráfico
let datosUltimos = []; // Para almacenar los últimos 5 datos en la tabla

// Función para obtener los últimos 5 datos y graficar
async function obtenerDatos() {
    try {
        // Obtener los últimos 5 datos de la base de datos
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Verificar si la respuesta es un arreglo
        if (!Array.isArray(data)) {
            console.error("La respuesta no es un arreglo válido:", data);
            mostrarMensajeSinDatos();
            return;
        }

        // Si no hay datos, mostrar un mensaje
        if (data.length === 0) {
            mostrarMensajeSinDatos();
            return;
        }

        // Agregar los nuevos datos al gráfico, a la lista y a la tabla
        agregarDatos(data);

        // Ordenar los datos por fecha para asegurarnos de que estén en orden cronológico
        ordenarDatos();

        // Actualizar gráfico con los datos ordenados
        actualizarGrafico();

        // Mostrar los 5 últimos datos en la página
        mostrarUltimosDatos(data);

        // Agregar nuevos datos a la tabla
        actualizarTabla(data);

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}

// Función para agregar nuevos datos
function agregarDatos(data) {
    data.forEach(dato => {
        // Asegurarse de que las fechas y los valores se agreguen secuencialmente
        fechasGraficas.push(dato.fecha + ' ' + dato.hora);
        datosGraficos.push(dato.valor);
    });
}

// Función para ordenar los datos por fecha
function ordenarDatos() {
    // Crear un arreglo de objetos que contengan las fechas y valores juntos
    const datosCompletos = fechasGraficas.map((fecha, index) => ({
        fecha: fecha,
        valor: datosGraficos[index]
    }));

    // Ordenar los datos por fecha (de forma ascendente)
    datosCompletos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Reasignar los valores ordenados a fechasGraficas y datosGraficos
    fechasGraficas = datosCompletos.map(item => item.fecha);
    datosGraficos = datosCompletos.map(item => item.valor);
}

// Función para actualizar el gráfico
function actualizarGrafico() {
    const trace = {
        x: fechasGraficas,
        y: datosGraficos,
        type: 'scatter',
        mode: 'lines+markers',  // Conecta los puntos secuencialmente
        line: {
            shape: 'linear',  // Forma de la línea: 'linear' asegura que los puntos se conecten de forma secuencial
            color: 'rgb(50, 150, 250)',  // Color azul suave
            width: 3  // Grosor de la línea
        },
        marker: {
            color: 'rgb(50, 150, 250)',  // Color de los puntos
            size: 6  // Tamaño de los puntos
        }
    };

    const layout = {
        title: 'Niveles de Rayos UV',
        xaxis: {
            title: 'Fecha y Hora',
            showgrid: true,
            zeroline: false,
            tickangle: -45  // Rota las etiquetas de los ejes para mejorar la visibilidad
        },
        yaxis: {
            title: 'Valor de Rayos UV',
            range: [0, 1000],  // Rango fijo para evitar aplastamiento
            showgrid: true,
            zeroline: true
        },
        plot_bgcolor: 'rgb(240, 240, 240)',  // Fondo suave del gráfico
        paper_bgcolor: 'rgb(255, 255, 255)',  // Fondo blanco general
        margin: { t: 50, b: 100, l: 50, r: 50 },  // Márgenes para mejorar el espacio
    };

    Plotly.react('grafico-uv', [trace], layout);
}

// Función para mostrar los últimos 5 datos en la página
function mostrarUltimosDatos(datos) {
    const ultimoDatoElement = document.getElementById("ultimo-dato");
    ultimoDatoElement.innerHTML = "<h3>Últimos 5 Datos:</h3>";

    // Agregar cada dato a la lista
    datos.forEach(dato => {
        ultimoDatoElement.innerHTML += `
            <p>Sensor ID: ${dato.id_sensor}</p>
            <p>Valor: ${dato.valor}</p>
            <p>Fecha: ${dato.fecha}</p>
            <p>Hora: ${dato.hora}</p>
            <hr>
        `;
    });
}

// Función para mostrar un mensaje cuando no hay datos
function mostrarMensajeSinDatos() {
    const graficoElement = document.getElementById('grafico-uv');
    graficoElement.innerHTML = "<h3 class='text-center text-gray-500'>No hay datos disponibles para mostrar en este momento.</h3>";
}

// Función para actualizar la tabla con los últimos datos
function actualizarTabla(datos) {
    const tabla = document.getElementById("tabla-datos");

    // Agregar cada dato a la tabla
    datos.forEach(dato => {
        const fila = document.createElement("tr");

        const columnaId = document.createElement("td");
        columnaId.textContent = dato.id_sensor;
        fila.appendChild(columnaId);

        const columnaValor = document.createElement("td");
        columnaValor.textContent = dato.valor;
        fila.appendChild(columnaValor);

        const columnaFecha = document.createElement("td");
        columnaFecha.textContent = dato.fecha;
        fila.appendChild(columnaFecha);

        const columnaHora = document.createElement("td");
        columnaHora.textContent = dato.hora;
        fila.appendChild(columnaHora);

        tabla.appendChild(fila);
    });
}

// Obtener datos cada 3 segundos
setInterval(obtenerDatos, 3000);

// Inicializar al cargar la página
window.onload = obtenerDatos;
