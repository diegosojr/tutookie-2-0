import { useParams } from 'react-router'

function ProductDetailPage() {
  const { id } = useParams()

  return (
    <section>
      <h1>Detalhes do produto</h1>
      <p>
        Você está vendo o produto de id: <strong>{id}</strong>
      </p>
    </section>
  )
}

export default ProductDetailPage