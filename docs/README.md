# PRACTICA 11 - Async Sockets

>Informe para la asignatura de Desarrollo de Sistemas Informáticos
>
>>**Eric Dürr Sierra** - **eric.durr.20@ull.edu.es**
>>
>> **Última modificación**: 8/05/2022
>

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr/badge.svg?branch=master)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr?branch=master)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr)

***CI STATUS***

[![Deploy report](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr/actions/workflows/deploy.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr/actions/workflows/deploy.yml)
[![Sonar-Cloud Analysis](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr/actions/workflows/sonarcloud.yml)
[![Test and coverage](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr/actions/workflows/runtests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-Eric-Durr/actions/workflows/runtests.yml)

***

## [Enlace a la documentación generada con TypeDoc](http://dsi-p11-code-docs.surge.sh/modules.html)

## Indice

- [PRACTICA 11 - Async Sockets](#practica-11---async-sockets)
  - [Enlace a la documentación generada con TypeDoc](#enlace-a-la-documentación-generada-con-typedoc)
  - [Indice](#indice)
  - [Introducción](#introducción)
  - [Objetivos](#objetivos)
  - [Actividades previas](#actividades-previas)
  - [Código reutilizado](#código-reutilizado)
  - [Clase servidor (Server)](#clase-servidor-server)
  - [Clase cliente (Client)](#clase-cliente-client)
  - [programa principal cliente](#programa-principal-cliente)
  - [Para la ejecución](#para-la-ejecución)
  - [Referencias](#referencias)
  - [Estructura del directorio](#estructura-del-directorio)
  - [Comandos npm del repositorio](#comandos-npm-del-repositorio)

***

## Introducción

El siguiente documento pretende servir de registro y justificación
para las soluciones desarrolladas para los ejercicios de la práctica,
además de explicar algunas de las cuestiones planteadas a lo largo del
guión.

***

## Objetivos

El objetivo de la práctica número 11 conlleva aprender a lidiar con las
comunicaciones entre dos Socket, cliente y servidor respectivamente, con
los cuales hacer funcionar las funcionalidades desarrolladas para la
práctica 9. Durante esta práctica se involucran patrones de desarrollo de
pruebas que hacen uso de los eventos y la asíncronía que los envuelve.

Al finalizar el ejercicio práctico el repositorio contendrá:

- Un programa principal para ejecutar el servidor
- Un programa principal para ejecutar las peticiones del cliente
- Los ficheros para la gestión de notas de la práctica 09
- Una clase para manejar las particularidades del cliente (Client)
- Una clase para manejar las peticiones del cliente y la persistencia
  de la aplicación de notas (Server)
- Tests para todas las clases desarrolladas en la práctica.

***

## Actividades previas

A parte de las actividades previas comunes a todas las prácticas, para este
proyecto se ha tenido que recopilar el código de la práctica 09.

Todos los ficheros de configuración y los automatismos para las Github
Actions han sido adaptados a partir de una plantilla.

***

## Código reutilizado

Dado que esta práctica es una extensión de la práctica 09 se va a utilizar de nuevo el código relacionado con la gestión
de notas y usuarios (Notes y User) para hacer que las clases Server y Client sean interfaces que aprovechen las
funcionalidades desarrolladas. Por otro lado el programa principal de la práctica 09 se modifica y refactoriza para
hacer uso de la clase Client

***

## Clase servidor (Server)

La clase servidor se desarrolla para lanzar su ejecución de forma ininterrumpida para capturar todas las peticiones que
los clientes puedan mandar y ejecutando un método concreto formateado en el mensaje que el cliente envía. El mensaje
recibido identifica una acción y los datos para efectuar dicha acción.

El servidor incorpora un método por cada petición a resolver para el cliente en la aplicción de notas, es decir:

- crear un usuario
- eliminar un usuario
- añadir una nota
- borrar una nota
- leer una nota
- editar una nota
- listar todas las notas de un usuario

Todos los anteriores métodos son privados ya que el servidor debe poder manejar exclusívamente de forma interna estas
operaciones sólo cuando un cliente las solicite.

Se añaden algunos métodos fruto de la refactorización y el manejo del objeto Server, como son un método para cerrar el
servidor, cargar un usuario (sus notas) y cambiar las propiedades de una nota.

En cada operación el servidor, a parte de llevar un registro de qué usuario efectúa qué acción, emite un mensaje de
respuesta que contiene el tipo de respuesta (error, success, info, list , red, blue, green o yellow) y el contenido del
mensaje que puede ser un texto con información, el contenido de una nota formateada para impresión o la lista de notas
con el color para cada una. De esta manera el cliente puede capturar cada evento y operar y emitir otro evento para
poder gestionar la información en el programa principal.

***

## Clase cliente (Client)

La clase cliente sirve para lanzar todas las peticiones hacia el servidor relacionadas con la aplicación de notas,
cuando se crea un objeto cliente es cuando se inicia la conexión con el servidor pasando al constructor el puerto al
que se espera conectarse. En este caso y como se espera que la conexión del Socket sea más fugaz por cómo funciona la
interacción con la línea de comandos se maneja directamente en el constructor y se mantiene la conexión como un atributo
de la clase, en lugar de crear un método para lanzarlo de manera ininterrumpida.

La necesidad de que el Socket del cliente sea un atributo facilita la tarea de separar en métodos todas las peticiones y
permite abstraer en un método el manejo de las respueestas provistas por el servidor y a su vez gestionar la emisión de
eventos.

La clase Client y la clase Server heredan de EventEmmiter, no solo para manejar la salida por pantalla del programa
principal sino también para los test con Mocha y Chai asíncronos.

La clase cliente tiene los mismos métodos expresados en el servidor para la aplicación de notas y se encargan de
escribir en el Socket un objeto JSON con la operación a realizar y los datos que necesita. A parte de estos métodos
también se incluye un método para recopilar todos los manejadores/emisores de eventos y otro para cerrar la conexión del
servidor.

Para los test de la clase Client se comprueba en primera instancia que el cliente sea capaz de gestionar cuando no se
conecta con el servidor durante la creación del objeto y sea capaz de emitir un evento. En este caso se sobreescribe
el evento error para emitir un mensaje de aviso.

```ts
describe('Client with no server up', () => {
  it('Testing constructor should fail and handle error from server', (done) => {
    new Client(8888).on('error', (msg) => {
      expect(msg).to.be.eq('Server is down, try again later');
      done();
    });
  });
});
```

Luego cada método es comprobado individualmente para cada una de sus posibles respuestas. Algunos, como aplican en
directorios vacíos es necesario incluir más de un evento para que en el repositorio remoto no fallen los test.

La herramienta de tests, por cómo funciona internamente, puede llegar a ejecutar vairias veces un mismo evento e
interpretar que el `done()` que marca el test unitario como finalizado se ejecuta múltiples veces. Esto se soluciona
revisando los eventos con el método `once(...)` en lugar de `on(...)` permitiendo que Node interprete que se ejecuta una
sóla vez y cierre el listener asociado a ese evento.

***

## programa principal cliente

El programa principal del cliente hace uso de la clase Client para iniciar una conexión con el servidor y, mediante el
paquete `yargs` captura la información de la terminal para lanzar las peticiones, capturar los eventos emitidos por el
objeto Client e imprimir la información correspondiente por pantalla.

Para la captura de información y para la impresión por pantalla se refactorizan las instrucciones ejecutadas en dos
funciones que permiten evitar la duplicidad de código y llamarlas tras el lanzamiento de la petición.

***

## Para la ejecución

En primer lugar es necesario compilar el programa (``npm run build``) por si no existiera el archivo JavaScript a
ejecutar.

El cliente sólo funciona si se lanza el servidor por lo que es necesario ejecutar en otra terminal
`npm run notes-server`

Para continuar se debe ejecutar la petición en el cliente es decir, hay que ejecutar
``npm run  notes-client [opción] -- [argumentos]`` donde las opciones son:

- new-user
- delete-user
- list-notes
- add-note
- edit-note
- read-note
- delete-note

y cuyos argumentos pueden ser:

- --user="nombre de usuario"
- --title="título de la nota"
- --body="contenido de la nota"
- --color=("red", "blue", "green", "yellow")

***

## Referencias

[Guión de la práctica](https://ull-esit-inf-dsi-2122.github.io/prct10-async-fs-process/)

## Estructura del directorio

***

```txt
P11/
|____.github/         (Github actions workflow files)
| |____workflows/
| | |____deploy.yml
| | |____runtests.yml
| | |____sonarcloud.yml
|____dist/            (Transpiled JavaScript code)
|____doc/             (Autogenerated TypeDoc documentation files)
|____docs/            (Assingment report folder)
| |_____config.yml
| |____README.md
|____src/             (Source files for TypeScript code)
|____test/            (Test workbench folder)
|____package.json
|____.gitignore
|____.mocharc.json
|____.eslintrc.json
|____typedoc.json
|____sonar-project.properties
|____tsconfig.json

```

## Comandos npm del repositorio

- **npm test**  `ejecuta los test unitarios`
- **npm run notes-server**  `ejecuta el servidor en el puerto 60300`
- **npm run  notes-client [opción] -- [argumentos]**  `ejecuta una petición del cliente en el puerto 60300`
- **npm run test:watch** `inicia la ejecución de los test unitarios de manera ininterrumpida`
- **npm run test:coverage** `inicia la ejecución de los test junto con la cobertura de código`
- **npm run get:coverage** `transforma el informe de la cobertura de código en formato lcov`
- **npm run build** `ejecuta los test y traduce el código TypeScript a JavaScript`
- **npm run docs** `Genera la documentación de código con TypeDoc del código fuente`
