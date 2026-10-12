import React, { useEffect, useMemo, useState } from 'react';
import styles from './style.module.scss';
import Modal from '../../components/Modal';
import { Images, Svgs } from '../../assets';
import { Swiper, SwiperSlide } from 'swiper/react';

export type TLocationInfoType = 'bus' | 'line1' | 'line2' | 'line5';
interface IItem {
  imgUrl: string;
  infomation: string;
}

const SHUTTLE_BUS_IMAGE: IItem[] = [
  {
    imgUrl: Images.shuttleBus1,
    infomation: `문래역 4번출구로 나오셔서 우측으로 바라보시면\n[셔틀버스 타는곳] 화살표가 보입니다.`
  },
  {
    imgUrl: Images.shuttleBus2,
    infomation: `위 사진 길을 따라서 250M 앞으로 직진해주세요.`
  },
  { imgUrl: Images.shuttleBus3, infomation: `노란색 버스가 있습니다.` },
  {
    imgUrl: Images.shuttleBus4,
    infomation: `[규수당웨딩]을 확인하시어 버스에 탑승해주시면 됩니다.\n셔틀버스는 3~5분간격으로 운행합니다.`
  }
];
const LINE_1_IMAGE: IItem[] = [
  { imgUrl: Images.locationLine1_1, infomation: '영등포역 6번 출구' },
  {
    imgUrl: Images.locationLine1_2,
    infomation: '조은고시원에서 2개 횡단보도 건너기'
  },
  {
    imgUrl: Images.locationLine1_3,
    infomation: '오른쪽 방향'
  },
  {
    imgUrl: Images.locationLine1_4,
    infomation: '왼쪽 방향'
  },
  {
    imgUrl: Images.locationLine1_5,
    infomation: '신세계백화점 타임스퀘어점 방면으로 횡단보도 건너기'
  },
  { imgUrl: Images.locationLine1_6, infomation: '직진' },
  {
    imgUrl: Images.locationLine1_7,
    infomation: '왼쪽 방향'
  },
  {
    imgUrl: Images.locationLine1_8,
    infomation: '잭슨피자 영등포점 방면으로 횡단보도 건너기'
  },
  {
    imgUrl: Images.locationLine1_9,
    infomation: '천씨씨커피 영등포타임스퀘어점까지 직진'
  },
  {
    imgUrl: Images.locationLine1_10,
    infomation: '천씨씨커피 영등포타임스퀘어점에서 횡단보도 건너기'
  },
  { imgUrl: Images.locationLine1_11, infomation: '오른쪽 방향' },
  {
    imgUrl: Images.locationLine1_12,
    infomation: '무림상회에서 왼쪽 방향'
  },
  {
    imgUrl: Images.locationLine5_12,
    infomation: '영등포SK리더스뷰아파트 방면으로 횡단보도 건너기'
  },
  { imgUrl: Images.locationLine5_13, infomation: '직진' },
  { imgUrl: Images.locationLine5_14, infomation: '규수당 문래점' }
];
const LINE_5_IMAGE: IItem[] = [
  { imgUrl: Images.locationLine5_1, infomation: '영등포시장역 4번 출구' },
  {
    imgUrl: Images.locationLine5_2,
    infomation: '메가MGC커피 영등포위더스점에서 오른쪽 방향'
  },
  {
    imgUrl: Images.locationLine5_3,
    infomation: '웨딩그룹위더스 영등포에서 왼쪽 방향'
  },
  {
    imgUrl: Images.locationLine5_4,
    infomation: 'CU 영등포메인점에서 오른쪽 방향'
  },
  {
    imgUrl: Images.locationLine5_5,
    infomation: '서해쭈꾸미영등포직영점 방면으로 횡단보도 건너기'
  },
  { imgUrl: Images.locationLine5_6, infomation: '오른쪽 방향' },
  {
    imgUrl: Images.locationLine5_7,
    infomation: '영등포헌집곱창에서 왼쪽 방향'
  },
  {
    imgUrl: Images.locationLine5_8,
    infomation: '천왕헤어 영등포점에서 오른쪽 방향'
  },
  { imgUrl: Images.locationLine5_9, infomation: '하양상회에서 왼쪽 방향' },
  {
    imgUrl: Images.locationLine5_10,
    infomation: '하양상회에서 2개 횡단보도 건너기'
  },
  { imgUrl: Images.locationLine5_11, infomation: '무림상회에서 오른쪽 방향' },
  {
    imgUrl: Images.locationLine5_12,
    infomation: '영등포SK리더스뷰아파트 방면으로 횡단보도 건너기'
  },
  { imgUrl: Images.locationLine5_13, infomation: '직진' },
  { imgUrl: Images.locationLine5_14, infomation: '규수당 문래점' }
];

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

  const items = useMemo(() => {
    if (type === 'bus') {
      return SHUTTLE_BUS_IMAGE;
    } else if (type === 'line1') {
      return LINE_1_IMAGE;
    } else if (type === 'line2') {
    } else if (type === 'line5') {
      return LINE_5_IMAGE;
    }
    return [];
  }, [type]);

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
          <Swiper
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
            {items.map(({ imgUrl, infomation }, i) => (
              <SwiperSlide key={i} className={styles.modalImg}>
                <div></div>
                <img src={imgUrl} alt="오시는 길" />
                {infomation}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Modal>
  );
}
