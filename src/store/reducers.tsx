import {combineReducers} from '@reduxjs/toolkit';

import {geocodingReducer} from '../screens/MainAppScreens/Geocoding/slice';
import {userReducer} from '../screens/MainAppScreens/Users/slice';

export const rootReducer = combineReducers({
  users: userReducer,
  geocoding: geocodingReducer,
});
