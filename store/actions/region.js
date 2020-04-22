export const SET_REGION_DATA = "SET_REGION_DATA";

import DailyModel from "../../models/DailyModel";
import RegionData from "../../models/RegionData";

export const fetchRegionData = (slug, countryCode) => {
  return async (dispatch) => {
    try {
      const responce = await fetch(
        "https://api.covid19api.com/total/dayone/country/" + slug
      );
      if (!responce.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await responce.json();
      const regionDailyData = [];
      for (i in resData) {
        regionDailyData.push(
          new DailyModel(
            i,
            resData[i].Confirmed,
            resData[i].Deaths,
            resData[i].Recovered,
            resData[i].Date
          )
        );
      }

      const responce2 = await fetch(
        "https://restcountries.eu/rest/v2/alpha/" + countryCode
      );
      if (!responce2.ok) {
        throw new Error("Something went wrong");
      }
      const resData2 = await responce2.json();
      const regionData = new RegionData(
        countryCode,
        resData2.name,
        resData2.nativeName,
        resData2.latlng[0],
        resData2.latlng[1],
        resData2.population,
        resData2.flag
      );

      dispatch({
        type: SET_REGION_DATA,
        regionDailyData: regionDailyData,
        regionData: regionData,
      });
    } catch (err) {
      throw err;
    }
  };
};
