import { BrowserRouter, Routes, Route } from "react-router-dom"
import HuntListPage from "./hunts/page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hunts" element={<HuntListPage />} />
      </Routes>
    </BrowserRouter>
  )
}