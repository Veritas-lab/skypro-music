import TrackSkeleton from "../TrackSkeleton/TrackSkeleton";
import styles from "./LoadingSkeleton.module.css";

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 8 }: LoadingSkeletonProps) {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <TrackSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
