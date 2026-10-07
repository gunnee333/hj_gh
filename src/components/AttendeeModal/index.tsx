import React, { useState } from 'react';
import styles from './style.module.scss';
import { Svgs } from '../../assets';
import Modal from '../../components/Modal';
import { useAttendee } from '../../hooks';
import { IAttendeeInputData } from '../../hooks/useAttendee';

const initData: IAttendeeInputData = {
  side: 'groom',
  attendance: true,
  adultCount: 1,
  childCount: 0,
  infantCount: 0,
  name: '',
  relation: '',
  message: '',
  password: ''
};

export function AttendeeModal({
  visible,
  close
}: {
  visible: boolean;
  close?: () => void;
}) {
  const { submit, checkComplete } = useAttendee();
  const [data, setData] = useState<IAttendeeInputData>(initData);
  const [loading, setLoading] = useState(false);

  const { isComplete, errMsg } = checkComplete(data);

  async function handleSubmit() {
    if (!isComplete) {
      return alert(errMsg);
    }
    setLoading(true);
    const isDone = await submit(data);
    setLoading(false);
    if (isDone) {
      close?.();
      setData(initData);
      alert('방문 여부가 전달되었습니다.');
    } else {
      alert('저장 중 문제가 발생했습니다.');
    }
  }

  return (
    <Modal
      visible={visible}
      close={close}
      isCenter
      className={styles.attendeeModal}
      contentClassName={styles.modalWrap}
      toWay="none"
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
          <div className={styles.row}>
            <div className={styles.title}>
              <span>
                비밀번호
                <Dot />
              </span>
            </div>
            <div className={styles.inputContainer}>
              <input
                value={data.password}
                type="password"
                placeholder="삭제용 암호 (4자 이상)"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, password: e.target.value }))
                }
                maxLength={30}
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
