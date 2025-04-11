// https://github.com/FelixDuverell/nextjs-state-management

"use client"

import * as React from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import { Divider, Button } from "@mui/material"
import "../app/globals.css"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ReactQueryDevtools,
  ReactQueryDevtoolsPanel,
} from "@tanstack/react-query-devtools"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  opacity: 0.8,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}))

const HomeContent = () => {
  const cities = ["Helsingborg", "Malmo", "Lund", "Ystad"]
  const queryClient = useQueryClient()
  const storedCity = queryClient.getQueryData(["selectedCity"]) as string
  const [currentIndex, setCurrentIndex] = React.useState(
    storedCity ? cities.indexOf(storedCity) : 0
  )
  const currentCity = cities[currentIndex]
  const [isOpen, setIsOpen] = React.useState(false)
  const [historicalData, setHistoricalData] = React.useState<{
    city: string
    data: {
      main: { temp: number; humidity: number; pressure: number }
      weather: { description: string }[]
      wind: { speed: number }
      visibility: number
      sys: { sunrise: number; sunset: number }
    }
  } | null>(null)

  React.useEffect(() => {
    queryClient.setQueryData(["selectedCity"], currentCity)
  }, [currentCity, queryClient])

  const { data, error, isLoading } = useQuery({
    queryKey: ["weather", currentCity],
    queryFn: async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${currentCity},SE&appid=${process.env.NEXT_PUBLIC_API_KEY}&units=metric`
      )
      if (!res.ok) {
        throw new Error("Failed to fetch data")
      }
      const weatherData = await res.json()

      // Spara väderdata i localStorage
      const storedData = JSON.parse(localStorage.getItem("weatherData") || "[]")
      storedData.unshift({
        city: currentCity,
        data: weatherData,
        timestamp: Date.now(),
      })

      // Ta bort gamla data om vi har mer än 7 poster
      if (storedData.length > 7) {
        storedData.pop()
      }

      // Spara tillbaka i localStorage
      localStorage.setItem("weatherData", JSON.stringify(storedData))

      return weatherData
    },
  })

  const fetchHistoricalData = () => {
    const storedData = JSON.parse(localStorage.getItem("weatherData") || "[]")
    if (storedData.length > 0) {
      setHistoricalData(storedData[0]) // Hämta den senaste sparade väderdata
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error instanceof Error) return <div>Error: {error.message}</div>

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          style={{
            background: "white",
            color: "darkblue",
            border: "none",
            height: "40px",
            width: "10rem",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Open"} devtools
        </Button>
        <Divider> </Divider>
        <Box>
          <select
            name="menu"
            style={{
              background: "none",
              color: "darkblue",
              border: "2px solid darkblue",
              height: "40px",
              width: "12rem",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 10px",
            }}
            onChange={e => setCurrentIndex(cities.indexOf(e.target.value))}
          >
            <option value="stad">Välj stad</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </Box>
      </Box>

      {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
      <ReactQueryDevtools initialIsOpen={false} />

      <Box sx={{ flexGrow: 1, padding: 4 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Item>
              <h2>{data?.name}</h2>
              <h3>{data?.main?.temp}°C</h3>
              <h4>{data?.weather[0]?.description}</h4>
            </Item>
          </Grid>

          <Grid size={12}>
            <Item
              sx={{
                height: "300px",
                overflowY: "auto",
              }}
            >
              <h5>Wind: {data?.wind?.speed} m/s</h5>
              <Divider />
              <h5>Humidity: {data?.main?.humidity}%</h5>
              <Divider />
              <h5>Pressure: {data?.main?.pressure} hPa</h5>
              <Divider />
              <h5>Visibility: {data?.visibility / 1000} km</h5>
              <Divider />
              <h5>Clouds: {data?.clouds?.all}%</h5>
              <Divider />
              <h5>
                Sunrise:{" "}
                {new Date(data?.sys?.sunrise * 1000).toLocaleTimeString()}
              </h5>
              <Divider />
              <h5>
                Sunset:{" "}
                {new Date(data?.sys?.sunset * 1000).toLocaleTimeString()}
              </h5>
              <Divider />
              <h5>Lon: {data?.coord?.lon}</h5>
              <Divider />
              <h5>Lat: {data?.coord?.lat}</h5>
            </Item>
          </Grid>

          <Grid size={12}>
            {/* Buttons to show historical data */}
            <Item>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchHistoricalData}
                sx={{ marginBottom: "1rem" }}
              >
                View data from earlier today
              </Button>

              {historicalData ? (
                <Box sx={{ marginTop: "1rem" }}>
                  <h2>{historicalData.city}</h2>
                  <h3>{historicalData.data.main.temp}°C</h3>
                  <h4>{historicalData.data.weather[0].description}</h4>
                  <h5>Wind: {historicalData.data.wind.speed} m/s</h5>
                  <h5>Humidity: {historicalData.data.main.humidity}%</h5>
                  <h5>Pressure: {historicalData.data.main.pressure} hPa</h5>
                  <h5>
                    Visibility: {historicalData.data.visibility / 1000} km
                  </h5>
                  <h5>
                    Sunrise:{" "}
                    {new Date(
                      historicalData.data.sys.sunrise * 1000
                    ).toLocaleTimeString()}
                  </h5>
                  <h5>
                    Sunset:{" "}
                    {new Date(
                      historicalData.data.sys.sunset * 1000
                    ).toLocaleTimeString()}
                  </h5>
                </Box>
              ) : (
                <p>No historical data available</p>
              )}
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default HomeContent
