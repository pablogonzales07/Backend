const boton = document.getElementById("botonFeliz");

//CALLBACK:

const decirHola = () => {
    console.log("Hola");
}

boton.addEventListener("click", decirHola )