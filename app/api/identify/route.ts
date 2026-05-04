import { NextRequest, NextResponse } from "next/server";
// import { identifyScat } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const _body = await req.json();
    // TODO: extract base64 image from body, call identifyScat(), return card data
    // const { imageBase64, mimeType } = body;
    // const card = await identifyScat(imageBase64, mimeType);
    // return NextResponse.json(card);

    return NextResponse.json({ message: "Identify route placeholder — not yet implemented" }, { status: 501 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
