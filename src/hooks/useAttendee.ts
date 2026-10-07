import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { db } from '../lib/firebase';
import { GuestCount, GuestSide } from '../util/constant';
import { useEffect, useMemo, useState } from 'react';

const DB_ID = process.env.REACT_APP_FIREBASE_ATTENDEE_LIST_DB_ID!;

export interface IAttendeeInputData extends GuestCount {
  attendance: boolean;
  side: GuestSide;
  name: string;
  relation: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  message: string;
  password: string;
}

interface IGuestItem extends GuestCount {
  id: string;
}

export default function useAttendee() {
  const colRef = useMemo(() => collection(db, DB_ID), []);
  const [items, setItems] = useState<IGuestItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  function checkComplete(data: IAttendeeInputData) {
    const returnValue: { isComplete: boolean; errMsg: string } = {
      isComplete: false,
      errMsg: '오류 발생'
    };

    if (submitting) {
      returnValue.errMsg = '전송중입니다...';
    }

    const name = (data.name || '').trim();
    const message = (data.message || '').trim();
    const password = (data.password || '').trim();
    const totalCount = data.adultCount + data.childCount + data.infantCount;

    if (!name) {
      returnValue.errMsg = '이름을 입력해 주세요.';
    } else if (name.length > 20) {
      returnValue.errMsg = '이름은 20자 이내로 입력해 주세요.';
    } else if (message.length > 300) {
      returnValue.errMsg = '댓글은 300자 이내로 입력해 주세요.';
    } else if (password.length < 4) {
      returnValue.errMsg = '비밀번호는 4자 이상으로 입력해 주세요.';
    } else if (password.length > 30) {
      returnValue.errMsg = '비밀번호는 30자 이내로 입력해 주세요.';
    } else if (!!data.attendance && totalCount === 0) {
      returnValue.errMsg = '방문 인원을 선택해주세요.';
    } else {
      returnValue.isComplete = true;
      returnValue.errMsg = '';
    }

    return returnValue;
  }

  async function submit(data: IAttendeeInputData) {
    try {
      setSubmitting(true);
      const { password, ...rest } = data;
      const pwHash = await bcrypt.hash(password!, 10);
      await addDoc(collection(db, DB_ID), {
        ...rest,
        pwHash,
        adultCount: data.attendance ? data.adultCount : 0,
        childCount: data.attendance ? data.childCount : 0,
        infantCount: data.attendance ? data.infantCount : 0,
        deleted: false,
        createdAt: serverTimestamp()
      });
      setSubmitting(false);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  useEffect(() => {
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const next = snap.docs
          .map((d) => {
            const data = d.data() as any;
            return {
              id: d.id,
              attendance: Boolean(data.attendance ?? false),
              side: String(data.side ?? '') as GuestSide,
              name: String(data.name ?? ''),
              relation: String(data.relation ?? ''),
              adultCount: Number(data.adultCount ?? 0),
              childCount: Number(data.childCount ?? 0),
              infantCount: Number(data.infantCount ?? 0),
              message: String(data.message ?? ''),
              pwHash: String(data.pwHash ?? ''),
              deleted: Boolean(data.deleted ?? false),
              createdAt: data.createdAt
            };
          })
          .filter((item) => !item.deleted);
        setItems(next);
      },
      (e) => setError(e.message)
    );
    return () => unsub();
  }, [colRef]);

  return {
    submit,
    checkComplete,
    submitting,
    error,
    items
  };
}
