import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // Importa tu instancia de Supabase desde donde la configuraste
import { useEffect } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      const user = await supabase.auth.getUser();
      console.log('dentro del login');
      
      console.log(user);
      
      if (!user.data.user) {
        navigate("/login");
      }
    }
    getUser();
    
  }, [navigate]);

  useEffect(() => {

    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        navigate("/orders");
      }

    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reiniciar mensaje de error antes de intentar el login

    try {
      // Consulta a la base de datos para validar usuario y contraseña
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      })

      if (error) {
        // Si ocurre un error, mostrarlo
        setError("Usuario o contraseña incorrectos.");
        return;
      }

      if (data.session) {
        console.log("Sesión creada:", data.session);

        // Si la sesión se creó correctamente, redirigir a la página de órdenes
        navigate("/orders");
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error general:", err);
      setError("Ocurrió un error inesperado. Inténtalo más tarde.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleLogin}>
          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


