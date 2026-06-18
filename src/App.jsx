import { useState, useEffect } from 'react'

function App() {
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // 検索・フィルター用State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedNation, setSelectedNation] = useState('All')

  // ★クイズ用State
  const [isQuizMode, setIsQuizMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null) // 正解の船
  const [options, setOptions] = useState([])                    // 4択の選択肢
  const [selectedAnswerId, setSelectedAnswerId] = useState(null)// ユーザーが選んだID
  const [isCorrect, setIsCorrect] = useState(null)              // 正解かどうかのフラグ

  useEffect(() => {
    const fetchAllShips = async () => {
      try {
        const appId = import.meta.env.VITE_WARGAMING_APP_ID
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

  // 📝 1. 通常の図鑑用マルチフィルター
  const filteredShips = ships.filter((ship) => {
    const matchesType = selectedType === 'All' || ship.type === selectedType
    const matchesNation = selectedNation === 'All' || ship.nation === selectedNation
    const matchesSearch = ship.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesNation && matchesSearch
  })

  // 📝 2. ★クイズ用の「綺麗なプール」を作る（鋭い指摘のあったノイズを除去！）
  const quizPool = ships.filter((ship) => {
    // 名前に "[" が含まれるテスト艦を除外
    const isTestShip = ship.name.includes('[') || ship.name.includes(']')
    // ARP（アルペジオ）や AL（アズレン）などの特殊コラボ艦を除外（お好みで調整してね）
    const isEventShip = ship.name.startsWith('ARP ') || ship.name.startsWith('AL ')
    
    return !isTestShip && !isEventShip
  })

  // 📝 3. ★新しくクイズを1問生成する関数
  const startNewQuiz = () => {
    if (quizPool.length < 4) return

    // プールからランダムに1隻「正解」を選ぶ
    const correctShip = quizPool[Math.floor(Math.random() * quizPool.length)]
    
    // 正解以外の船をプールから集める
    const wrongPool = quizPool.filter(s => s.ship_id !== correctShip.ship_id)
    
    // ランダムに3隻の「ハズレ」を選ぶ
    const wrongChoices = []
    while (wrongChoices.length < 3) {
      const randomWrong = wrongPool[Math.floor(Math.random() * wrongPool.length)]
      if (!wrongChoices.some(s => s.ship_id === randomWrong.ship_id)) {
        wrongChoices.push(randomWrong)
      }
    }

    // 正解とハズレを合体させてシャッフル（4択にする）
    const totalChoices = [correctShip, ...wrongChoices].sort(() => Math.random() - 0.5)

    // クイズの状態を初期化してセット
    setCurrentQuestion(correctShip)
    setOptions(totalChoices)
    setSelectedAnswerId(null)
    setIsCorrect(null)
  }

  // クイズモードへの切り替え時のトリガー
  const toggleQuizMode = () => {
    const nextMode = !isQuizMode
    setIsQuizMode(nextMode)
    if (nextMode) {
      startNewQuiz()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#11141a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">全艦船データを一括読み込み中…</p>
        </div>
      </div>
    )
  }

  if (error) return <div className="p-8 text-red-500 bg-[#11141a] min-h-screen text-center font-bold">エラー：{error}</div>

  return (
    <div className="p-6 bg-[#11141a] text-white min-h-screen font-sans antialiased">
      {/* ヘッダーエリア */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 mb-4">
          World of Warships 艦船図鑑
        </h1>
        {/* モード切り替えボタン */}
        <button
          onClick={toggleQuizMode}
          className={`px-6 py-2.5 rounded-full font-bold shadow-md transition-all duration-300 ${
            isQuizMode 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' 
              : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black'
          }`}
        >
          {isQuizMode ? '📖 図鑑モードに戻る' : '🎮 シルエットクイズに挑戦！'}
        </button>
      </div>
      
      {/* 🎮 ---------------- クイズモードの画面 ---------------- 🎮 */}
      {isQuizMode && currentQuestion && (
        <div className="max-w-xl mx-auto bg-[#1c2029] border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
          <h2 className="text-xl font-bold text-yellow-500 mb-4 tracking-wide">この船のシルエットは何だ？！</h2>
          
          {/* シルエット画像エリア */}
          <div className="relative w-full h-48 bg-gradient-to-b from-slate-500 to-slate-800 rounded-xl flex items-center justify-center p-4 border border-gray-800 mb-6 overflow-hidden">
            <img 
              src={currentQuestion.images?.large || currentQuestion.images?.small} 
              alt="Quiz Silhouette" 
              // ★ここがTailwindの魔法！回答前なら brightness-0 で真っ黒なシルエットにし、回答後は本来の姿を見せる
              className={`h-full object-contain transition-all duration-500 filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.1)] ${
                selectedAnswerId === null ? 'brightness-0' : 'brightness-100'
              }`}
            />
          </div>

          {/* ヒント情報 */}
          <div className="w-full bg-[#11141a] p-3 rounded-lg text-xs text-gray-400 mb-6 flex justify-around border border-gray-900/50">
            <p>国家: <span className="text-slate-200 font-bold uppercase">{currentQuestion.nation}</span></p>
            <p>艦種: <span className="text-slate-200 font-bold">{currentQuestion.type}</span></p>
            <p>Tier: <span className="text-slate-200 font-bold">{currentQuestion.tier}</span></p>
          </div>

          {/* 4択ボタンエリア */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
            {options.map((option) => {
              // ボタンの色付けロジック
              let btnClass = "bg-[#252b37] border-gray-800 text-slate-200 hover:bg-[#2e3545] hover:border-gray-700"
              
              if (selectedAnswerId !== null) {
                if (option.ship_id === currentQuestion.ship_id) {
                  // 正解のボタンは緑
                  btnClass = "bg-green-900/80 border-green-500 text-green-200 font-bold cursor-default"
                } else if (option.ship_id === selectedAnswerId) {
                  // 自分が選んで間違えたボタンは赤
                  btnClass = "bg-red-900/80 border-red-500 text-red-200 cursor-default"
                } else {
                  // それ以外の選択肢は無効化トーン
                  btnClass = "bg-[#11141a] border-gray-900 text-gray-600 cursor-default"
                }
              }

              return (
                <button
                  key={option.ship_id}
                  disabled={selectedAnswerId !== null}
                  onClick={() => {
                    setSelectedAnswerId(option.ship_id)
                    setIsCorrect(option.ship_id === currentQuestion.ship_id)
                  }}
                  className={`p-3 text-sm border rounded-xl transition-all text-center truncate ${btnClass}`}
                >
                  {option.name}
                </button>
              )
            })}
          </div>

          {/* 結果＆次の問題エリア */}
          {selectedAnswerId !== null && (
            <div className="w-full text-center animate-fade-in">
              <p className={`text-xl font-extrabold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '🎉 正解！お見事！' : '❌ 残念！不正解！'}
              </p>
              
              {/* 正解発表時の艦船説明文 */}
              <p className="text-xs text-gray-400 text-left bg-[#11141a] p-3 rounded-lg mb-4 line-clamp-3 leading-relaxed">
                {currentQuestion.description || "この艦艇に関する詳細なデータが登録されています。"}
              </p>

              <button
                onClick={startNewQuiz}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors shadow"
              >
                次の問題へ ➡️
              </button>
            </div>
          )}
        </div>
      )}

      {/* 📖 ---------------- 通常の図鑑モードの画面 ---------------- 📖 */}
      {!isQuizMode && (
        <>
          {/* フィルター UI セクション */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <input
              type="text"
              placeholder="船の名前で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 rounded-lg bg-[#1c2029] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 w-64 shadow-md transition-all"
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

          {/* 件数表示サマリ */}
          <p className="text-center text-sm text-gray-400 mb-6 tracking-wide">
            該当件数: <span className="text-yellow-500 font-bold">{filteredShips.length}</span> 件 / 全体: {ships.length} 件
          </p>

          {/* 🚢 艦船カード一覧 */}
          <div className="flex flex-wrap gap-6 justify-center mt-6">
            {filteredShips.map((ship) => (
              <div 
                key={ship.ship_id} 
                className="relative w-60 h-80 bg-[#1c2029] border border-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:border-gray-700 hover:shadow-2xl"
              >
                {/* 【前面】通常のカード表示 */}
                <div className="flex flex-col items-center justify-center h-full p-4 transition-all duration-350 ease-out group-hover:opacity-10 group-hover:scale-95">
                  {ship.price_gold > 0 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-[10px] text-black font-black rounded uppercase tracking-wider shadow">
                      PREM
                    </span>
                  )}
                  <img src={ship.images?.small} alt={ship.name} className="h-24 object-contain filter drop-shadow-md" />
                  <h3 className="mt-4 text-md font-bold text-slate-100 text-center px-2 line-clamp-2">{ship.name}</h3>
                  <p className="mt-1 text-xs text-gray-400">Tier {ship.tier} | {ship.type}</p>
                  <span className="mt-3 text-[10px] text-gray-600 uppercase tracking-widest border border-gray-800 px-2 py-0.5 rounded-full">{ship.nation}</span>
                </div>

                {/* 【背面】シャッター */}
                <div className="absolute inset-0 bg-[#0e1118]/95 p-5 flex flex-col justify-between items-center text-center transition-transform duration-350 ease-out transform translate-y-full group-hover:translate-y-0 border border-yellow-600/20 rounded-xl">
                  <div className="w-full flex flex-col items-center">
                    <h4 className="text-sm font-extrabold text-yellow-500 tracking-wide border-b border-gray-800 pb-1.5 w-full mb-3">{ship.name}</h4>
                    <p className="text-[11px] text-gray-300 leading-relaxed text-left line-clamp-5 px-1">{ship.description || "詳細なテキストデータがここに表示されます。"}</p>
                  </div>
                  <div className="text-[11px] text-gray-400 border-t border-gray-800/60 pt-2 w-full flex justify-between px-1">
                    <span className="text-gray-500">ゲーム内価格:</span>
                    <span className="font-medium text-slate-200">
                      {ship.price_gold > 0 ? `🪙 ${ship.price_gold.toLocaleString()} 金貨` : ship.price_credit > 0 ? `🪙 ${ship.price_credit.toLocaleString()} 銀貨` : '非売品 / 特殊'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App