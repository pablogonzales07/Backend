class Persona {
    constructor(nombre, apellido, edad) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.especie = "humano";
        this.amigos = [];
    }
    saludar = () => {
        console.log(`¡Hola soy ${this.nombre}!`);
    }
}

const persona1 = new Persona("Pablo", "Gonzales", 23);

persona1.saludar();