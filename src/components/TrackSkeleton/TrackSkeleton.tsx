import CustomSkeleton from "../Skeleton/Skeleton";
import styles from "./TrackSkeleton.module.css";

export default function TrackSkeleton() {
  return (
    <div className={styles.skeletonTrack}>
      <div className={styles.skeletonTitle}>
        <CustomSkeleton circle={true} height={51} width={51} />
        <CustomSkeleton height={19} width={200} />
      </div>
      <div className={styles.skeletonAuthor}>
        <CustomSkeleton height={19} width={150} />
      </div>
      <div className={styles.skeletonAlbum}>
        <CustomSkeleton height={19} width={180} />
      </div>
      <div className={styles.skeletonTime}>
        <CustomSkeleton circle={true} height={14} width={14} />
        <CustomSkeleton height={19} width={40} />
      </div>
    </div>
  );
}
