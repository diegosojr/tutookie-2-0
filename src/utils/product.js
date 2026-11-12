// Regra de negócio: um produto está em promoção quando tem preço
// promocional válido (maior que zero) e MENOR que o preço original.
export function hasActivePromotion(product) {
  const promo = Number(product.precoPromocional)
  return promo > 0 && promo < Number(product.preco)
}