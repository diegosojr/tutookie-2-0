import { initialProducts } from '../data/products.js'
import { initialCategories } from '../data/categories.js'

// CAMADA DE SERVIÇO (dados simulados + localStorage).
// As páginas só chamam as funções daqui. No futuro, trocamos o interior
// de cada função por chamadas fetch() à API REST, sem mexer nas páginas.
//
// ATENÇÃO: localStorage NÃO é um banco de dados real. Os dados ficam só
// neste navegador e não são compartilhados com outros aparelhos.

const PRODUCTS_KEY = 'tutookie:products'
const CATEGORIES_KEY = 'tutookie:categories'
const FAKE_DELAY_MS = 600 // atraso simulado para mostrar o "carregando"

// ---- Controles de demonstração (para a apresentação) ----
// Permitem forçar o estado de ERRO e o de LISTA VAZIA.
const DEMO_ERROR_KEY = 'tutookie:demo-error'
const DEMO_EMPTY_KEY = 'tutookie:demo-empty'

export function getDemoFlags() {
  return {
    error: localStorage.getItem(DEMO_ERROR_KEY) === 'true',
    empty: localStorage.getItem(DEMO_EMPTY_KEY) === 'true',
  }
}

export function setDemoFlag(name, value) {
  const key = name === 'error' ? DEMO_ERROR_KEY : DEMO_EMPTY_KEY
  localStorage.setItem(key, String(value))
}

// ---- Funções auxiliares internas ----
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readList(key, initialValue) {
  const saved = localStorage.getItem(key)
  if (saved === null) {
    localStorage.setItem(key, JSON.stringify(initialValue))
    return initialValue
  }
  try {
    return JSON.parse(saved)
  } catch {
    return initialValue
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // Acontece quando o localStorage está cheio (limite de ~5 MB)
    throw new Error(
      'Não foi possível salvar: o espaço de armazenamento do navegador está cheio.',
    )
  }
}

async function simulateRequest() {
  await wait(FAKE_DELAY_MS)
  if (getDemoFlags().error) {
    throw new Error('Não foi possível carregar os dados. Tente novamente.')
  }
}

// ---- Categorias ----
export async function listCategories() {
  await simulateRequest()
  return readList(CATEGORIES_KEY, initialCategories)
}

// ---- Produtos ----
export async function listProducts() {
  await simulateRequest()
  if (getDemoFlags().empty) return []
  return readList(PRODUCTS_KEY, initialProducts)
}

export async function getProductById(id) {
  await simulateRequest()
  const products = readList(PRODUCTS_KEY, initialProducts)
  return products.find((product) => product.id === String(id)) ?? null
}

export async function createProduct(data) {
  await wait(FAKE_DELAY_MS)
  const products = readList(PRODUCTS_KEY, initialProducts)
  const newProduct = { ...data, id: String(Date.now()) }
  writeList(PRODUCTS_KEY, [...products, newProduct])
  return newProduct
}

export async function updateProduct(id, data) {
  await wait(FAKE_DELAY_MS)
  const products = readList(PRODUCTS_KEY, initialProducts)
  const updated = products.map((product) =>
    product.id === String(id) ? { ...product, ...data, id: product.id } : product,
  )
  writeList(PRODUCTS_KEY, updated)
  return updated.find((product) => product.id === String(id)) ?? null
}

export async function deleteProduct(id) {
  await wait(FAKE_DELAY_MS)
  const products = readList(PRODUCTS_KEY, initialProducts)
  writeList(
    PRODUCTS_KEY,
    products.filter((product) => product.id !== String(id)),
  )
}