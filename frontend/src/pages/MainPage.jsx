import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainPage() {
    return (
        <div>
            <NavBar />
            <h1>Aerospace Mission Analytics Platform</h1>
            <p className="intro">
                Track upcoming rocket launches from around the world, save the ones you
                care about, and write briefing notes on each mission.
            </p>
            <p className="intro">
                <Link to="/dashboard">See upcoming launches →</Link>
            </p>
        </div>
    )
}
