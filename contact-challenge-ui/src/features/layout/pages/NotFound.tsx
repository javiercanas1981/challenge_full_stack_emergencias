import React from "react";
import { Link } from "react-router-dom";
import icon404 from "../../../assets/404.svg";

import "./NotFound.css";

export const NotFound: React.FC = () => {
  return (
    <>
      <section className="section-404">
        <div className="container-404">
          <img src={icon404} alt="Icono Pagina no encontrada" />
          <h3>¡UPS!</h3>
          <p>No podemos encontrar la página que buscas.</p>
          <button className="button-viajar">
            <Link to="/">Inicio</Link>
          </button>
        </div>
      </section>
    </>
  );
};
