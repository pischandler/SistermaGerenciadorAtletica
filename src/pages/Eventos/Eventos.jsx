import React from 'react';
import Header from "../../components/Header";

function Eventos() {
  return (
    <div>
      <Header title="Calendário de Eventos" />
      <iframe 
        src="http://localhost/eventos/" 
        width="100%" 
        height="600px" 
        title="Calendário"
      />
    </div>
  );
}

export default Eventos;

