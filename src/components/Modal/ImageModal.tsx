import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './imageModal.module.scss';
import { Svgs } from '../../assets';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/zoom';

type Props = {
  photos: string[];
  index: number;
  onClose: () => void;
};

export function ImageModal({ photos, index, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(index);
  const swiperRef = useRef<SwiperCore | null>(null);

  const onPrev = useCallback(() => {
    if (currentIndex > 0) {
      swiperRef.current?.slideTo(currentIndex - 1, 0);
    } else {
      swiperRef.current?.slideTo(photos.length - 1, 0);
    }
  }, [currentIndex, photos]);

  const onNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      swiperRef.current?.slideTo(currentIndex + 1, 0);
    } else {
      swiperRef.current?.slideTo(0, 0);
    }
  }, [currentIndex, photos]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTop}>
          {photos.length > 1 && (
            <div className={styles.modalIndex}>
              {Number(currentIndex) + 1} / {photos.length}
            </div>
          )}
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="닫기"
          >
            <Svgs.Close width={50} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <Swiper
            className={styles.swiper}
            spaceBetween={0}
            initialSlide={currentIndex}
            slidesPerView="auto"
            centeredSlides={true}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(e) => {
              if (!isNaN(Number(e.realIndex))) {
                setCurrentIndex(e.realIndex);
              }
            }}
            modules={[Zoom]}
            zoom={{ maxRatio: 2 }}
            loop
          >
            {photos.map((url, i) => (
              <SwiperSlide key={i} className={styles.modalImg}>
                <div className="swiper-zoom-container">
                  <img src={url} alt={`확대 사진 ${i + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
