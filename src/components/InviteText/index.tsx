import { useState } from "react";
import styles from "./style.module.scss";
import Modal from "../Modal";
import { Svgs } from "../../assets";
import { CONSTANT } from "../../util";

const groomTelNumList = [CONSTANT.groom, CONSTANT.groomDad, CONSTANT.groomMom];
const brideTelNumList = [CONSTANT.bride, CONSTANT.brideMom];

export default function Component() {
  const [isModal, setIsModal] = useState(false);

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
        <div className={[styles.desc, styles.names].join(" ")}>
          <div>
            <b>{CONSTANT.groomDad.name}</b> • <b>{CONSTANT.groomMom.name}</b> 의 장남
            <br />
            <b>{CONSTANT.groom.name}</b>
          </div>
          <div>
            故 <b>{CONSTANT.brideDad.name}</b> • <b>{CONSTANT.brideMom.name}</b> 의 장녀
            <br />
            <b>{CONSTANT.bride.name}</b>
          </div>
        </div>
        <div>
          <button onClick={() => setIsModal(true)}>
            <Svgs.Phone2 width={18} />
            연락하기
          </button>
        </div>
      </div>
      <Modal
        visible={isModal}
        isCenter={true}
        className={styles.modal}
        contentClassName={styles.modalWrap}
        toWay="none"
        close={() => setIsModal(false)}
      >
        <div className={styles.close} onClick={() => setIsModal(false)}>
          <Svgs.Close fill="white" />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.list}>
            {groomTelNumList.map((item) => (
              <TelItem key={item.title} item={item} />
            ))}
          </div>
          <div className={styles.division} />
          <div className={styles.list}>
            {brideTelNumList.map((item) => (
              <TelItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

function TelItem({ item }: { item: { title: string; name: string; tel?: string | undefined; kakaotalk?: string } }) {
  return (
    <div className={styles.item}>
      <div className={styles.textContainer}>
        <div className={styles.telTitle}>{item.title}</div>
        <div className={styles.telName}>{item.name}</div>
      </div>
      <div className={styles.btnList}>
        {!!item.kakaotalk && (
          <div className={styles.btn}>
            <a href={item.kakaotalk}>
              <Svgs.KakaoTalk width={14} />
              <div>카카오톡</div>
            </a>
          </div>
        )}
        {!!item.tel && (
          <>
            <div className={styles.btn}>
              <a href={`tel:${item.tel}`}>
                <Svgs.Phone width={14} />
                <div>전화</div>
              </a>
            </div>
            <div className={styles.btn}>
              <a href={`sms:${item.tel}`}>
                <Svgs.Message width={14} />
                <div>문자</div>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
