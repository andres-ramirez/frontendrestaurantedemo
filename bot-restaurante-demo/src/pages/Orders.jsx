import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMotorcycle, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async (usuarioId) => {
    const { data, error } = await supabase
      .from("ordenesPendientes")
      .select("*")
      .eq("estado", "preparando")
      .eq("usuario_id", usuarioId)
      .order("numeroDePedido", { ascending: false });

    if (error) {
      console.error("Error al obtener órdenes:", error);
    } else {
      setOrders(data);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        navigate("/login");
        return;
      }

      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("uuid", userData.user.id)
        .single();

      if (usuarioError) {
        console.error("Error obteniendo usuario:", usuarioError);
        return;
      }

      setUserId(usuarioData.id);
      await fetchOrders(usuarioData.id);
    };

    init();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("ordenesPendientes-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ordenesPendientes",
        },
        (payload) => {
          console.log("📢 Cambio detectado:", payload);

          setOrders((prevOrders) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...prevOrders, payload.new];
              case "UPDATE":
                return prevOrders.map((order) =>
                  order.id === payload.new.id ? payload.new : order
                );
              case "DELETE":
                return prevOrders.filter((order) => order.id !== payload.old.id);
              default:
                return prevOrders;
            }
          });
        }
      )
      .subscribe();

    return () => {
      console.log("❌ Suscripción cancelada");
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleConfirm = async (id) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const { error: insertError } = await supabase
      .from("ordenesCompletadas")
      .insert([{ ...order, estado: "completado", usuario_id: order.usuario_id }]);

    if (insertError) {
      console.error("Error al confirmar la orden:", insertError);
      return;
    }

    const { error: deleteError } = await supabase
      .from("ordenesPendientes")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error al eliminar la orden pendiente:", deleteError);
      return;
    }

    setOrders((prevOrders) => prevOrders.filter((o) => o.id !== id));
  };

  const handleCancel = async (id) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const { error: insertError } = await supabase
      .from("ordenesCompletadas")
      .insert([{ ...order, estado: "cancelado", usuario_id: order.usuario_id }]);

    if (insertError) {
      console.error("Error al cancelar la orden:", insertError);
      return;
    }

    const { error: deleteError } = await supabase
      .from("ordenesPendientes")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error al eliminar la orden pendiente:", deleteError);
      return;
    }

    setOrders((prevOrders) => prevOrders.filter((o) => o.id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Órdenes</h2>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Órdenes Pendientes
          </h3>
          {orders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No hay órdenes pendientes.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded shadow-md flex flex-col border-blue-500 justify-between border-solid border-2 bg-gray-100 dark:bg-gray-800 dark:border-4 dark:border-gray-700 dark:text-white"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <FontAwesomeIcon
                      icon={order.entrega === "domicilio" ? faMotorcycle : faUtensils}
                      className={`text-3xl ${
                        order.entrega === "domicilio"
                          ? "text-blue-500 dark:text-blue-300"
                          : "text-yellow-500 dark:text-yellow-300"
                      }`}
                    />
                    <div>
                      <p>
                        <strong>NÚMERO PEDIDO:</strong>
                        <span className="pl-2">{order.numeroDePedido}</span>
                      </p>
                      <p>
                        <strong>CLIENTE:</strong>
                        <span className="pl-2">{order.cliente}</span>
                      </p>
                      <p>
                        <strong>ORDEN:</strong>
                        <span className="pl-2">{order.producto}</span>
                      </p>
                      <p>
                        <strong>ENTREGA:</strong>
                        <span className="pl-2">{order.entrega}</span>
                      </p>
                      <p>
                        <strong>MEDIO DE PAGO:</strong>
                        <span className="pl-2">{order.medioDePago}</span>
                      </p>
                      {order.entrega === "domicilio" && (
                        <p>
                          <strong>DOMICILIO:</strong>
                          <span className="pl-2">{order.direccion}</span>
                        </p>
                      )}
                      <p>
                        <strong>VALOR:</strong>
                        <span className="pl-2">
                          {Number(order.valor).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 mt-auto">
                    <button
                      onClick={() => handleConfirm(order.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 w-full"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 w-full mt-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Orders;


