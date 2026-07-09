import { describe, expect, test } from 'vitest'
import { filterQuizShips } from './App.jsx'

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
      { name: '[Des Moines]' }, // 先頭にある
      { name: 'Gearing [T]' },   // 末尾にある
      { name: 'Mino[ta]ur' }     // 途中にある
    ]
    const result = filterQuizShips(testShips)
    expect(result.length).toBe(0)
  })

  test('厳密性：ARP や AL が「名前の途中や末尾」に含まれる通常艦を誤って排除しないこと', () => {
    const trickyShips = [
      { name: 'Karp' },        // 名前の後ろに "arp" が含まれる通常艦
      { name: 'Galahad' },     // 名前の先頭に "AL" が含まれるが、後ろにスペースがない通常艦
      { name: 'Buffalo' }      // 名前の途中に "al" が含まれる通常艦
    ]
    
    const result = filterQuizShips(trickyShips)
    
    // 判定条件が正確なら、これらはすべて除外されずに残る
    expect(result.length).toBe(3)
    expect(result[0].name).toBe('Karp')
    expect(result[1].name).toBe('Galahad')
    expect(result[2].name).toBe('Buffalo')
  })

  test('堅牢性：name プロパティが欠損している（undefined や null）データが混ざっても、クラッシュせずにスキップすること', () => {
    const brokenShips = [
      { name: 'Yamato' },
      { id: 99999 },            // ❌ name プロパティ自体が無いデータ
      { name: null },           // ❌ name が null のデータ
      { name: 'Shimakaze' }
    ]
    
    // 実行したときにエラー（例外）でアプリが落ちないことを検証
    expect(() => filterQuizShips(brokenShips)).not.toThrow()
    
    // 生き残るのは正常な2隻だけであることを検証
    const result = filterQuizShips(brokenShips)
    expect(result.length).toBe(2)
    expect(result[0].name).toBe('Yamato')
    expect(result[1].name).toBe('Shimakaze')
  })

  test('厳密性：[ ] や arp, al が「小文字」で入ってきた場合でも、漏らさず確実に排除できること', () => {
    const lowercaseBadShips = [
      { name: '[yamato]' },     // 小文字のブラケット
      { name: 'arp kongo' },    // 小文字の arp
      { name: 'al yukikaze' },  // 小文字の al
      { name: 'Yamato' }        // ◯ 通常艦
    ]
    
    const result = filterQuizShips(lowercaseBadShips)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Yamato')
  })

})