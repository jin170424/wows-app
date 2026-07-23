// src/components/dictionary/DictionaryView.jsx
import { useState } from 'react'
import { ShipCard } from './ShipCard'

export function DictionaryView({ ships }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedNation, setSelectedNation] = useState('All')

  const filteredShips = ships.filter((ship) => {
    const matchesType = selectedType === 'All' || ship.type === selectedType
    const matchesNation = selectedNation === 'All' || ship.nation === selectedNation
    const matchesSearch = ship.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesNation && matchesSearch
  })

  return (
    <>
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

      <p className="text-center text-sm text-gray-400 mb-6 tracking-wide">
        該当件数: <span className="text-yellow-500 font-bold">{filteredShips.length}</span> 件 / 全体: {ships.length} 件
      </p>

      <div className="flex flex-wrap gap-6 justify-center mt-6">
        {filteredShips.map((ship) => (
          <ShipCard key={ship.ship_id} ship={ship} />
        ))}
      </div>
    </>
  )
}