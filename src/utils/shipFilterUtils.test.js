// src/utils/shipFilterUtils.test.js
import { describe, expect, test } from 'vitest'
// 💡 App.jsx ではなく ./shipFilterUtils からインポートするように修正
import { filterQuizShips } from './shipFilterUtils'

describe('filterQuizShips 関数の網羅的フィルタリングテスト', () => {
  test('正常系：空の配列を渡した場合は、エラーにならず空の配列を返すこと', () => {
    const result = filterQuizShips([])
    expect(result).toEqual([])
  })

  test('正常系：すべて通常艦の場合は、1隻も減らずにそのまま返すこと', () => {
    const normalShips = [
      { name: 'Yamato' },
      { name: 'Iowa' },
      { name: 'Bismarck' }
    ]
    const result = filterQuizShips(normalShips)
    expect(result.length).toBe(3)
    expect(result).toEqual(normalShips)
  })

  test('異常系：すべてが排除対象（テスト艦・コラボ艦）の場合は、空の配列を返すこと', () => {
    const badShips = [
      { name: '[Yamato]' },
      { name: 'ARP Kongo' },
      { name: 'AL Yukikaze' }
    ]
    const result = filterQuizShips(badShips)
    expect(result.length).toBe(0)
    expect(result).toEqual([])
  })

  test('境界値：名前のどの位置に [ ] があっても、開発・テスト用艦艇を完全に排除できること', () => {
    const testShips = [
      { name: '[Des Moines]' },
      { name: 'Gearing [T]' },
      { name: 'Mino[ta]ur' }
    ]
    const result = filterQuizShips(testShips)
    expect(result.length).toBe(0)
  })

  test('厳密性：ARP や AL が「名前の途中や末尾」に含まれる通常艦を誤って排除しないこと', () => {
    const trickyShips = [
      { name: 'Karp' },
      { name: 'Galahad' },
      { name: 'Buffalo' }
    ]
    
    const result = filterQuizShips(trickyShips)
    
    expect(result.length).toBe(3)
    expect(result[0].name).toBe('Karp')
    expect(result[1].name).toBe('Galahad')
    expect(result[2].name).toBe('Buffalo')
  })

  test('堅牢性：name プロパティが欠損している（undefined や null）データが混ざっても、クラッシュせずにスキップすること', () => {
    const brokenShips = [
      { name: 'Yamato' },
      { id: 99999 },
      { name: null },
      { name: 'Shimakaze' }
    ]
    
    expect(() => filterQuizShips(brokenShips)).not.toThrow()
    
    const result = filterQuizShips(brokenShips)
    expect(result.length).toBe(2)
    expect(result[0].name).toBe('Yamato')
    expect(result[1].name).toBe('Shimakaze')
  })

  test('厳密性：[ ] や arp, al が「小文字」で入ってきた場合でも、漏らさず確実に排除できること', () => {
    const lowercaseBadShips = [
      { name: '[yamato]' },
      { name: 'arp kongo' },
      { name: 'al yukikaze' },
      { name: 'Yamato' }
    ]
    
    const result = filterQuizShips(lowercaseBadShips)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Yamato')
  })
})