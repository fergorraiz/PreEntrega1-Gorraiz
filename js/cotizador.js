import * as clases from './modelo.js';

function cotizarVehiculo(marca, modelo, year) {
    const resultadoCotizacion = [];
    const lv_anio_actual = new Date().getFullYear();
    const lv_descuentoPorAnio = 4800;
    const lv_marca = marca.toUpperCase();
    const lv_modelo = modelo.toUpperCase();
    const lv_year = parseInt(year);

    if (lv_year < 2000) //No cotizamos vehiculos anteriores al año 2000
    {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Lo sentimos, pero solo cotizamos vehiculos superiores al año 2000.",
            showConfirmButton: false,
            timer: 2000,
        });
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

        Swal.fire({
            position: "center",
            icon: "error",
            title: "El año del vehiculo no puede ser superior al año actual.",
            showConfirmButton: false,
            timer: 2000,
        });

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

    respuesta && resultadoSection.removeChild(respuesta);

}

function cargarTablaHTML(tablaHtml, vehiculosCotizados) {
    let contador = 0;
    vehiculosCotizados.reverse();//Invertimos el orden para mostrar primero el último vehículo cotizado
    console.log(vehiculosCotizados);

    vehiculosCotizados.forEach(vehiculo => {

        //Solamente mostramos 1 vez en la cabecera los datos del auto, dado que se repiten para todos los planes disponibles.
        if (contador == 0) {
            let tr_th = document.createElement("tr");
            tr_th.innerHTML = `<th>Marca: ${vehiculo.marca}, Modelo: ${vehiculo.modelo}, Año: ${vehiculo.year}</th>`;
            tablaHtml.appendChild(tr_th);
        }
        //Si es el último plan del auto cotizado entonces volvemos contador a cero, caso contrario seguimos acumulando el contador.
        (contador === aseguradora.planes.length - 1) ? (contador = 0) : (contador++);

        let tr_td = document.createElement("tr");
        tr_td.innerHTML = `<td>Plan: ${vehiculo.plan}</td><td>Cotización: $${vehiculo.cotizacion}</td><td>Bonificación: ${vehiculo.bonificacion}%</td>`;
        tablaHtml.appendChild(tr_td);
    });

}

function cargarHistorial() {

    let tablaHtml = document.getElementById("historialCotizaciones");
    let vehiculosCotizados = JSON.parse(localStorage.getItem("vehiculosCotizados"));
    let sectionHistorial = document.getElementById("historial");

    if (vehiculosCotizados && vehiculosCotizados.length > 0) {
        cargarTablaHTML(tablaHtml, vehiculosCotizados);
        const botonLimpiar = document.createElement("button");
        botonLimpiar.textContent = "Limpiar";
        botonLimpiar.id = "btnClear";
        botonLimpiar.className = "btn";
        sectionHistorial.insertBefore(botonLimpiar, tablaHtml);
        botonLimpiar.addEventListener("click", (e) => {

            localStorage.removeItem("vehiculosCotizados");
            window.location.reload();//Recargamos la página

        });
    }
    else {
        let respuesta = document.createElement("p");
        respuesta.innerHTML = "No tienes cotizaciones recientes.";
        sectionHistorial.insertBefore(respuesta, tablaHtml);

    }

}

