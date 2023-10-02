import './App.css'
import NavBarMUI from './components/NavbarMUI'
import { UserProvider } from './context/UserContext'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <UserProvider>
      <NavBarMUI />
      <AppRoutes />
    </UserProvider>
  )
}

export default App
