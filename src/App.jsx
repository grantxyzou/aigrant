import './App.css'

function App() {
  return (
    <div className="App">
      <header className='app-header'>
       <h1>Hello, I am Grant</h1>
        <p className="tagline">this site is spinning something cool</p>
      </header>
      
      <main className="app-main">
        <div className="intro-section">
          <h2>Welcome to My Interactive Portfolio</h2>
          <p>
            This is an AI-driven experience that showcases my design career and serves as 
            a personal agent. Ask me anything about my projects, experience, or design philosophy.
          </p>
        </div>
        
        <div className="coming-soon">
          <h3>Chat Interface Coming Soon</h3>
          <p>The conversational AI experience is currently under development.</p>
        </div>
      </main>
    </div>
  )
}

export default App