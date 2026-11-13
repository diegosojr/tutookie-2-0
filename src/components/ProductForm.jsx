import { useState } from 'react'
import { Link } from 'react-router'
import {
  TAGS,
  FIELD_ORDER,
  parsePrice,
  priceToInput,
  validateProduct,
} from '../utils/productValidation.js'
import { processImageFile, MAX_FILE_SIZE_MB } from '../utils/image.js'

// Valores iniciais: do produto (edição) ou vazios (cadastro).
function buildInitialValues(product) {
  return {
    nome: product?.nome ?? '',
    descricao: product?.descricao ?? '',
    categoriaId: product?.categoriaId ?? '',
    preco: priceToInput(product?.preco),
    precoPromocional: priceToInput(product?.precoPromocional),
    etiqueta: product?.etiqueta ?? '',
    disponivel: product?.disponivel ?? true,
    imagem: product?.imagem ?? '',
  }
}

function ProductForm({ product, categories, onSubmit, submitLabel }) {
  const [values, setValues] = useState(() => buildInitialValues(product))
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [imageBusy, setImageBusy] = useState(false)

  const hasErrors = Object.values(errors).some(Boolean)

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSubmitError('')
  }

  function handleChange(event) {
    setField(event.target.name, event.target.value)
  }

  // Junta o id da dica e o id do erro para os leitores de tela
  function describedBy(name, hintId) {
    const ids = [hintId, errors[name] ? `erro-${name}` : null].filter(Boolean)
    return ids.length > 0 ? ids.join(' ') : undefined
  }

  async function handleImageChange(event) {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    setImageBusy(true)
    setErrors((current) => ({ ...current, imagem: undefined }))

    try {
      const dataUrl = await processImageFile(file)
      setValues((current) => ({ ...current, imagem: dataUrl }))
    } catch (error) {
      setErrors((current) => ({ ...current, imagem: error.message }))
    } finally {
      setImageBusy(false)
      input.value = '' // permite escolher o mesmo arquivo de novo
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    const found = validateProduct(
      values,
      categories.map((category) => category.id),
    )
    setErrors(found)

    // Leva o foco para o primeiro campo com problema
    const firstInvalid = FIELD_ORDER.find((name) => found[name])
    if (firstInvalid) {
      document.getElementById(`campo-${firstInvalid}`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        nome: values.nome.trim(),
        descricao: values.descricao.trim(),
        categoriaId: values.categoriaId,
        preco: parsePrice(values.preco),
        precoPromocional: parsePrice(values.precoPromocional), // null se vazio
        imagem: values.imagem,
        etiqueta: values.etiqueta,
        disponivel: values.disponivel,
      })
    } catch (error) {
      setSubmitError(error.message)
      setSubmitting(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <p className="field__hint">Campos marcados com * são obrigatórios.</p>

      {hasErrors && (
        <p className="form-alert" role="alert">
          Há campos que precisam de correção. Confira as mensagens abaixo de
          cada campo.
        </p>
      )}

      {submitError && (
        <p className="form-alert" role="alert">
          {submitError}
        </p>
      )}

      <div className="field">
        <label htmlFor="campo-nome">
          Nome <span aria-hidden="true">*</span>
        </label>
        <input
          id="campo-nome"
          name="nome"
          type="text"
          value={values.nome}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={errors.nome ? 'true' : undefined}
          aria-describedby={describedBy('nome')}
        />
        {errors.nome && (
          <p className="field__error" id="erro-nome">
            {errors.nome}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="campo-descricao">
          Descrição <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="campo-descricao"
          name="descricao"
          value={values.descricao}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={errors.descricao ? 'true' : undefined}
          aria-describedby={describedBy('descricao', 'dica-descricao')}
        />
        <p className="field__hint" id="dica-descricao">
          De 10 a 300 caracteres. Atualmente: {values.descricao.trim().length}.
        </p>
        {errors.descricao && (
          <p className="field__error" id="erro-descricao">
            {errors.descricao}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="campo-categoriaId">
          Categoria <span aria-hidden="true">*</span>
        </label>
        <select
          id="campo-categoriaId"
          name="categoriaId"
          value={values.categoriaId}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={errors.categoriaId ? 'true' : undefined}
          aria-describedby={describedBy('categoriaId')}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nome}
            </option>
          ))}
        </select>
        {errors.categoriaId && (
          <p className="field__error" id="erro-categoriaId">
            {errors.categoriaId}
          </p>
        )}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="campo-preco">
            Preço (R$) <span aria-hidden="true">*</span>
          </label>
          <input
            id="campo-preco"
            name="preco"
            type="text"
            inputMode="decimal"
            value={values.preco}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.preco ? 'true' : undefined}
            aria-describedby={describedBy('preco', 'dica-preco')}
          />
          <p className="field__hint" id="dica-preco">
            Use vírgula ou ponto. Exemplo: 14,50.
          </p>
          {errors.preco && (
            <p className="field__error" id="erro-preco">
              {errors.preco}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="campo-precoPromocional">
            Preço promocional (R$)
          </label>
          <input
            id="campo-precoPromocional"
            name="precoPromocional"
            type="text"
            inputMode="decimal"
            value={values.precoPromocional}
            onChange={handleChange}
            aria-invalid={errors.precoPromocional ? 'true' : undefined}
            aria-describedby={describedBy(
              'precoPromocional',
              'dica-precoPromocional',
            )}
          />
          <p className="field__hint" id="dica-precoPromocional">
            Opcional. Precisa ser menor que o preço original.
          </p>
          {errors.precoPromocional && (
            <p className="field__error" id="erro-precoPromocional">
              {errors.precoPromocional}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="campo-etiqueta">Etiqueta</label>
        <select
          id="campo-etiqueta"
          name="etiqueta"
          value={values.etiqueta}
          onChange={handleChange}
          aria-invalid={errors.etiqueta ? 'true' : undefined}
          aria-describedby={describedBy('etiqueta')}
        >
          <option value="">Sem etiqueta</option>
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.etiqueta && (
          <p className="field__error" id="erro-etiqueta">
            {errors.etiqueta}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="campo-imagem">Imagem do produto</label>
        <input
          id="campo-imagem"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          aria-invalid={errors.imagem ? 'true' : undefined}
          aria-describedby={describedBy('imagem', 'dica-imagem')}
        />
        <p className="field__hint" id="dica-imagem">
          JPG, PNG ou WebP, de até {MAX_FILE_SIZE_MB} MB. A imagem é reduzida
          automaticamente antes de ser salva.
        </p>
        {imageBusy && (
          <p className="field__hint" role="status">
            Processando imagem...
          </p>
        )}
        {errors.imagem && (
          <p className="field__error" id="erro-imagem">
            {errors.imagem}
          </p>
        )}
        {values.imagem && (
          <div className="image-preview">
            <img
              src={values.imagem}
              alt="Pré-visualização da imagem do produto"
            />
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={() => setField('imagem', '')}
            >
              Remover imagem
            </button>
          </div>
        )}
      </div>

      <div className="field field--check">
        <input
          id="campo-disponivel"
          name="disponivel"
          type="checkbox"
          checked={values.disponivel}
          onChange={(event) => setField('disponivel', event.target.checked)}
        />
        <label htmlFor="campo-disponivel">Produto disponível para venda</label>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn"
          disabled={submitting || imageBusy}
        >
          {submitting ? 'Salvando...' : submitLabel}
        </button>
        <Link to="/admin/produtos" className="btn btn--secondary">
          Cancelar
        </Link>
      </div>
    </form>
  )
}

export default ProductForm