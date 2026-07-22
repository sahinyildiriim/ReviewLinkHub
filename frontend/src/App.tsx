import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { RequestsPage } from '@/pages/RequestsPage'
import { RequestDetailPage } from '@/pages/RequestDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:id" element={<RequestDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
