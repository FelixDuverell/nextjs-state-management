"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}

// page.tsx kod, gammal
// "use client"
// import * as React from "react"
// import { styled } from "@mui/material/styles"
// import Box from "@mui/material/Box"
// import Paper from "@mui/material/Paper"
// import Grid from "@mui/material/Grid"
// import { Divider } from "@mui/material"
// import "../app/globals.css"

// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import {
//   ReactQueryDevtools,
//   ReactQueryDevtoolsPanel,
// } from "@tanstack/react-query-devtools"

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: "white",
//   opacity: 0.8,
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
//   ...theme.applyStyles("dark", {
//     backgroundColor: "#1A2027",
//   }),
// }))

// const HomeContent = () => {
//   const cities = ["Helsingborg", "Malmo", "Lund", "Ystad"]
//   const queryClient = useQueryClient()
//   const storedCity = queryClient.getQueryData(["selectedCity"]) as string
//   const [currentIndex, setCurrentIndex] = React.useState(
//     storedCity ? cities.indexOf(storedCity) : 0
//   )
//   const currentCity = cities[currentIndex]
//   const [isOpen, setIsOpen] = React.useState(false)

//   React.useEffect(() => {
//     queryClient.setQueryData(["selectedCity"], currentCity)
//   }, [currentCity, queryClient])

//   const { data, error, isLoading } = useQuery({
//     queryKey: ["weather", currentCity],
//     queryFn: async () => {
//       const res = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?q=${currentCity},SE&appid=d0c2e36ece03dffea8c83426c54b0f26&units=metric`
//       )
//       if (!res.ok) {
//         throw new Error("Failed to fetch data")
//       }
//       const weatherData = await res.json()

//       // Lagra väderdata i localStorage tillsammans med tidsstämpel
//       const storedData = JSON.parse(localStorage.getItem("weatherData") || "[]")

//       // Lägg till den nya datan i början av arrayen
//       storedData.unshift({
//         city: currentCity,
//         data: weatherData,
//         timestamp: Date.now(),
//       })

//       // Ta bort gamla data om vi har mer än t.ex. 7 poster
//       if (storedData.length > 7) {
//         storedData.pop() // Ta bort den äldsta posten
//       }

//       // Spara tillbaka i localStorage
//       localStorage.setItem("weatherData", JSON.stringify(storedData))

//       return weatherData
//     },
//   })

//   // Funktion för att visa historisk väderdata (t.ex. för en dag eller en vecka sedan)
//   const showHistoricalData = (daysAgo: number) => {
//     const storedData = JSON.parse(localStorage.getItem("weatherData") || "[]")

//     // Hitta den data som är äldre än 'daysAgo'
//     const targetTime = Date.now() - daysAgo * 24 * 60 * 60 * 1000
//     const historicalData = storedData.find(
//       (entry: any) => entry.timestamp <= targetTime
//     )

//     if (historicalData) {
//       return (
//         <div>
//           <h2>{historicalData.city}</h2>
//           <h3>{historicalData.data.main.temp}°C</h3>
//           <h4>{historicalData.data.weather[0].description}</h4>
//           <h5>Wind: {historicalData.data.wind.speed} m/s</h5>
//         </div>
//       )
//     } else {
//       return <div>No historical data available for that day.</div>
//     }
//   }

//   if (isLoading) return <div>Loading...</div>
//   if (error instanceof Error) return <div>Error: {error.message}</div>

//   return (
//     <>
//       <Box sx={{ display: "flex", justifyContent: "center" }}>
//         <button
//           style={{
//             background: "white",
//             color: "darkblue",
//             border: "none",
//             height: "40px",
//             width: "10rem",
//             cursor: "pointer",
//             marginBottom: "1rem",
//           }}
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? "Close" : "Open"} devtools
//         </button>
//         <Divider> </Divider>
//         <Box>
//           <select
//             name="menu"
//             style={{
//               background: "none",
//               color: "darkblue",
//               border: "2px solid darkblue",
//               height: "40px",
//               width: "12rem",
//               cursor: "pointer",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               padding: "0 10px",
//             }}
//           >
//             <option value="stad">Välj stad</option>
//             {cities.map((city, index) => (
//               <option
//                 key={index}
//                 value={city}
//                 onClick={() => setCurrentIndex(index)}
//               >
//                 {city}
//               </option>
//             ))}
//           </select>
//         </Box>
//       </Box>

//       {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
//       <ReactQueryDevtools initialIsOpen={false} />

//       <Box sx={{ flexGrow: 1, padding: 4 }}>
//         <Grid container spacing={2}>
//           <Grid size={12}>
//             <Item>
//               <h2>{data?.name}</h2>
//               <h3>{data?.main?.temp}°C</h3>
//               <h4>{data?.weather[0]?.description}</h4>
//             </Item>
//           </Grid>

//           <Grid size={12}>
//             <Item
//               sx={{
//                 height: "300px",
//                 overflowY: "auto",
//               }}
//             >
//               <h5>Wind: {data?.wind?.speed} m/s</h5>
//               <Divider />
//               <h5>Humidity: {data?.main?.humidity}%</h5>
//               <Divider />
//               <h5>Pressure: {data?.main?.pressure} hPa</h5>
//               <Divider />
//               <h5>Visibility: {data?.visibility / 1000} km</h5>
//               <Divider />
//               <h5>Clouds: {data?.clouds?.all}%</h5>
//               <Divider />
//               <h5>
//                 Sunrise:{" "}
//                 {new Date(data?.sys?.sunrise * 1000).toLocaleTimeString()}
//               </h5>
//               <Divider />
//               <h5>
//                 Sunset:{" "}
//                 {new Date(data?.sys?.sunset * 1000).toLocaleTimeString()}
//               </h5>
//               <Divider />
//               <h5>Lon: {data?.coord?.lon}</h5>
//               <Divider />
//               <h5>Lat: {data?.coord?.lat}</h5>
//             </Item>
//           </Grid>

//           <Grid size={12}>
//             {/* Buttons to show historical data */}
//             <Item>
//               <button
//                 style={{
//                   background: "none",
//                   color: "darkblue",
//                   border: "2px solid darkblue",
//                   height: "40px",
//                   width: "12rem",
//                   cursor: "pointer",
//                   padding: "0 10px",
//                 }}
//                 onClick={() => showHistoricalData(1)}
//               >
//                 Show weather from 1 day ago
//               </button>
//               <button
//                 style={{
//                   background: "none",
//                   color: "darkblue",
//                   border: "2px solid darkblue",
//                   height: "40px",
//                   width: "12rem",
//                   cursor: "pointer",
//                   padding: "0 10px",
//                 }}
//                 onClick={() => showHistoricalData(7)}
//               >
//                 Show weather from 7 days ago
//               </button>
//             </Item>
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   )
// }

// export default HomeContent
