import { expect, test } from "vitest";

test("a fetch to a non-localhost origin is blocked by the page's Content-Security-Policy", async () => {
  const violation = nextViolation();
  await expect(fetch("https://example.com/")).rejects.toThrow(TypeError);
  expect(await violation).toBe("https://example.com/");
});

test("an image from a non-localhost origin is blocked by the page's Content-Security-Policy", async () => {
  const violation = nextViolation();
  const image = new Image();
  image.src = "https://example.com/pixel.png";
  expect(await violation).toBe("https://example.com/pixel.png");
});

test("a fetch to the localhost test server still goes through", async () => {
  const response = await fetch(location.href);
  expect(response.ok).toBe(true);
});

function nextViolation(): Promise<string> {
  return new Promise((resolve) => {
    document.addEventListener("securitypolicyviolation", (event) => resolve(event.blockedURI), {
      once: true,
    });
  });
}
