import React from 'react';
import './ClientCard.css';
import Image from 'next/image';
import { RiVipFill, RiUserStarLine } from 'react-icons/ri';

const ClientCard = ({ client }) => {
  const birthDate = new Date(client.FechaNacimiento);
  const today = new Date();

  // Correct age calculation
  const age =
    today.getFullYear() -
    birthDate.getFullYear() -
    (today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
      ? 1
      : 0);

  const formattedDate = `${birthDate.getDate()}/${
    birthDate.getMonth() + 1
  }/${birthDate.getFullYear()}`;

  // Calculate the difference between the current date and the next birthday
  const nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const diffDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  // Display birthday emojis if the birthday is within one week (before or after)
  const birthdaySoon = diffDays <= 7 && diffDays > -7 ? 'cumpleaños 🎂🎉' : '';

  const getClientStatus = (numIngresos) => {
    if (numIngresos >= 41) return 'VIP';
    if (numIngresos >= 10) return 'Frecuente';
    return 'Nuevo';
  };

  const clientStatus = getClientStatus(client.NumIngresos);

  // Calculate total consumption
  const totalConsumo = client.Consumos_general.reduce(
    (total, consumo) => total + parseFloat(consumo.Monto),
    0
  ).toFixed(2);

  return (
    <div
      className={`card-cont ${
        clientStatus === 'VIP'
          ? 'gold-background'
          : clientStatus === 'Frecuente'
          ? 'green-background'
          : ''
      }`}
    >
      <div className="pic-cont">
        <Image
          src={client.imageUrl || 'https://via.placeholder.com/120'}
          alt={`${client.Nombre} ${client.Apellido}`}
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </div>
      <div className="info-cont">
        <div className="name-cont">
          <div className="icon-cont">
            {clientStatus === 'VIP' && <RiVipFill size={35} />}
            {clientStatus === 'Frecuente' && <RiUserStarLine size={35} />}
          </div>
          {client.Nombre} {client.Apellido}
        </div>
        <p className="text-sm">
          <strong>CI:</strong> {client.CI}
        </p>
        <p className="text-sm">
          <strong>Fecha de Nacimiento:</strong> {formattedDate} (Edad: {age}){' '}
          {birthdaySoon} <br />
        </p>
        <p className="text-sm">
          <strong>Género:</strong> {client.Genero}
        </p>
        <p className="text-sm">
          <strong>Lugar de nacimiento:</strong> {client.LugarNacimiento}
        </p>
        <p className="text-sm">
          <strong>Estado Civil:</strong>{' '}
          {client.EstadoCivil || 'No especificado'}
        </p>

        <h2>Historia del cliente</h2>
        <p className="text-sm">
          <strong>No. visitas:</strong> {client.NumIngresos} ({clientStatus})
        </p>
        <p className="text-sm">
          <strong>Último ingreso:</strong>{' '}
          {new Date(
            client.Ingresos[client.Ingresos.length - 1]?.Fecha
          ).toLocaleString()}
        </p>
        <p className="text-sm">
          <strong>Consumo total:</strong> ${totalConsumo}
        </p>
        <h4 className="text-xl">
          <strong>Historial de Consumo</strong>
        </h4>
        <div className="consumo-cont">
          {client.Consumos_general.length > 0 ? (
            client.Consumos_general.map((consumo, index) => (
              <div key={index} className="consumo-item">
                <p>
                  <strong>Fecha:</strong>{' '}
                  {new Date(consumo.Fecha).toLocaleDateString()}
                </p>
                <p>
                  <strong>Monto:</strong> ${consumo.Monto}
                </p>
                <ul>
                  {consumo.Detalles.map((detalle, i) => (
                    <li key={i}>
                      • {detalle.Cantidad} - {detalle.Producto}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>Sin historial de consumo.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
