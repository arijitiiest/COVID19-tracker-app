import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import MapView, { Marker } from "react-native-maps";

import * as regionActions from "../store/actions/region";
import Colors from "../constants/Colors";
import StatusCard from "../components/UI/StatusCard";
import GraphView from "../components/UI/GraphView";
import PieChartView from "../components/UI/PieChartView";

const RegionStatScreen = (props) => {
  const regionId = props.navigation.getParam("regionId");
  const [regionData, setRegionData] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chartData, setChartData] = useState();
  const [pieChartData, setPieChartData] = useState();
  const [mapLocation, setMapLoaction] = useState();
  const [markerLocation, setMarkerLocation] = useState();

  const regionsData = useSelector((state) => state.world.regionsData);
  const regionDailyData = useSelector((state) => state.region.regionDailyData);
  const region = useSelector((state) => state.region.regionData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (Array.isArray(regionsData)) {
      const myRegion = regionsData.filter((data) => data.id === regionId);
      setRegionData(myRegion[0]);
    }
  }, [regionsData]);

  const loadData = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(
        regionActions.fetchRegionData(regionData.region, regionData.countryCode)
      );
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    setIsRefreshing(false);
  });

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().then(() => {
      setIsRefreshing(false);
    });
  }, [isRefreshing]);

  useEffect(() => {
    if (regionData !== undefined) {
      setIsLoading(true);
      loadData().then(() => {
        setIsLoading(false);
      });
    }
  }, [regionData]);

  useEffect(() => {
    props.navigation.setParams({ regionName: region.name });
  }, [region]);

  useEffect(() => {
    if (Array.isArray(regionDailyData)) {
      const myChartData = [
        {
          lables: [],
          datasets: [
            {
              data: [],
              color: () => Colors.deathColor,
              strokeWidth: 2,
            },
          ],
          legend: ["Confirmed"],
        },
        {
          lables: [],
          datasets: [
            {
              data: [],
              color: () => Colors.recoveredColor,
              strokeWidth: 2,
            },
          ],
          legend: ["Recovered"],
        },
        {
          lables: [],
          datasets: [
            {
              data: [],
              color: () => Colors.infectedColor,
              strokeWidth: 2,
            },
          ],
          legend: ["Decreased"],
        },
      ];

      regionDailyData.map((data, idx) => {
        if (idx % 7 === 0) {
          myChartData[0].lables.push(data.date);
          myChartData[1].lables.push(data.date);
          myChartData[2].lables.push(data.date);
          myChartData[0].datasets[0].data.push(data.confirmed);
          myChartData[1].datasets[0].data.push(data.recovered);
          myChartData[2].datasets[0].data.push(data.deaths);
        }
      });
      setChartData(myChartData);
    }
  }, [regionDailyData]);

  useEffect(() => {
    if (region !== undefined && regionData !== undefined) {
      const data = [
        {
          name: "Recovered",
          population: regionData.totalRecovered,
          color: Colors.recoveredColor,
          legendFontColor: Colors.textColor,
          legendFontSize: 12,
          legendFontFamily: "open-sans",
        },
        {
          name: "Active",
          population:
            regionData.totalConfirmed -
            regionData.totalDeaths -
            regionData.totalRecovered,
          color: Colors.deathColor,
          legendFontColor: Colors.textColor,
          legendFontSize: 12,
          legendFontFamily: "open-sans",
        },
        {
          name: "Deaths",
          population: regionData.totalDeaths,
          color: Colors.infectedColor,
          legendFontColor: Colors.textColor,
          legendFontSize: 12,
          legendFontFamily: "open-sans",
        },
        {
          name: "Uninfected",
          population:
            region.population -
            regionData.totalConfirmed +
            regionData.totalDeaths,
          color: Colors.activeColor,
          legendFontColor: Colors.textColor,
          legendFontSize: 12,
          legendFontFamily: "open-sans",
        },
      ];
      setPieChartData(data);
    }
  }, [region, regionData]);

  useEffect(() => {
    if (region) {
      setMapLoaction({
        latitude: region.lat,
        longitude: region.lan,
        latitudeDelta: 8.298,
        longitudeDelta: 3.789,
      });
      setMarkerLocation({
        latitude: region.lat,
        longitude: region.lan,
      });
    }
  }, [region]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text
          style={{
            fontFamily: "open-sans-bold",
            fontSize: 15,
            color: Colors.textColor,
          }}
        >
          An error occurred!
        </Text>
        <Button
          title="Try again"
          onPress={loadData}
          color={Colors.primaryColor}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{
                uri: `http://www.geognos.com/api/en/countries/flag/${region.countryCode}.png`,
              }}
            />
          </View>
          <Text style={styles.nativeName}>{region.nativeName}</Text>

          {pieChartData !== undefined ? (
            <PieChartView pieData={pieChartData} />
          ) : (
            <Text></Text>
          )}

          <Text style={styles.header}>Stats</Text>

          {regionData !== undefined ? (
            <View style={styles.stats}>
              <StatusCard style={styles.statCard}>
                <View style={styles.stat}>
                  <Text style={{ ...styles.confirmedText, fontSize: 12 }}>
                    Confirmed
                  </Text>
                  <Text style={{ ...styles.confirmedText, fontSize: 10 }}>
                    [+
                    {regionData.newConfirmed
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    ]
                  </Text>
                  <Text style={{ ...styles.confirmedText, fontSize: 18 }}>
                    {regionData.totalConfirmed
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                </View>
              </StatusCard>
              <StatusCard style={styles.statCard}>
                <View style={styles.stat}>
                  <Text style={{ ...styles.activeText, fontSize: 13 }}>
                    Active
                  </Text>
                  <Text></Text>
                  <Text style={{ ...styles.activeText, fontSize: 18 }}>
                    {(
                      regionData.totalConfirmed -
                      regionData.totalDeaths -
                      regionData.totalRecovered
                    )
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                </View>
              </StatusCard>
              <StatusCard style={styles.statCard}>
                <View style={styles.stat}>
                  <Text style={{ ...styles.recoveredText, fontSize: 12 }}>
                    Recovered
                  </Text>
                  <Text style={{ ...styles.recoveredText, fontSize: 10 }}>
                    [+
                    {regionData.newRecovered
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    ]
                  </Text>
                  <Text style={{ ...styles.recoveredText, fontSize: 18 }}>
                    {regionData.totalRecovered
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                </View>
              </StatusCard>
              <StatusCard style={styles.statCard}>
                <View style={styles.stat}>
                  <Text style={{ ...styles.deathText, fontSize: 12 }}>
                    Deaths
                  </Text>
                  <Text style={{ ...styles.deathText, fontSize: 10 }}>
                    [+
                    {regionData.newDeaths
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    ]
                  </Text>
                  <Text style={{ ...styles.deathText, fontSize: 18 }}>
                    {regionData.totalDeaths
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                </View>
              </StatusCard>
            </View>
          ) : (
            <Text></Text>
          )}

          {chartData !== undefined ? (
            <View style={styles.chart}>
              <Text style={styles.header}>Graph View</Text>
              <View style={{ paddingBottom: 10 }}>
                <GraphView chartData={chartData[0]} />
              </View>
              <View style={{ paddingBottom: 10 }}>
                <GraphView chartData={chartData[1]} />
              </View>
              <View style={{ paddingBottom: 10 }}>
                <GraphView chartData={chartData[2]} />
              </View>
            </View>
          ) : (
            <Text></Text>
          )}

          <Text style={styles.header}>View on Map</Text>
          {mapLocation ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={mapLocation}
                onPress={() => {}}
              >
                {markerLocation && (
                  <Marker
                    title={region.name}
                    coordinate={markerLocation}
                  ></Marker>
                )}
              </MapView>
            </View>
          ) : (
            <Text></Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
  },
  imageContainer: {
    width: 180,
    height: 100,
    marginVertical: 20,
    borderColor: "white",
    borderWidth: 7,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    elevation: 5,
    borderRadius: 1,
    backgroundColor: "white",
    margin: 20,
  },
  header: {
    fontFamily: "open-sans-bold",
    fontSize: 19,
    marginVertical: 5,
  },
  nativeName: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    color: Colors.textColor,
    paddingBottom: 30,
  },
  mapContainer: {
    width: Dimensions.get("screen").width - 50,
    height: 200,
    marginVertical: 20,
    borderColor: "white",
    borderWidth: 7,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    elevation: 5,
    borderRadius: 1,
    backgroundColor: "white",
  },
  map: {
    width: "100%",
    height: "100%",
    borderColor: "white",
    borderWidth: 5,
  },

  stats: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
  },
  statCard: {
    marginHorizontal: 3,
  },
  stat: {
    width: 90,
    marginVertical: 10,
    alignItems: "center",
  },
  confirmedText: {
    fontFamily: "open-sans-bold",
    color: Colors.deathColor,
    padding: 2,
  },
  activeText: {
    fontFamily: "open-sans-bold",
    color: Colors.activeColor,
    padding: 2,
  },
  deathText: {
    fontFamily: "open-sans-bold",
    color: Colors.textColor,
    padding: 2,
  },
  recoveredText: {
    fontFamily: "open-sans-bold",
    color: Colors.recoveredColor,
    padding: 3,
  },
  chart: {
    flex: 1,
    alignItems: "center",
    marginVertical: 30,
  },
});

RegionStatScreen.navigationOptions = (navData) => {
  const regionTitle = navData.navigation.getParam("regionName");
  return {
    headerTitle: regionTitle ? regionTitle : "",
  };
};

export default RegionStatScreen;
