// Subida de imágenes (pósters de eventos) a Cloudinary, directo desde el
// navegador — sin pasar por nuestro servidor, así no necesitamos guardar
// archivos en ningún lado nuestro.
//
// Para activarlo (ver README):
//   1. Crea una cuenta gratis en https://cloudinary.com
//   2. En el dashboard, copia tu "Cloud name".
//   3. Settings → Upload → Upload presets → Add upload preset →
//      Signing Mode: "Unsigned". Copia el nombre del preset.
//   4. En tu .env:
//        VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
//        VITE_CLOUDINARY_UPLOAD_PRESET=tu-preset
//
// Mientras esas variables no existan, el panel de administración deja subir
// eventos sin póster (se ve la fecha en grande, como ya pasa hoy con los
// eventos sin imagen) y no ofrece el botón de subir archivo.
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const cloudinaryConfigurado = Boolean(CLOUD_NAME && UPLOAD_PRESET)

// Sube un archivo y regresa la URL pública de la imagen ya alojada
// (`secure_url`), que es lo que se guarda en `evento.src`.
export async function subirImagen(archivo) {
  if (!cloudinaryConfigurado) {
    throw new Error('Cloudinary no está configurado (ver src/lib/cloudinary.js).')
  }

  const formData = new FormData()
  formData.append('file', archivo)
  formData.append('upload_preset', UPLOAD_PRESET)
  // Carpeta propia para no mezclarse con nada más que suban a esa cuenta.
  formData.append('folder', 'axioma/eventos')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.error?.message || 'No se pudo subir la imagen.')
  }
  return data.secure_url
}

// Sube cualquier archivo (PDF, imagen, lo que sea) para los Recursos
// descargables de /problemas. A diferencia de subirImagen, usa el endpoint
// "auto" de Cloudinary en vez de "image": ese es el que acepta PDFs y otros
// archivos que no son imagen (con /image/upload, un PDF se rechaza).
export async function subirArchivo(archivo) {
  if (!cloudinaryConfigurado) {
    throw new Error('Cloudinary no está configurado (ver src/lib/cloudinary.js).')
  }

  const formData = new FormData()
  formData.append('file', archivo)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'axioma/recursos')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.error?.message || 'No se pudo subir el archivo.')
  }
  return data.secure_url
}
