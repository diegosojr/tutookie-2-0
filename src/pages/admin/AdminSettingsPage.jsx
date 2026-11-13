import { useState } from 'react'
import { processImageFile, MAX_FILE_SIZE_MB } from '../../utils/image.js'
import { readSettings, saveSettings } from '../../services/settingsService.js'
import { applyFavicon } from '../../hooks/useFavicon.js'

// Cartão para enviar, ver e remover uma imagem das configurações.
function ImageSetting({
  id,
  title,
  description,
  value,
  processOptions,
  previewClass,
  onChange,
}) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleFile(event) {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    setBusy(true)
    setMessage(null)

    try {
      const dataUrl = await processImageFile(file, processOptions)
      await onChange(dataUrl)
      setMessage({ type: 'success', text: 'Imagem salva com sucesso.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
      input.value = '' // permite escolher o mesmo arquivo de novo
    }
  }

  async function handleRemove() {
    setBusy(true)
    setMessage(null)

    try {
      await onChange('')
      setMessage({ type: 'success', text: 'Imagem removida.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="image-setting" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <p className="field__hint">{description}</p>

      <div className={`image-setting__preview ${previewClass}`}>
        {value ? (
          <img src={value} alt={`Imagem atual: ${title}`} />
        ) : (
          <p>Nenhuma imagem enviada.</p>
        )}
      </div>

      <div className="field">
        <label htmlFor={`${id}-file`}>Escolher nova imagem</label>
        <input
          id={`${id}-file`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          disabled={busy}
          aria-describedby={`${id}-hint`}
        />
        <p className="field__hint" id={`${id}-hint`}>
          JPG, PNG ou WebP, de até {MAX_FILE_SIZE_MB} MB.
        </p>
      </div>

      {busy && (
        <p className="field__hint" role="status">
          Processando...
        </p>
      )}

      {message && (
        <p
          className={`form-alert${message.type === 'success' ? ' form-alert--success' : ''}`}
          role={message.type === 'success' ? 'status' : 'alert'}
        >
          {message.text}
        </p>
      )}

      {value && (
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={handleRemove}
          disabled={busy}
        >
          Remover imagem
        </button>
      )}
    </section>
  )
}

function AdminSettingsPage() {
  const [settings, setSettings] = useState(() => readSettings())

  async function update(key, value) {
    const saved = await saveSettings({ [key]: value })
    setSettings(saved)
    if (key === 'favicon') applyFavicon(saved.favicon)
  }

  return (
    <section className="settings-page">
      <h1>Configurações da loja</h1>
      <p>
        Envie a logomarca, o banner e o ícone da aba. As imagens são reduzidas
        automaticamente e ficam salvas neste navegador.
      </p>

      <ImageSetting
        id="logo"
        title="Logomarca"
        description="Aparece no cabeçalho e no rodapé no lugar do texto. Prefira PNG com fundo transparente."
        value={settings.logo}
        processOptions={{ maxSize: 600, format: 'png' }}
        previewClass="image-setting__preview--logo"
        onChange={(value) => update('logo', value)}
      />

      <ImageSetting
        id="banner"
        title="Banner da página inicial"
        description="Tamanho recomendado: cerca de 1600 × 500 px. Em telas estreitas as bordas podem ser cortadas, então deixe o importante no centro."
        value={settings.banner}
        processOptions={{ maxSize: 1600, format: 'jpeg', quality: 0.8 }}
        previewClass="image-setting__preview--banner"
        onChange={(value) => update('banner', value)}
      />

      <ImageSetting
        id="favicon"
        title="Ícone da aba do navegador"
        description="Use uma imagem quadrada, como o mascote. O centro da imagem é recortado em formato quadrado."
        value={settings.favicon}
        processOptions={{ maxSize: 128, format: 'png', square: true }}
        previewClass="image-setting__preview--icon"
        onChange={(value) => update('favicon', value)}
      />
    </section>
  )
}

export default AdminSettingsPage