import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.module.scss';
import Modal from '../../components/Modal';
import { Svgs } from '../../assets';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import {
  LINE_1_IMAGE,
  LINE_2_IMAGE,
  LINE_5_IMAGE,
  SHUTTLE_BUS_IMAGE,
  TLocationInfoType
} from './LocationData';

export function LocationInfoModal({
  visible,
  close,
  type
}: {
  visible: boolean;
  close?: () => void;
  type?: TLocationInfoType;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<SwiperRef>(null);

  const items = useMemo(() => {
    if (type === 'bus') {
      return SHUTTLE_BUS_IMAGE;
    } else if (type === 'line1') {
      return LINE_1_IMAGE;
    } else if (type === 'line2') {
      return LINE_2_IMAGE;
    } else if (type === 'line5') {
      return LINE_5_IMAGE;
    }
    return [];
  }, [type]);

  function prev() {
    ref.current?.swiper?.slidePrev?.();
  }
  function next() {
    ref.current?.swiper?.slideNext?.();
  }

  useEffect(() => {
    if (!visible) {
      setCurrentIndex(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      close={close}
      isCenter={true}
      className={styles.modal}
      contentClassName={styles.modalWrap}
      toWay="none"
    >
      <div className={styles.close} onClick={close}>
        <Svgs.Close fill={'black'} />
      </div>
      <div className={styles.modalContainer}>
        <div className={styles.list}>
          <div className={styles.page}>
            {currentIndex + 1} / {items.length}{' '}
            <span>우측으로 넘겨주세요 {'>'}</span>
          </div>
          <div className={styles.swiperContainer}>
            <Swiper
              ref={ref}
              className={styles.swiper}
              spaceBetween={0}
              initialSlide={0}
              slidesPerView="auto"
              centeredSlides={true}
              zoom={{ maxRatio: 2 }}
              onSlideChange={(e) => {
                if (!isNaN(Number(e.realIndex))) {
                  setCurrentIndex(e.realIndex);
                }
              }}
            >
              {items.map(({ imgUrl, infomation, distance }, i) => (
                <SwiperSlide key={i} className={styles.modalImg}>
                  <div></div>
                  <img src={imgUrl} alt="오시는 길" />
                  <div>
                    <div>{infomation}</div>
                    {(distance || 0) > 0 && <span>{distance}m 이동</span>}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {currentIndex > 0 && (
              <div
                className={[styles.allow, styles.prev].join(' ')}
                onClick={prev}
              >
                <Svgs.Arrow fill="#000" width={20} rotate={270} />
              </div>
            )}
            {currentIndex < items.length - 1 && (
              <div
                className={[styles.allow, styles.next].join(' ')}
                onClick={next}
              >
                <Svgs.Arrow fill="#000" width={20} rotate={90} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
