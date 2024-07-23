import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const getNavLinkClass = ({ isActive }) => {
        return isActive ? "text-red-500" : "text-white";
    };

    const containerVariants = {
        hidden: { clipPath: "circle(0% at 50% 50%)", transition: { duration: 0.5 } },
        visible: { clipPath: "circle(150% at 50% 50%)", transition: { duration: 0.5 } },
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
                </ul>
            </div>

            <motion.div
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
                variants={containerVariants}
                className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center lg:hidden"
            >
                <ul className="space-y-6 text-center text-xl z-20">
                    <li>
                        <NavLink
                            to="/"
                            className={getNavLinkClass}
                            onClick={toggleNavbar}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/about"
                            className={getNavLinkClass}
                            onClick={toggleNavbar}
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/planner"
                            className={getNavLinkClass}
                            onClick={toggleNavbar}
                        >
                            Planner
                        </NavLink>
                    </li>
                </ul>
                <button onClick={toggleNavbar} className="absolute top-4 right-4 z-20">
                    <FaTimes className="text-white text-2xl" />
                </button>
            </motion.div>
        </nav>
    );
}

export default Navbar;
