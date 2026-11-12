import { Link, useParams } from 'react-router'

// Página provisória: o formulário real entra na Etapa 12.
function AdminProductFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)

  return (
    <section>
      <h1>{isEditing ? 'Editar produto' : 'Novo produto'}</h1>
      <p>
        O formulário de {isEditing ? `edição do produto ${id}` : 'cadastro'}{' '}
        será construído na próxima etapa.
      </p>
      <Link to="/admin/produtos" className="btn btn--secondary">
        Voltar para a lista
      </Link>
    </section>
  )
}

export default AdminProductFormPage