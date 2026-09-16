export interface CustomerReview {
  id: string;
  author: string;
  region: string;
  model: string;
  rating: number;
  date: string;
  title: string;
  content: string;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    author: "김*우 고객님",
    region: "경기 시흥시 배곧동",
    model: "2023년식 혼다 PCX125",
    rating: 5,
    date: "2026-08-26",
    title: "시흥 본사가 가까워서 20분 만에 오셨네요!",
    content: "타 업체들은 전화로는 비싸게 부르고 현장 와서 50만원씩 깎으려고 해서 기분 상했었는데, 넥스트바이크 사장님은 사진 보고 부른 가격에서 1원도 안 깎고 그 자리에서 바로 전액 입금해 주셨습니다. 배곧 주민분들 강추합니다."
  },
  {
    id: "rev-2",
    author: "이*혁 고객님",
    region: "서울 강남구 역삼동",
    model: "2022년식 BMW R1250GS",
    rating: 5,
    date: "2026-08-20",
    title: "고급 수입 바이크 옵션 가치를 알아봐 주십니다.",
    content: "3박스랑 아크라포빅 머플러 등 튜닝에 돈이 많이 들어갔는데, 딜러들이 헐값 취급해서 속상했습니다. 넥스트바이크에서 옵션 가치를 제대로 인정해 주셔서 시세보다 훨씬 좋은 가격에 정리했습니다. 이전 처리도 다음날 바로 서류 사진 보내주셔서 믿음직했습니다."
  },
  {
    id: "rev-3",
    author: "박*진 고객님",
    region: "경기 부천시 상동",
    model: "2021년식 야마하 NMAX125",
    rating: 5,
    date: "2026-08-16",
    title: "시동 안 걸리는 방치 바이크였는데 깔끔하게 가져가셨어요.",
    content: "지하주차장에 6개월 넘게 세워둬서 배터리 방전되고 시동도 안 걸렸는데, 전용 리프트 차량으로 조용하게 실어가셨습니다. 폐차해야 하나 고민했는데 생각보다 훨씬 좋은 금액 주셔서 감사했습니다."
  },
  {
    id: "rev-4",
    author: "정*호 고객님",
    region: "인천 연수구 송도동",
    model: "2023년식 야마하 XMAX300",
    rating: 5,
    date: "2026-08-12",
    title: "송도까지 30분 만에 오셔서 시원시원하게 거래 완료!",
    content: "다른 데 견적 세 군데 비교해 봤는데 넥스트바이크가 가장 높았습니다. 친절하게 서류 폐지하는 법도 알려주시고 당일 현금으로 바로 계좌 입금해 주시네요. 최고입니다."
  },
  {
    id: "rev-5",
    author: "최*민 고객님",
    region: "충남 천안시 불당동",
    model: "2022년식 혼다 레블500",
    rating: 5,
    date: "2026-08-05",
    title: "지방인데도 약속 시간 딱 맞춰서 오셨습니다.",
    content: "천안 불당동이라 출장비나 감가 걱정했는데, 서울/경기랑 똑같이 무료 출장으로 와주셨고 상차 전에 바로 입금 확인되었습니다. 바이크 파실 분들 여기서 견적 꼭 받아보세요."
  }
];
