import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { trackSliceReducer } from "./Features/Trackslice";

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      tracks: trackSliceReducer,
    }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>; // Добавили export
export type AppDispatch = AppStore["dispatch"]; // Добавили export

// Для нового TS
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
