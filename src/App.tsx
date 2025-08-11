import { Outlet } from 'react-router-dom'
import { AppLayout } from '@/components/Layout/AppLayout'

export function App() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default App
