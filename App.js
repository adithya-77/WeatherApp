
import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import axios from 'axios';

const App = () => {
  const [city, setCity] = useState(''); 
  const [weather, setWeather] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [suggestions, setSuggestions] = useState([]);

  const access_key = 'YOUR API KEY HERE'; 

  
  const fetchWeather = async () => {
    if (!city) return alert('Please enter a city name!');
    setLoading(true);
    try {
      const response = await axios.get(
        `http://api.weatherstack.com/current?access_key=${access_key}&query=${city}`
      );
      console.log(response.data);
      const data = response.data;

      
      if (data.error || !data.location || !data.current) {
        alert('City not found or invalid response. Please try again!');
        setWeather(null);
      } else {
        setWeather(data); 
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('Unable to fetch weather. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim() === '') {
        setSuggestions([]);
        return;
      }
      
      try {
        
        const response = await axios.get(`https://api.weatherstack.com/autocomplete?access_key=${access_key}&query=${city}`);
        const data = response.data;
        setSuggestions(data || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(timer); 
  }, [city]);

  const handleSuggestionSelect = (suggestion) => {
    setCity(suggestion); 
    setSuggestions([]);  
    fetchWeather(suggestion); 
  };

  
  const getWeatherAnimation = () => {
    if (!weather || !weather.current) return { uri: 'https://assets.lottiefiles.com/packages/lf20_default.json' };
    const condition = weather.current.weather_descriptions[0].toLowerCase();

    if (condition.includes('sunny'))
      return { uri: 'https://lottie.host/3f79a6f8-8cb7-40f7-8320-d281fc4c5528/ZHKGzlc2iP.lottie' };
    if (condition.includes('cloudy'))
      return { uri: 'https://lottie.host/79c6c9b9-8381-4657-ba9b-9601d424dadb/94lAfKZ6Mn.lottie' };
    if (condition.includes('rain'))
      return { uri: 'https://lottie.host/240c1a45-c02f-457c-a7cf-50ab8e183fdf/nyPgKnjxwI.lottie' };
    if (condition.includes('haze'))
      return { uri: 'https://lottie.host/5c524a2e-680c-4596-b818-f0dee4d8c690/GjrRCwqAIq.lottie' };
    if (condition.includes('clear'))
      return { uri: 'https://lottie.host/47146ca7-47fd-4435-ad68-6314f616b50c/GcpqOMqyd8.lottie' };
    if (condition.includes('overcast'))
      return { uri: 'https://lottie.host/a6987e47-96f7-4dbc-8eba-c23634ba4c23/yawL2IUOAP.lottie' };

    return { uri: 'https://assets.lottiefiles.com/packages/lf20_default.json' };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      <Button title="Get Weather" onPress={fetchWeather} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionSelect(item)}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}
      {weather && weather.location && weather.current && (
        <View style={styles.weatherContainer}>
          <LottieView
            source={getWeatherAnimation()}
            autoPlay
            loop
            style={styles.weatherAnimation}
          />
          <View style={{ paddingBottom: 20 }}>
          <Text style={styles.weatherText}>
            {weather.location.name}: {weather.current.temperature}°C
            {'\n'}
            {weather.current.weather_descriptions[0].toUpperCase()}
            {'\n'}
            Feelslike: {weather.current.feelslike}°C
            {'\n'}
            Last Checked Time: {weather.current.observation_time}
            {'\n'}
            Region: {weather.location.region}
            {'\n'}
            Humidity: {weather.current.humidity}
            {'\n'}
            Local Time: {weather.location.localtime}
          </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherAnimation: {
    width: 200,
    height: 200,
  },
  weatherText: {
    fontSize: 20,
    marginVertical: 5,
    textAlign: 'center',
    lineHeight: 30,
  },
  suggestionsContainer: {
    marginTop: 10,
    maxHeight: 150,
  },
  suggestionText: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;

