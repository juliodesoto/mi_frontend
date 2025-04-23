import { useEffect, useState } from "react";
import Header from "./Header";
import Login from "./Login";
import Decisiones from "./Decisiones";

function App() {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  // Al cargar la app comprueba si hay una sesión activa
  useEffect(() => {
    fetch("https://mi-backend-gjv6.onrender.com/session", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.usuario) {
          setLogueado(true);
          setUsuario(data.usuario);
          setTipoUsuario(data.tipo);
        }
      })
      .catch(err => {
        console.error("Error al obtener la sesión:", err);
      });
  }, []);

  // Cerrar sesión del usuario
  const cerrarSesion = () => {
    fetch("https://mi-backend-gjv6.onrender.com/logout", {
      credentials: "include"
    }).then(() => {
      setLogueado(false);
      setUsuario("");
      setTipoUsuario("");
    });
  };

  // Al hacer login con éxito, actualizamos el estado
  const alIniciarSesion = () => {
    setLogueado(true);

    // Recuperamos usuario y tipo de usuario tras iniciar sesión
    fetch("https://mi-backend-gjv6.onrender.com/session", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.usuario) {
          setUsuario(data.usuario);
          setTipoUsuario(data.tipo);
        }
      });
  };

  return (
    <div>
      {/* Header con nombre del usuario y botón de logout si está logueado */}
      <Header usuario={usuario} alCerrarSesion={logueado ? cerrarSesion : null} />

      {logueado ? (
        <>
          {/* Texto Inicial explicativo */}
          <div className="textoInicial">
            <p>
              Si estás indeciso y no sabes qué decisión tomar, aquí estamos para ponértelo más fácil.
            </p>
          </div>

          {/* Componente principal de gestión de decisiones */}
          <Decisiones tipoUsuario={tipoUsuario} />
        </>
      ) : (
        // Si no hay sesión activa se muestra el formulario para logearse
        <Login alIniciarSesion={alIniciarSesion} />
      )}
    </div>
  );
}

export default App;
