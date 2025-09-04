export const metadata = {
  title: 'Minimal Test - No Layout'
}

export default function MinimalTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Minimal Test Page</h1>
      <p style={{ color: '#666' }}>This is a minimal test to see if the app loads without layout.</p>
      <p style={{ color: '#666' }}>Time: {new Date().toISOString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <p>If you can see this styled content, the page is rendering correctly!</p>
      </div>
    </div>
  )
}
