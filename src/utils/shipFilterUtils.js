// src/utils/shipFilterUtils.js

export function filterQuizShips(shipArray) {
  return shipArray.filter((ship) => {
    if (!ship || !ship.name) return false

    const lowerName = ship.name.toLowerCase()
    const isTestShip = lowerName.includes('[') || lowerName.includes(']')
    const isEventShip = lowerName.startsWith('arp ') || lowerName.startsWith('al ')
    
    return !isTestShip && !isEventShip
  })
}