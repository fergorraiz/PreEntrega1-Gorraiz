export class Aseguradora {
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

export class Plan {

    constructor(nombre, precio, bonificacion) {
        this.nombre = nombre.toUpperCase();
        this.precioBase = parseFloat(precio);
        this.bonificacion = parseFloat(bonificacion);
    }
}

export class Vehiculo {
    constructor(marca, modelo) {
        this.marca = marca.toUpperCase();
        this.modelo = modelo.toUpperCase();
        this.activo = true;
    }

    actualizarEstado(estado) {
        this.activo = estado;
    }
}