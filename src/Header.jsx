import "./index.css";
import logo from "./estaticos/logo.png";

// Componente que muestra el logo y la información del usuario
function Header({ alCerrarSesion, usuario }) {
  return (
    <header className="header">
      {/* Logo */}
      <img className="logo" src={logo} alt="Logo" />

      {/* Nombre de usuario logueado y botón para cerrar sesión */}
      {usuario && (
        <div className="usuario-info">
          <span className="nombre-usuario">{usuario}</span>
          <button className="boton-logout" onClick={alCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;

