import { useEffect, useState } from 'react';
import { HiSearch } from "react-icons/hi";
import { Combobox } from '@headlessui/react';

export default function CitiesSearchbar({ city, setCity }) {
  const [citiesSearch, setCitiesSearch] = useState([]);
  const [query, setQuery] = useState('');

  // Used for the search bar to fetch cities based on the query from search bar.
  useEffect(() => {
    // debounce to prevent spamming API
    const getData = setTimeout(() => {
      searchCities();
    }, 200)

    return () => clearTimeout(getData)
  }, [query]);

  /**
   * Searches for cities based on the query and sets the 'citiesSearch' state with the results.
   */
  async function searchCities() {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${process.env.REACT_APP_WEATHERKEY}&q=${query}`);
      if (response.ok) {
        const data = await response.json();
        setCitiesSearch(data);
      } else {
        throw new Error('Unable to fetch weather data');
      }
    } catch (error) {
      // console.error(error);
    }
  }

  // Filter cities based on the query.
  const filteredCities =
    query === ''
      ? citiesSearch
      : citiesSearch.filter((city) => {
        return city.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
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
                className={({ active }) => `relative cursor-pointer select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              >
                {({ active, selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'text-white font-semibold' : ''}`}>{filteredCity.name}, {filteredCity.region}, {filteredCity.country}</span>

                    {selected && (
                      <span
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-blue-600'}`}
                      >
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
  )
}