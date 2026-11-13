// PROCESSAMENTO DE IMAGENS ENVIADAS PELO ADMIN
// A imagem é reduzida e comprimida antes de ser salva, porque o
// localStorage tem um limite pequeno de espaço (cerca de 5 MB no total).

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_FILE_SIZE_MB = 5

// Recebe um arquivo e devolve o endereço da imagem reduzida (data URL).
export async function processImageFile(
  file,
  { maxSize = 1000, quality = 0.75 } = {},
) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Formato não aceito. Envie uma imagem JPG, PNG ou WebP.')
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(
      `A imagem é muito grande. O tamanho máximo é ${MAX_FILE_SIZE_MB} MB.`,
    )
  }

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('Não foi possível ler essa imagem. Tente outro arquivo.')
  }

  // Reduz mantendo a proporção (nunca aumenta a imagem)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  // Fundo branco (PNG com transparência fica branco no JPG)
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', quality)
}