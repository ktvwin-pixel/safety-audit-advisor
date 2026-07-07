const questionInput = document.querySelector("#question");
const answerBtn = document.querySelector("#answerBtn");
const clearBtn = document.querySelector("#clearBtn");
const phaseSelect = document.querySelector("#phase");
const inputTypeSelect = document.querySelector("#inputType");
const interviewToggle = document.querySelector("#interviewToggle");
const deadlineSelect = document.querySelector("#deadlineSelect");
const fileInput = document.querySelector("#fileInput");
const fileStatus = document.querySelector("#fileStatus");
const answerBody = document.querySelector("#answerBody");
const statusText = document.querySelector("#statusText");
const modeBadge = document.querySelector("#modeBadge");
const docxBtn = document.querySelector("#docxBtn");
const pdfBtn = document.querySelector("#pdfBtn");
const googleDocBtn = document.querySelector("#googleDocBtn");
const xlsxBtn = document.querySelector("#xlsxBtn");
const installBtn = document.querySelector("#installBtn");
const promptButtons = document.querySelectorAll(".quick-prompts button");
const orgNameInput = document.querySelector("#orgNameInput");
const orgTypeSelect = document.querySelector("#orgTypeSelect");
const homeUrlInput = document.querySelector("#homeUrlInput");
const lawUrlInput = document.querySelector("#lawUrlInput");
const planUrlInput = document.querySelector("#planUrlInput");
const localContextInput = document.querySelector("#localContextInput");
const saveOrgBtn = document.querySelector("#saveOrgBtn");
const clearOrgBtn = document.querySelector("#clearOrgBtn");
const orgStatus = document.querySelector("#orgStatus");
const memoryInput = document.querySelector("#memoryInput");
const saveMemoryBtn = document.querySelector("#saveMemoryBtn");
const clearMemoryBtn = document.querySelector("#clearMemoryBtn");
const memoryStatus = document.querySelector("#memoryStatus");
const knowledgeStatus = document.querySelector("#knowledgeStatus");

const STORAGE_KEY = "safetyAuditGptsMemory";
const ORG_PROFILE_KEY = "safetyAuditOrgProfile";
const FOOTER = "KOREA CONTENTS LAB | 안전감찰 자문AI";
let lastAnswerTitle = "안전감찰_통합_자문_답변";

const audienceMap = {
  central: {
    label: "중앙정부 관점",
    role: "소관 법령·정책지침의 정합성, 부처 간 조정, 전국 기준의 이행상태를 확인하는 역할"
  },
  local: {
    label: "지방정부 관점",
    role: "조례·규칙, 조직·인력, 현장 집행체계, 재난관리기금 및 안전관리계획의 이행상태를 확인하는 역할"
  },
  joint: {
    label: "공동 대응 관점",
    role: "중앙의 기준과 지방의 집행자료를 대조하여 법령 정합성, 책임 공백, 현장 작동성을 공동 확인하는 역할"
  }
};

const phaseMap = {
  prevention: "예방·점검 단계로 분류됨. 위험 예측, 사전점검, 체크리스트, 예산·인력 배치의 적정성을 우선 검토함.",
  response: "상황 대응 단계로 분류됨. 인지, 최초 조치, 보고, 지휘, 유관기관 협조, 대국민 소통의 시계열을 우선 검토함.",
  audit: "현장 감찰 단계로 분류됨. 문서상 적정성보다 현장 작동 여부, 증거자료, 관계자 진술, 조치 이행상태를 우선 검토함.",
  improvement: "개선·환류 단계로 분류됨. 개선명령, 이행점검, 제도 보완, 예산 반영, 재발방지 지표를 우선 검토함."
};

const examples = {
  "다중이용시설 점검 기준": "다중이용시설 안전점검이 형식적으로 운영된다는 의심이 있음. 건축법, 시설물안전법, 재난안전법 기준으로 감찰 착안사항과 개선명령 구조를 제시하십시오.",
  "재난 대응 매뉴얼 미작동": "재난 대응 매뉴얼은 존재하나 실제 상황에서 보고와 지휘가 지연되었다는 제보가 있음. 상황 인지부터 사후점검까지 감찰 기준을 제시하십시오.",
  "기관 간 책임 공백": "중앙부처, 광역지자체, 기초지자체 사이에 안전관리 책임 공백이 발생한 사안임. 법령 정합성과 역할 분담 기준을 검토하십시오.",
  "사후 개선명령 설계": "사고 이후 개선명령을 작성해야 함. 법적 근거, 담당부서, 기한, 이행점검 지표를 포함한 공문서형 조치계획을 작성하십시오.",
  "보조금·위탁 안전관리": "보조금 사업 및 민간위탁 시설에서 안전관리 책임이 불명확함. 계약·협약서, 감독기관 책무, 예산 집행 관점에서 분석하십시오.",
  "민원·언론 대응": "안전 관련 민원과 언론 보도가 반복됨. 공식자료 확인, 통계 비교, 보완자료 요청, 대국민 신뢰 회복 관점의 감찰 자문을 작성하십시오.",
  "조례 정합성 URL 분석": "https://www.example.go.kr 조례·규칙 및 안전관리계획 공개자료를 기준으로 상위법 정합성, 이행상태, 미비점을 검토하십시오.",
  "피감기관 면담 질문지": "피감기관 담당자 면담을 실시할 예정임. 사실관계, 시점, 근거문서, 결정권자, 보고라인 확인을 위한 질문지와 진술확인서 양식을 작성하십시오.",
  "시설물 사고 면담 질문지": "시설물 사고 관련 인터뷰 질문지 생성. 건축물·시설물 유지관리 기준과 산업안전보건 기준을 구분하고, 사고 전 위험징후, 법정점검, 보수·보강, 도급관리, 작업중지, 사고 직후 대응을 확인할 수 있도록 작성하십시오.",
  "무응답 보완통지서": "면담·자료제출 무응답 상황에 바로 사용할 48시간 보완통지서와 기한 경과 후 2차 재통지, 상급부서 통지, 내부 보고용 에스컬레이션 문구를 공문서형으로 작성하십시오.",
  "다수 진술 비교 매트릭스": "다수 진술 비교분석 매트릭스(xlsx) 권장 열 구조, 코드값, 샘플 진술, 자동 요약 지표를 포함하고 개인정보는 R001 등 익명화 코드 기준으로 처리하십시오.",
  "복지시설 화재 인터뷰": "복지시설 화재 대응 사례 인터뷰 스크립트와 재질문 설계안을 작성하십시오. 노인요양시설, 장애인거주시설, 아동복지시설 등 사회복지시설을 대상으로 인지, 초기조치, 119 신고, 대피, 보고, 사후조치 타임라인을 확인하십시오.",
  "안전감찰 기구·개요": "안전감찰 기구 및 개요를 기준으로 재난관리책임기관 대상, 법적 근거, 역할, 기관경고·징계요구, 재난관리책임기관의 평시·재난시 역할, 안전감찰 범위를 정리하십시오."
};

const legalProfiles = [
  {
    id: "disaster",
    title: "재난·안전관리",
    ministries: ["행정안전부"],
    keywords: ["재난", "안전관리", "상황실", "재난관리기금", "안전관리계획", "지역안전지수"],
    laws: ["재난 및 안전관리 기본법", "자연재해대책법", "지진·화산재해대책법"],
    sources: ["국민재난안전포털", "국립재난안전연구원(NDMI)", "지역안전지수", "생활안전지도(SafeMap)"]
  },
  {
    id: "facility",
    title: "시설·건축 안전",
    ministries: ["국토교통부", "행정안전부"],
    keywords: ["시설", "건축", "다중이용", "붕괴", "승강기", "교량", "터널"],
    laws: ["건축법", "시설물의 안전 및 유지관리에 관한 특별법", "재난 및 안전관리 기본법"],
    sources: ["국토교통부 통계누리", "시설물통합정보관리시스템", "KOSIS"]
  },
  {
    id: "industry",
    title: "산업·에너지 안전",
    ministries: ["산업통상자원부", "고용노동부"],
    keywords: ["산업", "공장", "전기", "가스", "에너지", "산업단지", "중대재해"],
    laws: ["산업안전보건법", "전기사업법", "고압가스 안전관리법"],
    sources: ["산업안전보건공단", "KOSIS", "산업통상자원부 통계"]
  },
  {
    id: "food",
    title: "식품·보건 안전",
    ministries: ["식품의약품안전처", "보건복지부"],
    keywords: ["식품", "급식", "위생", "감염병", "의료", "보건", "복지시설"],
    laws: ["식품위생법", "감염병의 예방 및 관리에 관한 법률", "사회복지사업법"],
    sources: ["식품의약품안전처", "보건복지부 통계포털", "KOSIS"]
  },
  {
    id: "agri",
    title: "농림·축산 안전",
    ministries: ["농림축산식품부"],
    keywords: ["농림", "축산", "가축", "가축전염병", "농어업재해", "방역"],
    laws: ["농어업재해대책법", "가축전염병예방법", "농수산물 품질관리법"],
    sources: ["농림축산식품부 재해대책 통계", "KOSIS", "농림축산검역본부"]
  },
  {
    id: "marine",
    title: "해양·수산 안전",
    ministries: ["해양수산부"],
    keywords: ["해양", "수산", "항만", "어항", "해양환경", "선박", "연안"],
    laws: ["해양환경관리법", "항만법", "어촌·어항법"],
    sources: ["해양수산부 통계", "해양환경정보포털", "KOSIS"]
  },
  {
    id: "gender",
    title: "성평등·가족·보호체계",
    ministries: ["여성가족부(성평등가족부)"],
    keywords: ["여성", "가족", "청소년", "성평등", "보호", "시설"],
    laws: ["양성평등기본법", "청소년복지 지원법", "가정폭력방지 및 피해자보호 등에 관한 법률"],
    sources: ["여성가족부 통계", "KOSIS", "공공데이터포털"]
  }
];

const checklistItems = [
  "목적·범위·대상기관이 특정되어 있는지 확인할 것",
  "관련 법령·조례·지침의 조문 번호가 병기되어 있는지 확인할 것",
  "점검표, 위험도 평가, 증거자료, 통계 출처가 구분되어 있는지 확인할 것",
  "개선조치의 담당부서, 기한, 이행점검 방식이 특정되어 있는지 확인할 것",
  "개인정보 및 민감정보가 익명화 또는 가림 처리되어 있는지 확인할 것"
];

