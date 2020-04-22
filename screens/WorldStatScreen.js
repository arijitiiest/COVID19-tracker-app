import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableHighlight,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../components/UI/HeaderButton";
import * as worldActions from "../store/actions/world";
import Colors from "../constants/Colors";
import StatusCard from "../components/UI/StatusCard";
import GraphView from "../components/UI/GraphView";

const WorldStatScreen = (props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [sortedRegions, setSortedRegions] = useState();
  const [chartData, setChartData] = useState();
  const date = useSelector((state) => state.world.date);
  const worldData = useSelector((state) => state.world.worldData);
  const regionsData = useSelector((state) => state.world.regionsData);
  const worldDailyData = useSelector((state) => state.world.worldDailyData);

  const dispatch = useDispatch();

  const loadData = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(worldActions.fetchWorldData());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  });

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadData);
    return () => {
      willFocusSub.remove();
    };
  }, [loadData]);

  useEffect(() => {
    setIsLoading(true);
    loadData().then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().then(() => {
      setIsRefreshing(false);
    });
  }, [isRefreshing]);

  useEffect(() => {
    props.navigation.setParams({ onRefresh: onRefresh });
  }, []);

  useEffect(() => {
    if (Array.isArray(regionsData)) {
      setSortedRegions(
        regionsData.sort((a, b) => b.totalDeaths - a.totalDeaths)
      );
    }
  }, [regionsData]);

  useEffect(() => {
    if (Array.isArray(worldDailyData)) {
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
              color: () => Colors.infectedColor,
              strokeWidth: 2,
            },
          ],
          legend: ["Decreased"],
        },
      ];

      worldDailyData.map((data, idx) => {
        if (idx % 7 === 0) {
          myChartData[0].lables.push(data.date);
          myChartData[1].lables.push(data.date);
          myChartData[0].datasets[0].data.push(data.confirmed);
          myChartData[1].datasets[0].data.push(data.deaths);
        }
      });
      setChartData(myChartData);
    }
  }, [worldDailyData])

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{fontFamily: "open-sans-bold", fontSize: 15, color: Colors.textColor}}>An error occurred!</Text>
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
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.screen}>
          <View style={styles.header}>
            <Text style={styles.worldText}>
              {new Date(date).toDateString()}
            </Text>
            <Text style={styles.worldText}>COVID - 19 Cases</Text>
            <Text style={{ ...styles.worldText, fontSize: 25 }}>
              {worldData.totalConfirmed === undefined
                ? " "
                : worldData.totalConfirmed
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
          </View>
          <View style={styles.deathRecovered}>
            <StatusCard>
              <Text
                style={{
                  ...styles.worldData,
                  fontSize: 15,
                  color: Colors.textColor,
                  paddingTop: 20,
                }}
              >
                Deaths
              </Text>
              <Text
                style={{
                  ...styles.worldData,
                  fontSize: 25,
                  color: Colors.deathColor,
                  paddingBottom: 20,
                }}
              >
                {worldData.totalDeaths === undefined
                  ? " "
                  : worldData.totalDeaths
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            </StatusCard>
            <StatusCard>
              <Text
                style={{
                  ...styles.worldData,
                  fontSize: 15,
                  color: Colors.textColor,
                  paddingTop: 20,
                }}
              >
                Recovered
              </Text>
              <Text
                style={{
                  ...styles.worldData,
                  fontSize: 25,
                  color: Colors.recoveredColor,
                  paddingBottom: 20,
                }}
              >
                {worldData.totalRecovered === undefined
                  ? " "
                  : worldData.totalRecovered
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            </StatusCard>
          </View>
          <View style={styles.activeCases}>
            <StatusCard>
              <Text
                style={{
                  ...styles.worldData,
                  fontSize: 15,
                  color: Colors.textColor,
                  paddingTop: 20,
                }}
              >
                Active
              </Text>
              <Text
                style={{
                  ...styles.worldData,
                  fontSize: 25,
                  color: Colors.activeColor,
                  paddingBottom: 20,
                }}
              >
                {worldData.totalConfirmed === undefined
                  ? " "
                  : (
                      worldData.totalConfirmed -
                      worldData.totalDeaths -
                      worldData.totalRecovered
                    )
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            </StatusCard>
          </View>

          <View style={styles.mostAffected}>
            <Text style={styles.mostAffectedCountries}>
              Most Affected Countries
            </Text>
            <View style={styles.regionalButton}>
              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={() => props.navigation.navigate("Regions")}
              >
                <Text style={styles.regionalButton}>REGIONAL</Text>
              </TouchableHighlight>
            </View>
          </View>

          <View style={styles.affected}>
            {sortedRegions !== undefined ? (
              sortedRegions.slice(0, 5).map((region) => (
                <View key={region.countryCode} style={styles.region}>
                  <Image
                    style={{ width: 60, height: 32 }}
                    source={{
                      uri: `https://www.countryflags.io/${region.countryCode}/flat/64.png`,
                    }}
                  />
                  <Text style={styles.regionName}>
                    {region.region.toUpperCase()}
                  </Text>
                  <Text style={styles.regionDeath}>
                    Deaths: {region.totalDeaths}
                  </Text>
                </View>
              ))
            ) : (
              <Text></Text>
            )}
          </View>

          {chartData !== undefined ? (
            <View style={styles.chart}>
              <Text style={styles.headerText}>Graph View</Text>
              <View style={{ paddingBottom: 10 }}>
                <GraphView chartData={chartData[0]} />
              </View>
              <View style={{ paddingBottom: 10 }}>
                <GraphView chartData={chartData[1]} />
              </View>
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
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    backgroundColor: Colors.primaryColor,
    paddingTop: 2,
    paddingBottom: 50,
    paddingLeft: 13,
  },
  worldText: {
    fontFamily: "open-sans-bold",
    color: Colors.textColor,
    fontSize: 13,
    paddingVertical: 5,
  },
  deathRecovered: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 28,
    top: -45,
  },
  worldData: {
    fontFamily: "open-sans-bold",
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    textAlign: "center",
  },
  activeCases: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    top: -30,
  },
  mostAffected: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  buttonStyle: {
    borderRadius: 8,
    backgroundColor: Colors.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: -3.5,
  },
  regionalButton: {
    fontFamily: "open-sans-bold",
    color: Colors.textColor,
  },
  mostAffectedCountries: {
    fontFamily: "open-sans-bold",
    fontSize: 17,
    paddingTop: 9
  },
  affected: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  region: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
    padding: 10,
    paddingVertical: 15,
    borderColor: "black",
    borderWidth: 2,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 6,
    backgroundColor: "white",
  },
  regionName: {
    fontFamily: "open-sans-bold",
    fontSize: 13,
    paddingLeft: 10,
    color: Colors.textColor,
  },
  regionDeath: {
    color: Colors.deathColor,
    fontFamily: "open-sans-bold",
    fontSize: 13,
    marginLeft: 10,
  },
  chart: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
  },
  headerText: {
    fontFamily: "open-sans-bold",
    fontSize: 19,
    marginVertical: 5,
  }
});

WorldStatScreen.navigationOptions = (navData) => {
  const onRefresh = navData.navigation.getParam("onRefresh");
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title="Refresh" iconName={"refresh"} onPress={onRefresh} />
      </HeaderButtons>
    ),
  };
};

export default WorldStatScreen;
