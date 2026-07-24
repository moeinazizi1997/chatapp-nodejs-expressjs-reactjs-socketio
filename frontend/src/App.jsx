import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { Button } from '@heroui/react';
import {ThemeProvider} from "./context/ThemeContext";
import {WallpaperProvider} from "./context/WallpaperContext";
function App() {
  return(
    <ThemeProvider>
      <WallpaperProvider>
        
      </WallpaperProvider>
    </ThemeProvider>
  )
  
}

export default App