function cargarOpcionesSelect() {
    // Obtener los elementos select para marca y modelo
    const selectMarca = document.getElementById("marca");
    const selectModelo = document.getElementById("modelo");

    // Limpiar las opciones actuales en ambos selectores
    selectMarca.innerHTML = '';
    selectModelo.innerHTML = '';

    if (aseguradora?.vehiculosActivos?.length > 0) {
        // Crear opciones por cada marca y modelo disponibles
        aseguradora.vehiculosActivos.forEach(vehiculo => {
            // Agregar opciones de marcas si no existen ya
            if (!selectMarca.querySelector(`option[value="${vehiculo.marca}"]`)) {
                const optionMarca = document.createElement('option');
                optionMarca.value = vehiculo.marca;
                optionMarca.text = vehiculo.marca;
                selectMarca.appendChild(optionMarca);
            }
        });

        // Obtener el valor de la primera marca
        const marcaPorDefecto = selectMarca.querySelector('option:first-of-type').value;

        // Si se encontró una marca por defecto, cargar sus modelos
        if (marcaPorDefecto) {
            const modelosPorDefecto = aseguradora.vehiculosActivos.filter(vehiculo => vehiculo.marca === marcaPorDefecto);

            modelosPorDefecto.forEach(vehiculo => {
                const optionModelo = document.createElement('option');
                optionModelo.value = vehiculo.modelo;
                optionModelo.text = vehiculo.modelo;
                selectModelo.appendChild(optionModelo);
            });
        }

        // Agregar event listener para el cambio en el selector de marca
        selectMarca.addEventListener('change', function () {
            const marcaSeleccionada = this.value;

            // Limpiar el selector de modelos
            selectModelo.innerHTML = '';

            const modelosFiltrados = aseguradora.vehiculosActivos
                .filter(vehiculo => vehiculo.marca === marcaSeleccionada);

            modelosFiltrados.forEach(vehiculo => {
                const optionModelo = document.createElement('option');
                optionModelo.value = vehiculo.modelo;
                optionModelo.text = vehiculo.modelo;
                selectModelo.appendChild(optionModelo);
            });

        });
    }

}

const aseguradora = new clases.Aseguradora('CotizaPro');
const vehiculosGenerados = JSON.parse(localStorage.getItem("vehiculos"));

vehiculosGenerados.forEach(vehiculo => {
    aseguradora.agregarVehiculo(new clases.Vehiculo(vehiculo.marca, vehiculo.modelo));
});

const cargarPlanesVigentes = async () => {
    const response = await fetch("./db/planes.json");
    const data = await response.json();
    console.log(data); // Verifica el contenido del JSON
    data.forEach((plan) => {
        aseguradora.agregarPlan(new clases.Plan(plan.nombre, plan.precioBase, plan.bonificacion))
    });
};

cargarPlanesVigentes();

console.log(aseguradora.planes.length);
console.log('Aseguradora ' + aseguradora.nombre);

aseguradora.vehiculos[3].actualizarEstado(false);

console.log('Nuestras cotizaciones disponibles:');
console.log(aseguradora.vehiculosActivos);

console.log('Nuestros planes:');
console.log(aseguradora.planes);

let vehiculosCotizados;
let vehiculosCotizadosTemp = localStorage.getItem("vehiculosCotizados");

(vehiculosCotizadosTemp) ? (vehiculosCotizados = JSON.parse(vehiculosCotizadosTemp)) : vehiculosCotizados = [];

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

    if (marca.length === 0 || modelo.length === 0 || year.length === 0) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Los campos marca, modelo, año son obligatorios.",
            showConfirmButton: false,
            timer: 2000,
        });

    }
    else {
        const resultadoCotizacion = cotizarVehiculo(marca, modelo, year);

        if (resultadoCotizacion && resultadoCotizacion.length > 0) {
            vehiculosCotizados = vehiculosCotizados.concat(resultadoCotizacion);

            localStorage.setItem("vehiculosCotizados", JSON.stringify(vehiculosCotizados));

            vehiculosCotizados.length > 0 && cargarTablaHTML(tablaHtml, vehiculosCotizados);
            Toastify({
                text: "Vehiculo cotizado",
                duration: 2000,
                position: "right",
                gravity: "bottom",
                style: {
                    background: "#0a4595",
                }
            }).showToast();
        }
        else {
            respuesta.innerHTML = "No se encontraron cotizaciones para los parametros ingresados. Por favor, vuelva a intentarlo.";
            resultado.insertBefore(respuesta, resultado.firstChild)
        }
    }
};
/*Cargamos modelos y marcas disponibles*/
cargarOpcionesSelect();
/*Cargamos cotizaciones anteriores*/
cargarHistorial();


