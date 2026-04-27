'use client'

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>TEST PAGE</h1>
      <p>If you can see this, basic rendering works.</p>
      <button onClick={() => alert('Button clicked!')}>Test Button</button>
      <img src="/kevo-cuts.jpg" alt="Test Image" style={{ width: '100px', height: '100px' }} />
      <div style={{ marginTop: '20px' }}>
        <p>Font test: This should use the default font.</p>
        <p style={{ fontFamily: 'Poppins, sans-serif' }}>Font test: This should use Poppins if loaded.</p>
      </div>
    </div>
  )
}
