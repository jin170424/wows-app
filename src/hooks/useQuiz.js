// src/hooks/useQuiz.js
import { useState, useCallback } from 'react'
import { filterQuizShips } from '../utils/shipFilterUtils'

export function useQuiz(ships) {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedAnswerId, setSelectedAnswerId] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)

  const startNewQuiz = useCallback(() => {
    const quizPool = filterQuizShips(ships)
    if (quizPool.length < 4) return

    const correctShip = quizPool[Math.floor(Math.random() * quizPool.length)]
    const wrongPool = quizPool.filter(s => s.ship_id !== correctShip.ship_id)
    
    const wrongChoices = []
    while (wrongChoices.length < 3) {
      const randomWrong = wrongPool[Math.floor(Math.random() * wrongPool.length)]
      if (!wrongChoices.some(s => s.ship_id === randomWrong.ship_id)) {
        wrongChoices.push(randomWrong)
      }
    }

    const totalChoices = [correctShip, ...wrongChoices].sort(() => Math.random() - 0.5)

    setCurrentQuestion(correctShip)
    setOptions(totalChoices)
    setSelectedAnswerId(null)
    setIsCorrect(null)
  }, [ships])

  const selectAnswer = (shipId) => {
    if (selectedAnswerId !== null) return
    setSelectedAnswerId(shipId)
    setIsCorrect(shipId === currentQuestion?.ship_id)
  }

  return {
    currentQuestion,
    options,
    selectedAnswerId,
    isCorrect,
    startNewQuiz,
    selectAnswer
  }
}