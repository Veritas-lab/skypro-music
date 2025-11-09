import "./page.css";
import styles from "./page.module.css";
import Bar from "@/components/Bar/Bar";
import Centerblock from "@/components/Centerblock/Centerblock";
import Navigation from "@/components/Navigation/Navigation";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function DailyPlaylistPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock />
          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
