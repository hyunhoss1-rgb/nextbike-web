import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let phone = "";
    let model = "";
    let year = "";
    let mileage = "";
    let region = "";
    let memo = "";
    const photos: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      phone = (formData.get("phone") as string) || "";
      model = (formData.get("model") as string) || "";
      year = (formData.get("year") as string) || "";
      mileage = (formData.get("mileage") as string) || "";
      region = (formData.get("region") as string) || "";
      memo = (formData.get("memo") as string) || "";

      const photoEntries = formData.getAll("photos");
      for (const entry of photoEntries) {
        if (entry instanceof File && entry.size > 0) {
          photos.push(entry);
        }
      }
    } else {
      const data = await req.json();
      phone = data.phone || "";
      model = data.model || "";
      year = data.year || "";
      mileage = data.mileage || "";
      region = data.region || "";
      memo = data.memo || "";
    }

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
      photos.length > 0 ? `📷 첨부사진: ${photos.length}장 첨부됨` : "",
      `⏰ 접수일시: ${kstTime}`,
      "━━━━━━━━━━━━━━━━━━",
      "👉 고객님께 빠른 유선/문자 상담을 진행해 주세요.",
    ]
      .filter(Boolean)
      .join("\n");

    if (botToken && chatId) {
      if (photos.length === 0) {
        // 사진이 없을 때: 일반 텍스트 알림
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          console.error("Telegram sendMessage Error:", err);
        }
      } else if (photos.length === 1) {
        // 사진 1장 첨부 시: sendPhoto
        const tgFormData = new FormData();
        tgFormData.append("chat_id", chatId);
        tgFormData.append("caption", text.slice(0, 1024));
        tgFormData.append("photo", photos[0], photos[0].name || "bike.jpg");

        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: "POST",
          body: tgFormData,
        });

        if (!res.ok) {
          console.error("Telegram sendPhoto failed, fallback to text:", await res.text());
          // 사진 전송 실패 시 텍스트 백업
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text }),
          });
        }
      } else {
        // 사진 2장 이상 첨부 시: sendMediaGroup (앨범/갤러리 묶음)
        const tgFormData = new FormData();
        tgFormData.append("chat_id", chatId);

        const mediaArray = photos.slice(0, 10).map((file, idx) => {
          const attachKey = `photo_${idx}`;
          tgFormData.append(attachKey, file, file.name || `bike_${idx}.jpg`);
          return {
            type: "photo",
            media: `attach://${attachKey}`,
            caption: idx === 0 ? text.slice(0, 1024) : undefined,
          };
        });

        tgFormData.append("media", JSON.stringify(mediaArray));

        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
          method: "POST",
          body: tgFormData,
        });

        if (!res.ok) {
          console.error("Telegram sendMediaGroup failed, fallback to text:", await res.text());
          // 사진 전송 실패 시 텍스트 백업
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text }),
          });
        }
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
