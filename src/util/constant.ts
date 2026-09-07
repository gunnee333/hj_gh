export interface IPergson {
  title: string;
  name: string;
  bank?: string;
  account?: string;
  kakaoPay?: string;
  tel?: string;
  kakaotalk?: string;
  isGone?: boolean;
}

const constants = {
  ELEMENT_ID: {
    HOME: "home",
    GALLERY: "gallery",
    LOCATION: "location",
    GUEST_BOOK: "guestBook",
    ACCOUNT: "account",
    CALENDAR: "calendar",
    INFOMATION: "information",
  },
  date: {
    dateISO: "2027-05-01T18:00:00+09:00",
  },
  place: {
    address: "서울특별시 영등포구 문래로 164 SK리더스뷰 2층 (문래동3가 55-16)",
    hallname: "규수당 문래점",
    fullName: "규수당 문래점 카이타스홀 (2층)",
    tel: "02-332-9000",
    naver: "https://map.naver.com/p/entry/place/20050468?c=17.00,0,0,0,dh",
    kakao:
      "https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=,,477917.999999998,1116205.0000000012&rt1=&rt2=%EA%B7%9C%EC%88%98%EB%8B%B9%20%EB%AC%B8%EB%9E%98%EC%A0%90&rtIds=,16733009",
    lat: 37.5177939016069,
    lng: 126.900076883603,
  },
  groom: {
    title: "신랑",
    name: "김현중",
    bank: "신한은행",
    account: "110",
    tel: "01055533852",
  } as IPergson,
  groomDad: {
    title: "신랑 아버지",
    name: "김용근",
    bank: "신한은행",
    account: "110",
    tel: "01011111111",
  } as IPergson,
  groomMom: {
    title: "신랑 어머니",
    name: "김점순",
    bank: "신한은행",
    account: "110",
    tel: "01011111111",
  } as IPergson,
  bride: {
    title: "신부",
    name: "이건희",
    bank: "국민은행",
    account: "287702-04-172216",
    tel: "01051031952",
    kakaoPay: "https://qr.kakaopay.com/Ej9C7Nkav",
    kakaotalk: "http://qr.kakao.com/talk/hptoGRon7.FVoirTMeINaf9i2Uc-",
  } as IPergson,
  brideDad: {
    title: "신부 아버지",
    name: "이용성",
    bank: "",
    account: "",
    tel: "",
    isGone: true,
  } as IPergson,
  brideMom: {
    title: "신부 어머니",
    name: "강자경",
    bank: "국민은행",
    account: "614125-93-111755",
    tel: "01040973651",
  } as IPergson,
};

export default constants;
