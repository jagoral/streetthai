import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import { noBareErrorRule } from "../rules/no-bare-error.ts";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run("no-bare-error", noBareErrorRule, {
  valid: [
    "class PassExpiredError extends Error { constructor() { super('Pass expired.'); this.name = 'PassExpiredError'; } }",
    "throw new PassExpiredError();",
    "const isErr = value instanceof Error;",
    "const check = Error.isError(value);",
    {
      code: "function handle(err: Error) { return err.message; }",
      filename: "example.ts",
    },
  ],
  invalid: [
    {
      code: 'throw new Error("something went wrong");',
      errors: [{ messageId: "noBareError" }],
    },
    {
      code: 'const err = Error("something went wrong");',
      errors: [{ messageId: "noBareError" }],
    },
    {
      code: 'throw new globalThis.Error("boom");',
      errors: [{ messageId: "noBareError" }],
    },
    {
      code: 'throw globalThis.Error("boom");',
      errors: [{ messageId: "noBareError" }],
    },
  ],
});
