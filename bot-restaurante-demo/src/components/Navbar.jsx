/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../lib/supabaseClient";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogoutClick = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error al cerrar sesión:", error);
      return;
    }

    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo o título */}
        <div className="text-lg font-bold">Mi Restaurante</div>

        {/* Botón de menú hamburguesa */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl focus:outline-none"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

        {/* Menú de navegación */}
        <div
          className={`flex-col md:flex-row md:flex items-center md:space-x-4 absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-blue-600 dark:bg-gray-800 p-4 md:p-0 transition-transform ${isMenuOpen ? "flex" : "hidden md:flex"
            }`}
        >
          <Link
            to="/orders"
            className={`block md:inline hover:underline ${location.pathname === "/orders" ? "font-bold underline" : ""
              }`}
          >
            Órdenes Pendientes
          </Link>
          <Link
            to="/completed-orders"
            className={`block md:inline hover:underline ${location.pathname === "/completed-orders" ? "font-bold underline" : ""
              }`}
          >
            Órdenes Completadas
          </Link>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded mt-4 md:mt-0"
          >
            {theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
          </button>
          <button
            onClick={handleLogoutClick}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded mt-4 md:mt-0"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



