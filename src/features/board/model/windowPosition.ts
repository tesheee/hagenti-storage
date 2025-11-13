import { useState } from "react";

export type WindowPosition = {
  x: number;
  y: number;
  zoom: number;
};

export function useWindowPositionModel() {
  const [position, setPosition] = useState<WindowPosition>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  return { position, setPosition };
}

export type WindowPositionModel = ReturnType<typeof useWindowPositionModel>;
