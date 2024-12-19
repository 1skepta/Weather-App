import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  const [city, setCity] = useState<string>("Accra"); // Default city is Accra
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState<boolean>(true); // Tracks Celsius/Fahrenheit state

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: "metric", // Use metric units by default (Celsius)
        },
      });
      setWeather(response.data);
    } catch (err) {
      setError("Could not fetch weather data");
    }
    setLoading(false);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius); // Toggle between Celsius and Fahrenheit
  };

  // Convert the temperature based on the current unit
  const convertTemperature = (tempInCelsius: number) => {
    if (isCelsius) {
      return tempInCelsius; // Return Celsius if isCelsius is true
    } else {
      // Convert Celsius to Fahrenheit
      return tempInCelsius * (9 / 5) + 32;
    }
  };

  useEffect(() => {
    getWeather();
  }, []); // Run only once when the component mounts

  return (
    <LinearGradient colors={["#87CEFA", "#4682B4"]} style={styles.bigContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
          placeholderTextColor={"black"}
        />
        <Pressable
          style={({ pressed }) => [
            styles.press,
            pressed ? styles.pressed : null,
          ]}
          onPress={getWeather}
        >
          <Ionicons
            name="search"
            size={30}
            color="#4682B4"
            style={{ padding: 10 }}
          />
        </Pressable>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error ? (
        <Text style={styles.error}>CITY NOT FOUND</Text>
      ) : (
        weather && (
          <View style={styles.weatherContainer}>
            <Text style={styles.cityName}>
              {weather.name}, {weather.sys.country}
            </Text>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>
                {convertTemperature(weather.main.temp).toFixed(1)}°
                {isCelsius ? "C" : "F"}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.switchButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={toggleTemperatureUnit}
              >
                <Ionicons name="thermometer" size={30} color="#4682B4" />
              </Pressable>
            </View>
            <Text style={styles.weather}>{weather.weather[0].description}</Text>
            <Image
              style={styles.icon}
              source={{
                uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
              }}
            />
          </View>
        )
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 30,
  },
  input: {
    borderWidth: 0,
    color: "black",
    fontSize: 25,
    width: "80%",
    height: 50,
    marginLeft: 7,
  },
  press: { backgroundColor: "black", borderRadius: 50 },
  pressed: {
    backgroundColor: "#555",
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  cityName: {
    fontSize: 30,
    fontWeight: "bold",
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ADD8E6",
    paddingLeft: 70,
    paddingRight: 70,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  temperature: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 10,
  },
  weather: {
    fontSize: 30,
    color: "#555",
    backgroundColor: "#ADD8E6",
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  error: {
    color: "white",
    fontSize: 40,
    marginTop: 20,
    fontWeight: 800,
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  unitText: {
    fontSize: 20,
    marginLeft: 5,
    fontWeight: "bold",
  },
});
