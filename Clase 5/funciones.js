const nombres = ["fer", "gerardo","horacio", "juan","pedro","mirta"];

function indiceAleatorio(rango)
{
    let indice = Math.floor(Math.random() * rango);

    return indice;
}

let indice = indiceAleatorio(nombres.length);

console.log(nombres[indice]);

let padre = document.getElementById("personas");
let personas = ["juan","flor","fer"];

for(const persona of personas)
{
    let li = document.createElement("li");
    li.innerHTML = persona;
    padre.appendChild(li);
}