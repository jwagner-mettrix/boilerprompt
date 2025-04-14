import { ThemeProvider } from '@/components/theme-provider'
import StyleGuider from '@/components/style-guider'
import FloatingChatBubble from '@/components/chat'

function App() {
  return (
    <ThemeProvider>
      <StyleGuider />
      <FloatingChatBubble />
    </ThemeProvider>
  )
}

export default App
