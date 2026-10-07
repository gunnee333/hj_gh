import { useState } from 'react';
import { Menu, Intro, AniOverlay } from './components';
import {
  Header,
  InviteText,
  Calendar,
  Gallery,
  Infomation,
  Location,
  Account,
  GuestBook
} from './sections';
import styles from './layout.module.scss';

export default function App() {
  const [intro, setIntro] = useState(true);

  return (
    <>
      {!intro && <AniOverlay.Heart className={styles.animation} />}
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
