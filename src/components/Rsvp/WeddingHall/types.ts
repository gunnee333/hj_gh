import { IAttendance } from '../../../util/constant';

export interface WeddingHallProps {
  guests?: IAttendance[];
  /** 하객이 없을 때 보여줄 기본 줄(row) 수. 기본 2 */
  defaultRows?: number;
  /** 하객이 늘면 줄을 자동으로 늘릴지 여부. 기본 true */
  autoExpandRows?: boolean;
  /** autoExpandRows 사용 시 최대 줄 수. 기본 제한 없음 */
  maxRows?: number;
  /** 버진로드 한쪽의 열(column) 수. 기본 3 (양쪽 합쳐 6열) */
  columnsPerSide?: number;
  /**
   * true  : 신랑측은 왼쪽, 신부측은 오른쪽으로 나눠 앉음
   * false : 신랑/신부 구분 없이 입장 순서대로 좌우 번갈아 앉음
   */
  separateBySide?: boolean;
  /** 비어있는 의자를 보여줄지 여부. 기본 true */
  showEmptySeats?: boolean;
  /** 숫자 = 고정 배율, 'auto' = 부모 너비에 맞춤. 기본 'auto' */
  scale?: number | 'auto';
  className?: string;
  /** 하객 클릭 이벤트 (넘기면 하객이 버튼으로 렌더링됨) */
  onGuestClick?: (guest: IAttendance) => void;
  setIsAttendeeModal?: (value: boolean) => void;
}

export interface Seat {
  /** 맨 아래줄이 0 */
  rowFromBottom: number;
  /** 버진로드와 가장 가까운 열이 0 */
  colFromAisle: number;
  guest?: IAttendance;
  /** 하객 배열 안에서의 순번 (스프라이트 자동 배정용) */
  ordinal: number;
}

export interface SeatLayout {
  rows: number;
  /** left[rowFromBottom][colFromAisle] */
  left: Seat[][];
  right: Seat[][];
  /** 자리가 부족해서 앉지 못한 하객 수 */
  overflow: number;
}
