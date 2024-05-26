import React from "react";

import { useHover } from "@uidotdev/usehooks";

export interface FaCCuseHoverProps<T> {
  children: (
    ref: (instance: T | null) => void,
    hovering: boolean
  ) => React.ReactNode;
}

const FaCCuseHover = <T extends Element>({
  children,
}: FaCCuseHoverProps<T>) => {
  const [ref, hovering] = useHover<T>();

  return children(ref, hovering);
};

export default FaCCuseHover;
