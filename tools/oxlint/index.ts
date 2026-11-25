import { noBareErrorRule } from "./rules/no-bare-error.ts";

export default {
  meta: {
    name: "streetthai",
  },
  rules: {
    "no-bare-error": noBareErrorRule,
  },
};
