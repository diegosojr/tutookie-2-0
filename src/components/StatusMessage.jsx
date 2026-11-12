const DEFAULT_TITLES = {
  loading: 'Carregando...',
  error: 'Ops, algo deu errado',
  empty: 'Nada por aqui',
}

// Mensagem padrão para os estados de carregamento, erro e lista vazia.
// - onRetry: se informado, aparece um botão (texto em "actionLabel").
// - children: conteúdo extra (por exemplo, um link) mostrado abaixo da mensagem.
function StatusMessage({
  type = 'empty',
  title,
  message,
  onRetry,
  actionLabel = 'Tentar novamente',
  children,
}) {
  return (
    <div
      className={`status status--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {type === 'loading' && (
        <span className="status__spinner" aria-hidden="true" />
      )}
      <p className="status__title">{title ?? DEFAULT_TITLES[type]}</p>
      {message && <p className="status__message">{message}</p>}
      {children}
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default StatusMessage