// src/hooks/useShips.js
import { useState, useEffect } from 'react'

export function useShips() {
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllShips = async () => {
      try {
        const appId = import.meta.env.VITE_WARGAMING_APP_ID
        
        if (!appId) {
          throw new Error('【環境変数エラー】APIキー（VITE_WARGAMING_APP_ID）が読み込めていません。環境変数の設定を確認してください。')
        }

        let allShips = []
        let pageNo = 1
        let hasMore = true

        while (hasMore && pageNo <= 15) {
          const url = `https://api.worldofwarships.asia/wows/encyclopedia/ships/?application_id=${appId}&language=ja&page_no=${pageNo}`
          
          const res = await fetch(url)
          if (!res.ok) throw new Error(`${pageNo}ページの取得に失敗しました`)
          
          const json = await res.json()

          if (json.status === 'ok') {
            const shipArray = Object.values(json.data)
            if (shipArray.length === 0) {
              hasMore = false
            } else {
              allShips = [...allShips, ...shipArray]
              pageNo++
            }
          } else if (json.error?.message === 'PAGE_NO_NOT_FOUND') {
            hasMore = false
          } else {
            throw new Error(json.error?.message || 'APIエラーが発生しました')
          }
        }
        setShips(allShips)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllShips()
  }, [])

  return { ships, loading, error }
}