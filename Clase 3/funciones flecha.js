/* const suma = (a, b) => a + b;
const resta = (a, b) => a - b;

const iva = (precio) => precio * 0.18;
let precioProducto = Number(prompt("Cual es el precio del producto?"))
let descuento = Number(prompt("de cuanto es tu cupon de descuento?"))

// (precioProducto + iva) - descuento
let nuevoPrecio = resta(suma(precioProducto, iva(precioProducto)), descuento);


alert(nuevoPrecio); */

let marca = prompt("Ingrese la marca de su vehículo");
let modelo = prompt("Ingrese la modelo de su vehículo");
let year = prompt("Ingrese el año de su vehículo");
let cotizar = true;

if (marca && marca.length == 0 && modelo && modelo.length == 0 && year && year.length == 0) {
    console.log("Los campos marca, modelo, año son obligatorios.");
}
