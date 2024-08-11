import React from "react";
import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    alert("Enviando os dados:" + username + " - " + password);
  };
  return (
    <div className="Login">
      <div className="container">
        <div className="imagem">
          <img
            src="https://losbravosuepg.com.br/assets/logolb.png"
            width=""
            height="250"
            alt="Los Bravos"
            title="Los Bravos"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              placeholder="E-mail"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <div className="recall-forget">
              <label>
                <input type="checkbox" />
                Lembre de mim.
              </label>
            </div>
            <button>Entrar</button>
            <div>
              <label>
                <a href="">Esqueceu sua senha?</a>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
