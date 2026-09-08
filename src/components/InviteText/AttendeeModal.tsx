import React, { useMemo, useState } from 'react';
import Modal from '../Modal';
import styles from './style.module.scss';
import { Svgs } from '../../assets';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

type GuestSide = 'groom' | 'bride';
type GuestCount = {
  attendance: boolean;
  side: GuestSide;
  name: string;
  relation: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  message?: string;
  createdAt?: any;
};
const initData: GuestCount = {
  side: 'groom',
  attendance: true,
  adultCount: 1,
  childCount: 0,
  infantCount: 0,
  name: '',
  relation: '',
  message: undefined
};

const DB_ID = process.env.REACT_APP_FIREBASE_ATTENDEE_LIST_DB_ID!;

export function AttendeeModal({
  visible,
  close
}: {
  visible: boolean;
  close?: () => void;
}) {
  const [data, setData] = useState<GuestCount>(initData);
  const [loading, setLoading] = useState(false);

  const { isComplete, errMsg } = useMemo(() => {
    const result = { isComplete: false, errMsg: '오류' };
    try {
      if (loading) {
        result.errMsg = '전송중입니다.';
        throw Error(result.errMsg);
      }
      if (!data.name.trim()) {
        result.errMsg = '이름을 입력해주세요.';
        throw Error(result.errMsg);
      }
      if (data.attendance) {
        const totalCount = data.adultCount + data.childCount + data.infantCount;
        if (totalCount === 0) {
          result.errMsg = '방문 인원을 선택해주세요.';
          throw Error(result.errMsg);
        }
      }
      result.isComplete = true;
    } catch {}
    return result;
  }, [data, loading]);

  async function handleSubmit() {
    if (!isComplete) {
      return alert(errMsg);
    }
    try {
      setLoading(true);
      await addDoc(collection(db, DB_ID), {
        ...data,
        adultCount: data.attendance ? data.adultCount : 0,
        childCount: data.attendance ? data.childCount : 0,
        infantCount: data.attendance ? data.infantCount : 0,
        createdAt: serverTimestamp()
      });
      alert('방문 여부가 전달되었습니다.');
      setData(initData);
      close?.();
    } catch (error) {
      console.error(error);
      alert('저장 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      close={close}
      isCenter
      className={styles.attendeeModal}
      contentClassName={styles.modalWrap}
    >
      <div className={styles.close} onClick={close}>
        <Svgs.Close fill={'black'} />
      </div>
      <div className={styles.modalContainer}>
        <div className={styles.scrollContainer}>
          <div className={styles.row}>
            <div className={styles.title}>
              <span>
                참석 여부
                <Dot />
              </span>
            </div>
            <div className={styles.radioContainer}>
              <div
                className={[
                  styles.radio,
                  data.attendance ? styles.active : undefined
                ].join(' ')}
                onClick={() =>
                  setData((prev) => ({ ...prev, attendance: true }))
                }
              >
                참석
              </div>
              <div
                className={[
                  styles.radio,
                  !data.attendance ? styles.active : undefined
                ].join(' ')}
                onClick={() =>
                  setData((prev) => ({ ...prev, attendance: false }))
                }
              >
                불참
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.title}>
              <span>
                구분
                <Dot />
              </span>
            </div>
            <div className={styles.radioContainer}>
              <div
                className={[
                  styles.radio,
                  data.side === 'groom' ? styles.active : undefined
                ].join(' ')}
                onClick={() => setData((prev) => ({ ...prev, side: 'groom' }))}
              >
                신랑측 하객
              </div>
              <div
                className={[
                  styles.radio,
                  data.side === 'bride' ? styles.active : undefined
                ].join(' ')}
                onClick={() => setData((prev) => ({ ...prev, side: 'bride' }))}
              >
                신부측 하객
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.title}>
              <span>
                이름
                <Dot />
              </span>
            </div>
            <div className={styles.inputContainer}>
              <input
                value={data.name}
                placeholder="성함을 입력해주세요"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, name: e.target.value }))
                }
                maxLength={15}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.title}>
              <span>관계</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                value={data.relation}
                placeholder={`선택) ex. ${data.side === 'groom' ? '신랑' : '신부'} 친구`}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, relation: e.target.value }))
                }
                maxLength={30}
              />
            </div>
          </div>
          <div
            className={[
              styles.row,
              !data.attendance ? styles.hide : undefined
            ].join(' ')}
          >
            <div className={styles.title}>
              <span>
                방문 인원
                <Dot />
              </span>
            </div>
            <div className={styles.countContainer}>
              <div className={styles.countRow}>
                <div>성인</div>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        adultCount: Math.max(prev.adultCount - 1, 0)
                      }))
                    }
                  >
                    -
                  </button>
                  <span>{data.adultCount}명</span>
                  <button
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        adultCount: prev.adultCount + 1
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={styles.countRow}>
                <div>어린이 (5~11세)</div>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        childCount: Math.max(prev.childCount - 1, 0)
                      }))
                    }
                  >
                    -
                  </button>
                  <span>{data.childCount}명</span>
                  <button
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        childCount: prev.childCount + 1
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={styles.countRow}>
                <div>유아 (5세 미만)</div>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        infantCount: Math.max(prev.infantCount - 1, 0)
                      }))
                    }
                  >
                    -
                  </button>
                  <span>{data.infantCount}명</span>
                  <button
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        infantCount: prev.infantCount + 1
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={[styles.row, styles.hide].join(' ')}>
            <div className={styles.title}>
              <span>전달사항</span>
            </div>
            <div className={styles.inputContainer}>
              <textarea
                value={data.message}
                placeholder="선택) ex.유아용 의자 필요"
                onChange={(e) => {
                  e.target.style.height = `${e.target.scrollHeight}px`;
                  setData((prev) => ({ ...prev, message: e.target.value }));
                }}
                maxLength={250}
              />
            </div>
          </div>
        </div>
        <div className={styles.btnContainer}>
          <button
            onClick={handleSubmit}
            className={[
              styles.submit,
              isComplete ? styles.active : undefined
            ].join(' ')}
          >
            {loading ? '저장 중...' : '전달하기'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Dot() {
  return <div className={styles.dot}></div>;
}
