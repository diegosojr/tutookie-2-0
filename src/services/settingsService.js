// CONFIGURAÇÕES DA LOJA (logomarca e banner).
// Os valores ficam vazios até o administrador enviar as imagens pelo painel.
// Assim como os produtos, isso usa localStorage (não é um banco de dados real).

const SETTINGS_KEY = 'tutookie:settings'

const defaultSettings = {
  logo: '', // imagem da logomarca (enviada pelo admin)
  banner: '', // imagem do banner principal (enviada pelo admin)
}

export async function getSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY))
    return { ...defaultSettings, ...saved }
  } catch {
    return defaultSettings
  }
}

export async function saveSettings(settings) {
  const merged = { ...(await getSettings()), ...settings }
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
  } catch {
    throw new Error(
      'Não foi possível salvar: o espaço de armazenamento do navegador está cheio.',
    )
  }
  return merged
}