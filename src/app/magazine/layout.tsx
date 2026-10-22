import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오토바이 매거진 | 정비 꿀팁·중고 시세 가이드·라이더 백과",
  description:
    "오토바이 관리 및 정비 팁, 모델별 중고 시세 동향, 배터리 방전 예방과 안전 라이딩 가이드 등 전문 바이크 정보를 실시간으로 제공합니다.",
  alternates: {
    canonical: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/magazine",
  },
};

export default function MagazineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
