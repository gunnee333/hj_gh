import { useState } from "react";
import { Wedding } from "../../assets";
import styles from "./style.module.scss";
import { CONSTANT } from "../../util";
import { ImageModal } from "../Modal/ImageModal";

const images: string[] = [
  Wedding.photo1,
  Wedding.photo2,
  Wedding.photo21,
  Wedding.photo3,
  Wedding.photo4,
  Wedding.photo13,
  Wedding.photo6,
  Wedding.photo7,
  Wedding.photo8,
  Wedding.photo9,
  Wedding.photo10,
  Wedding.photo11,
  Wedding.photo12,
  Wedding.photo16,
  Wedding.photo17,
  Wedding.photo5,
  Wedding.photo14,
  Wedding.photo15,
  Wedding.photo18,
  Wedding.photo19,
  Wedding.photo20,
];

export default function Component() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className={styles.container} id={CONSTANT.ELEMENT_ID.GALLERY}>
        <div className={styles.title}>사진첩</div>
        <div className={styles.listContainer}>
          {images.map((item, index) => (
            <div key={index} className={styles.photoItem} onClick={() => setOpenIndex(index)}>
              <img src={item} alt={`wedding_${index}`} />
            </div>
          ))}
        </div>
      </div>
      {openIndex !== null && <ImageModal photos={images} index={openIndex} onClose={() => setOpenIndex(null)} />}
    </>
  );
}
