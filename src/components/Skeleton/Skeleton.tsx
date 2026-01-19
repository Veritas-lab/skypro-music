import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  circle?: boolean;
  className?: string;
  inline?: boolean;
}

export default function CustomSkeleton({
  count = 1,
  height = 20,
  width = "100%",
  circle = false,
  className = "",
  inline = false,
}: SkeletonProps) {
  return (
    <Skeleton
      count={count}
      height={height}
      width={width}
      circle={circle}
      className={className}
      inline={inline}
      baseColor="#1c1c1c"
      highlightColor="#2c2c2c"
      duration={1.5}
      enableAnimation={true}
      borderRadius={circle ? "50%" : "8px"}
    />
  );
}
