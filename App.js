import * as Location from 'expo-location';
import { React, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

//어디서든 그 기종에 맞는 너비를 확인할라구 
const { width: SCREEN_WIDTH } = Dimensions.get("window");


export default function App() {
  const [city, setCity] = useState("Loading city...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  // api 키는 항상 서버에서 받아오는게 좋다 . 
  const API_KEY = "-"
  const icons = {
    Clouds: "cloudy-gusts",
    Clear: "day-sunny",
    Rain: "rains",
    Atmosphere: "",
    Snow: "snow",
    Drizzle: "rain",
    Thunderstorm: "lightning",


  };

  const getWeather = async () => {
    //위치 정보를 가져 가도 되는지 여부 확인 -> 승인 -> 작동
    const { granted } = await Location.requestForegroundPermissionsAsync()
    if (!granted) {
      setOk(false);
    }
    // 위치 정보 허용 -> 현재 위치에 대한 위도 경도 -> 확인
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    // 위도 경도를 가지고 가서 사람이 쓰는 주소로 바꿔준다. 
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    // 해당 정보 안에는 도시 정보가 들어 있고 도시 이름을 세팅 ! 
    setCity(location[0].city)
    // 해당 도시에 대한 온도 정보를 가져 와야하는데 그거는 위도 경도 정보 fetch로 받아오기 
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    // 받아온 정보는 꼭 json 파일로 변환을 해줘야하나 보다 
    const json = await response.json()

    setDays(json.daily)

  }
  //앱 작동되면 함수 작동 ! 
  useEffect(() => {
    getWeather();
  }, []);

  return (


    // 모바일 앱은 column 이 기본 !
    // 웹은 row 가 기본 !  
    // height 안쓰고 flex 비율로 할꺼야 : 부모 flex가 있어야 한다.
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      {/* scrollview 를 사용할 때는 contentContainerStyle 사용해야함 */}
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="white" style={{ marginTop: 10 }} size="large" />
          </View>
        ) : (days.map((day, index) =>
          <View key={index} style={styles.day}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(0)}
              </Text>
              <Fontisto style={{ color: "white" }} name={icons[day.weather[0].main]} size={80} color="black" />
            </View>

            <Text style={styles.desc}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>

          </View>))}

      </ScrollView>
    </View>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,

  },
  cityName: {
    fontSize: 50,
    fontWeight: "500",
    color: "white",
  },
  weather: {

  },
  day: {
    alignContent: "center",
    width: SCREEN_WIDTH,
    paddingHorizontal: 30

  },

  temp: {
    marginTop: 30,
    fontWeight: 600,
    fontSize: 180,
    color: "white"

  },
  desc: {
    marginTop: -20,
    fontSize: 30,
    color: "white",
    fontWeight: "500"

  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500"
  }


});


