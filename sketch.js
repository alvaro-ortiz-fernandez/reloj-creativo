/* ########################################################### */
/* #######################  Variables  ####################### */
/* ########################################################### */
let imgs; // Variable para almacenar las imágenes
let puzle = {
    ancho: 700,
    alto: 360
};
let piezas; // Variable para almacenar las piezas del puzle
let pausa = false; // Variable para controlar el estado del temporizador

/* ########################################################### */
/* ###################  Métodos de p5.js  #################### */
/* ########################################################### */

/**
 * Método invocado por setup() para cargar información necesaria
 * de forma asíncrona (en segundo plano)
 * */
function preload() {
    cargarImagen();
}

/**
 * Método invocado una única vez por p5.js al iniciar el programa
 * para establecer la información necesaria para su funcionamiento
 * */
function setup() {
    // Establecemos el tamaño del marco sobre el que trabajará p5.js
    var canvas = createCanvas(puzle.ancho, puzle.alto);

    // Indicamos que el canvas lo pinte en el div html con el siguiente id
    canvas.parent("canvas-p5");

    // Cargamos las piezas del puzle, de forma desordenada
    piezas = Array.from({ length: 3600 }, (_, i) => i);
    for (let i = piezas.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [piezas[i], piezas[j]] = [piezas[j], piezas[i]];
    }

    // Establecemos las invocaciones por segundo al método draw()
    frameRate(5);
}

/**
 * Método invocado consecutivamente por p5.js
 * para mostrar en pantalla la información del programa
 * */
function draw() {
    // Limpiamos el canvas
    clear();

    // Mostramos la imagen en pantalla
    mostrarImagen();
    
    // Mostramos las líneas que separan las piezas del puzle
    mostrarRejilla();
    
    // Mostramos las piezas del puzle
    mostrarPuzle();

    // Actualizamos la hora en pantalla
    actualizarTemporizador();
}

/* ########################################################### */
/* ####################  Métodos propios  #################### */
/* ########################################################### */

/**
 * Método que definimos para cargar en memoria la imagen.
 * */
function cargarImagen() {
    // Cargamos las imágenes de cada puzle para las 24 horas del día
    imgs = [];
    for (var i = 0; i < 24; i++)
        imgs[i] = loadImage(`assets/images/puzle/${i}.jpg`);
}

/**
 * Método que definimos para mostrar en pantalla la imagen de fondo del puzle.
 * */
function mostrarImagen() {
    // Mostramos la imagen para la hora actual, centrada y ocupando todo su espacio
    var hora = getHora();
    image(imgs[hora], 0, 0, width, height, 0, 0, imgs[hora].width, imgs[hora].height, COVER);
}

/**
 * Método que definimos para mostrar en pantalla la rejilla del puzle.
 * Muestra una rejilla 60x60 (60 segundos para cada uno de los 60 minutos de 1 hora).
 * */
function mostrarRejilla() {
    stroke(0, 0, 0); // Color de trazado
    strokeWeight(0.1); // Grosor de trazado

    // Líneas horizontales
    for (var i = 0; i <= 60; i++) {
        var y = (puzle.alto / 60) * i;

        line(
            0, // Coordenada X del punto inicial de la línea
            y, // Coordenada Y del punto inicial de la línea
            puzle.ancho, // Coordenada X del punto final de la línea
            y  // Coordenada Y del punto final de la línea
        );
    }

    // Líneas verticales
    for (var i = 0; i <= 60; i++) {
        var x = (puzle.ancho / 60) * i;
        var y = 0;
        
        line(
            x, // Coordenada X del punto inicial de la línea
            0, // Coordenada Y del punto inicial de la línea
            x, // Coordenada X del punto final de la línea
            puzle.alto  // Coordenada Y del punto final de la línea
        );
    }
}

/**
 * Método que definimos para mostrar en pantalla las piezas del puzle.
 * */
