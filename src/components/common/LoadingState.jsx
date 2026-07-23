// src/components/common/LoadingState.jsx
export function LoadingState({ loading, error }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#11141a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">全艦船データを一括読み込み中（数秒かかります）…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 bg-[#11141a] min-h-screen text-center font-bold">
        エラー：{error}
      </div>
    )
  }

  return null
}