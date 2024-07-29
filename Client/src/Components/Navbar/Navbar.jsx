import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const getNavLinkClass = ({ isActive }) => {
        return isActive ? "text-red-500" : "text-white";
    };

    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
                <li>
                    <NavLink
                        to="/"
                        className={getNavLinkClass}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={getNavLinkClass}
                    >
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/planner"
                        className={getNavLinkClass}
                    >
                        Planner
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/posture"
                        className={getNavLinkClass}
                    >
                        P)ose Tracking
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;