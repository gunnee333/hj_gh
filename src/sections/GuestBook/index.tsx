import { useState } from 'react';
import styles from './style.module.scss';
import { CONSTANT } from '../../util';
import { Svgs } from '../../assets';
import { Reveal } from '../../components';
import { useGuestBook } from '../../hooks';

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
  const { items, submitting, checkComplete, onSubmit, requestDelete } =
    useGuestBook();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const { isComplete, errMsg } = checkComplete({ name, message, password });

  async function handleSubmit() {
    if (!isComplete) {
      return alert(errMsg);
    }
    const isDone = await onSubmit({ name, message, password });
    if (isDone) {
      setName('');
      setMessage('');
      setPassword('');
    } else {
      alert('댓글 등록에 실패했습니다.');
    }
  }

  return (
    <Reveal
      className={styles.container}
      id={CONSTANT.ELEMENT_ID.GUEST_BOOK}
      backgroundType="ivory"
      delay={150}
      isBottomBorder={false}
    >
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
            {!!errMsg && !(!name && !message && !password) && (
              <div className={styles.errorText}>{errMsg}</div>
            )}

            <button type="button" onClick={handleSubmit} disabled={!isComplete}>
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
    </Reveal>
  );
}
