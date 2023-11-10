import * as clases from '../js/modelo.js';

function eliminarDuplicados(array) {
    const vehiculosUnicos = [];
    const marcasYModelosVistos = new Set();

    for (const vehiculo of array) {
        const clave = vehiculo.marca + vehiculo.modelo;

        if (!marcasYModelosVistos.has(clave)) {
            marcasYModelosVistos.add(clave);
            vehiculosUnicos.push(vehiculo);
        }
    }

    return vehiculosUnicos;
}

function generarVehiculos() {
    // Array de marcas y modelos disponibles
    const marcasDisponibles = ["VOLKSWAGEN", "FORD", "TOYOTA", "FIAT", "RENAULT", "CHEVROLET"];
    const modelosPorMarca = {
        "VOLKSWAGEN": ["AMAROK", "GOLF", "JETTA", "POLO"],
        "FORD": ["FOCUS", "FIESTA", "RANGER", "ESCAPE"],
        "TOYOTA": ["COROLLA", "CAMRY", "RAV4", "HILUX"],
        "FIAT": ["500", "PANDA", "TIPO", "DOBLO"],
        "RENAULT": ["CLIO", "MEGANE", "KADJAR", "DUSTER"],
        "CHEVROLET": ["CRUZE", "SPARK", "EQUINOX", "SILVERADO"]
    };
    // Arreglo para almacenar los objetos generados
    const vehiculos = [];
    // Generar 30 objetos diferentes
    for (let i = 0; i < 30; i++) {
        // Elegir una marca aleatoria de la lista de marcas disponibles
        const marcaAleatoria = marcasDisponibles[Math.floor(Math.random() * marcasDisponibles.length)];

        // Elegir un modelo aleatorio correspondiente a la marca
        const modelosDeMarca = modelosPorMarca[marcaAleatoria];
        const modeloAleatorio = modelosDeMarca[Math.floor(Math.random() * modelosDeMarca.length)];

        // Crear un objeto con la marca y el modelo aleatorio
        const nuevoVehiculo = new clases.Vehiculo(marcaAleatoria, modeloAleatorio);

        // Agregar el objeto al arreglo
        vehiculos.push(nuevoVehiculo);
    }
    return eliminarDuplicados(vehiculos);
}

const vehiculosJSON= JSON.stringify(generarVehiculos());

JSON.parse(localStorage.getItem("vehiculos")) || localStorage.setItem("vehiculos",vehiculosJSON);
