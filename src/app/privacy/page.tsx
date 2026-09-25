import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Phone, Lock, FileText, CheckCircle2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 넥스트바이크 (NEXTBIKE)",
  description:
    "넥스트바이크는 정보통신망법 및 개인정보보호법에 의거하여 고객님의 소중한 개인정보를 안전하게 보호하고 관리합니다. 공식 개인정보처리방침 전문을 확인하세요.",
  robots: "index, follow",
};

export default function PrivacyPage() {
  return (
    <div className="py-10 sm:py-16">
      <JsonLd
        type="main"
        canonicalUrl="https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/privacy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 상단 네비게이션 */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            홈으로 돌아가기
          </Link>
          <span>/</span>
          <span className="text-gray-200">개인정보처리방침</span>
        </div>

        {/* 헤더 타이틀 */}
        <div className="space-y-4 border-b border-border/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            개인정보보호법 제30조 준수
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            넥스트바이크 <span className="text-brand-cyan">개인정보처리방침</span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            넥스트바이크(이하 &apos;회사&apos;)는 고객님의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하며, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 본 방침을 통해 회사가 고객님의 개인정보를 어떠한 용도와 방식으로 이용하고 보호하는지 상세히 안내해 드립니다.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
            <span>공고일자: 2026년 9월 25일</span>
            <span>•</span>
            <span className="text-brand-cyan font-semibold">시행일자: 2026년 9월 25일</span>
          </div>
        </div>

        {/* 본문 섹션 */}
        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          {/* 제1조 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제1조 (개인정보의 처리 목적)
            </h2>
            <p className="text-gray-300">
              회사는 다음의 목적을 위하여 최소한의 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
              <li>
                <strong className="text-gray-200">중고 오토바이 매입 견적 산출 및 상담:</strong> 고객이 신청한 바이크 모델명, 연식, 주행거리, 보관 지역, 상태 사진을 바탕으로 한 시세 감정 및 유선/문자 상담 진행
              </li>
              <li>
                <strong className="text-gray-200">현장 출장 방문 및 거래 계약 진행:</strong> 희망 방문 일시 및 보관 장소 조율, 출장 기사 배차, 현장 실차 확인 및 대금 입금 안내
              </li>
              <li>
                <strong className="text-gray-200">소유권 이전 및 폐지 행정 대행 지원:</strong> 이륜차 매매계약서 작성, 구청 차량등록사업소 명의이전 및 사용폐지 신고 대행 확인
              </li>
              <li>
                <strong className="text-gray-200">민원 및 고객 상담 대응:</strong> 서비스 이용 관련 문의, 불편 사항 처리 및 사실 확인, 분쟁 예방
              </li>
            </ul>
          </section>

          {/* 제2조 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제2조 (처리하는 개인정보의 항목 및 수집 방법)
            </h2>
            <div className="space-y-3">
              <p>
                회사는 웹사이트 견적 신청 및 상담 서비스 제공을 위해 아래와 같은 개인정보 항목을 수집하고 있습니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-border/80">
                  <thead className="bg-card text-gray-300 font-bold">
                    <tr>
                      <th className="p-3 border border-border/80">수집 단계</th>
                      <th className="p-3 border border-border/80">수집 항목</th>
                      <th className="p-3 border border-border/80">수집 구분</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-gray-400">
                    <tr>
                      <td className="p-3 border border-border/80 font-medium text-gray-300">온라인 견적 신청</td>
                      <td className="p-3 border border-border/80">
                        연락처(휴대전화번호), 오토바이 모델명, 연식, 주행거리, 보관지역, 차량 상태 사진, 고객 작성 메모
                      </td>
                      <td className="p-3 border border-border/80 text-brand-cyan font-bold">필수항목</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-border/80 font-medium text-gray-300">현장 매입 및 계약 체결</td>
                      <td className="p-3 border border-border/80">
                        판매자 성명, 주민등록번호 앞 6자리(생년월일), 본인 명의 입금 계좌번호, 이륜차 폐지서류/등록증 사본
                      </td>
                      <td className="p-3 border border-border/80 text-brand-cyan font-bold">계약 이행 필수</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-border/80 font-medium text-gray-300">웹 서비스 이용 과정</td>
                      <td className="p-3 border border-border/80">
                        접속 IP 주소, 쿠키, 서비스 이용 기록, 접속 로그, 불량 이용 기록
                      </td>
                      <td className="p-3 border border-border/80">자동 수집</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 제3조 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제3조 (개인정보의 처리 및 보유 기간)
            </h2>
            <p>
              회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
              <li>
                <strong className="text-gray-200">온라인 단순 견적 및 상담 정보:</strong> 상담 종결 또는 목적 달성 시 <strong>지체 없이 영구 파기</strong>
              </li>
              <li>
                <strong className="text-gray-200">매매 계약 체결 및 거래 완료 정보:</strong> 상법 및 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령에 의거하여 분쟁 방지 및 세무 처리를 위해 일정 기간 보존
                <div className="mt-2 pl-4 space-y-1 text-xs text-gray-500">
                  <p>• 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</p>
                  <p>• 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</p>
                  <p>• 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</p>
                  <p>• 웹사이트 접속 기록: 3개월 (통신비밀보호법)</p>
                </div>
              </li>
            </ul>
          </section>

          {/* 제4조 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제4조 (개인정보의 파기 절차 및 방법)
            </h2>
            <p>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  전자적 파일 형태
                </h4>
                <p className="text-xs text-gray-400">
                  기록을 재생할 수 없는 기술적 방법(Low Level Format, 파일 완전 삭제 알고리즘 등)을 사용하여 영구적으로 파기합니다.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  종이 문서 및 출력물
                </h4>
                <p className="text-xs text-gray-400">
                  분쇄기로 분쇄하거나 소각하여 어떤 문자나 정보도 식별할 수 없도록 물리적으로 완전 파기합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 제5조 & 제6조 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제5조 (개인정보의 제3자 제공 및 처리 위탁)
            </h2>
            <div className="space-y-3">
              <p>
                1. 회사는 원칙적으로 고객님의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 고객님의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 <strong>제3자에게 제공하지 않습니다.</strong> 단, 법률의 특별한 규정이 있거나 수사기관의 적법한 영장이 있는 경우는 예외로 합니다.
              </p>
              <p>
                2. 원활한 출장 서비스 및 알림 전송을 위해 아래와 같이 개인정보 처리 업무를 일부 위탁하고 있으며, 수탁자가 관계 법령을 위반하지 않도록 관리·감독하고 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-400 pl-2">
                <li><strong className="text-gray-300">웹 호스팅 및 인프라 운영:</strong> Vercel Inc. (보안 서버 운영)</li>
                <li><strong className="text-gray-300">실시간 상담 알림 전송:</strong> Telegram FZ-LLC (견적 접수 알림 채널 암호화 전송)</li>
                <li><strong className="text-gray-300">탁송 및 출장 운송:</strong> 협력 화물 운송 기사 (방문 출장 매입 진행 시 연락 및 상차 목적에 한함)</li>
              </ul>
            </div>
          </section>

          {/* 제7조 */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              제6조 (정보주체의 권리·의무 및 행사방법)
            </h2>
            <p>
              정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 대표 전화(010-4895-2487) 또는 고객센터를 통해 서면, 유선으로 요청하실 수 있으며, 회사는 본인 확인 절차를 거친 후 지체 없이 조치하겠습니다.
            </p>
          </section>

          {/* 제8조 (기술적 보안) */}
          <section className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-cyan" />
              제7조 (개인정보의 안전성 확보 조치)
            </h2>
            <p>
              회사는 고객님의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 다음과 같은 기술적·관리적 대책을 강구하고 있습니다.
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <p>• <strong>전송 구간 SSL/TLS 보안 암호화:</strong> 웹사이트 전 페이지에 256비트 SSL 암호화 통신을 기본 적용하여 데이터 전송 도청을 원천 차단합니다.</p>
              <p>• <strong>서버 DB 비적재(Stateless) 구조:</strong> 일반 웹 서버 DB에 고객 개인정보를 누적 저장하지 않고, 실시간 알림 전송 후 메모리에서 즉시 소멸시켜 대규모 해킹 위험을 사전에 방지합니다.</p>
              <p>• <strong>접근 권한 통제:</strong> 개인정보를 취급하는 담당자를 최소한으로 제한하고 주기적인 보안 교육을 실시합니다.</p>
            </div>
          </section>

          {/* 제9조 (책임자) */}
          <section className="p-6 rounded-2xl bg-gradient-to-br from-surface to-card border border-brand-cyan/30 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              제8조 (개인정보 보호책임자 및 상담 창구)
            </h2>
            <p className="text-gray-300">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-border/80 space-y-2 text-xs">
              <p><strong className="text-gray-200">담당 부서:</strong> 넥스트바이크 개인정보보호팀</p>
              <p><strong className="text-gray-200">직책:</strong> 개인정보관리 책임관</p>
              <p>
                <strong className="text-gray-200">직통 문의:</strong>{" "}
                <a href="tel:01048952487" className="text-brand-cyan font-bold hover:underline">
                  010-4895-2487
                </a>
              </p>
              <p><strong className="text-gray-200">소재지:</strong> 경기도 시흥시 은행동 301-25 1층 넥스트바이크</p>
            </div>
            <p className="text-[11px] text-gray-500">
              기타 개인정보 침해에 대한 신고나 상담이 필요한 경우 개인정보분쟁조정위원회(1833-6972), 대검찰청 사이버수사과(1301), 경찰청 사이버수사국(182)으로 문의하실 수 있습니다.
            </p>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-card border border-border text-xs font-bold text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            홈으로 돌아가기
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center gap-1.5 text-xs text-brand-cyan hover:underline font-semibold"
          >
            <FileText className="w-3.5 h-3.5" />
            서비스 이용약관 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
