import { Images } from '../../assets';

export type TLocationInfoType = 'bus' | 'line1' | 'line2' | 'line5';
interface IItem {
  imgUrl: string;
  infomation: string;
  distance?: number;
}

export const SHUTTLE_BUS_IMAGE: IItem[] = [
  {
    imgUrl: Images.shuttleBus1,
    infomation: `문래역 4번출구로 나오셔서 우측으로 바라보시면\n[셔틀버스 타는곳] 화살표가 보입니다.`
  },
  {
    imgUrl: Images.shuttleBus2,
    infomation: `위 사진 길을 따라서 250M 앞으로 직진해주세요.`
  },
  { imgUrl: Images.shuttleBus3, infomation: `노란색 버스가 있습니다.` },
  {
    imgUrl: Images.shuttleBus4,
    infomation: `[규수당웨딩]을 확인하시어 버스에 탑승해주시면 됩니다.\n셔틀버스는 3~5분간격으로 운행합니다.`
  }
];

export const LINE_1_IMAGE: IItem[] = [
  {
    imgUrl: Images.locationLine1,
    infomation: '영등포역 출발\n738m (1,152걸음)'
  },
  {
    imgUrl: Images.locationLine1_1,
    infomation: '영등포역 6번 출구',
    distance: 294
  },
  {
    imgUrl: Images.locationLine1_2,
    infomation: '2개 횡단보도 건너기',
    distance: 74
  },
  {
    imgUrl: Images.locationLine1_3,
    infomation: '청과시장입구에서 오른쪽 방향',
    distance: 331
  },
  {
    imgUrl: Images.locationLine1_4,
    infomation: '영등포SK리더스뷰아파트 방면으로 횡단보도 건너서 왼쪽방향',
    distance: 15
  },
  {
    imgUrl: Images.locationLine1_5,
    infomation: '도착!\n건물 2층으로 엘리베이터를 타고 올라와주세요.'
  }
];

export const LINE_2_IMAGE: IItem[] = [
  {
    imgUrl: Images.locationLine2,
    infomation: '2호선 문래역 출발\n550m (860걸음)'
  },
  {
    imgUrl: Images.locationLine2_1,
    infomation: '문래역 5번 출구',
    distance: 252
  },
  {
    imgUrl: Images.locationLine2_2,
    infomation: '오이씨 방면으로 횡단보도 건너기',
    distance: 17
  },
  {
    imgUrl: Images.locationLine2_3,
    infomation: '직진',
    distance: 75
  },
  {
    imgUrl: Images.locationLine2_4,
    infomation: '문래동 주민센터 방면으로 횡단보도 건너기',
    distance: 27
  },
  {
    imgUrl: Images.locationLine2_5,
    infomation: '직진',
    distance: 108
  },
  {
    imgUrl: Images.locationLine2_6,
    infomation: '왼쪽 방향',
    distance: 71
  },
  {
    imgUrl: Images.locationLine2_7,
    infomation: '도착!\n건물 2층으로 엘리베이터를 타고 올라와주세요.'
  }
];

export const LINE_5_IMAGE: IItem[] = [
  {
    imgUrl: Images.locationLine5,
    infomation: '5호선 영등포시장역 출발\n915m (1,430걸음)'
  },
  {
    imgUrl: Images.locationLine5_1,
    infomation: '영등포시장역 4번 출구',
    distance: 169
  },
  {
    imgUrl: Images.locationLine5_2,
    infomation: '메가MGC커피 영등포위더스점에서 오른쪽 방향',
    distance: 47
  },
  {
    imgUrl: Images.locationLine5_3,
    infomation: '웨딩그룹위더스 영등포에서 왼쪽 방향',
    distance: 104
  },
  {
    imgUrl: Images.locationLine5_4,
    infomation: 'CU 영등포메인점에서 오른쪽 방향',
    distance: 60
  },
  {
    imgUrl: Images.locationLine5_5,
    infomation: '서해쭈꾸미영등포직영점 방면으로 횡단보도 건너기',
    distance: 24
  },
  { imgUrl: Images.locationLine5_6, infomation: '오른쪽 방향', distance: 68 },
  {
    imgUrl: Images.locationLine5_7,
    infomation: '영등포헌집곱창에서 왼쪽 방향',
    distance: 165
  },
  {
    imgUrl: Images.locationLine5_8,
    infomation: '천왕헤어 영등포점에서 오른쪽 방향',
    distance: 70
  },
  {
    imgUrl: Images.locationLine5_9,
    infomation: '하양상회에서 왼쪽 방향',
    distance: 22
  },
  {
    imgUrl: Images.locationLine5_10,
    infomation: '하양상회에서 2개 횡단보도 건너기',
    distance: 51
  },
  {
    imgUrl: Images.locationLine5_11,
    infomation: '무림상회에서 오른쪽 방향',
    distance: 27
  },
  {
    imgUrl: Images.locationLine5_12,
    infomation: '영등포SK리더스뷰아파트 방면으로 횡단보도 건너기',
    distance: 15
  },
  { imgUrl: Images.locationLine5_13, infomation: '왼쪽방향', distance: 92 },
  {
    imgUrl: Images.locationLine5_14,
    infomation: '도착!\n건물 2층으로 엘리베이터를 타고 올라와주세요.'
  }
];
