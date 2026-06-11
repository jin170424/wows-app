import { useState, useEffect } from 'react'

function App() {
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedNation, setSelectedNation] = useState('All')

  useEffect(() => {
    const fetchAllShips = async () => {
      try {
        const appId = import.meta.env.VITE_WARGAMING_APP_ID
        
        if (!appId) {
          throw new Error('【環境変数エラー】APIキー（VITE_WARGAMING_APP_ID）が読み込めていません。GitHub Secretsの設定を確認してください。')
        }

        let allShips = []
        let pageNo = 1
        let hasMore = true

        while (hasMore && pageNo <= 15) {
          // アジアサーバー（.asia）から全件取得
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
            hasMore = false // 最終ページ到達の正常終了
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

  // 3つの条件でマルチフィルター
  const filteredShips = ships.filter((ship) => {
    const matchesType = selectedType === 'All' || ship.type === selectedType
    const matchesNation = selectedNation === 'All' || ship.nation === selectedNation
    const matchesSearch = ship.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesNation && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#11141a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">全艦船データを一括読み込み中（数秒かかります）…</p>
        </div>
      </div>
    )
  }

  if (error) return <div className="p-8 text-red-500 bg-[#11141a] min-h-screen text-center font-bold">エラー：{error}</div>

  return (
    <div className="p-6 bg-[#11141a] text-white min-h-screen font-sans antialiased">
      <h1 className="text-3xl font-extrabold text-center mb-8 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
        World of Warships 艦船図鑑
      </h1>
      
      {/* 🛠️ フィルター＆検索 UI セクション（Tailwindでモダンに装飾） */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="船の名前で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 rounded-lg bg-[#1c2029] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 w-64 shadow-md transition-all"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-3 rounded-lg bg-[#1c2029] border border-gray-800 text-white focus:outline-none focus:border-yellow-600 w-56 shadow-md cursor-pointer"
        >
          <option value="All">すべての艦種</option>
          <option value="Destroyer">駆逐艦 (Destroyer)</option>
          <option value="Cruiser">巡洋艦 (Cruiser)</option>
          <option value="Battleship">戦艦 (Battleship)</option>
          <option value="AirCarrier">航空母艦 (AirCarrier)</option>
          <option value="Submarine">潜水艦 (Submarine)</option>
        </select>

        <select
          value={selectedNation}
          onChange={(e) => setSelectedNation(e.target.value)}
          className="p-3 rounded-lg bg-[#1c2029] border border-gray-800 text-white focus:outline-none focus:border-yellow-600 w-56 shadow-md cursor-pointer"
        >
          <option value="All">すべての国家</option>
          <option value="japan">日本 (Japan)</option>
          <option value="usa">アメリカ (USA)</option>
          <option value="ussr">ソ連 (USSR)</option>
          <option value="germany">ドイツ (Germany)</option>
          <option value="uk">イギリス (UK)</option>
          <option value="france">フランス (France)</option>
          <option value="italy">イタリア (Italy)</option>
          <option value="pan_asia">パンアジア (Pan-Asia)</option>
          <option value="europe">ヨーロッパ (Europe)</option>
          <option value="commonwealth">英連邦 (Commonwealth)</option>
        </select>
      </div>

      {/* 📊 件数表示サマリ */}
      <p className="text-center text-sm text-gray-400 mb-6 tracking-wide">
        該当件数: <span className="text-yellow-500 font-bold">{filteredShips.length}</span> 件 / 全体: {ships.length} 件
      </p>

      {/* 🚢 艦船カード一覧 */}
      <div className="flex flex-wrap gap-6 justify-center mt-6">
        {filteredShips.map((ship) => (
          /* ★カード本体（親要素に group を付与、はみ出しを overflow-hidden で隠す） */
          <div 
            key={ship.ship_id} 
            className="relative w-60 h-80 bg-[#1c2029] border border-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:border-gray-700 hover:shadow-2xl"
          >
            {/* 🟦 【前面】通常のカード表示（ホバー時にフワッと薄くなり、少し縮小する演出） */}
            <div className="flex flex-col items-center justify-center h-full p-4 transition-all duration-350 ease-out group-hover:opacity-10 group-hover:scale-95">
              {/* プレミアム艦ならカードの右上にリッチなラベルを配置（絶対配置） */}
              {ship.price_gold > 0 && (
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-[10px] text-black font-black rounded uppercase tracking-wider shadow">
                  PREM
                </span>
              )}
              <img 
                src={ship.images?.small} 
                alt={ship.name} 
                className="h-24 object-contain filter drop-shadow-md" 
              />
              <h3 className="mt-4 text-md font-bold text-slate-100 text-center px-2 line-clamp-2">{ship.name}</h3>
              <p className="mt-1 text-xs text-gray-400">Tier {ship.tier} | {ship.type}</p>
              <span className="mt-3 text-[10px] text-gray-600 uppercase tracking-widest border border-gray-800 px-2 py-0.5 rounded-full">{ship.nation}</span>
            </div>

            {/* 🟨 【背面】下からシャッターのように競り上がってくる詳細画面（translate-y-full から 0 へ動く） */}
            <div className="absolute inset-0 bg-[#0e1118]/95 p-5 flex flex-col justify-between items-center text-center transition-transform duration-350 ease-out transform translate-y-full group-hover:translate-y-0 border border-yellow-600/20 rounded-xl">
              <div className="w-full flex flex-col items-center">
                <h4 className="text-sm font-extrabold text-yellow-500 tracking-wide border-b border-gray-800 pb-1.5 w-full mb-3">
                  {ship.name}
                </h4>
                
                {/* 艦船の解説テキスト（はみ出さないように3行で丸める設定） */}
                <p className="text-[11px] text-gray-300 leading-relaxed text-left line-clamp-5 px-1">
                  {ship.description || "この艦艇の詳細な歴史的背景や、ゲーム内での運用特徴に関するテキストデータがここに表示されます。"}
                </p>
              </div>

              {/* 下部に価格情報を配置 */}
              <div className="text-[11px] text-gray-400 border-t border-gray-800/60 pt-2 w-full flex justify-between px-1">
                <span className="text-gray-500">ゲーム内価格:</span>
                <span className="font-medium text-slate-200">
                  {ship.price_gold > 0 
                    ? `🪙 ${ship.price_gold.toLocaleString()} 金貨` 
                    : ship.price_credit > 0 
                      ? `🪙 ${ship.price_credit.toLocaleString()} 銀貨` 
                      : '非売品 / 特殊'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App