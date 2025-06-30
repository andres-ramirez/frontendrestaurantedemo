import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  // const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [rutaEstado, setRutaEstado] = useState(null);
  const [rutaLoading, setRutaLoading] = useState(false);

  const navigate = useNavigate();

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const isSameOrBetween = (date, start, end) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return d >= s && d <= e;
  };

  const filterOrdersByDate = () =>
    orders.filter(order => order.fecha && isSameOrBetween(parseLocalDate(order.fecha), startDate, endDate));

  const filteredOrders = filterOrdersByDate();

  useEffect(() => {
    const init = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        navigate("/login");
        return;
      }

      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("uuid", authData.user.id)
        .single();

      if (usuarioError) {
        console.error("Error obteniendo usuario:", usuarioError);
        return;
      }

      // setUserId(usuarioData.id);

      const { data: ordenes, error } = await supabase
        .from("ordenes_completadas")
        .select("*")
        .eq("usuario_id", usuarioData.id)
        .order("fecha_creacion", { ascending: false });

      if (error) {
        console.error("Error al obtener órdenes completadas:", error);
      } else {
        setOrders(ordenes);
      }

      setLoading(false);
    };

    init();
  }, [navigate]);

  useEffect(() => {
    const fetchRutaEstado = async () => {
      setRutaLoading(true);
      const { data, error } = await supabase
        .from("ruta")
        .select("estado")
        .eq("id", 1)
        .single();
      if (!error && data) setRutaEstado(data.estado);
      setRutaLoading(false);
    };

    fetchRutaEstado();
  }, []);

  const toggleRutaEstado = async () => {
    if (!rutaEstado) return;
    const nuevoEstado = rutaEstado === "IA" ? "BASICO" : "IA";
    setRutaLoading(true);
    const { error } = await supabase
      .from("ruta")
      .update({ estado: nuevoEstado })
      .eq("id", 1);
    if (!error) setRutaEstado(nuevoEstado);
    setRutaLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="mb-4">
          <button
            onClick={toggleRutaEstado}
            disabled={rutaLoading}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {rutaLoading ? "Cambiando..." : rutaEstado ? `Modo: ${rutaEstado}` : "Cargando..."}
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Órdenes Completadas</h2>

        <div className="mb-4 flex flex-col sm:flex-row items-center">
          <label className="mr-2">Filtrar por fecha:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              const newStart = new Date(date);
              newStart.setHours(0, 0, 0, 0);
              setStartDate(newStart);
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border p-2 rounded w-full sm:w-auto mb-2 sm:mb-0 dark:bg-gray-700 dark:text-white"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              const newEnd = new Date(date);
              newEnd.setHours(23, 59, 59, 999);
              setEndDate(newEnd);
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border p-2 rounded w-full sm:w-auto ml-0 sm:ml-2 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Cargando órdenes completadas...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500">No hay órdenes completadas o canceladas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`p-4 rounded shadow-md flex flex-col space-y-2 ${
                  order.estado === "completado"
                    ? "bg-green-100 border-l-4 border-green-500 dark:bg-green-800 dark:border-green-300"
                    : "bg-red-100 border-l-4 border-red-500 dark:bg-red-800 dark:border-red-300"
                }`}
              >
                <div>
                  <p className="font-bold text-lg">Pedido #{order.numero_pedido}</p>
                  <p><strong>Fecha:</strong> {parseLocalDate(order.fecha).toLocaleDateString()}</p>
                  <p><strong>Cliente:</strong> {order.cliente}</p>
                  <p><strong>Orden:</strong> {order.producto}</p>
                  <p><strong>Entrega:</strong> {order.entrega}</p>
                  <p><strong>Medio de pago:</strong> {order.medio_pago}</p>
                  <p>
                    <strong>Valor:</strong>{" "}
                    {Number(order.valor).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                  <p
                    className={`font-semibold ${
                      order.estado === "completado"
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    Estado: {order.estado}
                  </p>
                  {order.entrega === "domicilio" && (
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
