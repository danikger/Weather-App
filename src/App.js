import { useEffect, useState } from 'react';
import { HiSearch, HiRefresh } from "react-icons/hi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FiWind, FiDroplet, FiThermometer, FiEye, FiSun } from "react-icons/fi";
import { RiWaterPercentLine, RiDashboard3Line } from "react-icons/ri";
import { Combobox } from '@headlessui/react'
import weatherIcons from './JSON/weatherIcons';
import './App.css';

function App() {
  const [city, setCity] = useState({ name: 'Winnipeg' });
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({
    current: "",
    forecast: { forecastday: [""] },
  });

  const [query, setQuery] = useState('')
  const [citiesSearch, setCitiesSearch] = useState([]);

  let array = [
    {
      day: 'Today',
      maxTemp: Math.round(weatherData.forecast.forecastday[0]?.day?.maxtemp_c),
      lowTemp: Math.round(weatherData.forecast.forecastday[0]?.day?.mintemp_c),
    },
    {
      day: new Date(weatherData.forecast.forecastday[1]?.date_epoch * 1000).toLocaleTimeString('en-us', { weekday: "long" }).split(' ')[0],
      maxTemp: Math.round(weatherData.forecast.forecastday[1]?.day?.maxtemp_c),
      lowTemp: Math.round(weatherData.forecast.forecastday[1]?.day?.mintemp_c),
    },
    {
      day: new Date(weatherData.forecast.forecastday[2]?.date_epoch * 1000).toLocaleTimeString('en-us', { weekday: "long" }).split(' ')[0],
      maxTemp: Math.round(weatherData.forecast.forecastday[2]?.day?.maxtemp_c),
      lowTemp: Math.round(weatherData.forecast.forecastday[2]?.day?.mintemp_c),
    }, 
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

  function getWeatherDescription(weather) {
    let item = weatherIcons.find((item) => item.weather === weather);
    return item ? item.weather : null;
    // return item.weather;
  }

  function getWeatherIcon(weather = []) {
    // let item = weatherIcons.find((item) => item.weather === weather);
    let item = weatherIcons.find((item) => weather.includes(item.weather.toLowerCase()));
    return item ? <item.icon className="w-7 h-7 text-blue-500 mr-2" /> : null;
  }

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  useEffect(() => {
    console.log("searched city");
    // debounce to prevent spamming API
    const getData = setTimeout(() => {
      searchCities();
    }, 200)

    return () => clearTimeout(getData)
  }, [query]);

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

  async function fetchWeatherData() {
    try {
      // Used for loading animation
      setLoading(true);

      let cityName = city.name;

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

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const filteredCities =
    query === ''
      ? citiesSearch
      : citiesSearch.filter((person) => {
        return person.name.toLowerCase().includes(query.toLowerCase())
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
              {/* <div className="inline-flex items-center bg-gray-800 py-2 px-4 rounded-full shadow-sm"> */}
              {/* <HiSearch className="w-5 h-5 mr-2 text-gray-400" />
                <label className="sr-only" htmlFor="citySearch">City Search</label>
                <input
                  id="citySearch"
                  type="text"
                  placeholder="Search for city"
                  className="bg-gray-800 text-gray-100 inline-flex focus:ring-0 focus:ring-offset-0 outline-none"
                /> */}
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
            <div className="bg-gray-900 border border-gray-800 w-full col-span-3 md:col-span-1 rounded-md p-5 h-72">
              <h1 className="text-gray-100 text-3xl font-medium text-center">{city.name}</h1>

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
                {/* <FiSun className="w-6 h-6 text-blue-500 mr-2" /> */}
                {getWeatherIcon(weatherData.current?.condition?.text)}
                {/* {getWeatherIcon(weatherData?.current?.condition?.text)} */}
                {/* <FiSun className="w-6 h-6 text-blue-500 mr-2" /> */}
                {/* {getWeatherDescription(weatherData.current?.condition?.text)} */}
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


        {/* This section makes it feel like theres too many gray squares/rectangles on the page. 
        Perhaps go with something with no background?  */}

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
        <div className="mt-16 mx-auto max-w-5xl mb-16 p-4">
          <span className="text-gray-100 text-xl font-medium">3-Day Forecast</span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 mb-4">
            {array.map((item) => (
              <div className="bg-gray-900 border border-gray-800 shadow-sm rounded-md p-4 hover:bg-gray-800 cursor-pointer">

                <div className="flex items-center">
                  <FiSun className="w-7 h-7 text-blue-500 mr-2" />
                  <p className="text-gray-100 text-lg font-medium">{item.day}</p>
                  <div className="flex ml-auto">
                    <p className="text-gray-100 text-lg mr-1">{item.maxTemp}°</p>
                    <p className="text-gray-400 text-lg">{item.lowTemp}°</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <button className="flex items-center bg-gray-900 rounded-md p-2.5 w-full">
                <FiThermometer className="w-6 h-6 text-blue-500 mr-2.5" />
                <p className="text-gray-100 font-medium">Temperature</p>
              </button>

              <button className="flex items-center hover:bg-gray-900 rounded-md p-2.5 w-full group">
                <FiDroplet className="w-6 h-6 text-gray-600 mr-2.5 group-hover:text-blue-500" />
                <p className="text-gray-400 font-medium group-hover:text-gray-100">Precipitation</p>
              </button>
            </div>

            <div className="border border-gray-800 shadow-sm rounded-md p-4 col-span-3 h-80">

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
