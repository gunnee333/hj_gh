import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { Images, Svgs } from '../../assets';
import { CONSTANT } from '../../util';
import { Reveal } from '../../components';
import { LocationInfoModal } from './LocationInfoModal';
import { TLocationInfoType } from './LocationData';

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

export default function Component() {
  const [infoModalType, setInfoModalType] = useState<TLocationInfoType>();

  useEffect(() => {
    kakaoMapLoad();
  }, []);

  return (
    <>
      <Reveal
        className={styles.container}
        id={CONSTANT.ELEMENT_ID.LOCATION}
        backgroundType="ivory"
        delay={150}
      >
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
              <div className={[styles.trainItem, styles.green].join(' ')}>
                <span>2호선</span> 문래역
                <div className={styles.row}>
                  - 셔틀버스 : 4번출구 뒷쪽 셔틀버스 운행{' '}
                  <button
                    onClick={() => setInfoModalType('bus')}
                    className={styles.infoBtn}
                  >
                    안내 <Svgs.Search />
                  </button>
                </div>
                <div className={styles.row}>
                  - 도보 : 5번출구 전방 직진 300M (약 7분)
                  <button
                    onClick={() => setInfoModalType('line2')}
                    className={styles.infoBtn}
                  >
                    안내 <Svgs.Search />
                  </button>
                </div>
              </div>
              <div className={[styles.trainItem, styles.blue].join(' ')}>
                <span>1호선</span> 영등포역
                <div className={styles.row}>
                  - 도보 : 6번출구 (약 15분){' '}
                  <button
                    onClick={() => setInfoModalType('line1')}
                    className={styles.infoBtn}
                  >
                    안내 <Svgs.Search />
                  </button>
                </div>
              </div>
              <div className={[styles.trainItem, styles.purple].join(' ')}>
                <span>5호선</span> 영등포시장역
                <div className={styles.row}>
                  - 도보 : 4번출구 (약 15분){' '}
                  <button
                    onClick={() => setInfoModalType('line5')}
                    className={styles.infoBtn}
                  >
                    안내 <Svgs.Search />
                  </button>
                </div>
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
      </Reveal>
      <LocationInfoModal
        visible={!!infoModalType}
        close={() => setInfoModalType(undefined)}
        type={infoModalType}
      />
    </>
  );
}
