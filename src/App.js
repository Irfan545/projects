import { useEffect, useRef } from "react";
import { useState } from "react";
import "./index.css";

function App() {
  const [lname, setlname] = useState(null);
  const place = useRef();
  const [display, setdisplay] = useState(false);
  const [long, setlong] = useState();
  const [lat, setlat] = useState();
  const api_key = "f89ed57ba07e9b984941c0d527b53524";

  const [weather, setweather] = useState();
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}`;

  const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${api_key}`;
  const [weather2, setWeather2] = useState();

  const search_url = `https://api.openweathermap.org/data/2.5/weather?q=${lname}&appid=${api_key}`;
  const search_url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${lname}&appid=${api_key}`;

  const [temp, setTemp] = useState(false);
  const [icon, setIcon] = useState("");

  const getLocation = () => {
    // console.log("object")
    navigator.geolocation.getCurrentPosition(
      (position, err) => {
        if (err) console.log(err);
        var xlong = position.coords.longitude;
        var xlat = position.coords.latitude;
        // console.log(xlat, xlong);
        setlat(xlat);
        setlong(xlong);
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    );
  };
  // console.log(weather.location);
  useEffect(() => {
    getLocation();
    // console.log(lat, long);
    if (lat && long) {
      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log("fetch::",data);
          setweather(data);
          setIcon(
            "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
          );
        });
      fetch(forecast_url)
        .then((res) => res.json())
        .then((data) => {
          setWeather2(data);
          console.log(data);
        });
    }
  }, [lat, long]);

  useEffect(() => {
    if (lname) {
      fetch(search_url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setweather(data);
          setIcon(
            "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
          );
        });

      fetch(search_url2)
        .then((res) => res.json())
        .then((data) => {
          setWeather2(data);
        });
    }
  }, [lname]);

  const handleClick = () => {
    setlname(place.current.value);
    console.log(lname);
    place.current.value = null;
    //  setdisplay(true)
  };

  return (
    <div className="App">
      <div className="search_div">
        <input type="text" ref={place} placeholder="Search" />
        <button onClick={handleClick}>Search</button>
      </div>
      {!weather && (
        <center>
          <h1>Loading...</h1>
        </center>
      )}
      {weather && (
        <div className="parent_div">
          <div className="upper_div">
            <div className="head">
              <img src={icon} alt="Weather icon" />
              {!temp && (
                <h1 onClick={() => setTemp(true)}>
                  {Math.floor(weather.main.temp - 273.15)} °C
                </h1>
              )}
              {temp && (
                <h1 onClick={() => setTemp(false)}>
                  {Math.floor(((weather.main.temp - 273.15) * 9) / 5 + 32)}°F
                </h1>
              )}
              <div>
                <h3>{weather.weather[0].main}</h3>
                <h4>
                  {weather.name},
                  <span>
                    Updated: {new Date(weather.dt * 1000).getHours()}:
                    {new Date(weather.dt * 1000).getMinutes()}
                  </span>
                </h4>
              </div>
            </div>
            <div className="bottom">
              <div>{weather.wind.speed}: wind </div>
              <div>{weather.main.humidity}: humidity</div>
              <div>
                {new Date(weather.sys.sunrise * 1000).getHours()}:
                {new Date(weather.sys.sunrise * 1000).getMinutes()} AM:sunrise
              </div>
            </div>
          </div>

          {weather2 &&
            weather2.list.map((each) => (
              <div className="lower_div" key={each.dt}>
                <div className="left_div">
                  <div>
                    <h1 className="first_span">
                      {new Date(each.dt * 1000).getDate()}/
                      {new Date(each.dt * 1000).getMonth()}
                    </h1>
                    <span>{new Date(each.dt * 1000).getHours()}:</span>
                    <span>{new Date(each.dt * 1000).getMinutes()}</span>
                  </div>
                  <div className="image_div">
                    <img
                      src={
                        "http://openweathermap.org/img/w/" +
                        each.weather[0].icon +
                        ".png"
                      }
                      alt="icon"
                    ></img>
                    <span>{Math.floor(each.main.temp - 273.15)} °C</span>
                  </div>
                  <div>
                    <ul>
                      <li>{each.wind.speed} k/h(wind)</li>
                      <li>{each.main.humidity}% Humidity</li>
                      <li>{each.main.sea_level}m SeaLevel</li>
                      <li>{each.main.grnd_level}m G_level</li>
                    </ul>
                  </div>
                  <span></span>
                </div>
                <div className="right_div">
                  <h3>{each.weather[0].main}</h3>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
