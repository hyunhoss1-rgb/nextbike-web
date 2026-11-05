import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
const PER_REQUEST_TIMEOUT_MS = 10_000;

class InvalidEstimate extends Error {}

function textField(value: unknown, name: string, maxLength: number): string {
  if (value == null) return "";
  if (typeof value !== "string") {
    return String(value).trim().slice(0, maxLength);
  }
  return value.trim().slice(0, maxLength);
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "NextBike Estimate API is operational" });
}

export async function POST(req: Request) {
  try {
    let data: Record<string, unknown>;
    const photos: File[] = [];

    try {
      const contentType = req.headers.get("content-type")?.toLowerCase() || "";
      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        data = Object.fromEntries(formData.entries());
        for (const entry of formData.getAll("photos")) {
          if (entry instanceof File && entry.size > 0) {
            photos.push(entry);
          }
        }
      } else {
        const body: unknown = await req.json();
        if (!body || typeof body !== "object" || Array.isArray(body)) {
          throw new InvalidEstimate("견적 신청 내용을 확인해 주세요.");
        }
        data = body as Record<string, unknown>;
      }
    } catch (error) {
      if (error instanceof InvalidEstimate) throw error;
      throw new InvalidEstimate("견적 신청 내용을 읽을 수 없습니다. 다시 확인해 주세요.");
    }

    const phone = textField(data.phone, "연락처", 50);
    const model = textField(data.model, "바이크 모델명", 150);
    const year = textField(data.year, "연식", 50);
    const mileage = textField(data.mileage, "주행거리", 50);
    const region = textField(data.region, "보관지역", 300);
    const memo = textField(data.memo, "특이사항", 2_000);

    if (!phone) {
      throw new InvalidEstimate("연락 가능한 전화번호를 입력해 주세요.");
    }
    if (!model) {
      throw new InvalidEstimate("바이크 모델명을 입력해 주세요.");
    }

    const validPhotos = photos
      .slice(0, MAX_PHOTOS)
      .filter((photo) => photo.size > 0 && photo.size <= MAX_PHOTO_BYTES);

    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    if (!botToken || !chatId) {
      console.error("Estimate notification is not configured.");
      return NextResponse.json(
        { success: false, error: "온라인 견적 접수가 일시적으로 중단되었습니다. 전화 또는 카카오톡으로 문의해 주세요." },
        { status: 503 }
      );
    }

    const kstTime = new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Seoul",
    }).format(new Date());

    const makeText = (photoStatus: "included" | "separate" | "failed") => [
      "🔔 [넥스트바이크] 신규 견적 문의 접수!",
      "━━━━━━━━━━━━━━━━━━",
      `📞 연락처: ${phone}`,
      `🏍️ 바이크 모델: ${model}`,
      `📅 연식: ${year || "미입력"}`,
      `🛣️ 주행거리: ${mileage || "미입력"}`,
      `📍 보관지역: ${region || "미입력"}`,
      `📝 특이사항: ${memo || "없음"}`,
      validPhotos.length > 0
        ? photoStatus === "separate"
          ? `📷 첨부사진: ${validPhotos.length}장 별도 전송 예정`
          : photoStatus === "included"
            ? `📷 첨부사진: ${validPhotos.length}장 첨부됨`
            : `⚠️ 첨부사진 ${validPhotos.length}장 전송 실패: 고객에게 사진을 다시 요청해 주세요.`
        : "",
      `⏰ 접수일시: ${kstTime}`,
      "━━━━━━━━━━━━━━━━━━",
      "👉 고객님께 빠른 유선/문자 상담을 진행해 주세요.",
    ].filter(Boolean).join("\n");

    // Each Telegram call gets its own fresh timeout signal so a slow photo upload
    // never aborts the fallback text message.
    const send = async (method: string, options: RequestInit, timeoutMs = PER_REQUEST_TIMEOUT_MS): Promise<boolean> => {
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
          ...options,
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!response.ok) return false;
        const result: unknown = await response.json();
        return !!result && typeof result === "object" && "ok" in result && result.ok === true;
      } catch {
        return false;
      }
    };
    const sendText = (text: string) => send("sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }, 8_000);

    let delivered = false;
    let photosDelivered = true;
    const text = makeText("included");

    if (validPhotos.length === 0) {
      delivered = await sendText(text);
    } else {
      const separateText = text.length > 1024;
      const textDelivered = separateText ? await sendText(makeText("separate")) : false;

      const caption = separateText
        ? `📷 견적 문의 사진 ${validPhotos.length}장\n📞 ${phone}\n🏍️ ${model}`
        : text;
      const mediaForm = new FormData();
      mediaForm.append("chat_id", chatId);
      let method: string;
      if (validPhotos.length === 1) {
        method = "sendPhoto";
        mediaForm.append("caption", caption);
        const safeFileName = validPhotos[0].name && /\.[a-z0-9]+$/i.test(validPhotos[0].name)
          ? validPhotos[0].name
          : "bike_0.jpg";
        mediaForm.append("photo", validPhotos[0], safeFileName);
      } else {
        method = "sendMediaGroup";
        const media = validPhotos.map((photo, index) => {
          const key = `photo_${index}`;
          const safeFileName = photo.name && /\.[a-z0-9]+$/i.test(photo.name)
            ? photo.name
            : `bike_${index}.jpg`;
          mediaForm.append(key, photo, safeFileName);
          return { type: "photo", media: `attach://${key}`, caption: index === 0 ? caption : undefined };
        });
        mediaForm.append("media", JSON.stringify(media));
      }

      photosDelivered = await send(method, { method: "POST", body: mediaForm }, 10_000);

      // If sendPhoto/sendMediaGroup fails (e.g., HEIC/HEIF or non-standard image dimensions),
      // try sending as document when 1 photo, and always ensure the text lead is delivered.
      if (!photosDelivered && validPhotos.length === 1) {
        const docForm = new FormData();
        docForm.append("chat_id", chatId);
        docForm.append("caption", caption);
        docForm.append("document", validPhotos[0], validPhotos[0].name || "bike_photo.jpg");
        photosDelivered = await send("sendDocument", { method: "POST", body: docForm }, 8_000);
      }

      delivered = photosDelivered || textDelivered;
      if (!delivered) {
        delivered = await sendText(makeText("failed"));
      }
    }

    if (!delivered) {
      console.error("Estimate notification delivery failed.");
      return NextResponse.json(
        { success: false, error: "견적 신청을 전달하지 못했습니다. 다시 시도하거나 전화 또는 카카오톡으로 문의해 주세요." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, photosDelivered });
  } catch (error) {
    if (error instanceof InvalidEstimate) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("Estimate request could not be processed.");
    return NextResponse.json(
      { success: false, error: "견적 신청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
