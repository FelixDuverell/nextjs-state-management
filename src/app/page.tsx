"use client"

import { useQuery } from "@tanstack/react-query"

const Home = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=d0c2e36ece03dffea8c83426c54b0f26&units=metric`
      )
      if (!res.ok) {
        throw new Error("Failed to fetch data")
      }
      return res.json()
    },

    refetchInterval: 10000,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h1>Data från API:</h1>
      <h2>{data?.name}</h2>
      <h3>{data?.main?.temp}°C</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Home
