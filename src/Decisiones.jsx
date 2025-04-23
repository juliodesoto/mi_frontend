import { useState, useEffect } from "react";

// URLs de los GIFs para representar los resultados
const gifHazlo = "https://i.gifer.com/5SW.gif";
const gifNoLoHagas = "https://i.gifer.com/Ydjm.gif";
const gifEsperando = "https://i.gifer.com/3z9a.gif";

// URL base de la API del backend
const API_URL = "https://mi-backend-gjv6.onrender.com/decisiones";

function Decisiones() {
  const [decisiones, setDecisiones] = useState([]);
  const [nuevaDecision, setNuevaDecision] = useState("");

  // Al cargar el componente, obtenemos las decisiones existentes del backend
  useEffect(() => {
    fetchDecisiones();
  }, []);

  // Petición GET al backend para obtener las decisiones guardadas
  const fetchDecisiones = async () => {
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar decisiones");
      const data = await res.json();
      setDecisiones(data);
    } catch {
      // Si hay error, dejamos el estado vacío
      setDecisiones([]);
    }
  };

  // Función auxiliar para enviar peticiones POST o PUT con JSON al backend
  const enviarPeticion = async (url, method, body) => {
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  };

  // Añade una nueva decisión a la base de datos
  const agregarDecision = async () => {
    if (!nuevaDecision.trim()) return; // No permitir texto vacío
    try {
      const data = await enviarPeticion(`${API_URL}/nueva`, "POST", {
        texto: nuevaDecision,
      });

      // Añadimos la nueva decisión al estado con un GIF de espera
      const nueva = {
        id: data.id,
        texto: nuevaDecision,
        resultado: gifEsperando,
        exito: null,
      };
      setDecisiones([...decisiones, nueva]);
      setNuevaDecision(""); // Limpiar input
    } catch {}
  };

  // Actualiza un campo específico (texto, resultado o exito) en una decisión
  const actualizarCampo = async (id, campo, valor) => {
    try {
      await enviarPeticion(`${API_URL}/editar/${campo}/${id}`, "PUT", {
        [campo]: valor,
      });

      // Actualizamos el estado local con el nuevo valor
      setDecisiones((prev) =>
        prev.map((d) => (d.id === id ? { ...d, [campo]: valor } : d))
      );
    } catch {}
  };

  // Elimina una decisión del backend y del estado local
  const borrarDecision = async (id) => {
    try {
      const res = await fetch(`${API_URL}/borrar/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setDecisiones((prev) => prev.filter((d) => d.id !== id));
      }
    } catch {}
  };
  

  // Genera un resultado aleatorio (hazlo / no lo hagas)
  const lanzarDecision = (id) => {
    const resultado = Math.random() < 0.5 ? gifHazlo : gifNoLoHagas;
    actualizarCampo(id, "resultado", resultado);
  };

  return (
    <div className="contenedor">
      <h2>Agregar Nueva Decisión</h2>

      {/* Input para escribir una nueva decisión */}
      <input
        value={nuevaDecision}
        onChange={(e) => setNuevaDecision(e.target.value)}
        placeholder="Escribe una decisión..."
      />
      <button className="boton-tomar" onClick={agregarDecision}>
        + Añadir decisión
      </button>

      {/* Mostrar todas las decisiones existentes */}
      <div className="contenedor-cards">
        {decisiones.map(({ id, texto, resultado, exito }) => (
          <div key={id} className="decision-card">
            {/* Campo de texto editable para la decisión */}
            <input
              value={texto || ""}
              onChange={(e) => actualizarCampo(id, "texto", e.target.value)}
              className="decision-text"
            />

            {/* Mostrar resultado (GIF o texto) */}
            <div className="decision-result">
              {resultado?.includes("http") ? (
                <img
                  src={resultado}
                  alt="Resultado"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              ) : (
                <strong>{resultado}</strong>
              )}
            </div>

            {/* Botones para tomar decisión o borrarla */}
            <div className="bottom-section">
              <div className="buttons-container">
                <button className="boton-tomar" onClick={() => lanzarDecision(id)}>
                  Tomar Decisión
                </button>
                <button className="boton-borrar" onClick={() => borrarDecision(id)}>
                  Borrar
                </button>
              </div>
            </div>

            {/* Botones para indicar si el resultado fue exitoso o no */}
            <div className="toggle-container">
              <label>¿Salió bien?</label>
              <button
                className={exito === true ? "activo" : ""}
                onClick={() => actualizarCampo(id, "exito", true)}
              >
                Sí
              </button>
              <button
                className={exito === false ? "activo" : ""}
                onClick={() => actualizarCampo(id, "exito", false)}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Decisiones;









