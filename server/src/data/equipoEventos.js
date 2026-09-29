// Datos de Equipo y Eventos para el seed. Separado de problemasReales.js
// porque son cosas distintas (quiénes somos / qué está pasando) editadas
// por gente distinta del club — así no hay que buscar entre 93 problemas
// para cambiar el nombre de un integrante o agregar un evento.
//
// Para actualizar: edita el arreglo de aquí abajo, guarda el archivo y corre
// `npm run seed:equipo` (solo actualiza Equipo y Eventos). NO uses
// `npm run seed` para esto: ese además borra todos los comentarios.
//
// COORDINADORES: cada director puede tener su lista `coordinadores` (1 a 4
// personas). En la página aparece el botón "Ver coordinación" solo si la
// lista tiene gente. Ejemplo, dentro de la ficha del director:
//
//   coordinadores: [
//     { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Proyectos',
//       email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/...' },
//   ],
//
// Solo `nombre` es obligatorio; `rol` (puesto), `email`, `linkedin` y `foto`
// son opcionales (lo que falte simplemente no se muestra).

// `orden` controla en qué posición aparece cada quien (la API los pide
// ordenados por esto, luego por `id` si empatara): sin este campo, Mongo
// siempre los regresaba por `id`, sin importar el orden del arreglo de aquí
// abajo. Los directores sin coordinadores (Gil, Raúl, Alejandro) van juntos
// a propósito: sus tarjetas no llevan el botón "Ver coordinación", así que
// puestos junto a los que sí lo tienen, la fila los estiraba parejo y les
// dejaba un hueco en blanco abajo (ver PanelCoordinacion/MemberCard).
export const miembros = [
  {
    id: 1,
    orden: 1,
    nombre: 'Hugo André Meza Fierros',
    rol: 'Presidente',
    foto: '/equipo/hugo-meza.jpg',
    email: 'A00841695@tec.mx',
    linkedin: 'https://www.linkedin.com/in/hugo-a-meza',
    github: 'https://github.com/hugo-meza',
  },
  {
    id: 2,
    orden: 2,
    nombre: 'Lucero Díaz Ortega',
    rol: 'Vicepresidente',
    foto: '/equipo/lucero-diaz.jpg',
    email: 'A01199346@tec.mx',
    linkedin: 'https://www.linkedin.com/in/lucero-d%C3%ADaz-ortega-98979b354/',
    github: 'https://github.com/Luzdks',
  },
  {
    id: 3,
    orden: 3,
    nombre: 'Gil Brandon Garcia Contreras',
    rol: 'Dirección de Proyectos',
    foto: '/equipo/gil-garcia.jpg',
    email: 'A01254164@tec.mx',
    linkedin: 'https://www.linkedin.com/in/gil-brandon-garc%C3%ADa-contreras',
    github: 'https://github.com/gil-brandon',
  },
  {
    id: 4,
    orden: 4,
    nombre: 'Raúl Correa Ocañas',
    rol: 'Dirección de Vinculación',
    foto: '/equipo/raul-correa.jpg',
    email: 'A01722401@tec.mx',
    linkedin: 'https://www.linkedin.com/in/rcorreao/',
    github: 'https://github.com/Racoo203',
  },
  {
    id: 7,
    orden: 5,
    nombre: 'Alejandro José Alfaro García',
    rol: 'Dirección de Finanzas',
    foto: '/equipo/alejandro-alfaro.jpg',
    email: 'A00842460@tec.mx',
    linkedin: 'https://www.linkedin.com/in/alejandro-j-alfaro-g/',
    // Sin GitHub: el botón simplemente no aparece.
    github: '',
  },
  {
    id: 5,
    orden: 6,
    nombre: 'Emilio Alejandro González Huerta',
    rol: 'Dirección de Comunicación',
    foto: '/equipo/emilio-gonzalez.jpg',
    email: 'A01286440@tec.mx',
    linkedin: 'https://www.linkedin.com/in/emiliogzzh/',
    github: 'https://github.com/emigzzh',
    coordinadores: [
      { nombre: 'Luis Daniel González Alcocer', rol: 'Coordinador de Marketing',
        email: '', linkedin: 'https://www.linkedin.com/in/ludago4499',
        foto: '/equipo/luis-gonzalez.jpg' },
      { nombre: 'Diana Marlene Tovar Martínez', rol: 'Coordinadora de Marketing',
        email: '', linkedin: 'https://mx.linkedin.com/in/diana-marlene-tovar-mart%C3%ADnez-01a8233b3',
        foto: '/equipo/diana-tovar.jpg' },
      { nombre: 'Victoria Beltrán Aguilar', rol: 'Coordinadora de Marketing',
        email: '', linkedin: 'https://www.linkedin.com/in/victoria-beltran-aguilar/',
        foto: '/equipo/victoria-beltran.jpg' },
      { nombre: 'Paola Mireles Ochoa', rol: 'Coordinadora de Marketing',
        email: '', linkedin: 'https://www.linkedin.com/in/paola-mireles-ochoa-6161a7338/',
        foto: '/equipo/paola-mireles.jpg' },
    ],
  },
  {
    id: 6,
    orden: 7,
    nombre: 'Catherine González Díaz',
    rol: 'Dirección de Investigación',
    foto: '/equipo/catherine-gonzalez.jpg',
    email: 'A00845539@tec.mx',
    linkedin: 'https://www.linkedin.com/in/catherine-gonz%C3%A1lez-d%C3%ADaz-9a93a7281',
    github: 'https://github.com/catherinegd7',
    coordinadores: [
      { nombre: 'Ethiel Favila Alvarado', rol: 'Coordinadora de Investigación',
        email: '', linkedin: 'https://www.linkedin.com/in/ethiel-favila-alvarado-459ba2358/',
        github: 'https://github.com/efavilaa', foto: '/equipo/ethiel-favila.jpg' },
      { nombre: 'Elías Perianza Robles', rol: 'Coordinador de Investigación',
        email: '', linkedin: 'https://www.linkedin.com/in/elias-perianza-robles/',
        github: 'https://github.com/Perianza18', foto: '/equipo/elias-perianza.jpg' },
    ],
  },
  {
    id: 8,
    orden: 8,
    nombre: 'Orlando Gael Cardozo Beltrán',
    rol: 'Dirección de Responsabilidad Social',
    foto: '/equipo/orlando-cardozo.jpg',
    email: 'A00841016@tec.mx',
    linkedin: 'https://www.linkedin.com/in/orlando-gael-cardozo-beltr%C3%A1n-884b913b5/',
    // Sin GitHub: el botón simplemente no aparece.
    github: '',
    coordinadores: [
      { nombre: 'Edgar Axel Pérez Flores', rol: 'Coordinador de Responsabilidad Social',
        email: '', linkedin: 'https://www.linkedin.com/in/edgar-axel-flores',
        foto: '/equipo/edgar-perez.jpg' },
      { nombre: 'Angel Everardo Rodríguez Guevara', rol: 'Coordinador de Responsabilidad Social',
        email: '', linkedin: 'https://www.linkedin.com/in/angelrdzg',
        foto: '/equipo/angel-everardo.jpg' },
      { nombre: 'Andres Saul Perez Martinez', rol: 'Coordinador de Responsabilidad Social',
        email: '', linkedin: '', github: 'https://github.com/Andres210212',
        foto: '/equipo/andres-saul.jpg' },
    ],
  },
  // Asesores: van al final a propósito, con `esAsesor: true` — Equipo.jsx
  // les pone su propio encabezado ("Asesores") separado de los directores,
  // porque guían al club pero no son parte de su jerarquía estudiantil.
  {
    id: 9,
    orden: 9,
    nombre: 'Manuel Alejandro Ucan Puc',
    rol: 'Asesor',
    foto: '/equipo/manuel-ucan.jpg',
    email: '',
    linkedin: 'https://www.linkedin.com/in/alejandro-ucan-puc/',
    esAsesor: true,
  },
  {
    id: 10,
    orden: 10,
    nombre: 'Lilia Alanís López',
    rol: 'Asesora',
    foto: '/equipo/lilia-alanis.jpg',
    email: '',
    linkedin: 'https://www.linkedin.com/in/liliaalanislopez/',
    esAsesor: true,
  },
]

// NO hay un arreglo `eventos` aquí a propósito. Antes había uno, con datos
// de prueba viejos — nadie lo tocaba porque los eventos reales se agregan
// y editan por completo desde /admin/eventos, directo a la base de datos.
// Ese arreglo, olvidado, terminó siendo la causa de que un
// `npm run seed:equipo` "inocente" (solo para agregar gente al equipo)
// borrara los eventos reales sin avisar: seed.js/seedEquipo.js ya NO tocan
// la colección Evento en absoluto. Si en algún momento hace falta
// re-sembrar eventos de cero, créalos a mano desde el panel de admin.
