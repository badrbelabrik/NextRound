import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard'
import Tournaments from "./pages/Tournaments.jsx";
import TournamentDetails from "./pages/TournamentDetails.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from './components/GuestRoute';
import Games from './pages/Games.jsx';
import Rankings from './pages/Rankings.jsx';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import About from './pages/About.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/games" element={<Games />} />
                <Route path="/rankings" element={<Rankings />} />
                <Route path="/tournaments/:id" element={<TournamentDetails />} />
                <Route path="/about" element={<About />} />
                {/* Admin routes*/}
                <Route element={<AdminRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>
                {/* Guest routes */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/userdashboard"
                        element={<UserDashboard />}
                    />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
