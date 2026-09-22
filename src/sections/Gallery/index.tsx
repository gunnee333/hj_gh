import { useMemo, useState } from 'react';
import { Wedding } from '../../assets';
import styles from './style.module.scss';
import { CONSTANT } from '../../util';
import { ImageModal } from '../../components/Modal/ImageModal';
import { Reveal } from '../../components';

const rowNum = 4;
const images: string[] = [
  Wedding.photo1,
  Wedding.photo2,
  Wedding.photo3,
  Wedding.photo4,
  Wedding.photo5,
  Wedding.photo6,
  Wedding.photo7,
  Wedding.photo8,
  Wedding.photo9,
  Wedding.photo10,
  Wedding.photo11,
  Wedding.photo12,
  Wedding.photo13,
  Wedding.photo14,
  Wedding.photo15,
  Wedding.photo16,
  Wedding.photo17,
  Wedding.photo18,
  Wedding.photo19,
  Wedding.photo20,
  Wedding.photo21,
  Wedding.photo22,
  Wedding.photo23,
  Wedding.photo24,
  Wedding.photo25,
  Wedding.photo26,
  Wedding.photo27,
  Wedding.photo28
];

function getGroups() {
  const groups: { img: string; index: number }[][] = [];
  for (const [index, img] of images.entries()) {
    let lastIndex = Math.max(groups.length - 1, 0);
    if ((groups[lastIndex] || []).length === rowNum) {
      lastIndex++;
    }
    if (!groups[lastIndex]) {
      groups[lastIndex] = [];
    }
    groups[lastIndex].push({ img: img, index });
  }
  return groups;
}

export default function Component() {
  const [openIndex, setOpenIndex] = useState<number>();
  const groups = useMemo(getGroups, []);

  return (
    <>
      <Reveal
        className={styles.container}
        id={CONSTANT.ELEMENT_ID.GALLERY}
        backgroundType="ivory"
        delay={150}
      >
        <div className={styles.title}>사진첩</div>
        {groups.map((_images, j) => (
          <div className={styles.listContainer} key={j}>
            {_images.map(({ img, index }) => (
              <div
                key={index}
                className={styles.photoItem}
                onClick={() => setOpenIndex(index)}
              >
                <img src={img} alt={`wedding_${index}`} />
              </div>
            ))}
          </div>
        ))}
      </Reveal>
      <ImageModal
        visible={openIndex !== undefined}
        photos={images}
        index={openIndex}
        onClose={() => setOpenIndex(undefined)}
      />
    </>
  );
}
