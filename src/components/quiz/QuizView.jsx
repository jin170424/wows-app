// src/components/quiz/QuizView.jsx
import { useEffect } from 'react'
import { useQuiz } from '../../hooks/useQuiz'
import { NATION_NAMES, TYPE_NAMES } from '../../constants/shipData'

export function QuizView({ ships }) {
  const {
    currentQuestion,
    options,
    selectedAnswerId,
    isCorrect,
    startNewQuiz,
    selectAnswer
  } = useQuiz(ships)

  useEffect(() => {
    startNewQuiz()
  }, [startNewQuiz])

  if (!currentQuestion) return null

  return (
    <div className="max-w-xl mx-auto bg-[#1c2029] border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
      <h2 className="text-xl font-bold text-yellow-500 mb-4 tracking-wide">この船のシルエットは何だ？！</h2>
      
      <div className="relative w-full h-48 bg-gradient-to-b from-slate-500 to-slate-800 rounded-xl flex items-center justify-center p-4 border border-gray-800 mb-6 overflow-hidden">
        <img 
          src={currentQuestion.images?.large || currentQuestion.images?.small} 
          alt="Quiz Silhouette" 
          className={`h-full object-contain transition-all duration-500 filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.1)] ${
            selectedAnswerId === null ? 'brightness-0' : 'brightness-100'
          }`}
        />
      </div>

      <div className="w-full bg-[#11141a] p-3 rounded-lg text-xs text-gray-400 mb-6 flex justify-around border border-gray-900/50">
        <p>国家: <span className="text-slate-200 font-bold">{NATION_NAMES[currentQuestion.nation] || currentQuestion.nation}</span></p>
        <p>艦種: <span className="text-slate-200 font-bold">{TYPE_NAMES[currentQuestion.type] || currentQuestion.type}</span></p>
        <p>Tier: <span className="text-slate-200 font-bold">Tier {currentQuestion.tier}</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
        {options.map((option) => {
          let btnClass = "bg-[#252b37] border-gray-800 text-slate-200 hover:bg-[#2e3545] hover:border-gray-700"
          
          if (selectedAnswerId !== null) {
            if (option.ship_id === currentQuestion.ship_id) {
              btnClass = "bg-green-900/80 border-green-500 text-green-200 font-bold cursor-default"
            } else if (option.ship_id === selectedAnswerId) {
              btnClass = "bg-red-900/80 border-red-500 text-red-200 cursor-default"
            } else {
              btnClass = "bg-[#11141a] border-gray-900 text-gray-600 cursor-default"
            }
          }

          return (
            <button
              key={option.ship_id}
              disabled={selectedAnswerId !== null}
              onClick={() => selectAnswer(option.ship_id)}
              className={`p-3 text-sm border rounded-xl transition-all text-center truncate ${btnClass}`}
            >
              {option.name}
            </button>
          )
        })}
      </div>

      {selectedAnswerId !== null && (
        <div className="w-full text-center">
          <p className={`text-xl font-extrabold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? '🎉 正解！お見事！' : '❌ 残念！不正解！'}
          </p>
          
          <div className="text-xs text-gray-400 text-left bg-[#11141a] p-3 rounded-lg mb-4 max-h-28 overflow-y-auto leading-relaxed pr-2">
            {currentQuestion.description || "この艦艇に関する詳細なデータが登録されています。"}
          </div>

          <button
            onClick={startNewQuiz}
            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors shadow"
          >
            次の問題へ ➡️
          </button>
        </div>
      )}
    </div>
  )
}