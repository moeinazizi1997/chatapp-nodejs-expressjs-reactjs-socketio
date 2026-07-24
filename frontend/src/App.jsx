import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
function App() {
  return(
    <div>
      <h1 className='text-red-500 text-5xl'>My App</h1>
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal"/>
          <SignUpButton mode="modal"/>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  )
  
}

export default App
