import React from "react";
import styles from "./style.module.scss";
import { CONSTANT } from "../../util";

export default function Component() {
  return (
    <div className={styles.container} id={CONSTANT.ELEMENT_ID.INFOMATION}>
      <div className={styles.title}>안내사항</div>
      <div className={styles.row}>
        <div className={styles.item}>
          <div className={styles.itemTitle}>01</div>
          <div className={styles.itemContent}>
            환경보호 동참을 위해 화환은 정중히 사양합니다.
            <br />
            좋은 마음만 감사히 받겠습니다.
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>02</div>
          <div className={styles.itemContent}>
            연회장(식사)은 예식장과 같은 층(2F)에 있으며,
            <br />
            이용 시간은 17:30 ~ 20:00 입니다.
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>03</div>
          <div className={styles.itemContent}>
            예식장 로비에 포토부스가 마련되어 있습니다.
            <br />
            좋은 날의 추억을 사진으로 간직하시면 좋겠습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
