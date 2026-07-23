// src/App.jsx
import { useState } from 'react'
import { useShips } from './hooks/useShips'
import { Header } from './components/common/Header'
import { LoadingState } from './components/common/LoadingState'
import { DictionaryView } from './components/dictionary/DictionaryView'
import { QuizView } from './components/quiz/QuizView'

function App() {
  const { ships, loading, error } = useShips()
  const [isQuizMode, setIsQuizMode] = useState(false)

  if (loading || error) {
    return <LoadingState loading={loading} error={error} />
  }

  return (
    <div className="p-6 bg-[#11141a] text-white min-h-screen font-sans antialiased">
      <Header 
        isQuizMode={isQuizMode} 
        onToggleQuizMode={() => setIsQuizMode(!isQuizMode)} 
      />

      {isQuizMode ? (
        <QuizView ships={ships} />
      ) : (
        <DictionaryView ships={ships} />
      )}
    </div>
  )
}

export default App