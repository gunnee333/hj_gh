import moment from 'moment';
import { Wedding } from '../../assets';
import { CONSTANT } from '../../util';
import styles from './style.module.scss';
// @ts-ignore
import 'moment/locale/ko';
import { AniOverlay } from '../../components';

export default function Component() {
  return (
    <div className={styles.container} id={CONSTANT.ELEMENT_ID.HOME}>
      <AniOverlay />

      <img src={Wedding.main} alt="" className={styles.img} />
      <div className={styles.bottomText}>
        <div className={styles.title}>
          {CONSTANT.groom.name} & {CONSTANT.bride.name}
        </div>
        <div className={styles.desc}>
          {moment(CONSTANT.date.dateISO).format('YYYY년 MM월 DD일, dddd A h시')}
          <br />
          {CONSTANT.place.fullName}
        </div>
      </div>
    </div>
  );
}
