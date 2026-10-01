import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const executeMock = vi.fn();
const getReceiptMock = vi.fn();

vi.mock("@hashgraph/sdk", () => ({
  Client: {
    forTestnet: () => ({
      setOperator: vi.fn(),
      close: vi.fn(),
    }),
  },
  PrivateKey: {
    fromStringECDSA: vi.fn(() => "mock-private-key"),
  },
  TopicMessageSubmitTransaction: class {
    constructor(public input: unknown) {}

    execute() {
      return executeMock();
    }
  },
}));

describe("POST /api/sustainability/select", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    process.env.HEDERA_ACCOUNT_ID = "0.0.123";
    process.env.HEDERA_PRIVATE_KEY = "mock-key";
    process.env.HCS_TOPIC_ID = "0.0.456";

    getReceiptMock.mockResolvedValue({
      status: {
        toString: () => "SUCCESS",
      },
    });

    executeMock.mockResolvedValue({
      transactionId: {
        toString: () => "0.0.123@1234567890.000000000",
      },
      getReceipt: getReceiptMock,
    });
  });

  it("records a structured sustainability project selection", async () => {
    const { POST } = await import("../route");

    const request = new NextRequest("http://localhost/api/sustainability/select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceTimestamp: "123",
        name: "Example Reforestation Project",
        registryName: "Verra",
        methodology: "VM0047",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.topicId).toBe("0.0.456");
    expect(body.status).toBe("SUCCESS");

    expect(body.event).toMatchObject({
      eventType: "sustainability_project_selection",
      project: {
        sourceTimestamp: "123",
        name: "Example Reforestation Project",
        registryName: "Verra",
        methodology: "VM0047",
      },
    });

    expect(typeof body.event.selectedAt).toBe("string");
  });

  it("returns 500 when Hedera configuration is incomplete", async () => {
    delete process.env.HEDERA_ACCOUNT_ID;

    const { POST } = await import("../route");

    const request = new NextRequest("http://localhost/api/sustainability/select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceTimestamp: "123",
        name: "Example Project",
        registryName: "Verra",
        methodology: "VM0047",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Hedera configuration is incomplete.");
  });
});
