import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedOrders = async () => {
    const { data, error } = await supabase
      .from("ordenesCompletadas")
      .select("*");

    if (error) {
      console.error("Error al obtener órdenes completadas:", error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Órdenes Completadas</h2>
        {loading ? (
          <p className="text-gray-500">Cargando órdenes completadas...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No hay órdenes completadas o canceladas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`p-4 rounded shadow-md flex flex-col space-y-2 ${
                  order.estado === "completado"
                    ? "bg-green-100 border-l-4 border-green-500 dark:bg-green-800 dark:border-green-300"
                    : "bg-red-100 border-l-4 border-red-500 dark:bg-red-800 dark:border-red-300"
                }`}
              >
                <div>
                  <p className="font-bold text-lg">Pedido #{order.numeroDePedido}</p>
                  <p><strong>Cliente:</strong> {order.cliente}</p>
                  <p><strong>Orden:</strong> {order.producto}</p>
                  <p><strong>Entrega:</strong> {order.entrega}</p>
                  <p><strong>Medio de pago:</strong> {order.medioDePago}</p>
                  {order.estado === "completado" ? (
                    <p className="text-green-700 dark:text-green-300 font-semibold">
                      Estado: {order.estado}
                    </p>
                  ) : (
                    <p className="text-red-700 dark:text-red-300 font-semibold">
                      Estado: {order.estado}
                    </p>
                  )}
                  {order.direccion && (
                    <p><strong>Domicilio:</strong> {order.direccion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
  
};  

export default CompletedOrders;
