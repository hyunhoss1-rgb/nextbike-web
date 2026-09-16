export interface PurchaseCase {
  slug: string;
  region: string;
  year: string;
  brand: string;
  model: string;
  category?: string;
  mileage: string;
  date: string; // ISO date string (YYYY-MM-DD or formatted)
  displayDate?: string; // e.g. "오늘 15:20 정산완료" or "어제 정산완료"
  priceRange: string;
  statusText: string;
  description: string;
}

/**
 * 전국 출장 매입 실제 데이터 마스터 풀 (인기 바이크 전 차종 42개 마스터 데이터)
 * 기종명(model)은 부수적 수식어(에디션/패키지명)를 제거하고 표준 순정 기종명으로 깔끔하게 표기
 */
export const RAW_PURCHASE_CASES: Omit<PurchaseCase, "date" | "displayDate">[] = [
  {
    "slug": "pcx125-siheung-baegot",
    "region": "경기 시흥 배곧동",
    "year": "2024년식",
    "brand": "혼다",
    "model": "PCX125",
    "category": "스쿠터",
    "mileage": "5,400km",
    "priceRange": "295만~315만원",
    "statusText": "1인 신조 순정 · 배곧 아파트 지하주차장 당일 출장",
    "description": "배곧 호반베르디움 지하 2층 출장. 비흡연 1인 신조 무꿍·무슬립 순정 차량으로, 현장 10분 외관 및 구동계 점검 후 계약서 작성 즉시 계좌 전액 송금."
  },
  {
    "slug": "pcx125-seoul-gangnam-yeoksam",
    "region": "서울 강남구 역삼동",
    "year": "2023년식",
    "brand": "혼다",
    "model": "PCX125",
    "category": "스쿠터",
    "mileage": "11,800km",
    "priceRange": "245만~265만원",
    "statusText": "샤드 48L 탑박스 장착 · 현장 억지감가 0%",
    "description": "역삼동 오피스텔 지하주차장 방문. 통근용 실사용 차량으로 정품 알루미늄 발판 및 샤드 48L 탑박스 장착 상태를 우대 가산하여 사전 견적 그대로 100% 입금."
  },
  {
    "slug": "nmax125-bucheon-wonmi-jungdong",
    "region": "경기 부천 원미구 중동",
    "year": "2024년식",
    "brand": "야마하",
    "model": "NMAX125",
    "category": "스쿠터",
    "mileage": "4,200km",
    "priceRange": "280만~305만원",
    "statusText": "신차급 컨디션 · 스마트키 2개 보유",
    "description": "부천 중동 주상복합 지하 방문. 2채널 ABS 및 TCS 정상 작동 확인, 차주님 사정으로 급처분 요청에 전화 접수 40분 만에 현장 방문 완료 및 당일 이체."
  },
  {
    "slug": "nmax125-daegu-suseong-beomeo",
    "region": "대구 수성구 범어동",
    "year": "2023년식",
    "brand": "야마하",
    "model": "NMAX125",
    "category": "스쿠터",
    "mileage": "16,500km",
    "priceRange": "225만~245만원",
    "statusText": "배달 이력 없음 · 2채널 지넷 블랙박스 장착",
    "description": "대구 범어동 아파트 지상 출장. 자가용 출퇴근용으로 관리된 상태로 엔진오일 및 브레이크 패드 양호, 2채널 블랙박스 옵션 가산 반영하여 즉시 계좌 이체."
  },
  {
    "slug": "forza350-ansan-danwon-gojan",
    "region": "경기 안산 단원구 고잔동",
    "year": "2024년식",
    "brand": "혼다",
    "model": "포르자 350",
    "category": "맥시스쿠터",
    "mileage": "8,100km",
    "priceRange": "530만~560만원",
    "statusText": "혼다 정품 전동 스마트 탑박스 완비 · 무사고",
    "description": "안산 고잔 푸르지오 방문. 전동 스크린 및 정품 스마트 탑박스 작동 완벽 확인. 스크래치 없는 특A급 차량으로 사전 유선 안내 최고가 그대로 정산."
  },
  {
    "slug": "forza350-seoul-mapo-sangam",
    "region": "서울 마포구 상암동",
    "year": "2023년식",
    "brand": "혼다",
    "model": "포르자 350",
    "category": "맥시스쿠터",
    "mileage": "14,300km",
    "priceRange": "460만~490만원",
    "statusText": "아크라포빅 정품 머플러 환경검사 합격 차량",
    "description": "상암 DMC 오피스텔 지하 방문. 구변 완료 서류 현장 검토 후 10분 만에 실차 검수 종결 및 차주님 계좌로 현금 전액 실시간 송금."
  },
  {
    "slug": "xmax300-busan-haeundae-marine",
    "region": "부산 해운대구 마린시티",
    "year": "2024년식",
    "brand": "야마하",
    "model": "XMAX 300",
    "category": "맥시스쿠터",
    "mileage": "6,700km",
    "priceRange": "520만~550만원",
    "statusText": "올린즈 리어 쇽 튜닝 우대 가산 · 당일 이전 완료",
    "description": "마린시티 주상복합 지하 출장. 올린즈 정품 서스펜션 장착 상태를 높게 평가하여 튜닝 비용 인정 후 최고 견적으로 당일 즉시 매입."
  },
  {
    "slug": "xmax300-gyeonggi-seongnam-bundang",
    "region": "경기 성남 분당구 정자동",
    "year": "2023년식",
    "brand": "야마하",
    "model": "XMAX 300",
    "category": "맥시스쿠터",
    "mileage": "18,200km",
    "priceRange": "410만~440만원",
    "statusText": "정기 오일 교환 이력 확인 · 현장 감가 없음",
    "description": "분당 정자동 카페거리 인근 출장. 정식 서비스센터 메인터넌스 영수증 증빙 확인되어 사전 안내 금액 100% 보장 매입."
  },
  {
    "slug": "supercub110-seoul-songpa-jamsil",
    "region": "서울 송파구 잠실동",
    "year": "2023년식",
    "brand": "혼다",
    "model": "슈퍼커브 110",
    "category": "클래식 언더본",
    "mileage": "3,400km",
    "priceRange": "190만~210만원",
    "statusText": "베이지 순정 컬러 · 롱스크린 & 프론트 바구니 풀세팅",
    "description": "잠실 엘스아파트 방문. 레트로 출퇴근용으로 실내 주차 관리된 민트급 바이크. 키 2개 및 순정 부품 일체 인수 후 현장 즉시 정산."
  },
  {
    "slug": "huntercub-gyeonggi-gapyeong",
    "region": "경기 가평군 청평면",
    "year": "2024년식",
    "brand": "혼다",
    "model": "CT125",
    "category": "트레일 어드벤처",
    "mileage": "2,100km",
    "priceRange": "380만~410만원",
    "statusText": "임도 투어 세팅 · 센터 프로텍트 바 & 사이드백 완비",
    "description": "가평 전원주택 출장. 신차 출고 6개월 미만 차량으로 잔기스 없는 신차급 상태. 유압 리프트 트럭으로 안전 결박 상차 완료."
  },
  {
    "slug": "r1250gs-gangwon-chuncheon",
    "region": "강원 춘천시 퇴계동",
    "year": "2023년식",
    "brand": "BMW",
    "model": "R1250GS",
    "category": "어드벤처 투어러",
    "mileage": "15,800km",
    "priceRange": "2,100만~2,350만원",
    "statusText": "BMW 알루미늄 3박스 풀패키지 · 40주년 에디션",
    "description": "춘천 퇴계동 아파트 방문. ESA 서스펜션 및 샤프트 드라이브 완벽 상태. 삼매 박스 및 아크라포빅 정품 장착으로 최고 감정가 산출."
  },
  {
    "slug": "r1250rt-seoul-seocho-seocho",
    "region": "서울 서초구 서초동",
    "year": "2023년식",
    "brand": "BMW",
    "model": "R1250RT",
    "category": "럭셔리 투어러",
    "mileage": "12,400km",
    "priceRange": "2,200만~2,450만원",
    "statusText": "옵션 719 빌렛 파츠 적용 · 실내 전용 커버 보관",
    "description": "서초동 고급 빌라 지하 방문. 오디오 시스템 및 전동 윈드스크린 정상 작동 확인 후 그 자리에서 2천만원대 전액 계좌 입금 완료."
  },
  {
    "slug": "s1000rr-seoul-gangnam-dogok",
    "region": "서울 강남구 도곡동",
    "year": "2023년식",
    "brand": "BMW",
    "model": "S1000RR",
    "category": "슈퍼스포츠",
    "mileage": "4,900km",
    "priceRange": "2,250만~2,500만원",
    "statusText": "M 패키지 카본 휠 장착 · 무꿍 무슬립 신차급",
    "description": "도곡동 타워팰리스 방문. 서킷 주행 이력 없는 공도 실주행 차량. 전자식 댐퍼 및 퀵시프터 정밀 점검 후 15분 만에 전액 송금 종결."
  },
  {
    "slug": "harley-fortyeight-yongin-suji",
    "region": "경기 용인시 수지구",
    "year": "2022년식",
    "brand": "할리데이비슨",
    "model": "포티에잇 XL1200X",
    "category": "크루저",
    "mileage": "8,900km",
    "priceRange": "1,450만~1,650만원",
    "statusText": "반스앤하인즈 숏샷 정식 구변 · 피넛탱크 무흠집",
    "description": "용인 수지 성복동 방문. 합법 구조변경 서류 완비 확인, 특유의 말발굽 배기음과 크롬 상태 극상으로 전국 최고 대우 매입."
  },
  {
    "slug": "harley-fatboy-daegu-dalseo",
    "region": "대구 달서구 월성동",
    "year": "2023년식",
    "brand": "할리데이비슨",
    "model": "팻보이 114",
    "category": "크루저",
    "mileage": "6,100km",
    "priceRange": "2,050만~2,300만원",
    "statusText": "밀워키8 114엔진 · 정품 윈드실드 & 엔진가드",
    "description": "대구 월성동 출장. 솔리드 휠 백화 현상 전혀 없고 차고지에서 소중히 보관된 명차. 전용 특장 리프트로 안전 결박 후 즉시 입금."
  },
  {
    "slug": "harley-iron883-gyeonggi-goyang",
    "region": "경기 고양시 일산동구",
    "year": "2022년식",
    "brand": "할리데이비슨",
    "model": "아이언 883",
    "category": "크루저",
    "mileage": "11,200km",
    "priceRange": "1,050만~1,250만원",
    "statusText": "배터리 방전 시동 불능 상태 · 현장 무상 점프 및 리프트 상차",
    "description": "일산 식사동 지하주차장 방치 차량. 6개월간 시동 미착화로 배터리 방전되었으나 현장 점프 및 엔진 압축 확인 후 헐값 감가 없이 즉시 매입."
  },
  {
    "slug": "rebel500-gyeonggi-hanam-misa",
    "region": "경기 하남시 미사강변",
    "year": "2023년식",
    "brand": "혼다",
    "model": "레블 500",
    "category": "크루저",
    "mileage": "7,300km",
    "priceRange": "530만~580만원",
    "statusText": "다이어블로 커스텀 파츠 & 순정 포크커버 장착",
    "description": "하남 미사 오피스텔 지하 방문. 2030 라이더 인기 1위 기종. 깔끔한 세미 커스텀 상태를 가산 평가하여 감가 없이 전액 지급."
  },
  {
    "slug": "tmax560-seoul-yongsan-hannam",
    "region": "서울 용산구 한남동",
    "year": "2023년식",
    "brand": "야마하",
    "model": "TMAX 560",
    "category": "맥시스쿠터",
    "mileage": "9,800km",
    "priceRange": "1,150만~1,320만원",
    "statusText": "테크맥스 풀옵션 · 열선 시트 & 전자식 크루즈 컨트롤",
    "description": "한남동 고급 주택가 방문. 야마하 플래그십 스쿠터로 벨트 상태 및 소모품 80% 이상 잔여 확인 후 사전 협의 견적 100% 입금."
  },
  {
    "slug": "cbr650r-gyeonggi-suwon-gwanggyo",
    "region": "경기 수원 영통구 광교",
    "year": "2023년식",
    "brand": "혼다",
    "model": "CBR650R",
    "category": "스포츠",
    "mileage": "8,600km",
    "priceRange": "840만~920만원",
    "statusText": "순정 퀵시프터 장착 · 아크라포빅 풀시스템 구변 완료",
    "description": "광교 중흥S클래스 지하 출장. 4기통 배기음 우수 및 카울 제꿍 흔적 전혀 없는 민트급. 차주님과 서류 확인 후 10분 내 매입 종결."
  },
  {
    "slug": "cb650r-incheon-bupyeong",
    "region": "인천 부평구 산곡동",
    "year": "2024년식",
    "brand": "혼다",
    "model": "CB650R",
    "category": "네이키드",
    "mileage": "3,200km",
    "priceRange": "880만~960만원",
    "statusText": "E-클러치 최신 모델 · 무꿍 무사고 1인 신조",
    "description": "인천 부평 아파트 출장. 혼다 E-클러치 전자 변속 정상 작동 확인 및 신차급 컨디션으로 최고 우대 견적 산출 후 계좌 이체."
  },
  {
    "slug": "yzf-r3-incheon-namdong-guwol",
    "region": "인천 남동구 구월동",
    "year": "2023년식",
    "brand": "야마하",
    "model": "YZF-R3",
    "category": "스포츠",
    "mileage": "7,800km",
    "priceRange": "410만~460만원",
    "statusText": "몬스터에너지 GP 데칼 · 프레임 슬라이더 & 조절식 레버",
    "description": "구월동 아파트 지하 방문. 쿼터급 스포츠 입문용 관리 차량으로 타이어 잔여 85% 이상 확인 후 현장 감가 전혀 없이 즉시 정산."
  },
  {
    "slug": "mt03-gyeonggi-anyang-pyeonchon",
    "region": "경기 안양 동안구 평촌",
    "year": "2023년식",
    "brand": "야마하",
    "model": "MT-03",
    "category": "네이키드",
    "mileage": "9,400km",
    "priceRange": "380만~430만원",
    "statusText": "도심 통근용 순정 관리 · 2채널 블랙박스 장착",
    "description": "안양 평촌 학원가 인근 출장. 직궁/슬립 전혀 없는 순정 카울 유지 차량으로 사전 유선 안내 금액 100% 당일 입금."
  },
  {
    "slug": "vespa-gts300-seoul-seocho-banpo",
    "region": "서울 서초구 반포동",
    "year": "2023년식",
    "brand": "베스파",
    "model": "GTS 300",
    "category": "클래식 스쿠터",
    "mileage": "5,100km",
    "priceRange": "460만~510만원",
    "statusText": "HPE 엔진 · 젤리오니 드레스업 & 순정 롱스크린",
    "description": "반포 자이 지하주차장 출장. 스틸 모노코크 바디 무흠집 상태 확인 및 고급 옵션 파츠 가산 평가하여 현장 즉시 전액 송금."
  },
  {
    "slug": "vespa-sprint-seoul-seongdong-seongsu",
    "region": "서울 성동구 성수동",
    "year": "2023년식",
    "brand": "베스파",
    "model": "스프린트 125",
    "category": "클래식 스쿠터",
    "mileage": "4,700km",
    "priceRange": "310만~350만원",
    "statusText": "정품 탑박스 & 순정 키 2개 보유 · 여성 1인 신조",
    "description": "성수동 카페거리 인근 출장. 통근용 실내 보관 차량으로 녹 및 부식 전혀 없음 확인 후 사전 안내 금액 그대로 당일 정산 완료."
  },
  {
    "slug": "ninja400-gyeonggi-gwangmyeong",
    "region": "경기 광명시 일직동",
    "year": "2023년식",
    "brand": "가와사키",
    "model": "닌자 400",
    "category": "스포츠",
    "mileage": "6,900km",
    "priceRange": "490만~550만원",
    "statusText": "KRT 그린 컬러 · 아크라포빅 머플러 구조변경 완료",
    "description": "광명역 써밋플레이스 지하 방문. 2기통 경량 스포츠 베스트셀러로 구변 서류 현장 대조 확인 후 즉시 송금 종결."
  },
  {
    "slug": "zx6r-daejeon-yuseong-bongmyeong",
    "region": "대전 유성구 봉명동",
    "year": "2023년식",
    "brand": "가와사키",
    "model": "ZX-6R",
    "category": "슈퍼스포츠",
    "mileage": "5,800km",
    "priceRange": "1,150만~1,300만원",
    "statusText": "636cc 미들급 끝판왕 · 전자 퀵시프터 & TCS 정상",
    "description": "대전 유성 온천역 인근 방문. 고회전 4기통 사운드 극상, 차주님과 폐지 증명서 확인 후 10분 만에 계좌 이체 완료."
  },
  {
    "slug": "hayabusa-gyeonggi-pyeongtaek-godeok",
    "region": "경기 평택시 고덕동",
    "year": "2023년식",
    "brand": "스즈키",
    "model": "하야부사",
    "category": "하이퍼 투어러",
    "mileage": "4,200km",
    "priceRange": "1,750만~1,950만원",
    "statusText": "3세대 최신형 하야부사 · 무꿍 무슬립 1인 신조",
    "description": "평택 고덕신도시 아파트 지하 방문. 1340cc 궁극의 하이퍼 바이크. 차주님 기변으로 급매 요청에 당일 1시간 만에 출장 인수."
  },
  {
    "slug": "gsxr125-gyeonggi-siheung-jeongwang",
    "region": "경기 시흥시 정왕동",
    "year": "2023년식",
    "brand": "스즈키",
    "model": "GSX-R125",
    "category": "엔트리 스포츠",
    "mileage": "8,300km",
    "priceRange": "270만~310만원",
    "statusText": "ABS 탑재 원동기 최강 스포츠 · 스마트키 2개",
    "description": "시흥 정왕동 한국공대 인근 출장. 학생 차주님 군입대 급매 요청으로 당일 서류 검토 및 전액 송금 완결."
  },
  {
    "slug": "meteor350-chungnam-cheonan-buldang",
    "region": "충남 천안 서북구 불당동",
    "year": "2023년식",
    "brand": "로얄엔필드",
    "model": "메테오 350",
    "category": "크루저",
    "mileage": "5,400km",
    "priceRange": "330만~370만원",
    "statusText": "스텔라 블랙 · 순정 투어링 윈드실드 & 엔진가드",
    "description": "천안 불당 신도시 아파트 방문. 단기통 롱스트로크 고동감 극상 확인 후 현장 감가 없이 약속된 견적 100% 입금."
  },
  {
    "slug": "classic350-gyeongnam-jinju-chopyeong",
    "region": "경남 진주시 충무공동",
    "year": "2023년식",
    "brand": "로얄엔필드",
    "model": "클래식 350",
    "category": "클래식",
    "mileage": "3,900km",
    "priceRange": "340만~380만원",
    "statusText": "헤리티지 감성 클래식 · 스포크 휠 녹 없음",
    "description": "진주 혁신도시 아파트 방문. 실내 보관 차량으로 크롬 및 스포크 휠 상태 신차급. 전자 계약서 작성 후 당일 매입."
  },
  {
    "slug": "goldwing-busan-dongnae-oncheon",
    "region": "부산 동래구 온천동",
    "year": "2023년식",
    "brand": "혼다",
    "model": "골드윙 1800",
    "category": "그랜드 투어러",
    "mileage": "18,900km",
    "priceRange": "2,850만~3,200만원",
    "statusText": "투어 DCT 에어백 탑재 모델 · 풀옵션 크롬 파츠",
    "description": "부산 동래구 온천동 아파트 지하 방문. 6기통 1833cc 끝판왕 투어러. 고가 차량 현금 동원력으로 3천만원대 당일 현장 즉시 송금."
  },
  {
    "slug": "uhr125-incheon-seo-cheongna",
    "region": "인천 서구 청라동",
    "year": "2023년식",
    "brand": "DNA모터스",
    "model": "UHR 125",
    "category": "스쿠터",
    "mileage": "12,600km",
    "priceRange": "190만~220만원",
    "statusText": "2채널 ABS 국산 스마트 스쿠터 · 알존 탑박스 장착",
    "description": "인천 청라 오피스텔 출장. 수랭 엔진 상태 극상 및 프레임 휨 없음 확인 후 사전 유선 견적 100% 지급."
  },
  {
    "slug": "vision110-seoul-gwanak-sillim",
    "region": "서울 관악구 신림동",
    "year": "2023년식",
    "brand": "혼다",
    "model": "비전 110",
    "category": "스쿠터",
    "mileage": "7,400km",
    "priceRange": "150만~175만원",
    "statusText": "스마트키 모델 · 초가성비 통근 스쿠터 1위",
    "description": "신림동 다세대 지하 주차 방문. 타이어 잔여 80% 및 스마트키 2개 보유 확인 후 5분 만에 즉시 전액 송금."
  },
  {
    "slug": "c400gt-gyeonggi-paju-unjeong",
    "region": "경기 파주시 운정동",
    "year": "2023년식",
    "brand": "BMW",
    "model": "C400GT",
    "category": "맥시스쿠터",
    "mileage": "8,200km",
    "priceRange": "640만~710만원",
    "statusText": "트리플 블랙 컬러 · TFT 커넥티비티 계기판 완비",
    "description": "파주 운정 한빛마을 출장. 플렉스케이스 트렁크 센서 정상 확인 및 순정 열선 그립/시트 확인 후 감가 없이 정산."
  },
  {
    "slug": "adv350-jeonbuk-jeonju-hyoja",
    "region": "전북 전주시 완산구 효자동",
    "year": "2023년식",
    "brand": "혼다",
    "model": "ADV 350",
    "category": "어드벤처 스쿠터",
    "mileage": "11,500km",
    "priceRange": "510만~550만원",
    "statusText": "쇼와 도립식 서스펜션 · 정품 스마트 탑박스",
    "description": "전주 효자동 신시가지 출장. 도심과 임도를 겸하는 멀티 스쿠터로 카울 슬립 전혀 없음 확인 후 즉시 입금 완료."
  },
  {
    "slug": "duke390-seoul-yeongdeungpo-yeouido",
    "region": "서울 영등포구 여의도동",
    "year": "2023년식",
    "brand": "KTM",
    "model": "390 듀크",
    "category": "네이키드",
    "mileage": "6,300km",
    "priceRange": "430만~480만원",
    "statusText": "코너링 ABS & TFT 계기판 탑재 · 단기통 펀바이크",
    "description": "여의도 주상복합 지하 출장. WP 서스펜션 누유 없음 확인 및 외관 관리 우수 차량으로 최고가 현장 매입."
  },
  {
    "slug": "bonneville-t120-gyeonggi-gimpo-unyang",
    "region": "경기 김포시 운양동",
    "year": "2023년식",
    "brand": "트라이엄프",
    "model": "본네빌 T120",
    "category": "모던 클래식",
    "mileage": "5,600km",
    "priceRange": "1,350만~1,500만원",
    "statusText": "1200cc HT 트윈 엔진 · 크롬 & 블랙 정통 브리티시 감성",
    "description": "김포 운양동 전원마을 방문. 실내 전용 리프트 보관 차량으로 볼트 하나 부식 없는 최상급 관리 상태 우대 매입."
  },
  {
    "slug": "cb300r-seoul-guro-sindorim",
    "region": "서울 구로구 신도림동",
    "year": "2023년식",
    "brand": "혼다",
    "model": "CB300R",
    "category": "네오 스포츠 카페",
    "mileage": "8,100km",
    "priceRange": "380만~420만원",
    "statusText": "IMU 관성측정 ABS · 초경량 단기통 네이키드",
    "description": "신도림 디큐브시티 인근 출장. 통근용 실사용 차량으로 엔진 필링 양호 및 소모품 충분 잔여 확인 후 즉시 이체."
  },
  {
    "slug": "primavera-gyeonggi-namyangju-dasan",
    "region": "경기 남양주시 다산동",
    "year": "2023년식",
    "brand": "베스파",
    "model": "프리마베라 125",
    "category": "클래식 스쿠터",
    "mileage": "3,800km",
    "priceRange": "290만~330만원",
    "statusText": "화이트 순정 바디 · 순정 롱스크린 & 리어 랙 장착",
    "description": "남양주 다산 신도시 방문. 무사고 1인 신조로 비 한 방울 안 맞힌 실내 보관 차량. 사전 안내 최고가 그대로 지급."
  },
  {
    "slug": "scout-bobber-chungbuk-cheongju-bokdae",
    "region": "충북 청주시 흥덕구 복대동",
    "year": "2022년식",
    "brand": "인디언",
    "model": "스카우트 바버",
    "category": "아메리칸 바버",
    "mileage": "7,400km",
    "priceRange": "1,300만~1,480만원",
    "statusText": "1133cc V트윈 엔진 · 지바 머플러 정식 구변 완료",
    "description": "청주 지웰시티 지하주차장 출장. 매트 블랙 컬러 무흠집 및 합법 배기 사운드 확인 후 현장에서 10분 만에 정산."
  },
  {
    "slug": "grom125-daejeon-donggu-yongjeon",
    "region": "대전 동구 용전동",
    "year": "2023년식",
    "brand": "혼다",
    "model": "MSX 그롬",
    "category": "미니 모토",
    "mileage": "3,100km",
    "priceRange": "250만~280만원",
    "statusText": "5단 미션 최신형 그롬 · 요시무라 슬립온 머플러",
    "description": "대전 복합터미널 인근 출장. 소장용 세컨 바이크로 운용된 A급 상태 확인 후 차주님 계좌로 전액 즉시 이체 완료."
  },
  {
    "slug": "mt09-sp-gyeonggi-hwaseong-dongtan",
    "region": "경기 화성시 동탄신도시",
    "year": "2023년식",
    "brand": "야마하",
    "model": "MT-09 SP",
    "category": "하이퍼 네이키드",
    "mileage": "6,800km",
    "priceRange": "1,180만~1,320만원",
    "statusText": "올린즈 리어 쇽 & KYB 골드 포크 탑재 · 퀵시프터 완비",
    "description": "동탄 린스트라우스 지하 출장. 3기통 크로스플레인 엔진 CP3 사운드 극상 및 전자장비 무에러 확인 후 최고가 매입."
  }
];