const facilityAccidentInterviewBackdata = {
  title: "시설물 사고 면담 질문지(건축·산안 기준)",
  triggerKeywords: ["시설물 사고", "건축", "산안", "산업안전", "추락", "붕괴", "전도", "낙하", "작업발판", "개구부", "보수공사", "유지관리"],
  scope: [
    "붕괴·전도·낙하·추락·개구부 사고·작업발판 사고·보수공사 중 사고를 공통 대상으로 함.",
    "면담 목적은 책임 추궁이 아니라 사고 전 위험징후 인지, 법정 점검·보수·안전조치 이행, 보고·결재·도급관리 체계, 사고 직후 대응 적정성 확인에 둠.",
    "면담 기록은 R001, R002 또는 관리자1, 작업자1 방식으로 익명화하여 관리할 것."
  ],
  respondentGroups: [
    "A. 시설물 소유자·관리자: 정기점검, 긴급점검, 보수·보강, 예산, 사용승인 이후 변경사항 확인",
    "B. 현장 관리자·안전관리자: 위험성평가, 작업계획, 작업중지, 보호구, 추락·붕괴 방지조치 확인",
    "C. 유지보수·시공·용역업체: 작업방법, 작업지휘자, 사전점검, 구조변경·하중관리 확인",
    "D. 설계·감리·점검기관: 설계도서, 구조안전 검토, 점검결과, 지적사항 조치 확인",
    "E. 최초 발견자·목격자: 사고 시각, 위치, 작업상태, 이상징후, 즉시조치 확인",
    "F. 결재권자·상급부서: 보고라인, 의사결정, 예산·인력 배정, 재발방지 대책 확인"
  ],
  legalBasis: [
    "건축물관리법 제13조: 건축물 안전과 기능 유지를 위한 정기점검 실시 및 건축물관리계획 수립·이행 여부 확인",
    "건축물관리법 시행령 제9조: 붕괴·전도 위험 또는 안전한 이용에 중대한 영향 우려가 있는 경우 긴급점검 사유 검토",
    "시설물의 안전 및 유지관리에 관한 특별법: 제1종·제2종·제3종시설물별 정기안전점검·정밀안전점검·정밀안전진단 및 결과보고 체계 확인",
    "산업안전보건법 제38조: 추락·붕괴·낙하 위험 장소 등에 대한 산업재해 예방조치 확인",
    "산업안전보건기준에 관한 규칙 제42조: 작업발판, 추락방호망, 안전대 착용 등 추락방지 조치 확인",
    "중대재해 처벌 등에 관한 법률 제4조 및 시행령 제4조: 안전보건관리체계, 인력·예산, 재발방지대책, 도급·용역·위탁 기준 확인"
  ],
  commonQuestions: [
    "Q-01. 사고를 최초로 인지한 시각은 언제인지 YYYY-MM-DD HH:MM 기준으로 확인할 것. 증빙은 119 신고기록, CCTV, 상황보고서로 대조할 것.",
    "Q-02. 사고 발생 장소를 건물명, 층, 구역, 설비명, 작업위치 기준으로 특정할 것. 평면도·현장사진·작업구역도를 요청할 것.",
    "Q-03. 사고 당시 수행 중이던 작업 또는 이용행위를 작업명, 작업자, 작업지휘자, 작업허가 여부 기준으로 확인할 것.",
    "Q-04. 사고 전 균열, 처짐, 누수, 진동, 소음, 변형, 부식 등 이상징후가 있었는지 확인할 것.",
    "Q-05. 사고 전 마지막 정기점검 또는 자체점검의 일자, 점검자, 기준, 지적사항, 조치완료일을 확인할 것.",
    "Q-06. 사고 부위가 과거 보수·보강·증축·용도변경·하중변경 대상이었는지 확인할 것.",
    "Q-07. 사고와 관련된 위험성평가 또는 사전 위험요인 확인 절차가 있었는지 확인할 것.",
    "Q-08. 사고 당일 작업 전 안전교육 또는 TBM이 있었는지 교육자, 교육시간, 참석자 서명 기준으로 확인할 것.",
    "Q-09. 작업발판, 안전난간, 개구부 덮개, 추락방호망, 안전대 등 추락방지 조치가 실제 설치·착용되었는지 확인할 것.",
    "Q-10. 하중관리, 적재 제한, 출입통제, 작업중지 권한자, 사고 직후 대피·구호·현장보존 조치를 T0~T5 타임라인으로 재구성할 것."
  ],
  buildingQuestions: [
    "B-01. 사용승인일, 주용도, 층수, 연면적, 구조형식을 건축물대장·설계도서와 대조할 것.",
    "B-02. 사고 부위가 사용승인 당시 설계도서와 동일하게 유지되었는지, 임의 변경·철거·증설·하중 증가 여부를 확인할 것.",
    "B-03. 최근 3년간 정기점검, 긴급점검, 안전점검, 정밀안전점검 또는 정밀안전진단 내역을 확인할 것.",
    "B-04. 구조안전, 화재안전, 건축설비 항목의 부적합·주의·보수필요 판정과 조치 완료 여부를 확인할 것.",
    "B-05. 균열·처짐·누수·철근노출·콘크리트 박락·부식 등 결함 발견 시 보고라인과 후속조치를 확인할 것.",
    "B-06. 붕괴·전도 위험 인지 후 긴급점검 필요성을 검토한 사실이 있는지 확인할 것.",
    "B-07. 보수·보강 예산 요구·편성 여부와 사고 부위 주변 출입통제·하중제한·사용제한 조치 여부를 확인할 것."
  ],
  safetyQuestions: [
    "S-01. 사고 작업에 대한 작업계획서 또는 작업절차서 작성 여부를 확인할 것.",
    "S-02. 작업 시작 전 작업장소와 주변 상태를 바닥, 개구부, 구조물, 적재물 기준으로 점검하였는지 확인할 것.",
    "S-03. 안전난간, 덮개, 작업발판, 추락방호망, 안전대 조치의 실제 설치·착용 여부를 사진·점검표로 확인할 것.",
    "S-04. 작업발판 또는 비계 사용 시 최대적재하중, 고정상태, 점검·보수 여부 및 임의해체 여부를 확인할 것.",
    "S-05. 붕괴·전도·낙하 위험 구조물 또는 자재 적치물에 대한 위험구역 설정과 출입통제를 확인할 것.",
    "S-06. 작업지휘자의 지정 및 현장 상주 여부, TBM·안전교육의 실효성을 확인할 것.",
    "S-07. 원청과 수급인 간 위험정보 공유, 안전보건협의체, 합동점검, 도급관리 책임을 확인할 것.",
    "S-08. 사고 직후 동일·유사 작업 중지와 추가 위험요인 제거 여부를 확인할 것."
  ],
  evasiveReplies: [
    "“정확히 기억나지 않습니다.” → “기억에 의존한 답변은 보류하고, 해당 사실을 확인할 수 있는 문서명·담당자·보관부서를 특정해 주시기 바랍니다.”",
    "“업체가 알아서 했습니다.” → “업체에 위임한 업무범위와 발주기관 또는 원청의 확인·승인 절차를 구분하여 답변해 주시기 바랍니다.”",
    "“관행적으로 해왔습니다.” → “관행이 아닌 내부규정, 작업절차서, 결재문서 또는 회의록 기준으로 확인하겠습니다.”",
    "“위험하다고 생각하지 않았습니다.” → “그 판단의 근거가 된 점검결과, 전문가 의견, 현장확인 기록이 있는지 확인해 주시기 바랍니다.”",
    "“보고받은 적 없습니다.” → “보고체계상 귀하에게 보고되어야 하는 기준과 실제 미보고 사유를 구분하여 확인하겠습니다.”",
    "“조치 중이었습니다.” → “조치계획 수립일, 착수일, 완료예정일, 지연사유, 담당자, 예산확보 여부를 특정해 주시기 바랍니다.”"
  ],
  evidenceRequest: [
    "건축물대장, 사용승인도서, 구조도면, 설비도면",
    "최근 3년간 정기점검·안전점검·정밀안전점검·정밀안전진단 보고서",
    "사고 부위 보수·보강 이력, 예산요구서, 계약서, 준공서류",
    "사고 당일 작업계획서, 작업허가서, 위험성평가표, TBM 기록",
    "작업자 명단, 출입기록, 교육일지, 보호구 지급대장",
    "사고 전 민원·제보·내부보고·사진·CCTV 자료",
    "사고 직후 상황보고서, 119 신고기록, 응급조치 및 현장보존 기록",
    "도급·용역 계약서, 안전보건협의체 회의록, 합동점검 기록",
    "재발방지대책, 유사 시설물 확대점검 계획"
  ],
  immediateActions: [
    "사고 부위 및 유사 위험부위는 현장 확인 전까지 사용·출입·작업을 제한할 것.",
    "사고 전후 현장사진, CCTV, 작업일보, 점검보고서, 결재문서 원본을 보존할 것.",
    "동일 구조·동일 용도·동일 작업방식 시설물에 대해 긴급 육안점검을 실시할 것.",
    "위험성평가, 작업계획서, 작업허가서, 도급관리 문서를 대조하여 누락 여부를 확인할 것.",
    "면담은 개인별 분리 방식으로 실시하고, 다수 면담자는 동일 질문ID 체계로 비교할 것."
  ]
};

