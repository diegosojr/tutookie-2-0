// CONFIGURAÇÕES DA LOJA (logomarca, banner e ícone da aba).
// Valores padrão: imagens que ficam dentro do projeto (public/images).
// Valores personalizados: enviados pelo painel admin e salvos no
// localStorage (valem só neste navegador e têm prioridade sobre os padrão).

const SETTINGS_KEY = 'tutookie:settings'

export const defaultSettings = {
  logo: '/images/logo.png',
  banner: '/images/banner.jpg',
  favicon: '/images/mascote.png',
}

function readStored() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY))
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

// Só o que foi enviado pelo painel (usado para saber o que é personalizado)
export function readCustomSettings() {
  return readStored()
}

// Valores finais: personalizado, se existir; senão, o padrão do projeto.
// Leitura imediata (síncrona) para não "piscar" na primeira renderização.
export function readSettings() {
  const stored = readStored()
  const result = { ...defaultSettings }

  for (const key of Object.keys(defaultSettings)) {
    if (stored[key]) result[key] = stored[key]
  }

  return result
}

export async function getSettings() {
  return readSettings()
}

// Valor preenchido = salva a imagem personalizada.
// Valor vazio = apaga a personalizada (volta para a imagem padrão).
export async function saveSettings(changes) {
  const stored = readStored()

  for (const [key, value] of Object.entries(changes)) {
    if (value) stored[key] = value
    else delete stored[key]
  }

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(stored))
  } catch {
    throw new Error(
      'Não foi possível salvar: o espaço de armazenamento do navegador está cheio.',
    )
  }

  return readSettings()
}