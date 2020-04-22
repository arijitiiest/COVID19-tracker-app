export const SET_WORLD_DATA = "SET_WORLD_DATA";

import CasesModel from "../../models/CasesModel";
import DailyModel from "../../models/DailyModel";

export const fetchWorldData = () => {
  return async (dispatch) => {
    try {
      const responce = await fetch("https://api.covid19api.com/summary");

      if (!responce.ok) {
        throw new Error("Something went wrong");
      }

      const resData = await responce.json();
      const worldData = new CasesModel(
        1,
        "world",
        "WD",
        resData.Global.NewConfirmed,
        resData.Global.TotalConfirmed,
        resData.Global.NewDeaths,
        resData.Global.TotalDeaths,
        resData.Global.NewRecovered,
        resData.Global.TotalRecovered
      );

      const regionsData = [];
      for (i in resData.Countries) {
        regionsData.push(
          new CasesModel(
            i,
            resData.Countries[i].Slug,
            resData.Countries[i].CountryCode,
            resData.Countries[i].NewConfirmed,
            resData.Countries[i].TotalConfirmed,
            resData.Countries[i].NewDeaths,
            resData.Countries[i].TotalDeaths,
            resData.Countries[i].NewRecovered,
            resData.Countries[i].TotalRecovered
          )
        );
      }

      const date = resData.Date;

      const responceDaily = await fetch("https://covid19.mathdro.id/api/daily");

      if (!responceDaily.ok) {
        throw new Error("Something went wrong");
      }

      const resDataDaily = await responceDaily.json();
      const worldDailyData = [];
      for (i in resDataDaily) {
        worldDailyData.push(
          new DailyModel(
            i,
            resDataDaily[i].confirmed.total,
            resDataDaily[i].deaths.total,
            resDataDaily[i].recovered.total,
            resDataDaily[i].reportDate
          )
        );
      }

      dispatch({
        type: SET_WORLD_DATA,
        date: date,
        worldData: worldData,
        regionsData: regionsData,
        worldDailyData: worldDailyData,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};