const nonResponseNoticeBackdata = {
  title: "무응답 대비 보완통지서(48시간) 및 에스컬레이션 문구",
  triggerKeywords: ["무응답", "미제출", "보완통지", "재통지", "에스컬레이션", "48시간", "자료제출", "보완답변", "비협조", "상급부서 통지"],
  overview: [
    "적용 대상은 면담 당일 즉답 곤란, 자료 미제출, 답변 유보, 48시간 경과 후 미제출 또는 일부 제출, 반복 지연·장기 미제출 상황으로 한정함.",
    "본 문안은 제재 통보가 아니라 사실관계 확인 및 의견·자료 제출 기회 부여 문서로 설계함.",
    "정당한 사유 없는 불응 여부는 비위 확정이 아니라 확인 지연·자료 미제출 경과로 기록하는 방식이 적정함.",
    "제재성 표현은 기관 권한 및 내부 규정 확인을 전제로 신중히 제한할 것."
  ],
  legalBasis: [
    "공공감사에 관한 법률 제20조: 자체감사에 필요한 경우 출석·답변 요구, 관계 서류·장부·물품 제출 요구가 가능하되 감사에 필요한 최소한도에 그쳐야 하며, 요구받은 대상기관 및 소속 공무원·직원은 정당한 사유가 없으면 따라야 함.",
    "행정절차법 제27조: 당사자 등은 서면·구술 또는 정보통신망으로 의견을 제출할 수 있고, 주장 입증을 위한 증거자료를 첨부할 수 있으므로 의견제출 기회 보장 취지를 준용할 수 있음.",
    "개인정보 보호법 제3조 및 제16조: 개인정보 처리 목적을 명확히 하고 필요한 범위에서 최소한의 개인정보만 적법·정당하게 수집하여야 함.",
    "공무원 행동강령상 공정한 직무수행 원칙을 고려하여 감정적 압박, 모욕적 표현, 단정적 책임 추궁 문구를 배제할 것."
  ],
  stages: [
    "1단계 보완통지서: 수신 후 48시간 이내 보완답변서 및 증빙자료 제출 요구",
    "2단계 재통지서: 48시간 경과 후 미제출 또는 일부 제출 시 추가 24~48시간 기한 부여",
    "3단계 에스컬레이션 통지: 반복 지연·무응답·장기 미제출 시 비협조 사실 기록, 상급부서 통지, 현장확인 전환 검토",
    "4단계 내부 보고: 비협조 정황 및 감찰 지연 위험을 감사책임자에게 보고"
  ],
  firstNotice: [
    "문서번호: 안전감찰-____",
    "시행일자: 20__. __. __.",
    "수신: ○○기관장 / ○○부서장 / ○○담당자",
    "참조: 감사담당관 / 안전총괄과장",
    "제목: 안전감찰 관련 보완답변 및 증빙자료 제출 요청",
    "귀 기관의 업무 협조에 감사드립니다.",
    "우리 기관은 「○○ 안전감찰 계획」에 따라 [감찰명: ○○ 분야 안전관리 실태 감찰]을 실시 중이며, 20__. __. __. 실시한 면담 및 자료 확인 과정에서 아래 사항에 대한 추가 확인이 필요함을 알려드립니다.",
    "아래 사항은 사실관계 확정 및 관련 증빙 확인을 위한 보완 요청이며, 귀 기관의 의견 제출 및 소명 기회를 보장하기 위한 절차입니다. 귀 기관은 본 통지를 받은 때부터 48시간 이내에 보완답변서 및 관련 증빙자료를 제출하여 주시기 바랍니다.",
    "정당한 사유 없이 기한 내 보완답변 또는 증빙자료가 제출되지 않는 경우, 해당 사항은 감찰 절차상 미제출·무응답 사항으로 기록될 수 있으며, 필요 시 상급부서 통지, 추가 현장확인, 관계자 재면담 등 후속 확인 절차로 전환될 수 있음을 알려드립니다.",
    "본 요청은 사실관계 확인을 위한 절차로서, 제출자료 및 면담 내용은 감찰 목적 범위 내에서 관리하며, 개인정보 및 비공개 정보는 관계 법령과 내부 보안기준에 따라 처리할 예정입니다."
  ],
  requestedMaterials: [
    "사건 인지 시점 및 최초 조치 경위: 상황보고서, 내부 메모, 근무일지 등",
    "보고 및 결재 경로: 결재문서, 전자문서번호, 회의록",
    "조치 결정권자 및 실행자: 업무분장표, 지시사항, 조치결과",
    "사후점검 및 재발방지 조치: 점검표, 개선계획, 이행사진",
    "미제출 또는 확인 불가 사유: 사유서, 제출 가능 예정일"
  ],
  submissionRules: [
    "개인정보가 포함된 자료는 사건 확인에 필요한 최소 범위로 한정하고, 주민등록번호·연락처·주소 등 직접 식별정보는 원칙적으로 가림 처리할 것.",
    "문서번호, 작성일자, 결재선, 담당부서가 확인되도록 제출할 것.",
    "제출이 곤란한 자료가 있는 경우에는 그 사유와 대체 가능한 증빙자료를 함께 제출할 것.",
    "기한 내 제출이 불가피하게 어려운 경우에는 제출기한 만료 전까지 지연 사유 및 제출 가능 일시를 서면으로 통보할 것."
  ],
  answerForm: [
    "감찰명, 기관명, 작성자, 작성일시, 질의번호를 기재할 것.",
    "보완답변 요지, 관련 시점, 관련 장소, 관련 행위, 결정권자, 실행자, 보고라인을 구분하여 작성할 것.",
    "근거문서 ID는 문서번호, 회의록명, 보고서명 등 식별 가능한 형태로 기재할 것.",
    "첨부자료 목록, 미제출 자료 및 사유, 추가 제출 가능일을 병기할 것.",
    "확인 문구는 “위 내용은 사실관계 확인을 위하여 작성·제출함.”으로 둘 것."
  ],
  secondNotice: [
    "제목: 안전감찰 관련 보완답변 및 증빙자료 제출 재통지",
    "우리 기관은 20__. __. __. 문서번호 안전감찰-____호로 귀 기관에 대하여 [감찰명] 관련 보완답변 및 증빙자료 제출을 요청한 바 있습니다.",
    "그러나 20__. __. __. __:__ 현재까지 요청자료의 전부 또는 일부가 제출되지 않았거나, 제출자료만으로는 사실관계 확인이 곤란한 상태입니다.",
    "이에 귀 기관에 최종 보완기회를 부여하오니, 아래 자료를 20__. __. __. __:__까지 제출하여 주시기 바랍니다.",
    "위 기한까지 정당한 사유 없이 자료가 제출되지 않을 경우, 해당 사항은 기한 내 미제출 및 감찰 확인 지연 사항으로 감찰기록에 편철할 예정이며, 필요 시 관계자 재면담, 현장확인, 상급부서 통지 등 후속 절차를 진행할 수 있음을 알려드립니다.",
    "자료 제출이 제한되는 법령상 사유, 보안상 사유 또는 문서 부존재 사유가 있는 경우에는 그 사유를 구체적으로 기재한 사유서를 같은 기한 내 제출하여 주시기 바랍니다."
  ],
  escalationNotice: [
    "제목: 안전감찰 자료 미제출·무응답 사항 통지 및 협조 요청",
    "우리 기관은 [감찰명]과 관련하여 ○○부서에 20__. __. __. 1차 보완요청 및 20__. __. __. 2차 재통지를 실시하였으나, 20__. __. __. 현재까지 요청자료가 제출되지 않았거나 제출내용이 불충분하여 사실관계 확정에 지장이 발생하고 있습니다.",
    "본 건은 감찰 결과의 객관성 확보 및 피감기관의 소명기회 보장을 위하여 필요한 자료 제출 절차이나, 반복적인 기한 경과로 감찰 일정 및 사실관계 확인에 차질이 우려됩니다.",
    "귀 부서에서는 관련 부서가 요청자료를 즉시 제출하거나, 제출이 곤란한 경우 그 사유와 대체 증빙자료를 서면으로 제출하도록 조치하여 주시기 바랍니다.",
    "정당한 사유 없는 미제출 또는 무응답이 계속되는 경우, 해당 경과는 감찰보고서의 자료 미제출·확인 지연 경위로 기록하고, 필요 시 현장확인 또는 관계자 추가 면담으로 전환할 예정입니다."
  ],
  internalReport: [
    "제목: 안전감찰 관련 피감부서 무응답 경과 보고",
    "보고사항: ○○부서의 보완답변 및 증빙자료 미제출 경과 보고",
    "경과: 관계자 면담 실시, 1차 보완통지 48시간 기한 부여, 2차 재통지 추가 제출기한 부여, 현재 요청자료 미제출 또는 일부 미제출 상태 지속",
    "미제출 핵심자료: 사건 인지 시점 확인자료, 최초 보고 및 결재문서, 조치 결정권자 확인자료, 현장점검 결과 및 사후관리 자료",
    "검토의견: 감찰대상 사실관계의 핵심 구성요소인 시점, 행위, 결정권자, 근거문서 확인에 필요한 자료가 제출되지 않은 사안임. 기한 내 보완기회가 부여되었음에도 정당한 사유가 확인되지 않을 경우, 자료 미제출 경과를 감찰기록에 편철하고 상급부서 통지 또는 현장확인 전환이 필요함.",
    "조치건의: 부서장 명의 협조 촉구 통지, 관계자 재면담 일정 지정, 전자문서시스템상 관련 문서 현장확인, 미제출 사유서 징구, 향후 감찰보고서에 자료 미제출 경과 및 확인 한계 명시"
  ],
  fieldNotice: [
    "금번 면담은 사실관계 확인을 위한 절차로서, 귀하의 인격권을 존중하며 비공개로 진행함.",
    "즉시 답변이 곤란한 사항은 금일 구두로 확인 가능한 범위에서 시점, 장소, 행위, 결정권자, 근거문서 유무를 우선 확인하고, 나머지 사항은 별도 보완통지에 따라 48시간 이내 서면으로 제출하도록 안내하겠음."
  ],
  recordPhrase: [
    "질의 Q-__에 대하여 피면담자는 면담 당일 즉답이 곤란하다고 진술하였으며, 감찰반은 20__. __. __. __:__까지 서면 보완답변 및 증빙자료를 제출하도록 통지하였음.",
    "다만, 제출기한 경과 후에도 정당한 지연 사유 또는 보완자료가 제출되지 않아 해당 사항을 미제출·무응답 항목으로 기록함."
  ],
  limitedStrongPhrase: [
    "본 통지는 사실관계 확인 및 소명기회 부여를 위한 절차임.",
    "다만, 반복적인 미제출 또는 무응답으로 감찰 수행에 중대한 지장이 발생하는 경우, 해당 경과는 감찰기록 및 결과보고서에 반영될 수 있으며, 필요 시 기관 내부 규정에 따른 후속 조치 검토 대상이 될 수 있음.",
    "“징계 조치 예정”, “문책 확정”, “비위 인정” 등 단정 표현은 사용하지 않는 것이 적정함."
  ]
};

const statementMatrixTemplate = {
  title: "다수 진술 비교분석 매트릭스(xlsx)",
  triggerKeywords: ["다수 진술", "비교 매트릭스", "비교분석 매트릭스", "xlsx", "합치율", "불일치유형", "무응답률", "RespondentID"],
  sheets: ["Statements", "Codebook", "QuestionMap", "Summary"],
  columns: [
    ["CaseID", "CASE-2026-001", "사건/감찰 건 번호"],
    ["RespondentID", "R001", "익명화 코드"],
    ["부서", "안전총괄과", "개인정보 최소화"],
    ["직위", "팀장", "성명 대신 직위 중심"],
    ["질문ID", "Q01", "질문 단위 관리"],
    ["질문문구", "최초 인지 시점은 언제입니까", "표준 질문"],
    ["답변요지", "2026-06-10 09:30경 민원 접수로 인지함", "핵심 진술"],
    ["시점_ISO", "2026-06-10 09:30", "날짜 형식 통일"],
    ["장소", "재난상황실", "표준명 기재"],
    ["행위분류", "인지", "인지/보고/결정/시행/점검"],
    ["근거문서ID", "DOC-001", "공문, 회의록, 보고서 번호"],
    ["결정권자", "안전총괄국장", "직위 기준"],
    ["보고라인", "담당자→팀장→과장→국장", "보고 체계"],
    ["일치불일치코드", "일치", "일치/부분불일치/상충/확인불가"],
    ["불일치유형", "없음", "시점/장소/행위/근거/책임"],
    ["신뢰도코드", 3, "1 낮음, 2 보통, 3 높음"],
    ["보완필요", "N", "Y/N"],
    ["보완기한", "", "필요 시 YYYY-MM-DD HH:MM"],
    ["응답소요분", 12, "평균 응답시간 산출"],
    ["비고", "근거문서 확인 완료", "내부 검토 메모"]
  ],
  statements: [
    ["CASE-2026-001", "R001", "안전총괄과", "팀장", "Q01", "최초 인지 시점은 언제입니까", "2026-06-10 09:30경 민원 접수로 인지함", "2026-06-10 09:30", "재난상황실", "인지", "DOC-001", "과장", "담당자→팀장→과장", "일치", "없음", 3, "N", "", 12, "근거문서 확인 완료"],
    ["CASE-2026-001", "R002", "안전총괄과", "주무관", "Q01", "최초 인지 시점은 언제입니까", "2026-06-10 09:35경 팀장에게 보고함", "2026-06-10 09:35", "재난상황실", "보고", "DOC-001", "과장", "담당자→팀장→과장", "부분불일치", "시점", 2, "Y", "2026-06-12 18:00", 14, "시점 보완 필요"],
    ["CASE-2026-001", "R003", "도로관리과", "과장", "Q01", "최초 인지 시점은 언제입니까", "2026-06-10 10:00경 안전총괄과 연락으로 인지함", "2026-06-10 10:00", "도로관리과", "인지", "DOC-002", "국장", "과장→국장", "부분불일치", "시점", 2, "Y", "2026-06-12 18:00", 18, "인지 경로 확인 필요"],
    ["CASE-2026-001", "R001", "안전총괄과", "팀장", "Q02", "최초 조치 내용은 무엇입니까", "현장확인 지시 및 사진 제출 요청을 하였음", "2026-06-10 09:45", "재난상황실", "조치", "DOC-003", "과장", "팀장→과장", "일치", "없음", 3, "N", "", 10, "근거문서 확인 완료"],
    ["CASE-2026-001", "R002", "안전총괄과", "주무관", "Q02", "최초 조치 내용은 무엇입니까", "현장 담당자에게 전화 후 사진을 요청함", "2026-06-10 09:47", "사무실", "조치", "DOC-003", "팀장", "담당자→팀장", "일치", "없음", 3, "N", "", 11, "근거문서 확인 완료"],
    ["CASE-2026-001", "R003", "도로관리과", "과장", "Q02", "최초 조치 내용은 무엇입니까", "별도 지시를 받은 기억은 없으며 현장 확인은 오후에 실시함", "2026-06-10 13:20", "현장", "조치", "없음", "과장", "과장 자체판단", "상충", "행위/근거", 1, "Y", "2026-06-12 18:00", 22, "근거문서 미제출"]
  ],
  codebook: [
    ["구분", "코드값", "의미"],
    ["일치불일치코드", "일치", "다수 진술 및 문서가 일치"],
    ["일치불일치코드", "부분불일치", "핵심 사실은 같으나 시점·장소 등 일부 차이"],
    ["일치불일치코드", "상충", "핵심 사실관계가 서로 배치"],
    ["일치불일치코드", "확인불가", "진술 또는 근거문서 부족"],
    ["신뢰도코드", "1", "근거문서 없음, 진술 모호"],
    ["신뢰도코드", "2", "일부 근거 있음"],
    ["신뢰도코드", "3", "문서·다수 진술로 확인"],
    ["보완필요", "Y", "추가 자료 또는 재면담 필요"],
    ["보완필요", "N", "현 단계 보완 불필요"]
  ],
  questionMap: [
    ["질문ID", "질문문구", "핵심 확인요소", "권장 증빙"],
    ["Q01", "최초 인지 시점은 언제입니까", "인지 시각, 인지 경로, 최초 보고자", "민원접수대장, 상황보고서, CCTV, 통화기록"],
    ["Q02", "최초 조치 내용은 무엇입니까", "조치 시각, 지시자, 실행자, 현장확인 여부", "작업지시서, 현장사진, 보고문서"],
    ["Q03", "결정권자와 보고라인은 어떻게 됩니까", "결정권자, 결재선, 보고 지연 여부", "결재문서, 업무분장표, 회의록"],
    ["Q04", "근거문서는 무엇입니까", "문서번호, 작성일, 보관부서", "공문, 회의록, 점검표, 전자문서번호"]
  ]
};

