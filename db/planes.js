export const planes = [
    {
        nombre: "BRONCE",
        precioBase: 15000,
        bonificacion: 10
    },
    {
        nombre: "SILVER",
        precioBase: 45000,
        bonificacion: 20
    },
    {
        nombre: "GOLD",
        precioBase: 70000,
        bonificacion: 30
    }
]

JSON.parse(localStorage.getItem("planes")) || localStorage.setItem("planes", JSON.stringify(planes));
