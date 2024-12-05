import { useState, useEffect } from "react";

const SelectCity = () => {
  const dropdownStyle = {
    margin: "10px",
    fontSize: "20px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");

  const [states, setStates] = useState([]);
  const [state, setState] = useState("");

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");

  const [selectedLocation, setSelectedLocation] = useState("");

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://crio-location-selector.onrender.com/countries"
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch States
  const fetchStates = async (selectedCountry) => {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/states/`
      );
      const data = await response.json();
      setStates(data);
      setCities([]); // Clear cities when a new country is selected
      setState("");
      setCity("");
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // Fetch cities
  const fetchCities = async (selectedState) => {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/state=${selectedState}/cities/`
      );
      const data = await response.json();
      setCities(data);
      setCity("");
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    if (country && state && city) {
      setSelectedLocation(`You Selected ${city}, ${state}, ${country}`);
    }
  }, [country, state, city]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // border: "1px solid black",
        padding: "20px",
        width: "300px",
        margin: "auto",
      }}
    >
      {/* Header */}
      <h1>Select Location</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",

          padding: "20px",
        }}
      >
        {/* Select Country */}
        <select
          style={dropdownStyle}
          value={country}
          onChange={(e) => {
            const selectedCountry = e.target.value;
            setCountry(selectedCountry);
            fetchStates(selectedCountry);
          }}
        >
          <option value="">Select a Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* Select State */}
        <select
          style={dropdownStyle}
          value={state}
          onChange={(e) => {
            const selectedState = e.target.value;
            setState(selectedState);
            fetchCities(selectedState, country);
          }}
          disabled={!country} // Enabled only when a country is selected
        >
          <option value="">Select a State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* Select City */}
        <select
          style={dropdownStyle}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state} // Enabled only when a state is selected
        >
          <option value="">Select a City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Display Selected Location */}
      {selectedLocation && (
        <p
          style={{
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "20px",
            whiteSpace: "nowrap",
          }}
        >
          {city ? `You Selected ${city}, ${state}, ${country}` : ``}
        </p>
      )}
    </div>
  );
};

export default SelectCity;