const welfareFireInterviewBackdata = {
  title: "복지시설 화재 대응 사례 인터뷰 스크립트·재질문 설계",
  triggerKeywords: ["복지시설", "사회복지시설", "노인요양시설", "장애인거주시설", "아동복지시설", "사회복지관", "지역아동센터", "화재", "소방계획서", "피난계획서", "자위소방대", "119 신고", "대피유도"],
  scope: [
    "노인요양시설, 장애인거주시설, 아동복지시설, 사회복지관, 지역아동센터 등 사회복지시설 전반을 대상으로 함.",
    "화재 대응의 적정성을 인지 시점, 초기 조치, 119 신고, 대피 유도, 내부 보고, 지휘·결정, 외부기관 인계, 사후 조치의 시간순으로 재구성함.",
    "입소자·보호자·종사자 정보는 감찰 목적상 필요한 최소 범위에서 확인하고 보고서에는 시설장 A, 당직자 B, 이용자 C 방식으로 익명화함."
  ],
  evidence: [
    "소방계획서",
    "피난계획서",
    "자위소방대 편성표",
    "야간·휴일 근무표",
    "소방훈련·교육 기록",
    "소방시설 자체점검 결과",
    "119 신고기록",
    "CCTV·출입통제 기록",
    "입소자 현황 및 이동지원 필요자 명단",
    "지자체 지도점검·보완명령 이행자료"
  ],
  legalBasis: [
    "재난 및 안전관리 기본법 제34조의5: 재난유형별 위기관리 매뉴얼 작성·운용 및 재난대응활동계획 연계 여부 확인",
    "사회복지사업법 제34조의4 및 시행령 제18조의4: 사회복지시설 정기·수시 안전점검 체계, 반기 정기안전점검 실시 여부 확인",
    "화재의 예방 및 안전관리에 관한 법률 제24조제5항: 소방계획서, 자위소방대, 초기대응체계, 피난시설 관리, 소방훈련·교육, 화재 발생 시 초기대응 업무 확인",
    "화재의 예방 및 안전관리에 관한 법률 제36조: 소방안전관리대상물 피난계획 수립·시행 여부 확인",
    "화재의 예방 및 안전관리에 관한 법률 제37조: 소방훈련·교육 실시 및 소방본부장·소방서장의 지도·감독 근거 확인",
    "소방시설 설치 및 관리에 관한 법률 제22조: 특정소방대상물 관계인의 소방시설등 자체점검 의무 및 지적사항 보완 여부 확인",
    "행정절차법 및 개인정보 보호법: 사실확인 목적의 면담, 의견제출 기회 보장, 개인정보 최소수집·익명화 원칙 적용"
  ],
  introScript: [
    "금번 면담은 ○○복지시설 화재 대응 사례에 대한 사실관계 확인 절차임. 면담은 비공개로 진행하며, 귀하의 인격권을 존중함.",
    "본 면담의 목적은 책임을 예단하기 위한 것이 아니라, 화재 인지부터 대피·신고·보고·사후조치까지의 실제 경과와 근거자료를 확인하는 데 있음.",
    "답변이 곤란한 사항은 즉시 추정하여 답변하지 말고, 확인 가능한 문서·기록을 특정해 주시기 바람.",
    "질문은 시간, 장소, 행위, 근거문서, 결정권자 순으로 확인함. 말씀하신 내용은 면담 종료 전 요지를 다시 읽어드리고, 사실관계에 오류가 있는지 확인하겠음."
  ],
  timelineQuestions: [
    "T0-Q1. 화재 또는 연기·냄새·경보를 최초로 인지한 사람과 인지 시각을 확인함. 시각은 CCTV, 자동화재탐지설비 수신기, 근무일지 중 어느 기록을 기준으로 한 것인지 재확인할 것.",
    "T0-Q2. 최초 인지 장소와 발화 추정 지점과의 거리를 확인함. ○층 ○호실, 복도, 주방, 보일러실 등 표준 장소명으로 특정할 것.",
    "T1-Q3. 최초 인지 후 가장 먼저 수행한 조치를 확인함. 소화기 사용, 경보 전파, 119 신고, 입소자 이동 중 무엇이 먼저였는지 순서대로 확인할 것.",
    "T1-Q4. 초기소화 시 사용한 소화설비, 사용자, 사용 횟수, 실패 또는 중단 시각을 특정할 것.",
    "T2-Q5. 119 신고자, 신고시각, 신고내용, 119 신고기록 또는 통화녹취 확인 가능 여부와 관리부서를 특정할 것.",
    "T2-Q6. 내부 전파 방식이 비상방송, 무전, 전화, 구두전파, 단체메신저 중 무엇인지 구분할 것.",
    "T3-Q7. 대피 유도 개시시각과 대피 우선순위를 와상, 휠체어, 인지장애, 아동, 자력대피 가능자별로 구분하여 확인할 것.",
    "T3-Q8. 피난경로와 집결지가 사전 피난계획서와 일치했는지, 달랐다면 변경 결정자와 변경 사유를 특정할 것.",
    "T3-Q9. 방화문, 자동문, 승강기, 피난계단, 유도등의 작동 여부를 목격자 진술이 아닌 점검기록·CCTV·설비기록 기준으로 확인할 것.",
    "T4-Q10. 현장 지휘자와 지휘권 인계 시점을 시설장, 소방안전관리자, 당직책임자, 출동 소방대별로 구분할 것.",
    "T4-Q11. 법인, 지자체, 보호자, 유관기관 보고의 보고시각, 보고수단, 수신자, 보고내용을 표로 제출 가능한지 확인할 것.",
    "T5-Q12. 인명피해 확인, 응급처치, 임시보호, 보호자 통보를 대상자별 조치시각, 담당자, 이송기관, 보호자 통보시각 기준으로 익명화 제출하도록 할 것.",
    "T5-Q13. 화재 후 자체 원인분석 및 재발방지대책의 문서명, 문서번호, 결재일, 결재선, 미완료 과제를 특정할 것."
  ],
  respondentScripts: [
    "시설장 또는 법인 책임자: 사건 보고 시각, 보고자, 직접 지시사항, 대피·보호자 통보·지자체 보고·언론 대응·임시보호 조치의 결정자와 위임사항을 구분할 것.",
    "소방안전관리자 또는 안전관리책임관: 소방계획서상 역할과 실제 수행 역할, 자위소방대 편성표상 담당자의 실제 근무 여부, 피난계획서상 대피보조 필요자 명단 최신성, 자체점검 결과와 화재 당일 설비 작동상태의 불일치 여부를 확인할 것.",
    "최초 발견자 또는 당직자: 직접 본 사실과 들은 사실을 구분하고, 119 신고·내부전파·초기소화·대피유도 중 최초 행동을 확인할 것.",
    "대피유도 담당 종사자: 담당 이용자 수, 이동지원 필요자 수, 대피 순서, 방화문·승강기·피난계단 관련 판단의 결정자를 확인할 것.",
    "지자체 담당부서 또는 지도점검 담당자: 최근 3년간 안전점검, 지도점검, 보조금 점검, 민원·신고 이력, 지적사항 보완 이행 확인 방식을 확인할 것.",
    "이용자·보호자: 안내방송, 직원 안내, 대피 유도, 이동 지연, 안내 부족 여부만 제한적으로 확인하고 건강정보 등 민감정보는 최소화할 것."
  ],
  followups: [
    "“바로 했습니다.” → “여기서 ‘바로’는 몇 시 몇 분을 의미하는지 확인함. 확인 곤란 시 근거기록을 특정 바람.”",
    "“매뉴얼대로 했습니다.” → “해당 매뉴얼의 문서명, 개정일, 해당 조항, 실제 수행자를 특정해 주시기 바람.”",
    "“담당자가 했을 겁니다.” → “직접 확인한 사실인지 추정인지 구분하고, 실제 담당자 성명은 익명코드로 특정 바람.”",
    "“기억나지 않습니다.” → “기억이 불명확한 항목은 서면 보완으로 전환함. 확인 가능한 자료와 제출 가능 기한을 말씀해 주시기 바람.”",
    "“문제 없었습니다.” → “문제가 없다고 판단한 근거자료가 자체점검표, 설비기록, 현장확인 중 무엇인지 특정 바람.”",
    "“소방서가 도착해서 처리했습니다.” → “소방 도착 전까지 시설 측이 수행한 신고, 전파, 소화, 대피 조치를 시간순으로 답변 바람.”",
    "“입소자가 많아 어려웠습니다.” → “대피보조 필요자 수, 담당 직원 수, 우선대피 기준, 실제 미대피 인원을 구분하여 답변 바람.”",
    "“시설 구조상 불가피했습니다.” → “해당 구조적 한계를 언제부터 인지했는지, 개선요청 문서가 있는지 확인 바람.”"
  ],
  confirmationScript: [
    "지금까지 진술한 내용을 정리하면, 귀하는 ○월 ○일 ○시 ○분경 ○○에서 화재 또는 경보를 인지했고, ○시 ○분경 ○○에게 전파했으며, ○시 ○분경 ○○ 조치를 수행했다고 진술함. 이 요지가 맞는지 확인 바람.",
    "귀하의 진술 중 근거문서가 필요한 항목은 ① ○○기록, ② ○○점검표, ③ ○○보고서임. 해당 자료는 ○월 ○일 ○시까지 제출 가능한지 확인함.",
    "본 면담에서 확인되지 않은 사항은 추정으로 기재하지 않고, ‘서면 보완 예정’으로 정리함."
  ],
  checklist: [
    "소방계획서 최신성: 현 근무조·조직도·입소자 특성이 반영되어 있는지 확인할 것.",
    "피난계획 실효성: 이동지원 필요자별 대피방법과 담당자가 지정되어 있는지 확인할 것.",
    "야간 대응체계: 실제 야간근무자 기준으로 자위소방대 역할이 재편성되어 있는지 확인할 것.",
    "119 신고체계: 신고자, 대체신고자, 신고문구가 명확한지 확인할 것.",
    "방화문·피난시설: 개방·폐쇄 상태와 유지관리 기록이 일치하는지 확인할 것.",
    "훈련 실효성: 시나리오형 훈련 및 보완사항 조치기록이 있는지 확인할 것.",
    "자체점검 지적 보완: 지적사항별 보완일·증빙·확인자가 기재되어 있는지 확인할 것.",
    "사후조치: 임시보호, 의료조치, 보호자 통보, 재발방지 계획이 기록되어 있는지 확인할 것."
  ],
  improvements: [
    "즉시 시정: 화재 당시 타임라인 확정, 119 신고기록·CCTV·수신기 기록 보전, 대피보조 필요자 명단 현행화, 자체점검 지적사항 미보완 여부 확인, 보호자 통보 및 임시보호 조치 누락 여부 확인.",
    "단기 개선: 30일 이내 소방계획서·피난계획서 개정, 자위소방대 재편성, 야간근무 기준 모의훈련 실시.",
    "중기 개선: 3개월 이내 방화구획·피난동선·대피보조장비 실태점검 및 지자체 확인점검.",
    "장기 개선: 시설유형별 화재 대응 표준질문지와 진술 비교분석 매트릭스를 정례감찰 양식으로 도입."
  ],
  additionalRequests: [
    "해당 기관 공식 홈페이지 URL",
    "자치법규정보시스템 조례·규칙 URL",
    "최근 안전관리계획 또는 재난관리기금 공개 URL",
    "시설유형, 정원·현원, 24시간 운영 여부, 야간근무 인원",
    "화재 발생일시, 장소, 발화 추정 지점, 인명피해 여부",
    "소방계획서, 피난계획서, 소방훈련 결과, 자체점검 결과",
    "119 신고기록, CCTV 보존 여부, 지자체 지도점검 자료"
  ]
};