function mostrarPuzle() {
    stroke(0, 0, 0); // Color de trazado
    strokeWeight(0); // Grosor de trazado

    var hora = getHora();

    // Calculamos el color de fondo de las piezas del puzle
    // en base a la hora actual
    var fondo = color(
        (hora < 12) ? 50 : (50 + ((hora - 11) * (150 / 12))), // Canal R (red, rojo)
        50,  // Canal G (green, verde)
        (hora >= 12) ? 50 : (50 + ((12 - hora) * (150 / 12))) // Canal B (blue, azul)
    );

    fondo.setAlpha(200); // Transparencia
    fill(fondo); // Color de relleno

    var anchoPieza = (puzle.ancho / 60);
    var altoPieza = (puzle.alto / 60);

    // Calculamos el instance actual
    var instante = (getMinuto() * 60) + getSegundo();

    // Recorremos los 60 minutos
    for (var m = 0; m <= 60; m++) {
        // Recorremos los 60 segundos
        for (var s = 0; s <= 60; s++) {
            // Obtenemos la pieza correspondiente al instante que estamos recorriendo
            var pieza = piezas[(m * 60) + s];

            // Si no se ha alcanzado el instante, mostramos un cuadro para ocultar la pieza
            if (pieza >= instante) {
                rect(
                    anchoPieza * m, // Coordenada X de la posición de la pieza
                    altoPieza * s, // Coordenada Y de la posición de la pieza
                    anchoPieza, // Anchura de la pieza
                    altoPieza  // Altura de la pieza
                );
            }
        }
    }
}

/**
 * Método que definimos para obtener la hora actual,
 * en base al temporizador modificable por el usuario.
 * */
function getHora() {
    if (!pausa) {
        return hour();
    } else {
        var hora = document.getElementById("hora").value;
        if (!isNaN(hora) && parseInt(hora) <= 23 && hora.length <= 2)
            return parseInt(hora);
        else
            return 0;
    }
}

/**
 * Método que definimos para obtener el minuto actual,
 * en base al temporizador modificable por el usuario.
 * */
function getMinuto() {
    if (!pausa) {
        return minute();
    } else {
        var minuto = document.getElementById("minuto").value;
        if (!isNaN(minuto) && parseInt(minuto) <= 60 && minuto.length <= 2)
            return parseInt(minuto);
        else
            return 0;
    }
}

/**
 * Método que definimos para obtener el segundo actual,
 * en base al temporizador modificable por el usuario.
 * */
function getSegundo() {
    if (!pausa) {
        return second();
    } else {
        var segundo = document.getElementById("segundo").value;
        if (!isNaN(segundo) && parseInt(segundo) <= 60 && segundo.length <= 2)
            return parseInt(segundo);
        else
            return 0;
    }
}

/**
 * Método que definimos para mostrar en pantalla la hora actual.
 * */
function actualizarTemporizador() {

    if (!pausa) {
        // Los formateamos para que sean de al menos 2 dígitos siempre
        document.getElementById("hora").value = ('0' + getHora()).slice(-2);
        document.getElementById("minuto").value = ('0' + getMinuto()).slice(-2);
        document.getElementById("segundo").value = ('0' + getSegundo()).slice(-2);
    } else {
        var hora = document.getElementById("hora").value;
        var minuto = document.getElementById("minuto").value;
        var segundo = document.getElementById("segundo").value;

        if (isNaN(hora) || parseInt(hora) > 23 || hora.length > 2)
            document.getElementById("hora").value = "00";

        if (isNaN(minuto) || parseInt(minuto) > 60 || minuto.length > 2)
            document.getElementById("minuto").value = "00";

        if (isNaN(segundo) || parseInt(segundo) > 60 || segundo.length > 2)
            document.getElementById("segundo").value = "00";
    }
}

/* ########################################################### */
/* ###################  Eventos de botones  ################## */
/* ########################################################### */
function detener() {
    pausa = true;

    // Invertimos los botones
    document.getElementById("detener").classList.add("d-none");
    document.getElementById("reanudar").classList.remove("d-none");
    
    // Habilitamos las casillas de tiempo
    document.getElementById("hora").removeAttribute("disabled");
    document.getElementById("minuto").removeAttribute("disabled");
    document.getElementById("segundo").removeAttribute("disabled");
}

function reanudar() {
    pausa = false;

    // Invertimos los botones
    document.getElementById("detener").classList.remove("d-none");
    document.getElementById("reanudar").classList.add("d-none");
    
    // Deshabilitamos las casillas de tiempo
    document.getElementById("hora").setAttribute("disabled", "disabled");
    document.getElementById("minuto").setAttribute("disabled", "disabled");
    document.getElementById("segundo").setAttribute("disabled", "disabled");
}