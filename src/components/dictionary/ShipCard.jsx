// src/components/dictionary/ShipCard.jsx
import { NATION_NAMES, TYPE_NAMES } from '../../constants/shipData'

export function ShipCard({ ship }) {
  return (
    <div className="relative w-60 h-80 bg-[#1c2029] border border-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:border-gray-700 hover:shadow-2xl">
      {/* 【前面】通常のカード表示 */}
      <div className="flex flex-col items-center justify-center h-full p-4 transition-all duration-350 ease-out group-hover:opacity-10 group-hover:scale-95">
        {ship.price_gold > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-[10px] text-black font-black rounded uppercase tracking-wider shadow">
            PREM
          </span>
        )}
        <img src={ship.images?.small} alt={ship.name} className="h-24 object-contain filter drop-shadow-md" />
        <h3 className="mt-4 text-md font-bold text-slate-100 text-center px-2 line-clamp-2">{ship.name}</h3>
        <p className="mt-1 text-xs text-gray-400">Tier {ship.tier} | {TYPE_NAMES[ship.type] || ship.type}</p>
        <span className="mt-3 text-[10px] text-gray-400 font-medium border border-gray-800 px-2 py-0.5 rounded-full bg-[#11141a]">
          {NATION_NAMES[ship.nation] || ship.nation}
        </span>
      </div>

      {/* 【背面】競り上がりシャッター */}
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
  )
}