const safetyAuditOrganizationBackdata = {
  title: "안전감찰 기구 및 개요",
  source: "안전감찰 기구 및 개요.pdf",
  triggerKeywords: ["안전감찰 기구", "안전감찰 개요", "재난관리책임기관", "기관경고", "징계요구", "재난안전법 제77조", "안전감찰 범위", "재난예방조치", "재난응급조치"],
  organization: [
    "기구 및 정원은 본부장 직속 1담당관, 총 17명 체계로 제시됨.",
    "직급 구성은 3·4급, 4·5급, 5급, 6급, 7급, 8급, 9급 등으로 구성된 안전감찰 전담 조직으로 파악됨.",
    "안전감찰담당관은 재난관리책임기관의 재난관리 업무 전반이 실제 작동하는지 확인·조정·지원하는 기능을 수행함."
  ],
  legalBasis: [
    "재난 및 안전관리 기본법 제6조: 재난 및 안전관리 업무의 총괄·조정 근거",
    "재난 및 안전관리 기본법 제77조: 재난관리 의무 위반에 대한 기관경고 및 징계요구 근거",
    "행정안전부 직제 제19조: 안전감찰담당관 설치·기능 근거"
  ],
  targets: [
    "안전감찰 대상은 중앙부처, 지방자치단체, 공공기관 등 재난관리책임기관으로 설정됨.",
    "PDF 기준 총 384개 재난관리책임기관이 제시됨.",
    "세부 대상은 중앙부처 43개, 지방자치단체 243개(광역 17, 기초 226), 공공기관 98개로 정리됨."
  ],
  role: [
    "재난관리책임기관 및 그 소속 직원의 위법·부당 행위를 적발하고, 기관경고·징계 등을 요구하여 국가재난안전시스템이 제대로 작동하도록 조정·지원함.",
    "안전감찰 활동에서 도출된 문제점은 민간전문가 의견을 들어 대안을 제시하고 제도개선으로 연결하는 대안제시형 안전감찰 방식으로 운영함.",
    "기관경고는 재난관리책임기관이 재난안전법상 조치를 하지 아니한 경우 국무총리 또는 행정안전부장관이 조치할 수 있는 수단임.",
    "징계요구는 재난안전 임무를 게을리한 재난관리책임기관 소속 공무원 등에 대해 행정안전부장관 또는 지자체장이 요구할 수 있는 수단임."
  ],
  disasterManagementDuties: [
    "평시 예방: 안전관리계획 수립, 상황실 운영, 안전점검 등 재난예방 조치 수행",
    "평시 대비: 매뉴얼 작성·운용, 재난안전 훈련, 국가기반시설·특정관리대상시설 관리, 재난관리자원 비축 등 수행",
    "재난시 대응: 긴급구조·구급, 응급조치, 경보발령, 대피명령, 통행제한, 응원 등 수행",
    "재난시 복구: 피해조사, 복구계획 수립, 복구사업 관리 등 수행"
  ],
  scope: [
    "안전감찰 범위는 재난관리책임기관의 재난예방조치, 재난응급조치, 안전점검, 재난상황관리, 재난복구 등 재난관리 업무 전반임.",
    "감찰 문안 작성 시 단순 처분 중심이 아니라 법정 의무, 작동성, 개선대안, 제도 보완을 함께 제시하여야 함.",
    "중앙정부와 지방정부의 관계는 지적·방어 구도가 아니라 국가재난안전시스템 작동성 확보를 위한 조정·지원 관계로 정리하는 것이 적정함."
  ]
};

function getAudience() {
  return document.querySelector("input[name='audience']:checked").value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sanitizeFileName(value) {
  return String(value)
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80) || "안전감찰_통합_자문_답변";
}

function getMemory() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