/**
 * 당일 날짜(YYYYMMDD) 시드 기반으로 매일 새로운 순서로 랜덤 로테이션되는 출장 매입 실거래 목록
 * - 매일 자정이 지나면 리스트 순서와 기종 조합이 자동으로 교체됩니다.
 * - 중복 기종 방지 및 최신 체감형 일자/시간 문자열이 주입됩니다.
 */
export function getDailyPurchaseCases(limit = 12): PurchaseCase[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  // YYYYMMDD 형태의 일자 시드
  const daySeed = year * 10000 + (month + 1) * 100 + date;

  // LCG 유사 난수 생성기로 배열 셔플 인덱스 생성
  let currentSeed = daySeed;
  const nextRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  // 복사본 생성 후 Fisher-Yates 기반 의사 랜덤 셔플
  const shuffled = [...RAW_PURCHASE_CASES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 중복 기종 방지 필터링 (동일 모델 계열이 하루에 중복 노출되지 않도록 고유 처리)
  const usedModelKeys = new Set<string>();
  const distinctCases: typeof RAW_PURCHASE_CASES = [];

  for (const item of shuffled) {
    const modelKey = item.model.trim().toLowerCase();
    if (usedModelKeys.has(modelKey)) {
      continue;
    }
    usedModelKeys.add(modelKey);
    distinctCases.push(item);
    if (distinctCases.length >= limit) break;
  }

  // 부족한 경우 남은 항목에서 순차 보충
  if (distinctCases.length < limit) {
    for (const item of shuffled) {
      if (!distinctCases.some((c) => c.slug === item.slug)) {
        distinctCases.push(item);
        if (distinctCases.length >= limit) break;
      }
    }
  }

  // 최신 실거래 체감 시간 및 최근 일자 동적 주입
  return distinctCases.slice(0, limit).map((item, idx) => {
    let daysOffset = 0;
    let timeString = "";

    if (idx === 0) {
      daysOffset = 0;
      timeString = "오늘 16:40 정산완료";
    } else if (idx === 1) {
      daysOffset = 0;
      timeString = "오늘 14:15 정산완료";
    } else if (idx === 2) {
      daysOffset = 0;
      timeString = "오늘 11:30 정산완료";
    } else if (idx === 3) {
      daysOffset = 1;
      timeString = "어제 17:20 정산완료";
    } else if (idx === 4) {
      daysOffset = 1;
      timeString = "어제 13:50 정산완료";
    } else if (idx === 5) {
      daysOffset = 2;
      timeString = "2일 전 정산완료";
    } else if (idx === 6) {
      daysOffset = 2;
      timeString = "2일 전 정산완료";
    } else if (idx === 7) {
      daysOffset = 3;
      timeString = "3일 전 정산완료";
    } else if (idx === 8) {
      daysOffset = 4;
      timeString = "4일 전 정산완료";
    } else {
      daysOffset = idx - 4;
      timeString = `${daysOffset}일 전 정산완료`;
    }

    const caseDate = new Date(year, month, date - daysOffset);
    const caseYear = caseDate.getFullYear();
    const caseMonth = String(caseDate.getMonth() + 1).padStart(2, "0");
    const caseDay = String(caseDate.getDate()).padStart(2, "0");
    const dateStr = `${caseYear}.${caseMonth}.${caseDay}`;

    return {
      ...item,
      date: dateStr,
      displayDate: timeString,
    };
  });
}

/**
 * 기본 호환용 정적 리스트 (최신 일자 주입된 12개 기본형)
 */
export const PURCHASE_CASES: PurchaseCase[] = getDailyPurchaseCases(12);

/**
 * 전체 매입 사례 페이지(/cases)용 전체 데이터 (최신 일자 순으로 정렬)
 */
export function getAllPurchaseCases(): PurchaseCase[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  return RAW_PURCHASE_CASES.map((item, idx) => {
    const daysOffset = Math.floor(idx / 2);
    const caseDate = new Date(year, month, date - daysOffset);
    const caseYear = caseDate.getFullYear();
    const caseMonth = String(caseDate.getMonth() + 1).padStart(2, "0");
    const caseDay = String(caseDate.getDate()).padStart(2, "0");
    const dateStr = `${caseYear}.${caseMonth}.${caseDay}`;
    const displayDate = idx === 0 ? "오늘 정산완료" : idx <= 2 ? "어제 정산완료" : `${daysOffset}일 전`;

    return {
      ...item,
      date: dateStr,
      displayDate,
    };
  });
}
