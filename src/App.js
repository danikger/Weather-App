import { useEffect, useState } from 'react';
import { HiSearch, HiRefresh } from "react-icons/hi";
import { FiWind, FiDroplet, FiThermometer, FiEye } from "react-icons/fi";
import { RiWaterPercentLine, RiDashboard3Line } from "react-icons/ri";
import { Combobox } from '@headlessui/react'
import weatherIcons from './JSON/weatherIcons';
import WeatherGraph from './Components/weatherGraph';
import './App.css';

function App() {
  const [city, setCity] = useState({ name: 'Winnipeg', region: "Manitoba" });
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({
    current: "",
    forecast: { forecastday: [""] },
  });

  const [query, setQuery] = useState('')
  const [citiesSearch, setCitiesSearch] = useState([]);

  const [displayedGraphInfo, setDisplayedGraphInfo] = useState("Temp");
  const [detailedForecastDay, setDetailedForecastDay] = useState(0);

  let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  let threeDayForecast = [
    {
      day: 'Today',
      date: new Date(weatherData.forecast.forecastday[0]?.date),
      weather: weatherData.forecast.forecastday[0]?.day?.condition?.text,
      maxTemp: Math.round(weatherData.forecast.forecastday[0]?.day?.maxtemp_c),
      lowTemp: Math.round(weatherData.forecast.forecastday[0]?.day?.mintemp_c),
    },
    {
      day: days[new Date(weatherData.forecast.forecastday[1]?.date_epoch * 1000).getDay()],
      date: new Date(weatherData.forecast.forecastday[1]?.date),
      weather: weatherData.forecast.forecastday[1]?.day?.condition?.text,
      maxTemp: Math.round(weatherData.forecast.forecastday[1]?.day?.maxtemp_c),
      lowTemp: Math.round(weatherData.forecast.forecastday[1]?.day?.mintemp_c),
    },
    {
      day: days[new Date(weatherData.forecast.forecastday[2]?.date_epoch * 1000).getDay()],
      date: new Date(weatherData.forecast.forecastday[2]?.date),
      weather: weatherData.forecast.forecastday[2]?.day?.condition?.text,
      maxTemp: Math.round(weatherData.forecast.forecastday[2]?.day?.maxtemp_c),
      lowTemp: Math.round(weatherData.forecast.forecastday[2]?.day?.mintemp_c),
    },
  ];

  const graphSideNav = [
    { id: "Temp", icon: FiThermometer, text: "Temperature" },
    { id: "Prec", icon: FiDroplet, text: "Precipitation" },
  ];


  let weatherStats = [
    {
      title: 'Precipitation',
      icon: FiDroplet,
      stat: Math.round(weatherData.current.precip_mm),
      unit: 'mm',
    },
    {
      title: 'Wind',
      icon: FiWind,
      stat: Math.round(weatherData.current.wind_kph),
      unit: 'kph',
    },
    {
      title: 'Humidity',
      icon: RiWaterPercentLine,
      stat: Math.round(weatherData.current.humidity),
      unit: '%',
    },
    {
      title: 'Feels Like',
      icon: FiThermometer,
      stat: `${Math.round(weatherData.current.feelslike_c)}°`,
      unit: '',
    },
    {
      title: 'Visibility',
      icon: FiEye,
      stat: Math.round(weatherData.current.vis_km),
      unit: 'km',
    },
    {
      title: 'Pressure',
      icon: RiDashboard3Line,
      stat: weatherData.current.pressure_mb,
      unit: 'hPa',
    },
  ];


  useEffect(() => {
    fetchWeatherData();
  }, [city]);


  // Used for the search bar to fetch cities based on the query from search bar.
  useEffect(() => {
    // debounce to prevent spamming API
    const getData = setTimeout(() => {
      searchCities();
    }, 200)

    return () => clearTimeout(getData)
  }, [query]);


  /**
   * Provides the corresponding icon for the weather condition.
   * 
   * @param {String} weather Weather condition that needs to be matched with the weatherIcons array and return the corresponding icon.
   * @returns {JSX.Element} Returns the corresponding icon from the weatherIcons array. If no match is found, it returns null.
   */
  function getWeatherIcon(weather) {
    if (weather) {
      let item = weatherIcons.find((item) => item.weather.toLowerCase() === weather.toLowerCase().trim()); // Trim and lowercase to make sure it matches. API sometimes messes it up (Ex. "partly Cloudy " instead of "Partly cloudy")
      return item ? <item.icon className="w-full h-full text-blue-500" /> : null;
    }
  }


  /**
   * Searches for cities based on the query and sets the 'citiesSearch' state with the results.
   */
  async function searchCities() {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${process.env.REACT_APP_WEATHERKEY}&q=${query}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCitiesSearch(data);
      } else {
        throw new Error('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(error);
    }
  }


  /**
   * Fetches the weather data for the selected city and sets the 'weatherData' state with the results.
   */
  async function fetchWeatherData() {
    try {
      // Used for loading animation
      setLoading(true);

      let cityName = `${city.name} ${city.country}`;
      console.log(cityName);

      // const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHERKEY}&q=Winnipeg&days=7&aqi=no&alerts=no`);
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHERKEY}&q=${cityName}&days=7&aqi=no&alerts=no`);
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        throw new Error('Unable to fetch weather data');
      }
      // Give enough time for the loading animation to show
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Set loading to false after 1 second
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };


  /**
   * Used to combine classNames together.
   * @param  {...any} classes Classes to be combined together.
   * @returns {String} Returns a string of classNames combined together.
   */
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


  // Filter cities based on the query.
  const filteredCities =
    query === ''
      ? citiesSearch
      : citiesSearch.filter((city) => {
        return city.name.toLowerCase().includes(query.toLowerCase())
      })


  return (
    <main className="min-h-screen bg-gray-950 w-full absolute">
      <section className="relative overflow-hidden isolate"> {/* overflow-hidden */}
        <div
          className="absolute left-[calc(50%-4rem)] -z-10 top-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(60%-30rem)] xl:left-[calc(50%-24rem)]"
          aria-hidden="true"
        >
          <div
            className=" aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-blue-800 to-blue-600 opacity-10"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 48.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>

        <div className="mx-auto mt-16 max-w-5xl p-4">
          <div className="w-full sm:flex justify-between items-end">
            <h2 className="text-gray-400 text-sm mb-2 sm:mb-0">Updated on {new Date(weatherData.current?.last_updated).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}

            </h2>
            <div className="inline-flex items-center">
              <button className="bg-gray-800 rounded-full p-2 mr-2 group">
                <span className="sr-only">Refresh</span>
                <HiRefresh onClick={() => fetchWeatherData()} className={`w-5 h-5 text-gray-400 group-hover:text-gray-300 ${loading ? "animate-reverse-spin" : ""}`} />
              </button>
              <Combobox as="div" value={city} onChange={setCity}>
                <div className="relative  items-center bg-gray-800 pt-2 pb-1 px-4 rounded-full shadow-sm">
                  <div className="relative items-center inline-flex">

                    <HiSearch className="w-5 h-5 mr-2 text-gray-400" />
                    <Combobox.Label className="sr-only">City Search</Combobox.Label>
                    <Combobox.Input
                      placeholder="Search for city"
                      className="bg-gray-800 text-gray-100 inline-flex focus:ring-0 focus:ring-offset-0 outline-none"
                      onChange={(event) => setQuery(event.target.value)}
                    // displayValue={(filteredCity) => filteredCity?.name}
                    />
                  </div>


                  {filteredCities.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredCities.map((filteredCity) => (
                        <Combobox.Option
                          key={filteredCity.id}
                          value={filteredCity}
                          className={({ active }) =>
                            classNames(
                              'relative cursor-pointer select-none py-2 pl-3 pr-9',
                              active ? 'bg-blue-600 text-white' : 'text-gray-400'
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span className={classNames('block truncate', selected && 'text-white font-semibold')}>{filteredCity.name}, {filteredCity.region}, {filteredCity.country}</span>

                              {selected && (
                                <span
                                  className={classNames(
                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                    active ? 'text-white' : 'text-blue-600'
                                  )}
                                >
                                  {/* <RiSunLine className="h-5 w-5" aria-hidden="true" /> */}
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}
                </div>
              </Combobox>
              {/* </div> */}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-900 border border-gray-800 w-full col-span-3 md:col-span-1 rounded-md p-5">
              <h1 className="text-gray-100 text-2xl font-medium text-center">{city.name}, {city.region}</h1>

              {/* Offsets temp position depending if its negative temp or positive. No need to offset if negative since the "-" char it makes the text look centered. Need to offset if positive temp to make it look centered*/}
              {weatherData.current.temp_c < 0 ? (
                <p className="mt-5 text-gray-100 text-8xl font-medium text-center">
                  {Math.round(weatherData.current.temp_c)}°
                </p>
              ) : (
                <p className="-mr-10 mt-5 text-gray-100 text-8xl font-medium text-center">
                  {Math.round(weatherData.current.temp_c)}°
                </p>
              )}

              <span className="flex items-center text-gray-400 text-base mt-2 font-normal text-center justify-center">
                H: {Math.round(weatherData.forecast.forecastday[0].day?.maxtemp_c)}° L: {Math.round(weatherData.forecast.forecastday[0].day?.mintemp_c)}°
              </span>

              <span className="flex items-center text-gray-100 text-xl mt-5 font-normal text-center justify-center">
                <div className="w-7 h-7 mr-2.5">
                  {getWeatherIcon(weatherData.current?.condition?.text)}
                </div>
                {weatherData.current?.condition?.text}
              </span>

            </div>
            <div className="w-full col-span-3 md:col-span-2 grid md:grid-cols-3 grid-cols-2 gap-4">

              {weatherStats.map((item) => (
                <div className="bg-gray-900 border border-gray-800 shadow-sm rounded-md p-5">
                  <div className="flex items-center mb-4">
                    <item.icon className="w-6 h-6 mr-2 text-blue-500" />
                    <p className="text-gray-400 text-base lg:text-lg font-medium break-all">{item.title}</p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-100 text-4xl">{item.stat}</p>
                    <p className="text-gray-100 text-xl ml-1">{item.unit}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* 7 DAY FORECAST STYLING - need either a new API or pay $7 a month for 7 day forecast :(*/}
        {/* <div className="mt-12 mx-auto max-w-5xl mb-16">
          <span className="text-gray-100 text-xl font-medium">3-Day Forecast</span>

          <div className="grid grid-cols-7 gap-4 mt-2">
            {array.map((item) => (
              <div className="bg-gray-900 border border-gray-800 shadow-sm rounded-md p-5">

                <div className="flex items-center justify-center mb-3">
                  <p className="text-gray-100 text-lg font-medium">{item.day}</p>
                </div>

                <FiSun className="w-10 h-10 text-blue-500 mx-auto" />

                <div className="flex justify-center mt-3">
                  <p className="text-gray-400 text-4xl">{item.temp}°</p>
                </div>

              </div>
            ))}
          </div>
        </div> */}

        {/* 3 DAY FORECAST */}
        <div className="mt-6 sm:mt-16 mx-auto max-w-5xl mb-24 p-4">
          <span className="text-gray-100 text-xl font-medium">3-Day Forecast</span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 mb-4">
            {threeDayForecast.map((item, index) => (
              <div onClick={() => setDetailedForecastDay(index)} className="bg-gray-900 border border-gray-800 shadow-sm rounded-md p-4 hover:bg-gray-800 cursor-pointer">

                <div className="flex items-center">
                  <div className="w-7 h-7 mr-2.5">
                    {getWeatherIcon(item.weather)}
                  </div>
                  <div>
                    <p className="text-gray-100 text-lg font-medium">{item.day}</p>
                    {/* <p className="text-gray-400 text-sm -mt-1">{item.weather}</p> */}
                  </div>
                  <div className="flex ml-auto">
                    <p className="text-gray-100 text-lg mr-1">{item.maxTemp}°</p>
                    <p className="text-gray-400 text-lg">{item.lowTemp}°</p>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* FORECAST CAROUSEL */}
          <span className="md:hidden text-gray-100 text-xl font-medium">
            {/* All this extra date manipulation is to offset the timezone. Ex. "2024-02-21" shows up as "2024-02-20" without the offsetting. This should make it show up as the correct date. */}
            {threeDayForecast[detailedForecastDay].day + ", " + new Date(threeDayForecast[detailedForecastDay].date.getTime() - threeDayForecast[detailedForecastDay].date.getTimezoneOffset() * -60000).toLocaleDateString('en-us', { month: 'long', day: 'numeric' })}
          </span>
          <div className="md:hidden flex gap-x-3 whitespace-nowrap overflow-x-auto mt-2">
            {detailedForecastDay === 0 ? (
              <div className="h-full border border-gray-800 shadow-sm rounded-md py-4 px-5 flex flex-col items-center">
                <span className="text-gray-200 font-medium"> Now </span>
                <div className="w-9 h-9 mt-3 mb-3">
                  {getWeatherIcon(weatherData.forecast.forecastday[detailedForecastDay]?.hour?.slice(new Date().getHours())[0].condition.text)}
                </div>
                <span className="text-gray-100 text-lg"> {Math.round(weatherData.forecast.forecastday[detailedForecastDay]?.hour?.slice(new Date().getHours())[0].temp_c)}° </span>
              </div>
            ) : (
              null
            )}
            {weatherData.forecast.forecastday[detailedForecastDay]?.hour?.slice(detailedForecastDay === 0 ? new Date().getHours() + 1 : 0).map((item, index) => (
              <div className="h-full border border-gray-800 shadow-sm rounded-md py-4 px-5 flex flex-col items-center ">
                <span className="text-gray-400 font-medium text-center"> {new Date(item.time).getHours() % 12 || 12} {new Date(item.time).getHours() >= 12 ? "PM" : "AM"} </span>
                {/* <FiWind className="w-9 h-9 text-blue-500 mt-4 mb-4" /> */}
                <div className="w-9 h-9 mt-3 mb-3">
                  {getWeatherIcon(item.condition.text)}
                </div>
                <span className="text-gray-100 text-lg "> {Math.round(item.temp_c)}° </span>
              </div>
            ))}
          </div>


          {/* WEATHER GRAPH */}
          <div className="md:grid grid-cols-4 gap-4 hidden">
            <div className="col-span-1 space-y-1.5">
              {graphSideNav.map((button) => (
                <button
                  key={button.id}
                  onClick={() => setDisplayedGraphInfo(button.id)}
                  className={`flex items-center rounded-md p-2.5 w-full group ${displayedGraphInfo === button.id ? "bg-gray-900" : "hover:bg-gray-900"}`}
                >
                  <button.icon className={`w-6 h-6 mr-2.5 ${displayedGraphInfo === button.id ? "text-blue-500" : "text-gray-600 group-hover:text-blue-500"}`} />
                  <p className={`${displayedGraphInfo === button.id ? "text-gray-100 font-medium" : "text-gray-400 group-hover:text-gray-100"}`}>
                    {button.text}
                  </p>
                </button>
              ))}
            </div>

            <div className="col-span-3 border border-gray-800 shadow-sm rounded-md p-5 pb-10 h-80">
              <span className="text-gray-100 text-xl font-medium mb-0">
                {/* All this extra date manipulation is to offset the timezone. Ex. "2024-02-21" shows up as "2024-02-20" without the offsetting. This should make it show up as the correct date. */}
                {threeDayForecast[detailedForecastDay].day + ", " + new Date(threeDayForecast[detailedForecastDay].date.getTime() - threeDayForecast[detailedForecastDay].date.getTimezoneOffset() * -60000).toLocaleDateString('en-us', { month: 'long', day: 'numeric' })}
              </span>
              <WeatherGraph displayedGraphInfo={displayedGraphInfo} weatherData={weatherData} detailedForecastDay={detailedForecastDay} />
            </div>
          </div>
        </div>

      </section>

      <footer className="bg-gray-900 bottom-0 absolute w-full">
        <div className="w-full mx-auto max-w-5xl p-4 flex justify-center">
          <span className="text-sm text-gray-400 text-center">Created by Daniil Gerachshenko. Weather data from <a href="https://www.weatherapi.com/" target="_blank" className="underline hover:text-gray-300">Weather API</a>.</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