function getOrgProfile() {
  try {
    return JSON.parse(localStorage.getItem(ORG_PROFILE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveOrgProfile() {
  const profile = {
    name: orgNameInput.value.trim(),
    type: orgTypeSelect.value,
    homeUrl: homeUrlInput.value.trim(),
    lawUrl: lawUrlInput.value.trim(),
    planUrl: planUrlInput.value.trim(),
    localContext: localContextInput.value.trim()
  };
  localStorage.setItem(ORG_PROFILE_KEY, JSON.stringify(profile));
  updateOrgStatus();
  statusText.textContent = "기관 맞춤 설정을 저장함.";
}

function updateOrgStatus() {
  const profile = getOrgProfile();
  orgNameInput.value = profile.name || "";
  orgTypeSelect.value = profile.type || "local";
  homeUrlInput.value = profile.homeUrl || "";
  lawUrlInput.value = profile.lawUrl || "";
  planUrlInput.value = profile.planUrl || "";
  localContextInput.value = profile.localContext || "";

  if (profile.name || profile.homeUrl || profile.lawUrl || profile.planUrl || profile.localContext) {
    const label = profile.name || "기관명 미입력";
    const typeLabel = { central: "중앙정부", local: "지방정부", public: "공공기관" }[profile.type || "local"];
    orgStatus.textContent = `${label} · ${typeLabel} 맞춤 기준을 답변에 반영함.`;
  } else {
    orgStatus.textContent = "공통 법령 기준으로 답변함.";
  }
}

function orgProfileSummary(profile) {
  const typeLabel = { central: "중앙정부", local: "지방정부", public: "공공기관" }[profile.type || "local"];
  const lines = [];
  if (profile.name) lines.push(`기관명: ${profile.name}`);
  if (profile.type) lines.push(`기관 유형: ${typeLabel}`);
  if (profile.homeUrl) lines.push(`공식 홈페이지 URL: ${profile.homeUrl}`);
  if (profile.lawUrl) lines.push(`자치법규·훈령·예규 URL: ${profile.lawUrl}`);
  if (profile.planUrl) lines.push(`안전관리계획·재난관리기금 URL: ${profile.planUrl}`);
  if (profile.localContext) lines.push(`지역·기관 특성: ${profile.localContext}`);
  return lines.length ? lines : ["기관 맞춤 설정이 저장되지 않아 공통 법령·정책 기준으로 작성함."];
}

function orgProfileReviewPoints(profile) {
  if (!profile.name && !profile.homeUrl && !profile.lawUrl && !profile.planUrl && !profile.localContext) {
    return ["기관 URL이 미입력된 경우, 답변은 전국 공통 법령·정책 기준의 일반 자문으로 한정함."];
  }
  const points = [
    "저장된 기관 공식 홈페이지 URL을 우선 기준으로 조직도, 담당부서, 보도자료, 공개자료 확인 방향을 설정할 것.",
    "자치법규·훈령·예규 URL이 있는 경우 상위법과 조례·규칙·내부지침의 위임 범위 및 충돌 여부를 우선 대조할 것.",
    "안전관리계획·재난관리기금 URL이 있는 경우 계획 수립, 예산·기금 운용, 이행상태, 공개자료의 최신성을 함께 검토할 것.",
    "지역·기관 특성은 유사 지자체 선정, 위험도 비교, 우수사례 벤치마킹 기준에 반영할 것."
  ];
  if (profile.type === "central") points.push("중앙정부 기관은 소관 법령·정책지침, 전국 기준, 지자체 이행관리, 부처 간 조정 기능을 중심으로 검토할 것.");
  if (profile.type === "local") points.push("지방정부는 조례·규칙, 현장 집행체계, 주민 접점, 지역 위험시설, 재난관리기금 운용상태를 중심으로 검토할 것.");
  if (profile.type === "public") points.push("공공기관은 설립 근거, 위탁·대행 업무 범위, 안전관리 의무, 감독기관 보고체계를 중심으로 검토할 것.");
  return points;
}

function updateMemoryStatus() {
  const memory = getMemory();
  memoryInput.value = memory;
  if (memory.trim()) {
    const chars = memory.trim().length.toLocaleString("ko-KR");
    memoryStatus.textContent = `GPTs 누적 기록 ${chars}자를 함께 반영함.`;
    knowledgeStatus.textContent = `부처별 법령군, 공식 통계 출처, GPTs 누적 기록 ${chars}자를 함께 참조함.`;
  } else {
    memoryStatus.textContent = "기본 법령·정책·통계 검토 프레임이 반영되어 있음.";
    knowledgeStatus.textContent = "부처별 법령군, 정책 지침, 통계·공식자료 교차검증 프레임을 함께 참조함.";
  }
}

function inferInputType(text) {
  if (inputTypeSelect.value !== "auto") return inputTypeSelect.value;
  if (fileInput.files.length) return "document";
  if (/https?:\/\/[^\s]+/i.test(text)) return "url";
  if (/면담|인터뷰|진술|피면담|무응답|보완통지|질문지/.test(text)) return "interview";
  return "text";
}

function selectProfiles(text) {
  const target = `${text}\n${getMemory()}`;
  const matches = legalProfiles.filter((profile) =>
    profile.keywords.some((keyword) => target.includes(keyword))
  );
  return matches.length ? matches.slice(0, 3) : [legalProfiles[0], legalProfiles[1]];
}

function listItems(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function getAnswerLines() {
  const lines = ["대한민국 안전감찰 수석 자문 AI", "통합 자문 답변", ""];
  answerBody.querySelectorAll("h3, h4, p, li").forEach((node) => {
    const text = node.textContent.replace(/\s+/g, " ").trim();
    if (!text) return;
    if (node.tagName === "LI") {
      lines.push(`- ${text}`);
    } else {
      lines.push(text);
    }
    if (node.tagName === "H3" || node.tagName === "H4") lines.push("");
  });
  return lines;
}

function hasGeneratedAnswer() {
  return !answerBody.classList.contains("empty-state") && getAnswerLines().length > 4;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(array, value) {
  array.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeUint32(array, value) {
  array.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function dateToDos(date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

function createZip(files) {
  const encoder = new TextEncoder();
  const output = [];
  const central = [];
  let offset = 0;
  const stamp = dateToDos(new Date());

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = encoder.encode(file.content);
    const crc = crc32(dataBytes);
    const local = [];
    writeUint32(local, 0x04034b50);
    writeUint16(local, 20);
    writeUint16(local, 0x0800);
    writeUint16(local, 0);
    writeUint16(local, stamp.time);
    writeUint16(local, stamp.day);
    writeUint32(local, crc);
    writeUint32(local, dataBytes.length);
    writeUint32(local, dataBytes.length);
    writeUint16(local, nameBytes.length);
    writeUint16(local, 0);
    output.push(...local, ...nameBytes, ...dataBytes);

    const entry = [];
    writeUint32(entry, 0x02014b50);
    writeUint16(entry, 20);
    writeUint16(entry, 20);
    writeUint16(entry, 0x0800);
    writeUint16(entry, 0);
    writeUint16(entry, stamp.time);
    writeUint16(entry, stamp.day);
    writeUint32(entry, crc);
    writeUint32(entry, dataBytes.length);
    writeUint32(entry, dataBytes.length);
    writeUint16(entry, nameBytes.length);
    writeUint16(entry, 0);
    writeUint16(entry, 0);
    writeUint16(entry, 0);
    writeUint16(entry, 0);
    writeUint32(entry, 0);
    writeUint32(entry, offset);
    central.push(...entry, ...nameBytes);
    offset = output.length;
  });

  const centralOffset = output.length;
  output.push(...central);
  const end = [];
  writeUint32(end, 0x06054b50);
  writeUint16(end, 0);
  writeUint16(end, 0);
  writeUint16(end, files.length);
  writeUint16(end, files.length);
  writeUint32(end, central.length);
  writeUint32(end, centralOffset);
  writeUint16(end, 0);
  output.push(...end);
  return new Uint8Array(output);
}

function buildDocumentXml(lines) {
  const paragraphs = lines
    .map((line) => {
      const isHeading = line.startsWith("##") || line === "통합 자문 답변" || line === "대한민국 안전감찰 수석 자문 AI";
      const style = isHeading ? "<w:pStyle w:val=\"Heading2\"/>" : "";
      return `<w:p><w:pPr>${style}<w:spacing w:line=\"360\" w:lineRule=\"auto\"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii=\"Malgun Gothic\" w:hAnsi=\"Malgun Gothic\" w:eastAsia=\"맑은 고딕\"/><w:sz w:val=\"22\"/></w:rPr><w:t xml:space=\"preserve\">${escapeXml(line)}</w:t></w:r></w:p>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1417" w:right="1134" w:bottom="1417" w:left="1134" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function createDocxBlob(lines) {
  const files = [
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
    },
    {
      name: "word/document.xml",
      content: buildDocumentXml(lines)
    }
  ];
  return new Blob([createZip(files)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}

function columnName(index) {
  let name = "";
  let number = index;
  while (number > 0) {
    const remainder = (number - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    number = Math.floor((number - 1) / 26);
  }
  return name;
}

function excelCell(value, rowIndex, colIndex, style = 0) {
  const ref = `${columnName(colIndex)}${rowIndex}`;
  const styleAttr = style ? ` s="${style}"` : "";
  if (value && typeof value === "object" && value.formula) {
    return `<c r="${ref}"${styleAttr}><f>${escapeXml(value.formula)}</f></c>`;
  }
  if (typeof value === "number") {
    return `<c r="${ref}"${styleAttr}><v>${value}</v></c>`;
  }
  return `<c r="${ref}" t="inlineStr"${styleAttr}><is><t xml:space="preserve">${escapeXml(value ?? "")}</t></is></c>`;
}

function worksheetXml(rows, widths = []) {
  const maxCols = Math.max(...rows.map((row) => row.length));
  const cols = Array.from({ length: maxCols }, (_, index) => {
    const width = widths[index] || (index < 2 ? 18 : 24);
    return `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`;
  }).join("");
  const sheetData = rows
    .map((row, rowIndex) => {
      const r = rowIndex + 1;
      const cells = row.map((value, colIndex) => excelCell(value, r, colIndex + 1, rowIndex === 0 ? 1 : 0)).join("");
      return `<row r="${r}">${cells}</row>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>${cols}</cols>
  <sheetData>${sheetData}</sheetData>
</worksheet>`;
}

function buildStatementMatrixWorkbookRows() {
  const statementHeaders = statementMatrixTemplate.columns.map((column) => column[0]);
  const statements = [statementHeaders, ...statementMatrixTemplate.statements];
  const codebook = statementMatrixTemplate.codebook;
  const questionMap = statementMatrixTemplate.questionMap;
  const summary = [
    ["지표", "값", "산식/설명"],
    ["총 진술 수", { formula: "COUNTA(Statements!A2:A1000)" }, "Statements 시트 입력 행 수"],
    ["보완필요 건수", { formula: 'COUNTIF(Statements!Q2:Q1000,"Y")' }, "보완필요=Y"],
    ["무응답률", { formula: 'IFERROR(COUNTIF(Statements!N2:N1000,"확인불가")/COUNTA(Statements!A2:A1000),0)' }, "확인불가 비율"],
    ["평균 응답소요시간(분)", { formula: "IFERROR(AVERAGE(Statements!S2:S1000),0)" }, "응답소요분 평균"],
    ["일치 건수", { formula: 'COUNTIF(Statements!N2:N1000,"일치")' }, "일치불일치코드=일치"],
    ["부분불일치 건수", { formula: 'COUNTIF(Statements!N2:N1000,"부분불일치")' }, "일치불일치코드=부분불일치"],
    ["상충 건수", { formula: 'COUNTIF(Statements!N2:N1000,"상충")' }, "일치불일치코드=상충"],
    ["확인불가 건수", { formula: 'COUNTIF(Statements!N2:N1000,"확인불가")' }, "일치불일치코드=확인불가"],
    ["Q01 합치율", { formula: 'IFERROR(COUNTIFS(Statements!E:E,"Q01",Statements!N:N,"일치")/COUNTIF(Statements!E:E,"Q01"),0)' }, "Q01 중 일치 비율"],
    ["Q02 합치율", { formula: 'IFERROR(COUNTIFS(Statements!E:E,"Q02",Statements!N:N,"일치")/COUNTIF(Statements!E:E,"Q02"),0)' }, "Q02 중 일치 비율"]
  ];
  return { statements, codebook, questionMap, summary };
}

function createXlsxBlob() {
  const rows = buildStatementMatrixWorkbookRows();
  const files = [
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet4.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
    },
    {
      name: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Statements" sheetId="1" r:id="rId1"/>
    <sheet name="Codebook" sheetId="2" r:id="rId2"/>
    <sheet name="QuestionMap" sheetId="3" r:id="rId3"/>
    <sheet name="Summary" sheetId="4" r:id="rId4"/>
  </sheets>
</workbook>`
    },
    {
      name: "xl/styles.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="10"/><name val="Malgun Gothic"/></font><font><b/><sz val="10"/><name val="Malgun Gothic"/><color rgb="FFFFFFFF"/></font></fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC9982F"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="1" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`
    },
    { name: "xl/worksheets/sheet1.xml", content: worksheetXml(rows.statements, [18, 16, 16, 12, 10, 28, 44, 18, 18, 12, 16, 16, 26, 16, 18, 12, 10, 18, 12, 30]) },
    { name: "xl/worksheets/sheet2.xml", content: worksheetXml(rows.codebook, [18, 16, 42]) },
    { name: "xl/worksheets/sheet3.xml", content: worksheetXml(rows.questionMap, [12, 34, 34, 42]) },
    { name: "xl/worksheets/sheet4.xml", content: worksheetXml(rows.summary, [26, 18, 42]) }
  ];
  return new Blob([createZip(files)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}

function exportStatementMatrixXlsx() {
  const filename = "다수_진술_비교분석_매트릭스_템플릿.xlsx";
  downloadBlob(createXlsxBlob(), filename);
  statusText.textContent = "다수 진술 비교분석 매트릭스 XLSX 템플릿을 내려받음.";
}

function exportDocx(googleMode = false) {
  if (!hasGeneratedAnswer()) {
    statusText.textContent = "먼저 자문 답변을 생성하십시오.";
    return;
  }
  const filename = `${sanitizeFileName(lastAnswerTitle)}${googleMode ? "_GoogleDocs" : ""}.docx`;
  downloadBlob(createDocxBlob(getAnswerLines()), filename);
  statusText.textContent = googleMode
    ? "구글문서 업로드용 DOCX 파일을 내려받음."
    : "DOCX 파일을 내려받음.";
}

function exportPdf() {
  if (!hasGeneratedAnswer()) {
    statusText.textContent = "먼저 자문 답변을 생성하십시오.";
    return;
  }
  const printWindow = window.open("", "_blank", "width=900,height=1100");
  if (!printWindow) {
    statusText.textContent = "팝업이 차단됨. 브라우저에서 팝업을 허용한 뒤 다시 시도하십시오.";
    return;
  }
  printWindow.document.write(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(lastAnswerTitle)}</title>
    <style>
      body { font-family: "Malgun Gothic", "Noto Sans KR", Arial, sans-serif; margin: 28px; color: #211a0d; line-height: 1.7; }
      h1 { font-size: 20px; margin: 0 0 18px; }
      h3 { font-size: 16px; margin: 20px 0 8px; color: #5e4210; }
      h4 { font-size: 14px; margin: 16px 0 6px; color: #6b4a11; }
      ul { padding-left: 22px; }
      li { margin: 5px 0; }
      .footer-mark { margin-top: 18px; padding-top: 12px; border-top: 1px solid #d9bd77; font-weight: 700; }
      @page { margin: 18mm 16mm; }
    </style>
  </head>
  <body>
    <h1>대한민국 안전감찰 수석 자문 AI - 통합 자문 답변</h1>
    ${answerBody.innerHTML}
    <script>window.onload = () => { window.print(); };</script>
  </body>
</html>`);
  printWindow.document.close();
  statusText.textContent = "PDF 저장 창을 열었음. 대상에서 PDF 저장을 선택하십시오.";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getUrlList(text) {
  return text.match(/https?:\/\/[^\s)]+/gi) || [];
}

function getMemorySummary(question) {
  const memory = getMemory().trim();
  if (!memory) return ["기존 GPTs 실제 대화 전문은 미입력 상태임. 현재는 내장 법령·정책 검토 프레임을 기준으로 작성함."];
  const words = question.split(/\s+/).filter((word) => word.length >= 2);
  return memory
    .split(/[\n.!?。]+/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 12)
    .map((line) => ({
      line,
      score: words.reduce((sum, word) => sum + (line.includes(word) ? 1 : 0), 0)
    }))
    .sort((a, b) => b.score - a.score || b.line.length - a.line.length)
    .slice(0, 3)
    .map((item) => item.line.slice(0, 130));
}

function buildDocumentExtraction(inputKind, file, profile = {}) {
  if (inputKind === "document" && file) {
    return [
      `첨부파일명: ${file.name}`,
      `파일 형식: ${file.name.split(".").pop()?.toUpperCase() || "미상"}, 크기: ${(file.size / 1024).toFixed(1)}KB`,
      "OCR 또는 원문 판독 가능성을 전제로 목적, 범위, 기준, 점검표, 위험도평가, 개선조치, 예산·재원, 일정, 담당부서, 관련 근거, 첨부 통계 항목을 추출 대상으로 설정함."
    ];
  }
  if (inputKind === "url") {
    const urls = getUrlList(questionInput.value);
    return [
      `입력 URL: ${urls.length ? urls.join(", ") : "URL 형식 미확인"}`,
      "자치법규정보시스템의 조례·규칙, 공식 홈페이지의 안전관리계획, 재난관리기금 공개자료, 조직도, 보도자료를 우선 확인 대상으로 설정함.",
      ...orgProfileSummary(profile),
      "현재 정적 앱 환경에서는 외부 URL 본문을 자동 수집하지 않으므로, URL 제공 후 공개자료 원문 또는 주요 본문을 추가 입력하면 교차검증 정확도가 향상됨."
    ];
  }
  return [
    "입력 본문을 감찰보고서 또는 자문 요청 초안으로 간주함.",
    ...orgProfileSummary(profile),
    "문단·항목·번호 체계를 기준으로 목적, 범위, 기준, 점검표, 위험도평가, 개선조치, 예산·재원, 일정, 담당부서, 법적 근거, 첨부 통계 누락 여부를 점검함."
  ];
}

function buildLegalReview(profiles) {
  const commonSafetyAuditLaws = [
    "재난 및 안전관리 기본법 제6조(재난 및 안전관리 업무의 총괄·조정)",
    "재난 및 안전관리 기본법 제77조제1항(재난관리책임기관에 대한 기관경고 등 조치)",
    "재난 및 안전관리 기본법 제77조제2항(재난안전 임무 해태 등에 대한 징계요구 및 안전감찰 범위)",
    "행정안전부 직제 제19조(안전감찰담당관)"
  ];
  const laws = unique([...commonSafetyAuditLaws, ...profiles.flatMap((profile) => profile.laws)]);
  const ministries = unique(profiles.flatMap((profile) => profile.ministries));
  return {
    ministries,
    laws,
    commonBasis: [
      "재난안전법 제6조에 따라 중앙정부의 재난 및 안전관리 업무 총괄·조정 관점에서 사안을 검토할 것.",
      "재난안전법 제77조제1항에 따라 재난관리책임기관이 법정 조치를 이행하지 않은 경우 기관경고 등 조치 가능성을 검토할 것.",
      "재난안전법 제77조제2항에 따라 재난안전 임무 해태 여부, 징계요구 가능성, 재난예방조치·재난응급조치·안전점검·재난상황관리·재난복구 등 재난관리 업무 전반의 작동성을 검토할 것.",
      "행정안전부 직제 제19조의 안전감찰담당관 기능에 맞추어 단순 적발이 아니라 국가재난안전시스템 작동성 확보, 조정·지원, 제도개선 대안 제시 관점으로 작성할 것."
    ],
    points: [
      "PDF 「안전감찰 기구 및 개요」에 따른 공통 법적 근거를 모든 사안의 기본 판단축으로 우선 적용할 것.",
      "상위법, 시행령·시행규칙, 소관 부처 지침, 지방자치단체 조례·규칙 간 위임 범위와 충돌 여부를 대조할 것.",
      "법령상 의무, 지침상 권고, 기관 내부 기준을 구분하여 지적사항의 법적 근거 수준을 명시할 것.",
      "법적 책임 판단은 사실관계, 권한 보유 여부, 예견 가능성, 회피 가능성, 조치 가능성을 기준으로 한정할 것.",
      "감찰 결과는 위법·부당 행위 확인, 기관경고·징계요구 검토, 민간전문가 의견 등을 통한 대안제시형 제도개선으로 구분하여 정리할 것."
    ]
  };
}

function buildComparison(profiles, profile = {}) {
  const sources = unique(profiles.flatMap((profile) => profile.sources));
  const items = [
    `주요 통계·공식자료 출처는 ${sources.join(", ")}로 설정함.`,
    "유사 지자체는 인구 규모, 재정 여건, 시설 수, 위험 노출도, 최근 사고·민원 발생 정도를 기준으로 선정할 것.",
    "비교 항목은 조례 근거, 전담조직, 예산·기금 집행률, 점검주기, 사고·민원 추이, 개선명령 이행률로 구성할 것.",
    "우수사례는 공식 보도자료, 감사·감찰 결과, 중앙부처 평가자료 등 확인 가능한 출처가 있는 사례로 한정할 것."
  ];
  if (profile.name || profile.localContext) {
    items.push("저장된 기관명·지역 특성을 기준으로 유사 지자체 또는 유사 기관을 선정하고, 단순 행정구역이 아닌 위험요인·시설유형·인구구조·산업구조를 비교축으로 둘 것.");
  }
  if (profile.homeUrl || profile.planUrl) {
    items.push("저장된 공식 홈페이지 및 안전관리계획 URL의 공개자료를 기준 자료로 삼고, 최신 통계와 공개자료 간 불일치 여부를 확인할 것.");
  }
  return items;
}

function buildInterviewModule(deadline) {
  return `
    <h4>인터뷰 모듈 산출물</h4>
    <ul>
      <li>질문 설계: 팩트 확인형, 근거 유도형, 과정 재현형, 비교 유도형, 책임 명확화형, 위험 인지형 질문을 적용할 것.</li>
      <li>진행 스크립트: “금번 면담은 사실관계 확인을 위한 절차로, 귀하의 인격권을 존중하며 비공개로 진행함.”으로 고지할 것.</li>
      <li>재질문 방식: 핵심질문 → 시간·장소·행위 3요소 재확인 → 근거문서 특정 → 요지 확인 순으로 진행할 것.</li>
      <li>1차 보완요청: 즉답 곤란 항목은 서면 보완 기한을 ${deadline}시간으로 부여할 것.</li>
      <li>2차 재통지: 기한 경과 후 24시간 내 미제출 시 24~48시간 범위에서 재통지하고 사실표·증빙목록의 최소 제출요건을 안내할 것.</li>
      <li>3차 조치안: 5영업일 이상 무응답 또는 장기 체류 시 비협조 기록, 상급부서 통지, 현장확인 전환을 검토할 것.</li>
      <li>진술확인서 필수 항목: 사건명, 면담일시·장소, 면담자·피면담자, 직위·부서, 핵심질문·답변, 시점·장소·행위, 근거문서ID, 결정권자, 보고체계, 발언 요지, 확인 서명란, 개인정보 비공개 표기를 포함할 것.</li>
      <li>비교분석 매트릭스 열 구조: RespondentID, 익명화코드, 부서, 직위, 질문ID, 질문문구, 답변요지, 시점(ISO), 장소, 행위분류, 근거문서ID, 결정권자, 보고라인, 일치/불일치코드, 신뢰도코드(1~3), 보완필요 여부, 비고로 구성할 것.</li>
      <li>내보내기 기준: Excel은 .xlsx, CSV는 UTF-8 BOM, 날짜는 YYYY-MM-DD HH:MM, 문서 표는 최대 8열, 맑은 고딕 10~11pt를 적용할 것.</li>
    </ul>
  `;
}

function shouldUseFacilityAccidentBackdata(question, profiles) {
  const target = `${question}\n${getMemory()}`;
  const profileHit = profiles.some((profile) => ["facility", "industry"].includes(profile.id));
  const keywordHit = facilityAccidentInterviewBackdata.triggerKeywords.some((keyword) => target.includes(keyword));
  return profileHit && keywordHit;
}

function shouldUseNonResponseNoticeBackdata(question) {
  const target = `${question}\n${getMemory()}`;
  return nonResponseNoticeBackdata.triggerKeywords.some((keyword) => target.includes(keyword));
}

function shouldUseStatementMatrixTemplate(question) {
  const target = `${question}\n${getMemory()}`;
  return statementMatrixTemplate.triggerKeywords.some((keyword) => target.includes(keyword));
}

function shouldUseWelfareFireInterviewBackdata(question) {
  const target = `${question}\n${getMemory()}`;
  return welfareFireInterviewBackdata.triggerKeywords.some((keyword) => target.includes(keyword));
}

function shouldUseSafetyAuditOrganizationBackdata(question) {
  const target = `${question}\n${getMemory()}`;
  return safetyAuditOrganizationBackdata.triggerKeywords.some((keyword) => target.includes(keyword));
}

function buildFacilityAccidentInterviewModule() {
  const data = facilityAccidentInterviewBackdata;
  return `
    <h4>${escapeHtml(data.title)}</h4>
    <ul>${listItems(data.scope)}</ul>

    <h4>면담 대상 구분</h4>
    <ul>${listItems(data.respondentGroups)}</ul>

    <h4>법적 검토 보강</h4>
    <ul>${listItems(data.legalBasis)}</ul>

    <h4>공통 핵심질문</h4>
    <ul>${listItems(data.commonQuestions)}</ul>

    <h4>건축·시설물 관리 기준 질문</h4>
    <ul>${listItems(data.buildingQuestions)}</ul>

    <h4>산업안전보건 기준 질문</h4>
    <ul>${listItems(data.safetyQuestions)}</ul>

    <h4>회피·무응답 재질문 문구</h4>
    <ul>${listItems(data.evasiveReplies)}</ul>

    <h4>보완자료 제출 요청 항목</h4>
    <ul>${listItems(data.evidenceRequest)}</ul>

    <h4>즉시 시정 사항</h4>
    <ul>${listItems(data.immediateActions)}</ul>

    <h4>진술확인서·비교매트릭스 반영</h4>
    <ul>
      <li>진술확인서에는 사건명, 면담일시, 면담장소, 면담자, 피면담자, 핵심 진술, 시점, 장소, 행위, 근거문서, 결정권자, 보고라인, 보완 필요사항, 내부 평가·의견, 확인 문구 및 서명란을 포함할 것.</li>
      <li>다수 진술 비교분석 매트릭스는 RespondentID, 부서, 직위, 질문ID, 질문문구, 답변요지, 시점, 장소, 행위분류, 근거문서ID, 결정권자, 보고라인, 일치/불일치코드, 신뢰도코드, 보완필요 여부, 비고로 구성할 것.</li>
    </ul>
  `;
}

function buildNonResponseNoticeModule() {
  const data = nonResponseNoticeBackdata;
  return `
    <h4>${escapeHtml(data.title)}</h4>
    <ul>${listItems(data.overview)}</ul>

    <h4>법적 근거 및 작성 원칙</h4>
    <ul>${listItems(data.legalBasis)}</ul>

    <h4>단계별 처리 구조</h4>
    <ul>${listItems(data.stages)}</ul>

    <h4>1차 보완통지서안: 48시간</h4>
    <ul>${listItems(data.firstNotice)}</ul>

    <h4>제출 요청 자료</h4>
    <ul>${listItems(data.requestedMaterials)}</ul>

    <h4>제출 시 준수사항</h4>
    <ul>${listItems(data.submissionRules)}</ul>

    <h4>보완답변서 서식 구성</h4>
    <ul>${listItems(data.answerForm)}</ul>

    <h4>2차 재통지 문구: 48시간 경과 후 미제출 시</h4>
    <ul>${listItems(data.secondNotice)}</ul>

    <h4>에스컬레이션 문구: 상급부서 통지용</h4>
    <ul>${listItems(data.escalationNotice)}</ul>

    <h4>내부 보고용 에스컬레이션 문구</h4>
    <ul>${listItems(data.internalReport)}</ul>

    <h4>면담 현장 고지 문구</h4>
    <ul>${listItems(data.fieldNotice)}</ul>

    <h4>무응답 기록 문구</h4>
    <ul>${listItems(data.recordPhrase)}</ul>

    <h4>강한 표현이 필요한 경우의 제한적 문구</h4>
    <ul>${listItems(data.limitedStrongPhrase)}</ul>
  `;
}

function buildStatementMatrixModule() {
  const data = statementMatrixTemplate;
  return `
    <h4>${escapeHtml(data.title)}</h4>
    <ul>
      <li>권장 시트 구성은 ${escapeHtml(data.sheets.join(", "))} 4개로 구성함.</li>
      <li>성명·연락처 등 직접 식별정보는 제외하고 RespondentID(R001, R002 등) 기준으로 관리할 것.</li>
      <li>Summary 시트에는 질문별 합치율, 불일치 유형, 무응답률, 평균 응답소요시간을 수식으로 집계할 것.</li>
    </ul>

    <h4>권장 열 구조</h4>
    <ul>${listItems(data.columns.map((column, index) => `${index + 1}. ${column[0]}: 입력 예시 ${column[1] || "공란"} / ${column[2]}`))}</ul>

    <h4>코드값</h4>
    <ul>${listItems(data.codebook.slice(1).map((row) => `${row[0]} - ${row[1]}: ${row[2]}`))}</ul>

    <h4>샘플 진술 데이터</h4>
    <ul>${listItems(data.statements.map((row) => `${row[0]} / ${row[1]} / ${row[4]} / ${row[13]} / 보완필요 ${row[16]} / ${row[19]}`))}</ul>
  `;
}

function buildWelfareFireInterviewModule() {
  const data = welfareFireInterviewBackdata;
  return `
    <h4>${escapeHtml(data.title)}</h4>
    <ul>${listItems(data.scope)}</ul>

    <h4>우선 확보 증빙</h4>
    <ul>${listItems(data.evidence)}</ul>

    <h4>법적 검토 축</h4>
    <ul>${listItems(data.legalBasis)}</ul>

    <h4>공통 도입 스크립트</h4>
    <ul>${listItems(data.introScript)}</ul>

    <h4>T0~T5 사건 타임라인별 핵심 질문</h4>
    <ul>${listItems(data.timelineQuestions)}</ul>

    <h4>대상자별 면담 스크립트</h4>
    <ul>${listItems(data.respondentScripts)}</ul>

    <h4>회피·모호 답변 재질문</h4>
    <ul>${listItems(data.followups)}</ul>

    <h4>면담 중 요지 확인 스크립트</h4>
    <ul>${listItems(data.confirmationScript)}</ul>

    <h4>현장 점검 체크리스트</h4>
    <ul>${listItems(data.checklist)}</ul>

    <h4>즉시 시정 및 개선방안</h4>
    <ul>${listItems(data.improvements)}</ul>

    <h4>추가 입력 요청</h4>
    <ul>${listItems(data.additionalRequests)}</ul>
  `;
}

function buildSafetyAuditOrganizationModule() {
  const data = safetyAuditOrganizationBackdata;
  return `
    <h4>${escapeHtml(data.title)}</h4>
    <ul>
      <li>출처: ${escapeHtml(data.source)}</li>
      ${listItems(data.organization)}
    </ul>

    <h4>법적 근거</h4>
    <ul>${listItems(data.legalBasis)}</ul>

    <h4>안전감찰 대상</h4>
    <ul>${listItems(data.targets)}</ul>

    <h4>안전감찰 역할</h4>
    <ul>${listItems(data.role)}</ul>

    <h4>재난관리책임기관 역할</h4>
    <ul>${listItems(data.disasterManagementDuties)}</ul>

    <h4>안전감찰 범위</h4>
    <ul>${listItems(data.scope)}</ul>
  `;
}

function buildMissingBlock(inputKind, profile = {}) {
  const needsUrl = inputKind !== "url";
  return `
    <div class="request-block">
      <strong>[추가 입력 요청]</strong>
      <ul>
        <li>해당 기관 공식 홈페이지 URL: ${profile.homeUrl ? escapeHtml(profile.homeUrl) : needsUrl ? "미제공" : "제공 URL의 세부 페이지 확인 필요"}</li>
        <li>자치법규정보시스템(조례/규칙) URL: ${profile.lawUrl ? escapeHtml(profile.lawUrl) : "미제공"}</li>
        <li>최근 안전관리계획/재난관리기금 공개 URL: ${profile.planUrl ? escapeHtml(profile.planUrl) : "미제공"}</li>
        <li>지역·기관 특성: ${profile.localContext ? escapeHtml(profile.localContext) : "미제공"}</li>
        <li>기타 관련 자료(URL 또는 파일): 감찰보고서 원문, 점검표, 예산·기금 자료, 조직도, 보도자료</li>
      </ul>
      <p>상기 URL 제공 시, 조례-상위법 정합성 대조표 및 통계 교차검증을 반영하여 재작성함.</p>
    </div>
  `;
}

function buildAnswer() {
  const question = questionInput.value.trim();
  const file = fileInput.files[0];
  const inputKind = inferInputType(question);
  const includeInterview = interviewToggle.checked || inputKind === "interview";
  const audience = audienceMap[getAudience()];
  const orgProfile = getOrgProfile();
  const phase = phaseMap[phaseSelect.value];
  const profiles = selectProfiles(question);
  const legal = buildLegalReview(profiles);
  const comparison = buildComparison(profiles, orgProfile);
  const extraction = buildDocumentExtraction(inputKind, file, orgProfile);
  const orgReviewPoints = orgProfileReviewPoints(orgProfile);
  const memoryPoints = getMemorySummary(question);
  const deadline = deadlineSelect.value;
  const includeFacilityBackdata = shouldUseFacilityAccidentBackdata(question, profiles);
  const includeNonResponseBackdata = shouldUseNonResponseNoticeBackdata(question);
  const includeStatementMatrix = shouldUseStatementMatrixTemplate(question);
  const includeWelfareFireBackdata = shouldUseWelfareFireInterviewBackdata(question);
  const includeSafetyAuditOrgBackdata = shouldUseSafetyAuditOrganizationBackdata(question);

  if (!question && !file) {
    statusText.textContent = "URL, 본문 또는 문서 파일을 먼저 입력하십시오.";
    questionInput.focus();
    return;
  }

  lastAnswerTitle = sanitizeFileName(`안전감찰_통합자문_${profiles[0]?.title || "복합안전"}_${audience.label}`);
  modeBadge.textContent = `${audience.label} · ${inputKind.toUpperCase()}`;
  answerBody.classList.remove("empty-state");
  answerBody.innerHTML = `
    <h3>## 1. 현황 분석</h3>
    <ul>
      ${listItems(extraction)}
      <li>처리 관점: ${escapeHtml(audience.role)}.</li>
      <li>감찰 단계: ${escapeHtml(phase)}</li>
      <li>소관 분야: ${escapeHtml(profiles.map((profile) => profile.title).join(", "))}으로 판단됨.</li>
      <li>관련 부처: ${escapeHtml(legal.ministries.join(", "))} 소관 법령·정책지침 검토가 필요함.</li>
      ${listItems(memoryPoints)}
    </ul>

    <h3>## 2. 법적 검토</h3>
    <ul>
      <li>검토 대상 법령군: ${escapeHtml(legal.laws.join(", "))}.</li>
      ${listItems(legal.commonBasis)}
      ${listItems(orgReviewPoints)}
      ${listItems(legal.points)}
      <li>조례 정합성은 상위법 위임 근거, 조례상 책무 조항, 위원회·전담부서 설치, 점검·보고·개선명령 절차의 유무를 기준으로 분석할 것.</li>
      <li>법적 사각지대는 담당기관 불명확, 위탁·보조사업 감독책임 누락, 재난관리기금 사용 근거 불명확, 개인정보 처리근거 미흡 여부로 구분할 것.</li>
    </ul>

    <h3>## 3. 비교 분석</h3>
    <ul>${listItems(comparison)}</ul>

    <h3>## 4. 조치 계획</h3>
    <ul>
      <li>즉시 시정 사항: 법적 근거, 담당부서, 조치기한, 증빙자료 제출 방식을 명시하여 통지할 것.</li>
      <li>공통 조치 방향: 재난안전법 제77조제1항의 기관경고 가능성, 제77조제2항의 징계요구 가능성, 행정안전부 직제 제19조에 따른 안전감찰담당관의 조정·지원 기능을 구분하여 검토할 것.</li>
      <li>단기 개선: 조례·규칙 또는 내부 지침의 미비 조항을 보완하고 점검표·보고체계를 표준화할 것.</li>
      <li>중기 개선: 재난관리기금, 안전예산, 전담인력, 위탁계약 안전조항을 정비할 것.</li>
      <li>장기 개선: 통계 기반 위험도 평가, 유사 지자체 벤치마킹, 반복 감찰 환류 체계를 구축할 것.</li>
      <li>현장 점검 체크리스트: ${escapeHtml(checklistItems.join(" / "))}</li>
      <li>개인정보·민감정보는 A팀장, 담당자1, R001 등으로 익명화·가림 처리할 것.</li>
    </ul>
    ${includeInterview ? buildInterviewModule(deadline) : ""}
    ${includeFacilityBackdata ? buildFacilityAccidentInterviewModule() : ""}
    ${includeNonResponseBackdata ? buildNonResponseNoticeModule() : ""}
    ${includeStatementMatrix ? buildStatementMatrixModule() : ""}
    ${includeWelfareFireBackdata ? buildWelfareFireInterviewModule() : ""}
    ${includeSafetyAuditOrgBackdata ? buildSafetyAuditOrganizationModule() : ""}

    ${buildMissingBlock(inputKind, orgProfile)}

    <p class="scope-note">본 결과는 법률의견이 아닌 행정 안전감찰 자문 범위로 한정함. 법령 조항·통계 최신값·공식 출처는 원문 URL 또는 파일 제공 시 재검증하여 확정할 것.</p>
    <p class="footer-mark">${FOOTER}</p>
  `;
  statusText.textContent = "법령·정책·통계 중심의 공문서형 자문 초안을 생성함.";
}

answerBtn.addEventListener("click", buildAnswer);
docxBtn.addEventListener("click", () => exportDocx(false));
pdfBtn.addEventListener("click", exportPdf);
googleDocBtn.addEventListener("click", () => exportDocx(true));
xlsxBtn.addEventListener("click", exportStatementMatrixXlsx);

questionInput.addEventListener("input", () => {
  statusText.textContent = questionInput.value.trim() ? "답변 생성 준비가 완료됨." : "질의 내용을 입력하십시오.";
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileStatus.textContent = file
    ? `${file.name} 첨부됨. OCR 판독 가능 문서로 간주하여 분석함.`
    : "첨부가 없는 경우 입력 본문을 기준으로 분석함.";
});

clearBtn.addEventListener("click", () => {
  questionInput.value = "";
  fileInput.value = "";
  fileStatus.textContent = "첨부가 없는 경우 입력 본문을 기준으로 분석함.";
  answerBody.className = "answer-body empty-state";
  answerBody.textContent = "안전감찰은 상대 기관을 겨누는 창과 방패의 관계가 아니라, 위험이 실제로 낮아지도록 권한·책임·현장 실행을 한 화면에 놓고 조정하는 과정입니다.";
  lastAnswerTitle = "안전감찰_통합_자문_답변";
  statusText.textContent = "질의 내용을 입력하십시오.";
  questionInput.focus();
});

promptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    questionInput.value = examples[button.textContent];
    if (button.textContent.includes("면담") || button.textContent.includes("무응답") || button.textContent.includes("보완통지") || button.textContent.includes("진술") || button.textContent.includes("인터뷰")) interviewToggle.checked = true;
    if (button.textContent.includes("URL")) inputTypeSelect.value = "url";
    statusText.textContent = "예시 질의를 불러왔음.";
    buildAnswer();
  });
});

saveMemoryBtn.addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY, memoryInput.value.trim());
  updateMemoryStatus();
  statusText.textContent = "GPTs 누적 자문 기록을 앱에 반영함.";
});

clearMemoryBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  updateMemoryStatus();
  statusText.textContent = "사용자 입력 누적 기록을 삭제하고 기본 지식만 사용함.";
});

