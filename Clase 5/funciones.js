const nombres = ["fer", "gerardo","horacio", "juan","pedro","mirta"];

function indiceAleatorio(rango)
{
    let indice = Math.floor(Math.random() * rango);

    return indice;
}

let indice = indiceAleatorio(nombres.length);

console.log(nombres[indice]);