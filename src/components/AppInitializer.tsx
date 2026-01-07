// components/AppInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/Store/store";
import { restoreSession } from "@/Store/Features/authSlice";

export default function AppInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return null;
}
