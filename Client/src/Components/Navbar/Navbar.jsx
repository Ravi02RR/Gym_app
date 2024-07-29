import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const getNavLinkClass = ({ isActive }) => {
        return isActive ? "text-red-500" : "text-white";
    };

    return (
        <nav className="bg-gray-900 p-4  w-full  z-50">
            <div className="flex justify-between items-center">
                <div className="text-white text-xl"><Link to={'/'}>Gym</Link></div>
                <div className="lg:hidden">
                    <button onClick={toggleNavbar}>
                        {isOpen ? <FaTimes className="text-white text-2xl z-20" /> : <FaBars className="text-white text-2xl z-20" />}
                    </button>
                </div>
                <ul className="hidden lg:flex space-x-4">
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
                            to="/planner"
                        className={getNavLinkClass}
                    >
                            Planner
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;