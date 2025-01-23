import AppRoutes from "./AppRoutes"; // Archivo donde definimos las rutas principales
import "./index.css"; // Estilos generales (Tailwind incluido)

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppRoutes />
    </div>
  );
}

export default App;

