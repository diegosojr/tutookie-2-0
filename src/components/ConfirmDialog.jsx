import { useEffect, useRef } from 'react'

// Janela de confirmação (usa o <dialog> nativo do navegador).
// O navegador já prende o foco do teclado dentro dela e fecha com Esc.
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  busy = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
      onCancel={(event) => {
        // Esc: usamos nossa própria função para fechar
        event.preventDefault()
        if (!busy) onCancel()
      }}
    >
      <h2 id="dialog-title">{title}</h2>
      <p id="dialog-message">{message}</p>
      <div className="dialog__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onCancel}
          disabled={busy}
          autoFocus
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Excluindo...' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog