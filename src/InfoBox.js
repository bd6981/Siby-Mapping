import React from "react";
import "./Map.css";

const InfoBox = ({ info }) => {
  return (
    <>
      <div className="infoBox">
        <header>
          <h2>Crime Info</h2>
        </header>

        <div>
          <p>
            CRIME: <strong>{info.title}</strong>
          </p>
          <p>
            ID: <strong>{info.id}</strong>
          </p>
          <p>
            DATE: <strong>{info.date}</strong>
          </p>
          <p>
            OCCUR ON A: <strong>{info.day}</strong>
          </p>
          <p>
            TIME: <strong>{info.time}</strong>
          </p>
          <p>
            ON SCENE DATE: <strong>{info.osdate}</strong>
          </p>
          <p>
            ON SCENE TIME: <strong>{info.ostime}</strong>
          </p>
          <p>
            BEAT: <strong>{info.beat}</strong>
          </p>
          <p>
            ZONE: <strong>{info.zone}</strong>
          </p>
          <p>
            LOCATION: <strong>{info.location}</strong>
          </p>
          <p>
            IBR CODE: <strong>{info.ibr}</strong>
          </p>
          <p>
            NEIGHBORHOOD: <strong>{info.neighborhood}</strong>
          </p>
        </div>
      </div>
    </>
  );
};
export default InfoBox;
