const { test } = require("@power-doctest/tester");
const { parse } = require("@power-doctest/markdown");
const { readFileSync } = require("fs");
const { join } = require("path");

const contentPath = join(__dirname, "./README.md");
const content = readFileSync(contentPath, "utf-8");
const parsedResults = parse({ content, filePath: contentPath });
describe("doctest:markdown", () => {
  parsedResults.forEach(parsedCode => {
    const { location } = parsedCode;
    it(`README.md:${location.start.line}-${location.end.line}`, async () => {
      try {
        await test({ ...parsedCode, code: `const { select, createTable, insertInto } = require("${join(__dirname, "./index")}"); ${parsedCode.code}` });
      } catch(e) {
        console.error(
          `StrictEvalError: strict eval is failed at strictEval (README.md:${location.start.line}:${location.start.column})`
        );
        throw e;
      }
    });
  });
});
