import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import Reservation from './pages/Reservation'
import ReservationForm from './pages/ReservationForm'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carte" element={<Catalogue />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservation/formulaire" element={<ReservationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