saveOrgBtn.addEventListener("click", saveOrgProfile);

clearOrgBtn.addEventListener("click", () => {
  localStorage.removeItem(ORG_PROFILE_KEY);
  updateOrgStatus();
  statusText.textContent = "기관 맞춤 설정을 초기화함.";
});

updateOrgStatus();
updateMemoryStatus();

let pendingInstallPrompt = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        if (!statusText.textContent.includes("생성")) {
          statusText.textContent = "오프라인 사용 준비가 완료됨.";
        }
      })
      .catch(() => {
        if (!statusText.textContent.includes("생성")) {
          statusText.textContent = "앱은 정상 사용 가능하나, 오프라인 캐시는 지원되지 않는 환경임.";
        }
      });
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  pendingInstallPrompt = event;
  installBtn.hidden = false;
  installBtn.textContent = "앱 설치";
});

installBtn.addEventListener("click", async () => {
  if (!pendingInstallPrompt) {
    statusText.textContent = "브라우저 메뉴의 '앱 설치' 또는 '홈 화면에 추가'를 사용하십시오.";
    return;
  }
  pendingInstallPrompt.prompt();
  const result = await pendingInstallPrompt.userChoice;
  pendingInstallPrompt = null;
  statusText.textContent = result.outcome === "accepted" ? "앱 설치가 시작됨." : "앱 설치가 취소됨.";
});
