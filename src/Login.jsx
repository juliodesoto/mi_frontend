import { useState } from "react";
import "./index.css";

// Componente de formulario de inicio de sesión
function Login({ alIniciarSesion }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Maneja el envío del formulario
  const manejarInicioSesion = async (e) => {
    e.preventDefault(); // Evita recargar la página al enviar

    try {
      const respuesta = await fetch("https://mi-backend-gjv6.onrender.com/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ usuario, password })
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        alIniciarSesion(datos); // Informa al componente App del inicio de sesión
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={manejarInicioSesion}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" value="Iniciar sesión" />
        </form>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
        )}
      </div>
    </div>
  );
}

export default Login;





