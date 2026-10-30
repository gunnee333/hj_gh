import { useState } from 'react';
import { WeddingHall } from './WeddingHall';
import styles from './style.module.scss';
import { useAttendee } from '../../hooks';
import { AttendeeModal } from '../AttendeeModal';

const IS_SEPARATE_SIDE = true;
const ROW = 2;

export default function Component() {
  const { items: attendees } = useAttendee();
  const [isAttendeeModal, setIsAttendeeModal] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <WeddingHall
          guests={attendees}
          defaultRows={ROW}
          separateBySide={IS_SEPARATE_SIDE}
          columnsPerSide={3}
          setIsAttendeeModal={setIsAttendeeModal}
        />
      </div>
      <AttendeeModal
        visible={isAttendeeModal}
        close={() => setIsAttendeeModal(false)}
      />
    </>
  );
}
