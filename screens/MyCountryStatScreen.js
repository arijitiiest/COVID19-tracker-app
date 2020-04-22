import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import Colors from "../constants/Colors";
import { INDIA } from "../assets/images";
import StatusCard from "../components/UI/StatusCard";
import GraphView from "../components/UI/GraphView";
import PieChartView from "../components/UI/PieChartView";
import StateItem from "../components/state/StateItem";

import CasesModel from "../models/CasesModel";
import DailyModel from "../models/DailyModel";

const MyCountryStatScreen = (props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [dailyData, setDailyData] = useState();
  const [stateData, setStateData] = useState();
  const [totalData, setTotalData] = useState();
  const [chartData, setChartData] = useState();
  const [pieChartData, setPieChartData] = useState();
  const [population, setPopulation] = useState();

  const date = useSelector((state) => state.world.date);

  const loadData = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const responcePop = await fetch(
        "https://restcountries.eu/rest/v2/alpha/in"
      );
      const resPop = await responcePop.json();
      setPopulation(resPop.population);

      const responce = await fetch("https://api.covid19india.org/data.json");
      if (!responce.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await responce.json();

      const myDailyData = [];
      const timeSeries = resData.cases_time_series;
      for (i in timeSeries) {
        myDailyData.push(
          new DailyModel(
            i,
            timeSeries[i].totalconfirmed,
            timeSeries[i].totaldeceased,
            timeSeries[i].totalrecovered,
            timeSeries[i].date
          )
        );
      }

      const stateCases = [];
      const statewise = resData.statewise;
      for (i in statewise) {
        if (i == 0) continue;
        stateCases.push(
          new CasesModel(
            i,
            statewise[i].state,
            statewise[i].statecode,
            statewise[i].deltaconfirmed,
            statewise[i].confirmed,
            statewise[i].deltadeaths,
            statewise[i].deaths,
            statewise[i].deltarecovered,
            statewise[i].recovered
          )
        );
      }

      setTotalData(
        new CasesModel(
          0,
          statewise[0].state,
          statewise[0].statecode,
          statewise[0].deltaconfirmed,
          statewise[0].confirmed,
          statewise[0].deltadeaths,
          statewise[0].deaths,
          statewise[0].deltarecovered,
          statewise[0].recovered
        )
      );

      setDailyData(myDailyData);
      setStateData(stateCases);
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  });

  useEffect(() => {
    if (totalData !== undefined) {
      const data = [
        {
          name: "Recovered",
          population: totalData.totalRecovered,
          color: Colors.recoveredColor,
          legendFontColor: Colors.textColor,
          legendFontSize: 12,
          legendFontFamily: "open-sans",
        },
        {
          name: "Active",
          population:
            totalData.totalConfirmed -
            totalData.totalDeaths -
            totalData.totalRecovered,
          color: Colors.deathColor,
          legendFontColor: Colors.textColor,
          legendFontSize: 12,
          legendFontFamily: "open-sans",
        },
        {
          name: "Deaths",
          population: totalData.totalDeaths,
          color: Colors.infectedColor,
          legendFontColor: Colors.textColor,
          legendFontSize: 12,
          legendFontFamily: "open-sans",
        },
        {
          name: "Uninfected",
          population:
            population - totalData.totalConfirmed + totalData.totalDeaths,
          color: Colors.activeColor,
          legendFontColor: Colors.textColor,
          legendFontSize: 12,
          legendFontFamily: "open-sans",
        },
      ];
      setPieChartData(data);
    }
  }, [totalData]);

  useEffect(() => {
    if (Array.isArray(dailyData)) {
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

      dailyData.map((data, idx) => {
        if (idx % 5 === 0) {
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
  }, [dailyData]);

  useEffect(() => {
    setIsLoading(true);
    loadData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().then(() => {
      setIsRefreshing(false);
    });
  }, [isRefreshing]);

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
  const HeaderComponent = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={{ ...styles.headerText, color: Colors.textColor }}>
                COVID19
              </Text>
              <Text
                style={{ ...styles.headerText, color: Colors.primaryColor }}
              >
                {" "}
                INDIA
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image style={{ width: "100%", height: "100%" }} source={INDIA} />
            </View>

            {pieChartData !== undefined ? (
              <PieChartView pieData={pieChartData} />
            ) : (
              <Text></Text>
            )}

            <Text
              style={{
                ...styles.header,
                fontFamily: "open-sans",
                fontSize: 12,
                color: Colors.textColor,
                paddingVertical: 10,
              }}
            >
              {new Date(date).toDateString()}
            </Text>

            {totalData !== undefined ? (
              <View style={styles.stats}>
                <StatusCard style={styles.statCard}>
                  <View style={styles.stat}>
                    <Text style={{ ...styles.confirmedText, fontSize: 12 }}>
                      Confirmed
                    </Text>
                    <Text style={{ ...styles.confirmedText, fontSize: 10 }}>
                      [+
                      {totalData.newConfirmed
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      ]
                    </Text>
                    <Text style={{ ...styles.confirmedText, fontSize: 18 }}>
                      {totalData.totalConfirmed
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
                        totalData.totalConfirmed -
                        totalData.totalDeaths -
                        totalData.totalRecovered
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
                      {totalData.newRecovered
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      ]
                    </Text>
                    <Text style={{ ...styles.recoveredText, fontSize: 18 }}>
                      {totalData.totalRecovered
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
                      {totalData.newDeaths
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      ]
                    </Text>
                    <Text style={{ ...styles.deathText, fontSize: 18 }}>
                      {totalData.totalDeaths
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
                <Text
                  style={{
                    ...styles.header,
                    fontFamily: "open-sans-bold",
                    fontSize: 18,
                    color: Colors.textColor,
                    paddingVertical: 5,
                  }}
                >
                  Graph View
                </Text>
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
            <Text
              style={{
                ...styles.header,
                fontFamily: "open-sans-bold",
                fontSize: 18,
                color: Colors.textColor,
                paddingTop: 5,
              }}
            >
              State Wise Data
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <View>
      {stateData !== undefined ? (
        <FlatList
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          data={stateData}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={HeaderComponent}
          renderItem={(itemData) => (
            <StateItem data={itemData.item} onSelect={() => {}} />
          )}
        />
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingTop: 35,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  imageContainer: {
    width: 140,
    height: 80,
    marginVertical: 20,
    borderColor: "white",
    borderWidth: 4,
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "open-sans-bold",
    fontSize: 19,
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

export default MyCountryStatScreen;
