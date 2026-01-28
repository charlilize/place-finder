import Header from "@/components/header";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";

interface q {
  location: string;
  lookingFor: string;
  long: number;
  lat: number;
}

interface Place {
  title: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  thumbnail: string;
  links: {
    website: string; // add a way to go to website
    directions: string;
  };
}

function App() {
  const [query, setQuery] = useState<q | null>(null); // Full query info from the user's search
  const [places, setPlaces] = useState<Place[]>([]); // data retrieved from Google Local API
  const [fetchingData, setFetchingData] = useState(false); // for showing/hiding loading spinner

  // If a query is set, fetch data from Google Local to populate cards
  useEffect(() => {
    if (!query) {
      return;
    }

    console.log("in app:", query);

    // Link to the Netlify function that will fetch the data from Google Local
    const url = `/.netlify/functions/search?location=${query?.location}&q=${query?.lookingFor}`;

    const fetchGoogleLocalPlaces = async () => {
      setFetchingData(true);
      // Fetch the data from Google Local
      try {
        const response = await fetch(url);

        // If the response is ok, parse the data as JSON
        if (response.ok) {
          const data = await response.json();
          setPlaces(data["local_results"]);
        }
      } catch (error) {
        console.log("Error fetching Google Local Places", error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchGoogleLocalPlaces();
  }, [query]);

  // in here also could map through the places and find corresponding tiktok vids
  useEffect(() => {
    console.log("places updated: ", places);
  }, [places]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header getQuery={setQuery} />
      <div className="flex items-center justify-center flex-1 min-h-0 p-7">
        {/* Place Results */}
        <div className="w-[51.5%] h-full p-2 pt-12 flex flex-wrap gap-4 content-start justify-center overflow-y-auto scrollbar-none">
          {fetchingData ? (
            <Spinner className="size-8" />
          ) : places && places.length > 0 ? (
            places.map((place, index) => (
              <Card
                key={index}
                className="relative w-full max-w-xs overflow-hidden pt-0"
              >
                <div className="bg-primary absolute inset-0 z-30 aspect-4/3 opacity-50 mix-blend-color" />
                <img
                  src={
                    place.thumbnail
                      ? place.thumbnail
                      : "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  className={
                    place.thumbnail
                      ? ""
                      : "relative z-20 aspect-4/3 w-full object-cover brightness-60 grayscale"
                  }
                  alt="Photo by mymind on Unsplash"
                  title="Photo by mymind on Unsplash"
                />
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{place.title}</CardTitle>
                    <p className="shrink-0">{`${place.rating} (${place.reviews})`}</p>
                  </div>
                  <CardDescription>{place.description}</CardDescription>
                  <p>{place.price == "$" ? "" : place.price}</p>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-xl font-bold">Start searching!</p>
          )}
        </div>
        {/* Map */}
        <div className="w-[48.5%] h-[82vh] bg-gray-200 mr-5">
          <h1>Map</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
