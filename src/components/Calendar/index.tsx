import { useEffect, useState } from 'react';
import { Svgs } from '../../assets';
import styles from './style.module.scss';
import moment from 'moment';
import { CONSTANT } from '../../util';

function diffParts(nowMs: number) {
  const targetMs = new Date(CONSTANT.date.dateISO).getTime();

  const diffDays = moment(targetMs)
    .startOf('days')
    .diff(moment(nowMs).startOf('days'), 'days');
  const diff = targetMs - nowMs;
  const abs = Math.abs(diff);

  const totalSec = Math.floor(abs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  return { diffDays, diff, days, hours, mins, secs };
}

export default function Component() {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const d = diffParts(nowMs);
  const isBefore = d.diffDays > 0;

  return (
    <>
      <div className={styles.container} id={CONSTANT.ELEMENT_ID.CALENDAR}>
        <div className={styles.title}>달력</div>
        <div className={styles.date}>
          {moment(CONSTANT.date.dateISO).format('YYYY. MM. DD. (ddd) HH시')}
        </div>
        <div className={styles.desc}>
          {d.days === 0 ? (
            <div className={styles.text}>
              오늘은 {CONSTANT.groom.name.slice(1, 3)} <span>♥</span>{' '}
              {CONSTANT.bride.name.slice(1, 3)}의 결혼식입니다.
            </div>
          ) : (
            <>
              <div className={styles.text}>
                D {isBefore ? '-' : '+'} <span>{Math.abs(d.diffDays)}</span>
              </div>
              {d.diff !== 0 && (
                <div className={styles.timer}>
                  {d.days > 0 && <span>{String(d.days)}일</span>}
                  <span>{String(d.hours)}시간</span>
                  <span>{String(d.mins)}분</span>
                  <span>{String(d.secs)}초</span>
                  <div>{isBefore ? '남았습니다.' : '지났습니다.'}</div>
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.tableContainer}>
          <div className={styles.date}>
            {moment(CONSTANT.date.dateISO).format('YYYY. MM.')}
          </div>

          <table>
            <tbody>
              <tr>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
              </tr>
              <tr className={styles.activeTr}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div className={styles.heart}>
                    <Svgs.Heart width={36} />
                  </div>
                  <div className={styles.active}>1</div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td className={styles.red}>3</td>
                <td>4</td>
                <td className={styles.red}>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
              <tr>
                <td>9</td>
                <td>10</td>
                <td>11</td>
                <td>12</td>
                <td className={styles.red}>13</td>
                <td>14</td>
                <td>15</td>
              </tr>
              <tr>
                <td>16</td>
                <td>17</td>
                <td>18</td>
                <td>19</td>
                <td>20</td>
                <td>21</td>
                <td>22</td>
              </tr>
              <tr>
                <td>23</td>
                <td>24</td>
                <td>25</td>
                <td>26</td>
                <td>27</td>
                <td>28</td>
                <td>29</td>
              </tr>
              <tr>
                <td>30</td>
                <td>31</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
