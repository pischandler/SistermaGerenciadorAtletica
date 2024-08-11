
import React from 'react';
import Header from "../../components/Header";

function Jogos() {
  return (
    <div>
      <Header title="Calendário Esportivo" />
      <iframe 
        src="http://localhost/jogos/" 
        width="100%" 
        height="600px" 
        title="Calendário de jogos"
      />
    </div>
  );
}

export default Jogos;