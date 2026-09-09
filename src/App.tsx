import { useState } from 'react';
import {
  Header,
  Account,
  Calendar,
  Gallery,
  GuestBook,
  InviteText,
  Location,
  Menu,
  Intro,
  Infomation,
  AniOverlay
} from './components';
import styles from './layout.module.scss';

export default function App() {
  const [intro, setIntro] = useState(true);

  return (
    <>
      <AniOverlay count={80} className={styles.animation} />
      <Intro onComplete={() => setIntro(false)} />
      {!intro && (
        <div className={styles.wrap}>
          <Menu />
          <div className={styles.layout}>
            <div className={styles.page}>
              <Header />
              <InviteText />
              <Calendar />
              <Gallery />
              <Infomation />
              <Location />
              <Account />
              <GuestBook />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
