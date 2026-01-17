import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li>
            <NavLink to="/">Leaderboard</NavLink>
          </li>
          <li>
            <NavLink to="/log-match">Log Match</NavLink>
          </li>
          <li>
            <NavLink to="/players">Players</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
