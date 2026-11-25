import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { expect, test } from "vitest";

test("a request to a non-localhost origin fails without touching the network", async () => {
  await expect(fetch("https://example.com/")).rejects.toMatchObject({
    cause: { message: "Blocked request to non-localhost origin https://example.com" },
  });
});

test("a request to localhost still goes through", async () => {
  const server = createServer((_request, response) => response.end("ok"));
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const { port } = addressOf(server.address());
    const response = await fetch(`http://localhost:${port}/`);
    expect(await response.text()).toBe("ok");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

function addressOf(address: string | AddressInfo | null): AddressInfo {
  if (address === null || typeof address === "string") {
    throw new Error(`expected a TCP address, got ${String(address)}`);
  }
  return address;
}
