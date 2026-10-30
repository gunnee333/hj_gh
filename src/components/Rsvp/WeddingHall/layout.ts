import { IAttendance } from '../../../util/constant';
import type { Seat, SeatLayout } from './types';

interface LayoutOptions {
  defaultRows: number;
  autoExpandRows: boolean;
  maxRows?: number;
  columnsPerSide: number;
  separateBySide: boolean;
}

/**
 * 하객을 좌석에 배치한다.
 * - 맨 아래줄(단상 쪽), 버진로드와 가장 가까운 자리부터 채운다.
 * - 한 줄이 차면 위 줄로, 한 줄 안에서는 버진로드 → 바깥쪽 순서.
 */
export function layoutSeats(
  guests: IAttendance[],
  opts: LayoutOptions
): SeatLayout {
  const {
    defaultRows,
    autoExpandRows,
    maxRows,
    columnsPerSide: cols,
    separateBySide
  } = opts;

  const leftGuests: { guest: IAttendance; ordinal: number }[] = [];
  const rightGuests: { guest: IAttendance; ordinal: number }[] = [];

  guests.forEach((guest, ordinal) => {
    if (separateBySide) {
      (guest.side === 'groom' ? leftGuests : rightGuests).push({
        guest,
        ordinal
      });
    } else {
      (ordinal % 2 === 0 ? leftGuests : rightGuests).push({ guest, ordinal });
    }
  });

  const longest = Math.max(leftGuests.length, rightGuests.length);
  const needRows = Math.ceil(longest / cols);

  let rows = Math.max(1, defaultRows);
  if (autoExpandRows) rows = Math.max(rows, needRows);
  if (maxRows !== undefined) rows = Math.min(rows, Math.max(1, maxRows));

  const capacity = rows * cols;
  const overflow =
    Math.max(0, leftGuests.length - capacity) +
    Math.max(0, rightGuests.length - capacity);

  const build = (list: typeof leftGuests): Seat[][] =>
    Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c): Seat => {
        const entry = list[r * cols + c];
        return {
          rowFromBottom: r,
          colFromAisle: c,
          guest: entry?.guest,
          ordinal: entry ? entry.ordinal : -1
        };
      })
    );

  return { rows, left: build(leftGuests), right: build(rightGuests), overflow };
}
