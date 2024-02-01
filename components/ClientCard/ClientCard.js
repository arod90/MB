import React from 'react';
import './ClientCard.css';
import { RiVipFill, RiUserStarLine } from 'react-icons/ri';

const ClientCard = ({ client }) => {
  const birthDate = new Date(client.fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const formattedDate = `${birthDate.getDate()}/${
    birthDate.getMonth() + 1
  }/${birthDate.getFullYear()}`;

  // Calculate the difference between the current date and the next birthday
  const nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  if (nextBirthday - today < 0) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const diffDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  // Display birthday emojis if the birthday is within one week
  const birthdaySoon = diffDays <= 7 && diffDays >= -7 ? 'cumpleaños 🎂🎉' : '';

  return (
    <div
      className={`card-cont ${
        client.ingresos.num_ingresos >= 10 && client.ingresos.num_ingresos <= 40
          ? 'green-background'
          : ''
      }${client.ingresos.num_ingresos >= 41 ? 'gold-background' : ''}`}
    >
      <div className="pic-cont">
        <img src="https://via.placeholder.com/120" alt="Profile" />
      </div>
      <div className="info-cont">
        <div className="name-cont">
          <div className="icon-cont">
            {client.ingresos.num_ingresos >= 10 &&
              client.ingresos.num_ingresos <= 40 && (
                <RiUserStarLine size={35} />
              )}
            {client.ingresos.num_ingresos > 40 && <RiVipFill size={35} />}
          </div>
          {client.nombre} {client.apellido}
        </div>
        <p className="ci">
          <strong>CI:</strong> {client.ci}
        </p>
        <p className="birthday">
          <strong>Fecha de Nacimiento:</strong> {formattedDate} <br /> (Edad:{' '}
          {age}) {birthdaySoon}
        </p>
        <p></p>
        <p>
          <strong>Lugar de nacimiento: </strong> {client.lugarNacimiento}
        </p>
        <p>
          <strong>Hora de ingreso: </strong> {client.horaIngreso}
        </p>
        {/* TODO maybe add this?? */}
        {/* <p>Distintivo</p>
        <input type="text" /> */}
        <h2>Historia del cliente</h2>
        <div className="consumo-cont">
          {client.ingresos.num_ingresos ? (
            <>
              <p>
                <strong>no. visitas:</strong> {client.ingresos.num_ingresos}
                {client.ingresos.num_ingresos >= 10 &&
                  client.ingresos.num_ingresos <= 40 &&
                  ' (cliente frecuente)'}
                {client.ingresos.num_ingresos > 40 && ' (cliente VIP)'}
              </p>
              <p>
                <strong>facturacion total:</strong>{' '}
                {client.ingresos.facturacion_total} $
              </p>
            </>
          ) : (
            <p>primera visita</p>
          )}
          <h4>
            <strong>Perfil de consumo</strong>
          </h4>
          {Object.keys(client.ingresos.items_pref).length === 0 ? (
            <p>Sin historial de consumo.</p>
          ) : (
            Object.entries(client.ingresos.items_pref).map(([item, count]) => (
              <p key={item}>
                {item}: {count}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
