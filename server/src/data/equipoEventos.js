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

export const miembros = [
  {
    id: 1,
    nombre: 'Hugo André Meza Fierros',
    rol: 'Presidente',
    foto: null,
    email: 'A00841695@tec.mx',
    linkedin: 'https://www.linkedin.com/in/hugo-a-meza',
    github: 'https://github.com/hugo-meza',
  },
  {
    id: 2,
    nombre: 'Lucero Díaz Ortega',
    rol: 'Vicepresidente',
    foto: null,
    email: 'A01199346@tec.mx',
    linkedin: 'https://www.linkedin.com/in/lucero-d%C3%ADaz-ortega-98979b354/',
    github: 'https://github.com/Luzdks',
  },
  {
    id: 3,
    nombre: 'Gil Brandon Garcia Contreras',
    rol: 'Dirección de Proyectos',
    foto: null,
    email: 'A01254164@tec.mx',
    linkedin: 'https://www.linkedin.com/in/gil-brandon-garc%C3%ADa-contreras',
    github: 'https://github.com/gil-brandon',
    // Placeholders: reemplazar por los coordinadores reales (ver la plantilla arriba).
    coordinadores: [
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Proyectos',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Proyectos',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Proyectos',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
    ],
  },
  {
    id: 4,
    nombre: 'Raúl Correa Ocañas',
    rol: 'Dirección de Vinculación',
    foto: null,
    email: 'A01722401@tec.mx',
    linkedin: 'https://www.linkedin.com/in/rcorreao/',
    github: 'https://github.com/Racoo203',
    // Placeholders: reemplazar por los coordinadores reales (ver la plantilla arriba).
    coordinadores: [
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Vinculación',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Vinculación',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
    ],
  },
  {
    id: 5,
    nombre: 'Emilio Alejandro González Huerta',
    rol: 'Dirección de Comunicación',
    foto: null,
    email: 'A01286440@tec.mx',
    linkedin: 'https://www.linkedin.com/in/emiliogzzh/',
    github: 'https://github.com/emigzzh',
    // Placeholders: reemplazar por los coordinadores reales (ver la plantilla arriba).
    coordinadores: [
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Comunicación',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Comunicación',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Comunicación',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
    ],
  },
  {
    id: 6,
    nombre: 'Catherine González Díaz',
    rol: 'Dirección de Investigación',
    foto: null,
    email: 'A00845539@tec.mx',
    linkedin: 'https://www.linkedin.com/in/catherine-gonz%C3%A1lez-d%C3%ADaz-9a93a7281',
    github: 'https://github.com/catherinegd7',
    // Placeholders: reemplazar por los coordinadores reales (ver la plantilla arriba).
    coordinadores: [
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Investigación',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Investigación',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
    ],
  },
  {
    id: 7,
    nombre: 'Alejandro José Alfaro García',
    rol: 'Dirección de Finanzas',
    foto: null,
    email: 'A00842460@tec.mx',
    linkedin: 'https://www.linkedin.com/in/alejandro-j-alfaro-g/',
    // Sin GitHub: el botón simplemente no aparece.
    github: '',
    // Placeholders: reemplazar por los coordinadores reales (ver la plantilla arriba).
    coordinadores: [
      { nombre: 'Nombre Apellido', rol: 'Coordinador(a) de Finanzas',
        email: 'A00000000@tec.mx', linkedin: 'https://www.linkedin.com/in/placeholder' },
    ],
  },
]

export const eventos = [
  {
    id: 1,
    tipo: 'proximo',
    titulo: 'Entrenamiento',
    fecha: '29 de agosto',
    lugar: 'A3-109 · 11:00–15:00',
    alt: 'Póster de entrenamiento de matemáticas, 29 de agosto en A3-109',
    src: null,
    link: null,
  },
  {
    id: 2,
    tipo: 'proximo',
    titulo: 'Integration Bee 2026',
    fecha: '31 de agosto – 2 de septiembre',
    lugar: 'Organizado por SEIQ',
    alt: 'Póster de Integration Bee 2026, Tec de Monterrey',
    src: null,
    link: null,
  },
  {
    id: 3,
    tipo: 'proximo',
    titulo: 'Simposium Axioma',
    fecha: 'Fecha por confirmar',
    lugar: '',
    alt: 'Simposium de matemáticas de Axioma',
    src: null,
    link: null,
  },
  {
    id: 4,
    tipo: 'pasado',
    titulo: 'Concurso Putnam',
    fecha: 'Diciembre 2025',
    lugar: '',
    alt: 'Concurso Putnam, edición 2025',
    src: null,
    link: null,
  },
]
