import { useState } from "react";
import { Images, Svgs } from "../../assets";
import styles from "./style.module.scss";
import { CONSTANT } from "../../util";
import { useFontSize } from "../../context/FontSizeContext";

interface IItem {
  title: string;
  name: string;
  bank?: string;
  account?: string;
  kakaoPay?: string;
}
const list1: IItem[] = [
  { ...CONSTANT.groom, title: "신랑" },
  { ...CONSTANT.groomDad, title: "아버지" },
  { ...CONSTANT.groomMom, title: "어머니" },
];
const list2: IItem[] = [
  { ...CONSTANT.bride, title: "신부" },
  { ...CONSTANT.brideDad, title: "아버지" },
  { ...CONSTANT.brideMom, title: "어머니" },
];

async function copyText(text: string) {
  try {
    await window.navigator?.clipboard?.writeText?.(text);
    alert("계좌번호를 복사했습니다.");
  } catch (error) {
    console.error("copyText error", error);
  }
}

export default function Component() {
  const [isToggleOpen1, setIsToggleOpen1] = useState(false);
  const [isToggleOpen2, setIsToggleOpen2] = useState(false);

  return (
    <>
      <div className={styles.container} id={CONSTANT.ELEMENT_ID.ACCOUNT}>
        <div className={styles.title}>마음 전하실 곳</div>
        <div className={[styles.toggle, isToggleOpen1 ? styles.active : undefined].join(" ")}>
          <div className={styles.toggleTitle} onClick={() => setIsToggleOpen1((prev) => !prev)}>
            <span>신랑측</span>
            <div className={styles.arrow}>
              <Svgs.Arrow />
            </div>
          </div>
          <div className={styles.toggleDiv}>
            {list1
              .filter((item) => !!item.account && !!item.bank)
              .map((item) => (
                <ToggleItem item={item} key={item.title} />
              ))}
          </div>
        </div>
        <div className={[styles.toggle, isToggleOpen2 ? styles.active : undefined].join(" ")}>
          <div className={styles.toggleTitle} onClick={() => setIsToggleOpen2((prev) => !prev)}>
            <span>신부측</span>
            <div className={styles.arrow}>
              <Svgs.Arrow />
            </div>
          </div>
          <div className={styles.toggleDiv}>
            {list2
              .filter((item) => !!item.account && !!item.bank)
              .map((item) => (
                <ToggleItem item={item} key={item.title} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ToggleItem({ item }: { item: IItem }) {
  const { mode } = useFontSize();

  return (
    <div key={item.title} className={styles.toggleItem}>
      <div className={styles.nameRow}>
        {item.title} <b>{item.name}</b>
      </div>
      <div className={styles.bankRow}>
        <div className={styles.bank}>
          {item.bank} {item.account}
          <button type="button" className={styles.copyBtn} onClick={() => copyText(`${item.bank} ${item.account}`)}>
            복사
            <Svgs.Copy width={12} />
          </button>
        </div>
        {!!item.kakaoPay && (
          <button type="button" className={styles.kakaoBtn} onClick={() => window.open(item.kakaoPay, "_blank")}>
            <Svgs.KakaoPay width={["xs", "s", "m"].includes(mode) ? 24 : ["l", "xl", "xxl"].includes(mode) ? 30 : 40} />
          </button>
        )}
      </div>
    </div>
  );
}
