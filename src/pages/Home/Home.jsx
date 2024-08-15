import { Link } from "react-router-dom";
import Header from "../../components/Header";
import "./Home.css";

function Home() {
  return (
    <>
      <Header welcomeMessage="Bem vindo" />
      <div className="Home">
        <section className="container">
        <Link to="/associados" className="btn">Página de Associados</Link>
          <Link to="/eventos" className="btn">Página de Eventos</Link>
          <Link to="/jogos" className="btn">Página de Jogos</Link>
        </section>
      </div>
    </>
  );
}

export default Home;

