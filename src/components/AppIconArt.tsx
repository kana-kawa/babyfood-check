/** ホーム画面用アイコンの絵（オレンジ地にお茶わん）。next/og の ImageResponse で画像にする */
export default function AppIconArt({ size }: { size: number }) {
  const u = size / 100
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e8743b',
      }}
    >
      {/* ごはん */}
      <div style={{ width: 52 * u, height: 26 * u, borderRadius: `${26 * u}px ${26 * u}px 0 0`, background: '#fffaf3' }} />
      {/* お茶わん */}
      <div
        style={{
          width: 64 * u,
          height: 30 * u,
          borderRadius: `0 0 ${32 * u}px ${32 * u}px`,
          background: '#ffffff',
          borderTop: `${4 * u}px solid #f5c9ad`,
        }}
      />
    </div>
  )
}
