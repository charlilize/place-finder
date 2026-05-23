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
import { Skeleton } from "@/components/ui/skeleton";

// User's search (Geoapify API)
interface q {
  location: string;
  lookingFor: string;
  long: number;
  lat: number;
}

// Structure of data from Google Local Places API
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
  gps_coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface TikTokVideo {
  wmplay: string;
}

const PLACES_PER_PAGE = 4; // how many places to show on each page

function App() {
  const [query, setQuery] = useState<q | null>(null); // Full query info from the user's search
  const [fetchingData, setFetchingData] = useState(false); // for showing/hiding loading spinner
  const [currPage, setCurrPage] = useState(1); // for page pagination, when changes, whole App() rerenders
  const [places, setPlaces] = useState<Place[]>([]); // data retrieved from Google Local API
  const [tiktokVideos, setTiktokVideos] = useState<
    Record<string, TikTokVideo[]>
  >({}); // {"place name": TiktokVideos[]}

  // DUMMY DATA for las vegas "matcha"
  // const [tiktokVideos, setTiktokVideos] = useState<
  //   Record<string, TikTokVideo[]>
  // >({
  //   "True Matcha": [
  //     {
  //       wmplay: "/vid1.MP4",
  //     },
  //   ],
  //   "Urban Matcha": [
  //     {
  //       wmplay: "/vid2.MP4",
  //     },
  //   ],
  //   "Matcha Cafe Maiko of Las Vegas": [
  //     {
  //       wmplay: "/vid3.MP4",
  //     },
  //   ],
  //   "Nana's Green Tea": [
  //     {
  //       wmplay: "/vid4.MP4",
  //     },
  //   ],
  // });

  const mapRef = useRef<L.Map | null>(null); // keep reference of map instance from Leaflet to change it
  const abortControllerRef = useRef<AbortController | null>(null); // like the cancel button for api requests
  const markersRef = useRef<L.Marker[]>([]);

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
          setTiktokVideos({}); // get rid of old tiktok videos as new search
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

  // Update markers for every new set of places
  useEffect(() => {
    if (!mapRef.current || !places) return;

    const map = mapRef.current;

    console.log("[markers] places updated. total places:", places.length);

    // remove the markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = []; // clear the array

    // add new markers
    places
      .filter((p) => p.gps_coordinates) // only keep places with coordinates
      .forEach((p) => {
        const lat = p.gps_coordinates.latitude;
        const long = p.gps_coordinates.longitude;

        const marker = L.marker([lat, long])
          .bindTooltip(p.title, {
            permanent: true,
            offset: [-16, -15],
            direction: "top",
          })
          .addTo(map);

        markersRef.current.push(marker);
      });

    console.log("[markers] markers on map:", markersRef.current.length);
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

  // DISABLED FOR DUMMY DATA
  // Pull TikTok videos for each place
  useEffect(() => {
    const start = (currPage - 1) * PLACES_PER_PAGE;
    const end = start + PLACES_PER_PAGE;
    const visiblePlaces = safePlaces.slice(start, end);

    // Load tiktoks for the places on the current pagination page (skip if already cached)
    visiblePlaces.forEach((p) => {
      // Skip API call if we already have videos for this place
      if (tiktokVideos[p.title]?.length) return;

      const que = `${query?.location} ${p.title}`;
      const url = `https://tiktok-scraper7.p.rapidapi.com/feed/search?keywords=${encodeURIComponent(
        que,
      )}&region=us&count=5&cursor=0&publish_time=0&sort_type=0`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_TIKTOK_API_KEY,
          "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
        },
      };

      const fetchTiktok = async () => {
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          const videos = data.data?.videos || [];
          console.log("tiktok videos for ", p.title, data);

          const tiktokVideosData: TikTokVideo[] = videos.map(
            (vid: { wmplay?: string }) => ({
              wmplay: vid.wmplay || "",
            }),
          );

          setTiktokVideos((prev) => ({
            ...prev,
            [p.title]: tiktokVideosData,
          }));
        } catch (error) {
          console.log(error);
        }
      };
      fetchTiktok();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, currPage, query?.location]); // fetch tiktoks when places changes (new search), currPage changes (pagination), or location changes

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
                className="relative w-full max-w-xs overflow-hidden pt-0 bg-muted"
              >
                {tiktokVideos[place.title]?.[0]?.wmplay ? (
                  <div className="relative w-full aspect-9/16">
                    <video
                      src={tiktokVideos[place.title]?.[0]?.wmplay}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </div>
                ) : (
                  <Skeleton className="w-full aspect-9/16" />
                )}
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{place.title}</CardTitle>
                    <p className="shrink-0 pr-1">
                      {place.rating && place.reviews
                        ? `${place.rating} (${place.reviews})`
                        : ""}
                    </p>
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

                {totalPages > 1
                  ? pageNumbers.map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrPage(pageNum)}
                          isActive={currPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))
                  : null}

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
