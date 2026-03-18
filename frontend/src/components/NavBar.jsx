import '../App.css'
import { Link } from "react-router-dom"

export default function NavBar() {
    return (
        <nav className="nav">
            <Link to="/" className="home">Home</Link>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/watchlist">Watchlist</Link></li>
            </ul>
        </nav>
    )
}