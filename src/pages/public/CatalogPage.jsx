import { useEffect, useState } from 'react'
import { listProducts } from '../../services/productService.js'

function CatalogPage() {
  const [total, setTotal] = useState(null)

  useEffect(() => {
    listProducts().then((products) => setTotal(products.length))
  }, [])

  return (
    <section>
      <h1>Catálogo de produtos</h1>
      <p>
        {total === null
          ? 'Carregando...'
          : `Teste do serviço: ${total} produtos carregados.`}
      </p>
    </section>
  )
}

export default CatalogPage