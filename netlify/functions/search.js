// Netlify function to communicate to SerpAPI since front-end (App.tsx) can't do it directly
// Aka front-end talks to this function. This functino talks to SerpAPI
export default async (request, context) => {
  const apiKey = process.env.SERPAPI_API_KEY;

  // get the information from App.tsx's API request
  const url = new URL(request.url);
  const location = url.searchParams.get("location");
  const query = url.searchParams.get("q");

  // create the request that this function will send to SerpAPI
  const serpUrl = `https://serpapi.com/search.json?engine=google_local&q=${query}&location=${location}&api_key=${apiKey}`;

  const response = await fetch(serpUrl);
  const data = await response.json();

  // return the data
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
