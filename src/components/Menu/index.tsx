import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { CONSTANT } from "../../util";
import { useFontSize } from "../../context/FontSizeContext";
import _ from "lodash";

const MENU_LIST: { id: string; title: string }[] = [
  { id: CONSTANT.ELEMENT_ID.HOME, title: "모시는 글" },
  { id: CONSTANT.ELEMENT_ID.CALENDAR, title: "달력" },
  { id: CONSTANT.ELEMENT_ID.GALLERY, title: "사진첩" },
  { id: CONSTANT.ELEMENT_ID.INFOMATION, title: "안내사항" },
  { id: CONSTANT.ELEMENT_ID.LOCATION, title: "오시는 길" },
  { id: CONSTANT.ELEMENT_ID.ACCOUNT, title: "마음 전하실 곳" },
  { id: CONSTANT.ELEMENT_ID.GUEST_BOOK, title: "방명록" },
];

export default function Component() {
  const { setSmall, setLarge } = useFontSize();

  const [activeMenu, setActiveMenu] = useState(MENU_LIST[0].title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function scrollToId(id: string) {
    setIsMenuOpen(false);
    setTimeout(() => {
      if (id === "home") {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      } else {
        let scrollElement = document.getElementById(id);
        scrollElement?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  }

  const handleScroll = () => {
    const el = document.documentElement;
    if (!el) {
      return;
    }

    const scrollTop = el.scrollTop || window.pageYOffset || 0;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
    if (isBottom) {
      setActiveMenu(MENU_LIST[MENU_LIST.length - 1].title);
    } else {
      let newTabs = MENU_LIST.map((_tab) => {
        const offsetY = document.getElementById(_tab.id)?.offsetTop || 0;
        let active = false;
        if (scrollTop > offsetY - 50) {
          active = true;
        }
        return { ..._tab, offsetY, active };
      });
      const lastActiveIndex = newTabs.filter((_tab) => _tab.active).length - 1;
      if (lastActiveIndex === -1) {
        newTabs[0].active = true;
      } else {
        newTabs = newTabs.map((_tab, index) => (index !== lastActiveIndex ? { ..._tab, active: false } : _tab));
      }
      const newActiveTab = newTabs.find((item) => item.active);
      if (newActiveTab) {
        setActiveMenu(newActiveTab?.title);
      }
    }
  };
  const throttleHandleScroll = _.throttle(handleScroll, 300);

  useEffect(() => {
    window.addEventListener("scroll", throttleHandleScroll);

    return () => {
      window.addEventListener("scroll", throttleHandleScroll);
    };
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.btn} onClick={setSmall}>
            -
          </div>
          <div className={styles.icon}>
            <span className={styles.small}>가</span>
            <span className={styles.large}>가</span>
          </div>
          <div className={styles.btn} onClick={setLarge}>
            +
          </div>
        </div>
        <div className={styles.item} onClick={() => setIsMenuOpen((prev) => !prev)}>
          <div className={[styles.menu, isMenuOpen ? styles.active : undefined].join(" ")}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={[styles.toggleMenu, isMenuOpen ? styles.show : styles.hide].join(" ")}>
            {MENU_LIST.map((item) => {
              const isActive = item.title === activeMenu;
              return (
                <div
                  key={item.title}
                  className={[styles.menuItem, isActive ? styles.active : undefined].join(" ")}
                  onClick={() => scrollToId(item.id)}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
