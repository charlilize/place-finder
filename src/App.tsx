import Header from "@/components/header";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useRef } from "react";

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

const PLACES_PER_PAGE = 4; // how many places to show on each page

function App() {
  const [query, setQuery] = useState<q | null>(null); // Full query info from the user's search
  const [places, setPlaces] = useState<Place[]>([]); // data retrieved from Google Local API
  const [fetchingData, setFetchingData] = useState(false); // for showing/hiding loading spinner
  const mapRef = useRef<L.Map | null>(null); // keep reference of map instance from Leaflet to change it
  const [currPage, setCurrPage] = useState(1); // for page pagination, when changes, whole App() rerenders

  const abortControllerRef = useRef<AbortController | null>(null); // like the cancel button for api requests

  // If a query is set, fetch data from Google Local to populate cards
  useEffect(() => {
    if (!query || !mapRef.current) {
      return;
    }

    // remove previous api request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    mapRef.current.setView([query.lat, query.long], 13);

    console.log("query", query);

    // Link to the Netlify function that will fetch the data from Google Local
    const url = `/.netlify/functions/search?location=${encodeURIComponent(
      query?.location,
    )}&q=${encodeURIComponent(query?.lookingFor)}`;

    const fetchGoogleLocalPlaces = async () => {
      // create a way to cancel this specific request later
      abortControllerRef.current = new AbortController();

      setFetchingData(true);
      // Fetch the data from Google Local
      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });

        // If the response is ok, parse the data as JSON
        if (response.ok) {
          const data = await response.json();
          setPlaces(data["local_results"] || []);
          setCurrPage(1);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.log("Error fetching Google Local Places", error);
        }
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

  // Create the map on mount
  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = L.map("map").setView([37.7749, -122.4194], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    // when component unmounts, delete the map since React in Strict Mode renders components twice
    // to not get the error of already initializing a map
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Calculate which places to show depending on page pagination every re-render
  // Starting and end index of places array for each page
  const safePlaces = places || [];
  const startIndex = (currPage - 1) * PLACES_PER_PAGE;
  const endIndex = startIndex + PLACES_PER_PAGE;
  const placesToShow = safePlaces.slice(startIndex, endIndex);
  const totalPages = Math.ceil(safePlaces.length / PLACES_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // create an array of page numbers

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header getQuery={setQuery} />
      <div className="flex items-center justify-center flex-1 min-h-0 p-7">
        {/* Place Results */}
        <div className="w-[51.5%] h-full p-2 pt-12 flex flex-wrap gap-4 content-start justify-center overflow-y-auto scrollbar-none">
          {fetchingData ? (
            <Spinner className="size-8" />
          ) : placesToShow && placesToShow.length > 0 ? (
            placesToShow.map((place, index) => (
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
          ) : null}

          {query === null ? (
            <p className="text-xl font-bold">Start searching!</p>
          ) : null}

          {!fetchingData && safePlaces.length === 0 && query !== null ? (
            <p className="text-xl font-bold">No places found.</p>
          ) : null}

          {places && places.length > 0 && !fetchingData ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {currPage === 1 ? null : (
                    <PaginationPrevious
                      onClick={() => setCurrPage(currPage - 1)}
                    />
                  )}
                </PaginationItem>

                {pageNumbers.map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrPage(pageNum)}
                      isActive={currPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  {currPage === totalPages ? null : (
                    <PaginationNext onClick={() => setCurrPage(currPage + 1)} />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
        {/* Map */}
        <div className="w-[48.5%] h-[82vh] bg-gray-200 mr-5" id="map"></div>
      </div>
    </div>
  );
}

export default App;
