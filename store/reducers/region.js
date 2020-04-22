import { SET_REGION_DATA } from "../actions/region";

const initialState = {
  regionDailyData: "",
  regionData: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_REGION_DATA:
      return {
        regionDailyData: action.regionDailyData,
        regionData: action.regionData,
      };
  }
  return state;
};
