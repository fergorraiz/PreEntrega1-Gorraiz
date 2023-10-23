class Aseguradora {
    constructor(nombre) {
        this.nombre = nombre.toUpperCase();
        this.vehiculos = [];
        this.planes = [];
    }
    agregarVehiculo(vehiculos) {
        this.vehiculos.push(vehiculos);
    }
    agregarPlan(plan) {
        this.planes.push(plan);
    }

    get vehiculosActivos() {
        return this.vehiculos.filter(vehiculo => vehiculo.activo == true)
    }
}

class Plan {

    constructor(nombre, precio, bonificacion) {
        this.nombre = nombre.toUpperCase();
        this.precioBase = parseFloat(precio);
        this.bonificacion = parseFloat(bonificacion);
    }
}

class Vehiculo {
    constructor(marca, modelo) {
        this.marca = marca.toUpperCase();
        this.modelo = modelo.toUpperCase();
        this.activo = true;
    }

    actualizarEstado(estado) {
        this.activo = estado;
    }
}

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
        const nuevoVehiculo = new Vehiculo(marcaAleatoria, modeloAleatorio);

        // Agregar el objeto al arreglo
        vehiculos.push(nuevoVehiculo);
    }
    return eliminarDuplicados(vehiculos);
}

function cotizarVehiculo(marca, modelo, year) {
    const resultadoCotizacion = [];
    const lv_anio_actual = new Date().getFullYear();
    const lv_descuentoPorAnio = 4800;
    const lv_marca = marca.toUpperCase();
    const lv_modelo = modelo.toUpperCase();
    const lv_year = parseInt(year);

    if (lv_year < 2000) //No cotizamos vehiculos anteriores al año 2000
    {
        alert("Lo sentimos pero su vehiculo no está dentro de nuestro rango de cotización, solo cotizamos vehiculos superiores al año 2000.");
    }
    else if (lv_year <= lv_anio_actual) {
        const resultado = aseguradora.vehiculos.filter(vehiculos => {
            return vehiculos.marca === lv_marca && vehiculos.modelo === lv_modelo && vehiculos.activo == true;
        })
        const descuentoAntiguedad = (lv_anio_actual - lv_year) * lv_descuentoPorAnio / 100;

        for (let i = 0; i < resultado.length; i++) {
            for (let j = 0; j < aseguradora.planes.length; j++) {

                let cotizacion = (aseguradora.planes[j].precioBase - descuentoAntiguedad) - (aseguradora.planes[j].precioBase * aseguradora.planes[j].bonificacion / 100);

                resultadoCotizacion.push(
                    {
                        plan: aseguradora.planes[j].nombre,
                        marca: resultado[i].marca,
                        modelo: resultado[i].modelo,
                        year: lv_year,
                        cotizacion: cotizacion,
                        bonificacion: aseguradora.planes[j].bonificacion,
                    }
                )
            }
        }
    }
    else {
        alert("El año del vehiculo no puede ser superior al año actual.");

    }
    //evitamos retornar basura
    return resultadoCotizacion.filter(vehiculo => vehiculo !== undefined);;
}

function limpiarCotizacion() {
    let tablaHtml = document.getElementById("resultadoCotizaciones");
    while (tablaHtml.firstChild) {
        tablaHtml.removeChild(tablaHtml.firstChild);
    }

    let resultadoSection = document.getElementById("resultado");
    let respuesta = resultadoSection.querySelector("p");

    if (respuesta) {
        resultadoSection.removeChild(respuesta);
    }
}

