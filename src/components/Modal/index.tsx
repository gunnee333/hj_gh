'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

const DRAG_CLOSE_THRESHOLD = 120;

export interface IModalProps {
  visible?: boolean;
  close?: () => void;
  backOpacity?: number | string;
  backDropColor?: string;
  children: React.ReactNode;
  isFullModal?: boolean;
  isCenter?: boolean;
  toWay?: 'bottom' | 'top' | 'right' | 'left' | 'none' | 'center';
  className?: string | string[];
  contentClassName?: string | string[];
  position?: {
    bottom?: number;
    top?: number;
    right?: number;
    left?: number;
  };
  isIndicator?: boolean;
}

export default function Modal({
  visible = false,
  close,
  backDropColor = '#000000',
  backOpacity = 40,
  children,
  isFullModal = false,
  isCenter = false,
  toWay = 'top',
  className,
  contentClassName,
  position = {},
  isIndicator = false
}: IModalProps) {
  const classList = [
    styles.img,
    ...(Array.isArray(className) ? className : [className])
  ].filter((item) => !!item);
  const contentClassList = [
    styles.img,
    ...(Array.isArray(contentClassName) ? contentClassName : [contentClassName])
  ].filter((item) => !!item);

  const [isVisible, setIsVisible] = useState(visible);
  const [isClosing, setIsClosing] = useState(false);
  const [dragOffset, setOriginDragOffset] = useState(0);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef(0);

  function onClose() {
    startYRef.current = 0;
    currentYRef.current = 0;
    draggingRef.current = false;
    dragOffsetRef.current = 0;
    setOriginDragOffset(0);
    close?.();
  }

  function setDragOffset(value: number) {
    setOriginDragOffset(value);
    dragOffsetRef.current = value;
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    startYRef.current = e.clientY;
    currentYRef.current = e.clientY;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;

    currentYRef.current = e.clientY;
    const diff = currentYRef.current - startYRef.current;

    // 아래로만 이동
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const onPointerUp = () => {
    draggingRef.current = false;

    if (dragOffsetRef.current > DRAG_CLOSE_THRESHOLD) {
      onClose();
    } else {
      setDragOffset(0);
    }

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  useEffect(() => {
    if (visible) {
      setIsClosing(false);
      setIsVisible(true);
    } else {
      setIsClosing(true);
    }
  }, [visible]);

  useEffect(() => {
    if (isClosing) {
      setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }
  }, [isClosing]);

  if (!isVisible) {
    return <></>;
  }

  return (
    <div
      className={[
        styles.slideModal,
        isFullModal && styles.fullModal,
        ...classList
      ].join(' ')}
      style={{
        backgroundColor: isFullModal
          ? backDropColor
          : `${String(backDropColor)}${backOpacity}`
      }}
    >
      <div
        className={[
          styles.wrap,
          isClosing && styles.isClosing,
          !['none'].includes(toWay) && styles[`way-${toWay}`]
        ].join(' ')}
      >
        <div className={styles.container}>
          <div className={styles.background} onClick={onClose} />
          <div
            className={[
              styles.content,
              isFullModal && styles.isFull,
              isCenter && styles.isCenter,
              ...contentClassList
            ].join(' ')}
            style={{
              transform: `translateY(${dragOffset}px)`,
              transition: draggingRef.current ? 'none' : 'transform 0.25s ease',
              ...(!isNaN(Number(position.bottom)) && {
                bottom: position.bottom
              }),
              ...(!isNaN(Number(position.top)) && { top: position.top }),
              ...(!isNaN(Number(position.right)) && { right: position.right }),
              ...(!isNaN(Number(position.left)) && { left: position.left })
            }}
          >
            {!!isIndicator && (
              <>
                <div className={styles.indicator} onPointerDown={onPointerDown}>
                  <span />
                </div>
                <div className={styles.tempIndicator} />
              </>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
