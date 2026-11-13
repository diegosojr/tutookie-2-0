// CONFIGURAÇÕES DA LOJA (logomarca, banner e ícone da aba).
// Os valores ficam vazios até o administrador enviar as imagens pelo painel.
// Assim como os produtos, isso usa localStorage (não é um banco de dados real).

const SETTINGS_KEY = 'tutookie:settings'

const defaultSettings = {
  logo: '', // logomarca (cabeçalho e rodapé)
  banner: '', // banner da página inicial
  favicon: '', // ícone da aba do navegador
}

// Leitura imediata (síncrona). Útil para mostrar a logomarca já na
// primeira renderização, sem "piscar" o texto antes da imagem.
export function readSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY))
    return { ...defaultSettings, ...saved }
  } catch {
    return { ...defaultSettings }
  }
}

export async function getSettings() {
  return readSettings()
}

export async function saveSettings(changes) {
  const merged = { ...readSettings(), ...changes }

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
  } catch {
    throw new Error(
      'Não foi possível salvar: o espaço de armazenamento do navegador está cheio.',
    )
  }

  return merged
}