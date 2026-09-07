import { useState } from 'react';
import styles from './style.module.scss';
import { Svgs } from '../../assets';
import { CONSTANT } from '../../util';
import { TelModal } from './TelModal';
import { AttendeeModal } from './AttendeeModal';

export default function Component() {
  const [isTelModal, setIsTelModal] = useState(false);
  const [isAttendeeModal, setIsAttendeeModal] = useState(false);

  return (
    <>
      <div className={styles.container} id={CONSTANT.ELEMENT_ID.HOME}>
        <div className={styles.title}>초대합니다.</div>
        <div className={styles.desc}>
          서로 다른 길을 걸어온 두 사람이
          <br />
          같은 곳을 바라보며 함께 걷기로 했습니다.
          <br />
          <br />
          이제 두 사람은
          <br />
          사랑과 신뢰를 바탕으로
          <br />
          하나의 가정을 이루고자 합니다.
          <br />
          <br />
          새로운 시작의 순간에 함께하시어
          <br />
          따뜻한 축복을 전해주시면 감사하겠습니다.
          <br />
        </div>
        <div className={[styles.desc, styles.names].join(' ')}>
          <div>
            <b>{CONSTANT.groomDad.name}</b> • <b>{CONSTANT.groomMom.name}</b> 의
            장남
            <br />
            <b>{CONSTANT.groom.name}</b>
          </div>
          <div>
            故 <b>{CONSTANT.brideDad.name}</b> • <b>{CONSTANT.brideMom.name}</b>{' '}
            의 장녀
            <br />
            <b>{CONSTANT.bride.name}</b>
          </div>
        </div>
        <div className={styles.btnContainer}>
          <button onClick={() => setIsTelModal(true)}>
            <Svgs.Phone2 width={18} />
            연락하기
          </button>
          <button onClick={() => setIsAttendeeModal(true)}>
            <Svgs.Carendar />
            참석여부 알려주기
          </button>
        </div>
      </div>
      <TelModal visible={isTelModal} close={() => setIsTelModal(false)} />
      <AttendeeModal
        visible={isAttendeeModal}
        close={() => setIsAttendeeModal(false)}
      />
    </>
  );
}
