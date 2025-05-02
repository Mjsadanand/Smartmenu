import LandingPage from "./components/LandingPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register"
import Login from "./components/Login"
import MyRestaurants from "./components/restaurant/MyRestaurants.jsx"
import MenuCreation from "./components/restaurant/MenuCreation.jsx"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/:username" element={<MyRestaurants />} />
        <Route path="/restaurant/:username/menu/:restaurantId" element={<MenuCreation />} />
      </Routes>
    </Router>
  )
}

export default App
