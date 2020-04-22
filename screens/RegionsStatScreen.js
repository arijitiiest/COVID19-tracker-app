import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as worldActions from "../store/actions/world";
import RegionItem from "../components/world/RegionItem";
import Colors from "../constants/Colors";

const RegionsStatScreen = (props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const regionsData = useSelector((state) => state.world.regionsData);

  const dispatch = useDispatch();

  const loadData = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(worldActions.fetchWorldData());
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    setIsRefreshing(false);
  });

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
          Something went wrong!
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
    <FlatList
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      data={regionsData}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <RegionItem
          data={itemData.item}
          onSelect={() => {
            props.navigation.navigate("Region", {
              regionId: itemData.item.id,
            });
          }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegionsStatScreen;
