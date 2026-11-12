import { useCallback, useEffect, useState } from 'react'

// Carrega dados de uma função assíncrona e informa o estado:
// 'loading' (carregando), 'success' (deu certo) ou 'error' (falhou).
// "reload" tenta carregar de novo.
// Importante: a função recebida precisa ter sempre a mesma identidade
// (por exemplo, uma função importada de um serviço).
export function useAsyncData(fetcher) {
  const [state, setState] = useState({
    status: 'loading',
    data: null,
    error: null,
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', data: null, error })
      })

    return () => {
      cancelled = true
    }
  }, [fetcher, attempt])

  const reload = useCallback(() => {
    setState({ status: 'loading', data: null, error: null })
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, reload }
}