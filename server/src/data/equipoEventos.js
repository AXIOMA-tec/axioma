// Datos de Equipo y Eventos para el seed. Separado de problemasReales.js
// porque son cosas distintas (quiénes somos / qué está pasando) editadas
// por gente distinta del club — así no hay que buscar entre 93 problemas
// para cambiar el nombre de un integrante o agregar un evento.
//
// Para actualizar: edita el arreglo de aquí abajo y vuelve a correr
// `npm run seed`.

export const miembros = [
  {
    id: 1,
    nombre: 'Hugo André Meza Fierros',
    rol: 'Presidente',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 2,
    nombre: 'Lucero Díaz Ortega',
    rol: 'Vicepresidente',
    foto: null,
    linkedin: 'https://www.linkedin.com/in/lucero-d%C3%ADaz-ortega-98979b354/',
    github: 'https://github.com/Luzdks',
  },
  {
    id: 3,
    nombre: 'Nombre Apellido',
    rol: 'Coordinación de Problemas',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 4,
    nombre: 'Nombre Apellido',
    rol: 'Coordinación de Eventos',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 5,
    nombre: 'Nombre Apellido',
    rol: 'Difusión',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 6,
    nombre: 'Nombre Apellido',
    rol: 'Tesorería',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
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
