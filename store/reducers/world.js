import { SET_WORLD_DATA } from "../actions/world";

const initialState = {
  date: "",
  worldData: "",
  regionsData: "",
  worldDailyData: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_WORLD_DATA:
      return {
        date: action.date,
        worldData: action.worldData,
        regionsData: action.regionsData,
        worldDailyData: action.worldDailyData,
      };
  }
  return state;
};
