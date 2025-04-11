import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
function App() {
  const [count, setCount] = useState(0)

  const fetchRandomNumber = async () => {
    try {
      const response = await fetch('/api/v1/random-number');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Random number from server:', data.randomNumber);
    } catch (error) {
      console.error('Error fetching random number:', error);
    }
  };

  return (
    <ThemeProvider>
      <div className="card">
        <ModeToggle />
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <Button onClick={fetchRandomNumber} variant="outline" className="ml-4w">
          Get Random Number
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </ThemeProvider>
  )
}

export default App
