import { useEffect, useMemo, useState } from 'react';
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
import { db } from '../../lib/firebase';
import styles from './style.module.scss';
import { CONSTANT } from '../../util';
import { Svgs } from '../../assets';

type CommentDoc = {
  id: string;
  name: string;
  message: string;
  pwHash: string;
  deleted?: boolean;
  createdAt?: any;
};

const DB_ID = process.env.REACT_APP_FIREBASE_GUEST_BOOK_DB_ID!;

function formatDate(ts: any) {
  if (!ts?.toDate) return '';

  const d: Date = ts.toDate();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  // const hh = String(d.getHours()).padStart(2, '0');
  // const min = String(d.getMinutes()).padStart(2, '0');

  return `${yyyy}.${mm}.${dd}`;
}

export default function Component() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const [items, setItems] = useState<CommentDoc[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const colRef = useMemo(() => collection(db, DB_ID), []);

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

  async function onSubmit() {
    const n = name.trim();
    const m = message.trim();
    const p = password.trim();

    if (!n) return setError('이름을 입력해 주세요.');
    if (n.length > 20) return setError('이름은 20자 이내로 입력해 주세요.');
    if (!m) return setError('축하 메시지를 입력해 주세요.');
    if (m.length > 300) return setError('댓글은 300자 이내로 입력해 주세요.');
    if (p.length < 4) return setError('비밀번호는 4자 이상으로 입력해 주세요.');
    if (p.length > 30) return setError('비밀번호는 30자 이내로 입력해 주세요.');

    try {
      setError(undefined);
      setSubmitting(true);
      const pwHash = await bcrypt.hash(p, 10);

      await addDoc(colRef, {
        name: n,
        message: m,
        pwHash,
        deleted: false,
        createdAt: serverTimestamp()
      });

      setMessage('');
      setPassword('');
    } catch (e: any) {
      setError(e?.message ?? '댓글 등록에 실패했습니다.');
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

  return (
    <div className={styles.container} id={CONSTANT.ELEMENT_ID.GUEST_BOOK}>
      <div className={styles.title}>방명록</div>
      <div className={styles.commentForm}>
        <div className={styles.commentConatiner}>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              maxLength={20}
            />
            <textarea
              className={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="축하 메시지를 남겨주세요. (최대 300자)"
              maxLength={300}
            />
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="삭제용 암호 (4자 이상)"
              maxLength={30}
            />
          </div>

          <div className={styles.btnContainer}>
            {!!error && <div className={styles.errorText}>{error}</div>}

            <button type="button" onClick={onSubmit}>
              {submitting ? '작성 중...' : '글쓰기'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.listContainer}>
        {items.map((c) => (
          <div key={c.id} className={styles.itemContainer}>
            <div className={styles.item}>
              <div className={styles.titleRow}>
                <div className={styles.name}>{c.name}</div>
                <div className={styles.date}>
                  {c.createdAt ? formatDate(c.createdAt) : ''}
                </div>
              </div>

              <div className={styles.contentContainer}>
                <div className={styles.content}>
                  {c.deleted ? '삭제된 댓글입니다.' : c.message}
                </div>
                {!c.deleted && (
                  <div className={styles.delBtn}>
                    <button type="button" onClick={() => requestDelete(c)}>
                      <Svgs.Trash width={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
