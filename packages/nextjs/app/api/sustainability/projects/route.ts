import { NextRequest, NextResponse } from "next/server";
import { searchGuardianProjectsTool } from "@nature-wired/hedera-guardian-agent-plugin";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query")?.trim() || "forest";

    const requestedPageSize = Number(request.nextUrl.searchParams.get("pageSize") || "10");

    const pageSize = Math.min(Math.max(Number.isFinite(requestedPageSize) ? requestedPageSize : 10, 1), 50);

    const tool = searchGuardianProjectsTool({});

    const result = await tool.coreAction(
      {
        query,
        pageSize,
      },
      {},
      undefined,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Sustainability Atlas search failed:", error);

    return NextResponse.json(
      {
        error: "Unable to search Sustainability Atlas projects.",
      },
      { status: 500 },
    );
  }
}
