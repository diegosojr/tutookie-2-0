// Navegação entre páginas. "onChange" recebe o número da nova página.
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        type="button"
        className="btn btn--secondary"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Anterior
      </button>

      <ol className="pagination__pages">
        {pages.map((number) => (
          <li key={number}>
            <button
              type="button"
              className={`pagination__page${number === page ? ' is-current' : ''}`}
              aria-label={`Página ${number}`}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => onChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="btn btn--secondary"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Próxima
      </button>
    </nav>
  )
}

export default Pagination