// PROCESSAMENTO DE IMAGENS ENVIADAS PELO ADMIN
// A imagem é reduzida e comprimida antes de ser salva, porque o
// localStorage tem um limite pequeno de espaço (cerca de 5 MB no total).

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_FILE_SIZE_MB = 5

// Recebe um arquivo e devolve o endereço da imagem reduzida (data URL).
// Opções:
// - maxSize: lado maior da imagem final, em pixels
// - format: 'jpeg' (fundo branco, menor) ou 'png' (mantém transparência)
// - quality: qualidade do JPEG, de 0 a 1
// - square: recorta o centro da imagem em formato quadrado
export async function processImageFile(file, options = {}) {
  const {
    maxSize = 1000,
    quality = 0.75,
    format = 'jpeg',
    square = false,
  } = options

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

  // Área da imagem original que será usada
  let sx = 0
  let sy = 0
  let sw = bitmap.width
  let sh = bitmap.height

  if (square) {
    const side = Math.min(sw, sh)
    sx = (sw - side) / 2
    sy = (sh - side) / 2
    sw = side
    sh = side
  }

  // Reduz mantendo a proporção (nunca aumenta a imagem)
  const scale = Math.min(1, maxSize / Math.max(sw, sh))
  const width = Math.round(sw * scale)
  const height = Math.round(sh * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  if (format === 'jpeg') {
    // Fundo branco (PNG com transparência fica branco no JPG)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }

  context.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height)
  bitmap.close()

  return format === 'png'
    ? canvas.toDataURL('image/png')
    : canvas.toDataURL('image/jpeg', quality)
}