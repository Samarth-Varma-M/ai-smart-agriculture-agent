"use server";

import { WeatherDay } from "@/lib/types";

const MOCK_FORECAST: WeatherDay[] = [
  { day: "Today", condition: "Sunny", high: 32, low: 22, rain: 0, wind: 12, humidity: 48 },
  { day: "Tomorrow", condition: "Cloudy", high: 33, low: 23, rain: 0, wind: 10, humidity: 52 },
  { day: "Day 3", condition: "Cloudy", high: 30, low: 22, rain: 5, wind: 15, humidity: 68 },
  { day: "Day 4", condition: "Rain", high: 28, low: 21, rain: 25, wind: 20, humidity: 88 },
  { day: "Day 5", condition: "Rain", high: 27, low: 20, rain: 15, wind: 18, humidity: 82 },
];

export async function getWeatherData(city: string): Promise<{ forecast?: WeatherDay[], error?: string }> {
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    return { forecast: MOCK_FORECAST }; // Ironclad fallback
  }

  try {
    const geoRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`);
    const geoData = await geoRes.json();
    
    if (!geoData || geoData.length === 0) {
      return { forecast: MOCK_FORECAST };
    }
    
    const { lat, lon } = geoData[0];

    const forecastRes = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await forecastRes.json();
    
    if (data.cod !== "200") {
      return { forecast: MOCK_FORECAST };
    }

    const dailyData: Record<string, any> = {};
    for (const item of data.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date] || item.dt_txt.includes("12:00:00")) {
        dailyData[date] = item;
      }
    }

    const forecast: WeatherDay[] = Object.values(dailyData).slice(0, 5).map((item: any, index: number) => {
      let dayName = `Day ${index + 1}`;
      if (index === 0) dayName = "Today";
      else if (index === 1) dayName = "Tomorrow";

      let condition = "Sunny";
      if (item.weather[0].main.includes("Rain")) condition = "Rain";
      else if (item.weather[0].main.includes("Cloud")) condition = "Cloudy";

      return {
        day: dayName,
        condition,
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        rain: item.rain?.['3h'] || 0,
        wind: Math.round(item.wind.speed * 3.6),
        humidity: item.main.humidity,
      };
    });

    return { forecast };
  } catch (error: any) {
    console.error("OpenWeather API Error:", error);
    return { forecast: MOCK_FORECAST };
  }
}
