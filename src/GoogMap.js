import React, { useState, useRef, useEffect } from "react";
import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import "./Map.css";
import crimes from "./data.json";
import { Icon } from "@iconify/react";
import peopleRobbery from "@iconify/icons-fa6-solid/people-robbery";
import InfoBox from "./InfoBox";
import { useMainContext } from "./Hooks";




const Marker = ({ children }) => children;

export default function GoogMap() {
  const mapRef = useRef()
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [infoBox, setInfoBox] = useState(null);
  const [loading, setLoading] = useState(false);
  const [renderEvent, setRenderEvent] = useState([]);
  const { setEventData, reRenderMarkers } = useMainContext();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const response = await fetch("./data.json");
      if (response.ok) {
        const crimes = await response.json();
      }
      setEventData(crimes);
      setRenderEvent(crimes);
      setLoading(false);
    };

    fetchEvents(crimes);
  }, []);
  const points = crimes.map((crime) => ({
    type: "Feature",
    properties: {
      cluster: false,
      crimeId: crime.id,
      crimeTitle: crime.title,
      crimeDate: crime.date,
      crimeDay: crime.day,
      crimeTime: crime.time,
      crimeBeat: crime.beat,
      crimeZone: crime.zone,
      crimeLocation: crime.location,
      crimeIBR: crime.ibr,
      crimeOsDate: crime.osdate,
      crimeOsTime: crime.ostime,
      crimeNeighborhood: crime.neighborhood,
    },
    geometry: {
      type: "Point",
      coordinates: [parseFloat(crime.longitude), parseFloat(crime.latitude)],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyD2zMgWcSv5eO8fjUWF4b_hcbT6DPKc--A" }}
        defaultCenter={{ lat: 33.716073, lng: -84.353217 }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat,
          ]);
        }}
        onClick={() => {
          setInfoBox(null);
        }}
        onDrag={() => {
          setInfoBox(null);
        }}>
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}>
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.name),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}>
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={`crime-${cluster.properties.crimeId}`}
              lat={latitude}
              lng={longitude}>
              <button
                className="crime-marker"
                onClick={() => {
                  setInfoBox({
                    id: cluster.properties.crimeId,
                    title: cluster.properties.crimeTitle,
                    date: cluster.properties.crimeDate,
                    day: cluster.properties.crimeDay,
                    time: cluster.properties.crimeTime,
                    beat: cluster.properties.crimeBeat,
                    zone: cluster.properties.crimeZone,
                    location: cluster.properties.crimeLocation,
                    ibr: cluster.properties.crimeIBR,
                    osdate: cluster.properties.crimeOsDate,
                    ostime: cluster.properties.crimeOsTime,
                    neighborhood: cluster.properties.crimeNeighborhood,
                  });
                }}>
                <Icon icon={peopleRobbery} alt="crime isnt good"></Icon>
              </button>
            </Marker>
          );
        })}
      </GoogleMapReact>
      {infoBox && <InfoBox className="infoBox" info={infoBox}></InfoBox>}
    </div>
  );
}
