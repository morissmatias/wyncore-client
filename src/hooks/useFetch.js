import { useState, useEffect } from 'react'

export const useFetch = (fetchFn, deps = []) => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetchFn()
      setData(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, deps)

  return { data, loading, error, refetch: load }
}
