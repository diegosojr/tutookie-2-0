import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validação do formulário: devolve um objeto com as mensagens de erro.
function validate({ email, password }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Digite um e-mail válido, como nome@exemplo.com.'
  }

  if (!password) {
    errors.password = 'Informe sua senha.'
  } else if (password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.'
  }

  return errors
}

function LoginPage() {
  const { user, login, loginAsCustomer, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Já logado: mostra um resumo da conta em vez do formulário
  if (user) {
    return (
      <section className="auth-card">
        <h1>Sua conta</h1>
        <p>
          Você entrou como <strong>{user.nome}</strong> (
          {user.perfil === 'admin' ? 'administrador' : 'cliente'}).
        </p>
        <div className="auth-card__actions">
          {user.perfil === 'admin' && (
            <Link to="/admin" className="btn">
              Ir para o painel
            </Link>
          )}
          <Link to="/produtos" className="btn btn--secondary">
            Ver produtos
          </Link>
          <button type="button" className="btn btn--secondary" onClick={logout}>
            Sair
          </button>
        </div>
      </section>
    )
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    const found = validate(values)
    setErrors(found)

    // Leva o foco para o primeiro campo com problema
    if (found.email) {
      emailRef.current?.focus()
      return
    }
    if (found.password) {
      passwordRef.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      const loggedUser = await login(values.email, values.password)
      const from = location.state?.from
      navigate(from ?? (loggedUser.perfil === 'admin' ? '/admin' : '/'), {
        replace: true,
      })
    } catch (error) {
      setSubmitError(error.message)
      setSubmitting(false)
    }
  }

  async function handleCustomerLogin() {
    setSubmitError('')
    setErrors({})
    setSubmitting(true)

    try {
      await loginAsCustomer()
      navigate('/', { replace: true })
    } catch (error) {
      setSubmitError(error.message)
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <h1 className="auth-card__title">Faça seu login</h1>
      <p className="auth-card__lead">Informe seu e-mail e sua senha.</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <p className="form-alert" role="alert">
            {submitError}
          </p>
        )}

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            ref={emailRef}
            value={values.email}
            onChange={handleChange}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p className="field__error" id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            ref={passwordRef}
            value={values.password}
            onChange={handleChange}
            aria-invalid={errors.password ? 'true' : undefined}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p className="field__error" id="password-error">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn--block"
          disabled={submitting}
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="auth-divider">
        <span>ou</span>
      </p>

      <button
        type="button"
        className="btn btn--secondary btn--block"
        onClick={handleCustomerLogin}
        disabled={submitting}
      >
        Entrar como cliente
      </button>
      <p className="auth-card__note">
        Acesso rápido de demonstração, sem cadastro.
      </p>
    </section>
  )
}

export default LoginPage