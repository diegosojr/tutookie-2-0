const DEFAULT_TITLES = {
  loading: 'Carregando...',
  error: 'Ops, algo deu errado',
  empty: 'Nada por aqui',
}

// Mensagem padrão para os estados de carregamento, erro e lista vazia.
function StatusMessage({ type = 'empty', title, message, onRetry }) {
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
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}

export default StatusMessage