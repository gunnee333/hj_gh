import React from 'react';
import Modal from '../Modal';
import styles from './style.module.scss';
import { CONSTANT } from '../../util';
import { Svgs } from '../../assets';

const groomTelNumList = [CONSTANT.groom, CONSTANT.groomDad, CONSTANT.groomMom];
const brideTelNumList = [CONSTANT.bride, CONSTANT.brideMom];

export function TelModal({
  visible,
  close
}: {
  visible: boolean;
  close?: () => void;
}) {
  return (
    <Modal
      visible={visible}
      isCenter={true}
      className={styles.telModal}
      contentClassName={styles.modalWrap}
      toWay="none"
      close={close}
    >
      <div className={styles.close} onClick={close}>
        <Svgs.Close fill={'black'} />
      </div>
      <div className={styles.modalContainer}>
        <div className={styles.list}>
          {groomTelNumList.map((item) => (
            <TelItem key={item.title} item={item} />
          ))}
        </div>
        <div className={styles.division} />
        <div className={styles.list}>
          {brideTelNumList.map((item) => (
            <TelItem key={item.title} item={item} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

function TelItem({
  item
}: {
  item: {
    title: string;
    name: string;
    tel?: string | undefined;
    kakaotalk?: string;
  };
}) {
  return (
    <div className={styles.item}>
      <div className={styles.textContainer}>
        <div className={styles.telTitle}>{item.title}</div>
        <div className={styles.telName}>{item.name}</div>
      </div>
      <div className={styles.btnList}>
        {!!item.kakaotalk && (
          <div className={styles.btn}>
            <a href={item.kakaotalk}>
              <Svgs.KakaoTalk width={14} />
              <div>카카오톡</div>
            </a>
          </div>
        )}
        {!!item.tel && (
          <>
            <div className={styles.btn}>
              <a href={`tel:${item.tel}`}>
                <Svgs.Phone width={14} />
                <div>전화</div>
              </a>
            </div>
            <div className={styles.btn}>
              <a href={`sms:${item.tel}`}>
                <Svgs.Message width={14} />
                <div>문자</div>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
