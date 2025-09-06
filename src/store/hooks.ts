// src/store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// typed selector (manual signature)
export const useAppSelector: <TSelected>(
  selector: (state: RootState) => TSelected
) => TSelected = useSelector;
