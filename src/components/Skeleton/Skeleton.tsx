import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  circle?: boolean;
  className?: string;
}

export default function CustomSkeleton({
  count = 1,
  height = 20,
  width = "100%",
  circle = false,
  className = "",
}: SkeletonProps) {
  return (
    <Skeleton
      count={count}
      height={height}
      width={width}
      circle={circle}
      className={className}
      baseColor="#1c1c1c"
      highlightColor="#2c2c2c"
    />
  );
}
