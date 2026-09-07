import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { Images, Svgs } from '../../assets';
import { CONSTANT } from '../../util';
import Modal from '../Modal';
import { Swiper, SwiperSlide } from 'swiper/react';

let cnt = 0;

function kakaoMapLoad() {
  if (cnt > 0) {
    return;
  }
  try {
    // @ts-ignore
    new daum.roughmap.Lander({
      timestamp: '1788685396186',
      key: '2voxr6z3q7dy',
      mapWidth: '640',
      mapHeight: '360'
    }).render();
    cnt++;
  } catch (error) {
    console.error('kakaoMapLoad error', error);
  }
}

function tmapLoad() {
  // 티맵 (앱 스킴 + 안내 페이지)
  const schemeUrl = `tmap://route?goalx=${CONSTANT.place.lng}&goaly=${CONSTANT.place.lat}&goalname=${encodeURIComponent(CONSTANT.place.hallname)}`;
  const fallbackUrl = `https://www.tmap.co.kr/tmap2/mobile/main.do`;

  const start = Date.now();
  window.open(schemeUrl, '_blank');

  window.setTimeout(() => {
    // 스킴이 막히거나 앱 미설치면 대체 링크로
    if (Date.now() - start < 1500) {
      window.open(schemeUrl, fallbackUrl);
    }
  }, 800);
}

const SHUTTLE_BUS_IMAGE: { imgUrl: string; infomation: string }[] = [
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

export default function Component() {
  const [isModal, setIsModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    kakaoMapLoad();
  }, []);

  return (
    <>
      <div className={styles.container} id={CONSTANT.ELEMENT_ID.LOCATION}>
        <div className={styles.title}>오시는 길</div>
        <div className={styles.desc}>
          {CONSTANT.place.address}
          <br />
          {CONSTANT.place.hallname}
        </div>

        <div className={styles.map}>
          <div
            id="daumRoughmapContainer1788685396186"
            className="root_daum_roughmap root_daum_roughmap_landing"
          ></div>
          <div className={styles.link}>
            <div
              className={styles.linkItem}
              onClick={() => window.open(CONSTANT.place.naver, '_blank')}
            >
              <div className={[styles.circle, styles.naver].join(' ')}>
                <img src={Images.naverMap} alt="네이버지도" />
              </div>
              <span>네이버지도</span>
            </div>
            <div
              className={styles.linkItem}
              onClick={() => window.open(CONSTANT.place.kakao, '_blank')}
            >
              <div className={[styles.circle, styles.kakao].join(' ')}>
                <img src={Images.kakaoMap} alt="카카오맵" />
              </div>
              <span>카카오맵</span>
            </div>
            <div className={styles.linkItem} onClick={tmapLoad}>
              <div className={[styles.circle, styles.tmap].join(' ')}>
                <img src={Images.tMap} alt="티맵" />
              </div>
              <span>티맵</span>
            </div>
          </div>
        </div>
        <div className={styles.load}>
          <div className={styles.item}>
            <div className={styles.itemTitle}>
              <div className={styles.icon}>
                <Svgs.Train />
              </div>
              지하철 이용시
            </div>
            <div className={[styles.itemContent, styles.train].join(' ')}>
              <div className={[styles.row, styles.green].join(' ')}>
                <span>2호선</span> 문래역
              </div>
              <div className={styles.row}>
                - 셔틀버스 : 4번출구(뒷쪽) 셔틀버스 운행{' '}
                <button onClick={() => setIsModal(true)}>
                  <Svgs.Search />
                </button>
              </div>
              <div className={styles.row}>
                - 도보 : 5번출구 전방 직진 300M (약 7분)
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemTitle}>
              <div className={styles.icon}>
                <Svgs.Bus />
              </div>
              버스 이용시
            </div>
            <div className={[styles.itemContent, styles.bus].join(' ')}>
              <div className={styles.row}>문래역 하차</div>
              <div className={[styles.row, styles.blue].join(' ')}>
                - 간선<span>641</span>
              </div>
              <div className={[styles.row, styles.green].join(' ')}>
                - 지선<span>6211</span>
                <span>6516</span>
                <span>6625</span>
              </div>
              <div className={[styles.row, styles.green].join(' ')}>
                - 마을<span>영등포05</span>
                <span>영등포12</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemTitle}>
              <div className={styles.icon}>
                <Svgs.Car />
              </div>
              자가용 이용시
            </div>
            <div className={[styles.itemContent, styles.car].join(' ')}>
              <div className={styles.row}>- 네비게이션</div>
              <ul>
                <li>
                  <b>문래동 SK리더스뷰</b> 또는
                </li>
                <li>
                  <b>규수당 문래점</b> 또는
                </li>
                <li>
                  <b>서울 영등포구 문래로 164</b> 입력
                </li>
              </ul>
              <div className={styles.row}>- 주차장</div>
              <ul>
                <li>지하 3F. 동시 300여대 주차 가능</li>
                <li>예식장 로비(2F)에서 주차등록 가능</li>
                <li>
                  <b>2시간</b> 무료
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={isModal}
        close={() => setIsModal(false)}
        isCenter={true}
        className={styles.modal}
        contentClassName={styles.modalWrap}
        toWay="none"
      >
        <div className={styles.close} onClick={() => setIsModal(false)}>
          <Svgs.Close fill={'black'} />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.division} />
          <div className={styles.list}>
            <div className={styles.page}>
              {currentIndex + 1} / {SHUTTLE_BUS_IMAGE.length}{' '}
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
              {SHUTTLE_BUS_IMAGE.map(({ imgUrl, infomation }, i) => (
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
    </>
  );
}
