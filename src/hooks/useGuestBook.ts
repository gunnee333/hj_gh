import { CommentDoc } from '../util/constant';
import bcrypt from 'bcryptjs';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useEffect, useMemo, useState } from 'react';

const DB_ID = process.env.REACT_APP_FIREBASE_GUEST_BOOK_DB_ID!;

interface IInputData {
  name?: string;
  message?: string;
  password?: string;
}

export default function useGuestBook() {
  const [items, setItems] = useState<CommentDoc[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const colRef = useMemo(() => collection(db, DB_ID), []);

  function checkComplete(data: IInputData) {
    const returnValue: { isComplete: boolean; errMsg: string } = {
      isComplete: false,
      errMsg: '오류 발생'
    };

    const name = (data.name || '').trim();
    const message = (data.message || '').trim();
    const password = (data.password || '').trim();

    if (!name) {
      returnValue.errMsg = '이름을 입력해 주세요.';
    } else if (name.length > 20) {
      returnValue.errMsg = '이름은 20자 이내로 입력해 주세요.';
    } else if (!message) {
      returnValue.errMsg = '축하 메시지를 입력해 주세요.';
    } else if (message.length > 300) {
      returnValue.errMsg = '댓글은 300자 이내로 입력해 주세요.';
    } else if (password.length < 4) {
      returnValue.errMsg = '비밀번호는 4자 이상으로 입력해 주세요.';
    } else if (password.length > 30) {
      returnValue.errMsg = '비밀번호는 30자 이내로 입력해 주세요.';
    } else {
      returnValue.isComplete = true;
      returnValue.errMsg = '';
    }

    return returnValue;
  }

  async function onSubmit(data: IInputData) {
    try {
      const { isComplete } = checkComplete(data);
      if (!isComplete) {
        return false;
      }

      setSubmitting(true);
      const pwHash = await bcrypt.hash(data.password!, 10);

      await addDoc(colRef, {
        name: data.name,
        message: data.message,
        pwHash,
        deleted: false,
        createdAt: serverTimestamp()
      });
      return true;
    } catch (e: any) {
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  const requestDelete = async (c: CommentDoc) => {
    if (c.deleted) return;

    const input = prompt('댓글 삭제 비밀번호를 입력해 주세요.');
    if (!input) return;

    const ok = await bcrypt.compare(input, c.pwHash);
    if (!ok) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 소프트 삭제: deleted=true, message=""
    await updateDoc(doc(db, DB_ID, c.id), {
      deleted: true,
      message: '',
      pwHash: c.pwHash
    });
  };

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
              name: String(data.name ?? ''),
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
    items,
    submitting,
    error,
    onSubmit,
    requestDelete,
    checkComplete
  };
}
