// src/components/common/Header.jsx
export function Header({ isQuizMode, onToggleQuizMode }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 mb-4">
        World of Warships 艦船図鑑
      </h1>
      <button
        onClick={onToggleQuizMode}
        className={`px-6 py-2.5 rounded-full font-bold shadow-md transition-all duration-300 ${
          isQuizMode 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' 
            : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black'
        }`}
      >
        {isQuizMode ? '📖 図鑑モードに戻る' : '🎮 シルエットクイズに挑戦！'}
      </button>
    </div>
  )
}