import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const coreActionMock = vi.fn();

vi.mock("@nature-wired/hedera-guardian-agent-plugin", () => ({
  searchGuardianProjectsTool: () => ({
    coreAction: coreActionMock,
  }),
}));

describe("GET /api/sustainability/projects", () => {
  beforeEach(() => {
    coreActionMock.mockReset();
  });

  it("returns structured Sustainability Atlas project data", async () => {
    coreActionMock.mockResolvedValue({
      raw: {
        query: "reforestation",
        count: 1,
        projects: [
          {
            sourceTimestamp: "123",
            name: "Example Reforestation Project",
            country: "Peru",
            registryName: "Verra",
            developer: "Example Developer",
            methodology: "VM0047",
            category: "ARR",
            sector: "Forestry",
            status: "Issuing",
            lifecycleStage: "Registered",
            sdgs: [13, 15],
          },
        ],
      },
      humanMessage: 'Found 1 Sustainability Atlas project result(s) for "reforestation".',
    });

    const { GET } = await import("../route");

    const request = new NextRequest("http://localhost/api/sustainability/projects?query=reforestation&pageSize=3");

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.raw.count).toBe(1);
    expect(body.raw.projects[0].name).toBe("Example Reforestation Project");

    expect(coreActionMock).toHaveBeenCalledWith(
      {
        query: "reforestation",
        pageSize: 3,
      },
      {},
      undefined,
    );
  });

  it("returns a 500 response when Atlas search fails", async () => {
    coreActionMock.mockRejectedValue(new Error("Atlas unavailable"));

    const { GET } = await import("../route");

    const request = new NextRequest("http://localhost/api/sustainability/projects?query=forest");

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Unable to search Sustainability Atlas projects.");
  });
});
