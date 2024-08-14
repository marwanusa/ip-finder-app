import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import maplibregl from "maplibre-gl";

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");
  const [isp, setIsp] = useState("");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [ipSearched, setIpSearched] = useState("");
  const [inputValue, setInputValue] = useState("");
  const mapRef = useRef(null);
  useEffect(() => {
    axios
      .get(`https://ipapi.co/${ipSearched}/json/`)
      .then((response) => {
        setIpAddress(response.data.ip);
        setLocation(response.data.city);
        setTimezone(response.data.timezone);
        setIsp(response.data.org);
        setLat(response.data.latitude);
        setLong(response.data.longitude);
      })
      .catch((error) => console.error("Error fetching IP data:", error));
  }, [ipSearched]);

  useEffect(() => {
    if (lat !== null && long !== null) {
      if (mapRef.current) {
        mapRef.current.setCenter([long, lat]);
      } else {
        mapRef.current = new maplibregl.Map({
          container: "map",
          style: "https://api.maptiler.com/maps/streets-v2/style.json?key=Npp61B0jujthezVqibuv",
          center: [long, lat],
          zoom: 10,
        });
      }
    }
  }, [lat, long]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>IP Address Tracker</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search for any IP address "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={() => setIpSearched(inputValue)}>{">"}</button>
        </div>
      </header>
      <div className="ip-info">
        <div className="ip-address">
          <p>IP Address</p>
          <h2>{ipAddress}</h2>
        </div>
        <div className="location">
          <p>Location</p>
          <h2>{location}</h2>
        </div>
        <div className="timezone">
          <p>Timezone</p>
          <h2>{timezone}</h2>
        </div>
        <div className="isp">
          <p>ISP</p>
          <h2>{isp}</h2>
        </div>
      </div>
      <div id="map" style={{ width: "100%", height: "480px" }}></div>
    </div>
  );
}

export default App;