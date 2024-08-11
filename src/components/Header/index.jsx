import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Header({ title, welcomeMessage }) {
  return (
    <header className={styles.header}>
      <Link to="/home">
        <img
          src="https://losbravosuepg.com.br/assets/logolb.png"
          height="100"
          alt="Los Bravos"
          title="Página Inicial."
        />
      </Link>
      {title && <h1>{title}</h1>} {/* Exibe o título se estiver presente */}
      {welcomeMessage && <span>{welcomeMessage}, ...</span>} {/* Exibe a mensagem de boas-vindas se estiver presente */}
      <Link to="/" className="sair">Sair.</Link>
    </header>
  );
}

export default Header;