function cargarTablaHTML(tablaHtml, vehiculosCotizados) {
    let contador = 0;

    vehiculosCotizados.forEach(vehiculo => {

        //Solamente mostramos 1 vez en la cabecera los datos del auto, dado que se repiten para todos los planes disponibles.
        if (contador == 0) {
            let tr_th = document.createElement("tr");
            tr_th.innerHTML = `<th>Marca: ${vehiculo.marca}, Modelo: ${vehiculo.modelo}, Año: ${vehiculo.year}</th>`;
            tablaHtml.appendChild(tr_th);
        }
        //Si es el último plan del auto cotizado entonces volvemos contador a cero, caso contrario seguimos acumulando el contador.
        if (contador == aseguradora.planes.length - 1) {
            contador = 0;
        }
        else { contador = contador + 1; }

        let tr_td = document.createElement("tr");
        tr_td.innerHTML = `<td>Plan: ${vehiculo.plan}</td><td>Cotización: $${vehiculo.cotizacion}</td><td>Bonificación: ${vehiculo.bonificacion}%</td>`;
        tablaHtml.appendChild(tr_td);
    });

}

function cargarHistorial() {

    let tablaHtml = document.getElementById("historialCotizaciones");
    let vehiculosCotizados = JSON.parse(localStorage.getItem("vehiculos"));
    let sectionHistorial = document.getElementById("historial");

    if (vehiculosCotizados && vehiculosCotizados.length > 0) {
        cargarTablaHTML(tablaHtml, vehiculosCotizados);
        const botonLimpiar = document.createElement("button");
        botonLimpiar.textContent = "Limpiar";
        botonLimpiar.id = "btnClear";
        botonLimpiar.className = "btn";
        sectionHistorial.insertBefore(botonLimpiar, tablaHtml);
        botonLimpiar.addEventListener("click", (e) => {
            
            localStorage.clear();
            window.location.reload();//Recargamos la página
            
        });
    }
    else{        
        let respuesta = document.createElement("p");
        respuesta.innerHTML = "No tienes cotizaciones recientes.";
        sectionHistorial.insertBefore(respuesta, tablaHtml);

    }

}

const aseguradora = new Aseguradora('CotizaPro');
const vehiculosGenerados = generarVehiculos();
vehiculosGenerados.forEach(vehiculo => {
    aseguradora.agregarVehiculo(vehiculo);
});

console.log('Aseguradora ' + aseguradora.nombre);

aseguradora.vehiculos[3].actualizarEstado(false);

console.log('Nuestras cotizaciones disponibles:');
console.log(aseguradora.vehiculosActivos);

aseguradora.agregarPlan(new Plan('BRONCE', '15000', '10'));
aseguradora.agregarPlan(new Plan('SILVER', '45000', '20'));
aseguradora.agregarPlan(new Plan('GOLD', '70000', '30'));
console.log('Nuestros planes:');
console.log(aseguradora.planes);

let vehiculosCotizados;
let vehiculosCotizadosTemp = localStorage.getItem("vehiculos");

if (vehiculosCotizadosTemp) {
    vehiculosCotizados = JSON.parse(vehiculosCotizadosTemp);
}
else {
    vehiculosCotizados = [];
}

let formulario = document.getElementById("formCotizacion");

//Capturamos evento submit del formulario
formulario.onsubmit = (e) => {

    e.preventDefault();
    limpiarCotizacion();//Limpiamos tabla HTML de sección cotización
    let tablaHtml = document.getElementById("resultadoCotizaciones");
    let respuesta = document.createElement("p");
    let resultado = document.getElementById("resultado");

    /*Parametros de usuario */
    let marca = document.getElementById("marca").value;
    let modelo = document.getElementById("modelo").value;
    let year = document.getElementById("year").value;

    if (marca.length == 0 && modelo.length == 0 && year.length == 0) {
        alert("Los campos marca, modelo, año son obligatorios.");
    }
    else {
        const resultadoCotizacion = cotizarVehiculo(marca, modelo, year);

        vehiculosCotizados = vehiculosCotizados.concat(resultadoCotizacion);

        localStorage.setItem("vehiculos", JSON.stringify(vehiculosCotizados));

        if (vehiculosCotizados.length > 0) {
            cargarTablaHTML(tablaHtml, vehiculosCotizados);
        }
        else {
            respuesta.innerHTML = "No se encontraron cotizaciones para los parametros ingresados. Por favor, vuelva a intentarlo.";
            resultado.insertBefore(respuesta, resultado.firstChild)
        }

    }
};
/*Cargamos cotizaciones anteriores*/
cargarHistorial();

