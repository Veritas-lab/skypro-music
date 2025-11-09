import "./page.css";
import styles from "./page.module.css";
import Bar from "@/components/Bar/Bar";
import Centerblock from "@/components/CenterBlock/CenterBlock";
import Navigation from "@/components/Navigation/Navigation";
import Sidebar from "@/components/SideBar/SideBar";

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
