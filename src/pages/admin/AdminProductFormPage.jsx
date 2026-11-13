import { useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import {
  getProductById,
  listCategories,
  createProduct,
  updateProduct,
} from '../../services/productService.js'
import StatusMessage from '../../components/StatusMessage.jsx'
import ProductForm from '../../components/ProductForm.jsx'

// Serve para as duas rotas:
// /admin/produtos/novo (cadastro) e /admin/produtos/:id/editar (edição).
function AdminProductFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  // No cadastro não há produto para buscar
  const fetchProduct = useCallback(
    () => (isEditing ? getProductById(id) : Promise.resolve(null)),
    [id, isEditing],
  )
  const product = useAsyncData(fetchProduct)
  const categories = useAsyncData(listCategories)

  async function handleSubmit(data) {
    if (isEditing) {
      await updateProduct(id, data)
    } else {
      await createProduct(data)
    }

    // Volta para a lista com uma mensagem de sucesso
    navigate('/admin/produtos', {
      state: {
        feedback: {
          type: 'success',
          text: `Produto "${data.nome}" ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso.`,
        },
      },
    })
  }

  const title = isEditing ? 'Editar produto' : 'Novo produto'
  const isLoading =
    product.status === 'loading' || categories.status === 'loading'
  const hasError = product.status === 'error' || categories.status === 'error'

  let content

  if (isLoading) {
    content = <StatusMessage type="loading" title="Carregando formulário..." />
  } else if (hasError) {
    content = (
      <StatusMessage
        type="error"
        title="Não foi possível carregar o formulário"
        message={(product.error ?? categories.error).message}
        onRetry={() => {
          product.reload()
          categories.reload()
        }}
      />
    )
  } else if (isEditing && product.data === null) {
    content = (
      <StatusMessage
        type="empty"
        title="Produto não encontrado"
        message="Esse produto não existe ou já foi excluído."
      >
        <Link to="/admin/produtos" className="btn">
          Voltar para a lista
        </Link>
      </StatusMessage>
    )
  } else {
    content = (
      <ProductForm
        key={id ?? 'novo'}
        product={product.data}
        categories={categories.data}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar produto'}
      />
    )
  }

  return (
    <section className="form-page">
      <h1>{title}</h1>
      {content}
    </section>
  )
}

export default AdminProductFormPage