import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const MIN_ADDRESS_LENGTH = 3;
const DELAY = 300;

interface cityInfo {
  formatted: string;
  state: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
}

function Header({
  getQuery,
}: {
  getQuery: (query: {
    location: string;
    lookingFor: string;
    long: number;
    lat: number;
  }) => void;
}) {
  const [cities, setCities] = useState<cityInfo[]>([]); // Cities to show in dropdown
  const [selectedCity, setSelectedCity] = useState<cityInfo | null>(null); // City that is selected
  const [cityQuery, setCityQuery] = useState(""); // Query to search for cities
  const [lookingForQuery, setLookingForQuery] = useState(""); // Query to search for places
  const [citiesLoading, setCitiesLoading] = useState(false);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // set timer for 300ms
  const abortControllerRef = useRef<AbortController | null>(null); // like the cancel button for api requests

  // useEffect(() => {
  //   console.log("dropdown: ", cities);
  // }, [cities]);

  // Function for when user is typing in a city, render dropdown after 300ms
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setCityQuery(currentValue);

    // remove timer if user typed again before 300ms passed
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // remove previous api request if user typed again before 300ms passed
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear results if input is empty or too short
    if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
      setCities([]); // clear dropdown
      setSelectedCity(null);
      return;
    }

    // store id of timer in ref
    // start a timer for 300ms in background before making api request
    // (if user typed again before 300ms passed, timer is cleared above via new function call and new timer is created)
    debounceTimeoutRef.current = setTimeout(async () => {
      // create a way to cancel this specific request later
      abortControllerRef.current = new AbortController();

      setCitiesLoading(true);

      try {
        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          currentValue,
        )}&type=city&limit=5&format=json&apiKey=${apiKey}`;

        // make api request and link to stop button
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });

        if (response.ok) {
          // if request is successful, get data
          const data = await response.json();
          // get just city names from data
          const cities = (data.results || []).map(
            (result: {
              formatted: string;
              city: string;
              state: string;
              country: string;
              lon: number;
              lat: number;
            }) => ({
              formatted: result.formatted,
              city: result.city,
              state: result.state,
              country: result.country,
              longitude: result.lon,
              latitude: result.lat,
            }),
          );

          // set city names in dropdown
          setCities(cities);
        }
      } catch (error) {
        // Ignore abort errors (user typed again before request finished)
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Geocoding error:", error);
        }
      } finally {
        setCitiesLoading(false);
      }
    }, DELAY);
  };

  // When user clicks on an item on search cities dropdown
  const handleCitySelect = (item: cityInfo) => {
    setCityQuery(item.formatted);
    setSelectedCity(item);
  };

  // When user types in what they're looking for, update variable
  const handleLookingForInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const currentValue = e.target.value;
    setLookingForQuery(currentValue);
  };

  // When user clicks search button
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    // UI deals with empty city field
    // If they didn't select something from dropdown but have something typed, set city to the first one from dropdown
    // if selectedCity doesn't exist
    const cityToUse = selectedCity || cities[0];

    // If they selected a city in the dropdown, set the query
    if (cityToUse) {
      getQuery({
        location: `${cityToUse.city}, ${cityToUse.state}, ${cityToUse.country}`,
        lookingFor: lookingForQuery,
        long: cityToUse.longitude,
        lat: cityToUse.latitude,
      });
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-200 p-5">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Place Finder</h1>
      </div>
      <form className="w-full max-w-3xl" onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <Field>
              <FieldLabel>Location</FieldLabel>
              <Combobox items={cities}>
                <ComboboxInput
                  value={cityQuery}
                  type="text"
                  placeholder="Search city..."
                  showTrigger={false}
                  className="bg-white"
                  onChange={handleCityInputChange}
                  required
                  // Show red error if there is no city selected and no cities in dropdown
                  // (meaning no suggestions for what they inputted)
                  aria-invalid={
                    !selectedCity &&
                    cities.length === 0 &&
                    cityQuery.length != 0
                  }
                />
                <ComboboxContent>
                  <ComboboxEmpty>
                    {cityQuery.length < MIN_ADDRESS_LENGTH
                      ? "Type at least 3 characters..."
                      : "No cities found."}
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(item: cityInfo) => (
                      <ComboboxItem
                        key={item.formatted}
                        value={item.formatted}
                        onClick={() => handleCitySelect(item)}
                      >
                        {item.formatted}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field>
              <FieldLabel>Looking for</FieldLabel>
              <Input
                type="text"
                placeholder="Parks, coffee, museums..."
                className="bg-white"
                required
                onChange={handleLookingForInputChange}
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              // Disable when there's no cities loading OR no city is selected and no cities in dropdown
              disabled={citiesLoading || (!selectedCity && cities.length === 0)}
            >
              Search
            </Button>
          </div>
        </FieldGroup>
      </form>

      <div className="flex items-center gap-2">
        <h1>About</h1>
      </div>
    </div>
  );
}

export default Header;
