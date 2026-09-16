import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { phone, model, year, mileage, region, memo } = data;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 접수 시간 (한국 시간 KST)
    const now = new Date();
    const kstTime = new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Seoul",
    }).format(now);

    const text = [
      "🔔 [넥스트바이크] 신규 견적 문의 접수!",
      "━━━━━━━━━━━━━━━━━━",
      `📞 연락처: ${phone || "미입력"}`,
      `🏍️ 바이크 모델: ${model || "미입력"}`,
      `📅 연식: ${year || "미입력"}`,
      `🛣️ 주행거리: ${mileage || "미입력"}`,
      `📍 보관지역: ${region || "미입력"}`,
      `📝 특이사항: ${memo || "없음"}`,
      `⏰ 접수일시: ${kstTime}`,
      "━━━━━━━━━━━━━━━━━━",
      "👉 고객님께 빠른 유선/문자 상담을 진행해 주세요.",
    ].join("\n");

    if (botToken && chatId) {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const res = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Telegram API Error:", errText);
      }
    } else {
      console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Estimate API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
