import { NextRequest, NextResponse } from "next/server";
import { Client, PrivateKey, TopicMessageSubmitTransaction } from "@hashgraph/sdk";

type SelectionRequest = {
  sourceTimestamp: string | null;
  name: string | null;
  registryName: string | null;
  methodology: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKeyValue = process.env.HEDERA_PRIVATE_KEY;
    const topicId = process.env.HCS_TOPIC_ID;

    if (!accountId || !privateKeyValue || !topicId) {
      return NextResponse.json({ error: "Hedera configuration is incomplete." }, { status: 500 });
    }

    const project = (await request.json()) as SelectionRequest;

    const message = {
      eventType: "sustainability_project_selection",
      project: {
        sourceTimestamp: project.sourceTimestamp,
        name: project.name,
        registryName: project.registryName,
        methodology: project.methodology,
      },
      selectedAt: new Date().toISOString(),
    };

    const client = Client.forTestnet();

    client.setOperator(accountId, PrivateKey.fromStringECDSA(privateKeyValue));

    const transaction = await new TopicMessageSubmitTransaction({
      topicId,
      message: JSON.stringify(message),
    }).execute(client);

    const receipt = await transaction.getReceipt(client);

    client.close();

    return NextResponse.json({
      success: true,
      topicId,
      transactionId: transaction.transactionId.toString(),
      status: receipt.status.toString(),
      event: message,
    });
  } catch (error) {
    console.error("HCS project selection failed:", error);

    return NextResponse.json({ error: "Unable to record project selection on Hedera." }, { status: 500 });
  }
}
