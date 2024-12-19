import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import axios from "axios";

interface Weather {
  main: { temp: number };
  weather: { description: string; icon: string }[];
  name: string;
  sys: { country: string };
}

const WEATHER_API_KEY = "d8f2b37a87b8ae8b504c0e0fbee89b9d";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export default function Index() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: "metric",
        },
      });
      setWeather(response.data);
    } catch (err) {
      setError("Could not fetch weather data");
    }
    setLoading(false);
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
          placeholderTextColor={"white"}
        />

        <Pressable
          style={({ pressed }) => [
            styles.press,
            pressed ? styles.pressed : null,
          ]}
          onPress={getWeather}
        >
          <Text style={styles.buttonText}>Get Weather</Text>
        </Pressable>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          weather && (
            <View style={styles.weatherContainer}>
              <Text style={styles.cityName}>
                {weather.name}, {weather.sys.country}
              </Text>
              <Text style={styles.temperature}>{weather.main.temp}°C</Text>
              <Text style={styles.weather}>
                {weather.weather[0].description}
              </Text>
              <Image
                style={styles.icon}
                source={{
                  uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                }}
              />
            </View>
          )
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
    padding: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "white",
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  temperature: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 10,
  },
  weather: {
    fontSize: 20,
    color: "#555",
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  error: {
    color: "red",
    fontSize: 18,
    marginTop: 20,
  },
  press: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  pressed: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#25292e",
  },
});
