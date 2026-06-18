import { expect, test } from 'vitest'
import { filterQuizShips } from './App.jsx'

test('クイズ用のフィルター関数が、テスト艦やコラボ艦を正しく弾くかチェック', () => {
  // 1. テスト用の偽物のデータ（プール）を用意する
  const mockShips = [
    { name: 'Yamato', tier: 10 },               // ◯ 残るべき普通の船
    { name: '[Yamato]', tier: 10 },             // ❌ 弾かれるべきテスト艦
    { name: 'ARP Kongo', tier: 5 },             // ❌ 弾かれるべきアルペジオコラボ艦
    { name: 'AL Yukikaze', tier: 8 },           // ❌ 弾かれるべきアズレンコラボ艦
    { name: 'Shimakaze', tier: 10 }             // ◯ 残るべき普通の船
  ]

  // 2. 関数を実行してみる
  const result = filterQuizShips(mockShips)

  // 3. 結果の検証（アサーション）
  // 残った船は2隻のはず
  expect(result.length).toBe(2)
  
  // 残った船の名前が 'Yamato' と 'Shimakaze' であること
  expect(result[0].name).toBe('Yamato')
  expect(result[1].name).toBe('Shimakaze')
})