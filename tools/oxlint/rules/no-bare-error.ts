import type { RuleTester } from "oxlint/plugins-dev";

type OxlintRule = Parameters<RuleTester["run"]>[1];
type Visitor = ReturnType<NonNullable<OxlintRule["create"]>>;
type Callee = Parameters<NonNullable<Visitor["NewExpression"]>>[0]["callee"];

export const noBareErrorRule: OxlintRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require dedicated Error subclasses instead of bare Error() or new Error() in production code.",
    },
    messages: {
      noBareError:
        "Throw a dedicated Error subclass that owns its message instead of bare {{form}}.",
    },
  },
  create(context) {
    return {
      NewExpression(node) {
        if (!isBareErrorCallee(node.callee)) return;
        context.report({
          node,
          messageId: "noBareError",
          data: { form: "new Error()" },
        });
      },
      CallExpression(node) {
        if (!isBareErrorCallee(node.callee)) return;
        context.report({
          node,
          messageId: "noBareError",
          data: { form: "Error()" },
        });
      },
    };
  },
};

function isBareErrorCallee(callee: Callee): boolean {
  if (callee.type === "Identifier" && callee.name === "Error") {
    return true;
  }
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.object.type === "Identifier" &&
    callee.object.name === "globalThis" &&
    callee.property.type === "Identifier" &&
    callee.property.name === "Error"
  ) {
    return true;
  }
  return false;
}
