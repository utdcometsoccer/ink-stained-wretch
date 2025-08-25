import { describe, it, expect } from "vitest";
import { isValidCulture } from "../src/utilities/isValidCulture";

describe("isValidCulture", () => {
  it("validates en-US as true", () => {
    expect(isValidCulture("en-US")).toBe(true);
  });
  it("validates fr-FR as true", () => {
    expect(isValidCulture("fr-FR")).toBe(true);
  });
  it("validates ja-JP as true", () => {
    expect(isValidCulture("ja-JP")).toBe(true);
  });
  it("validates en-GB as true", () => {
    expect(isValidCulture("en-GB")).toBe(true);
  });
  it("validates es-US as true", () => {
    expect(isValidCulture("es-US")).toBe(true);
  });
  it("validates es-MX as true", () => {
    expect(isValidCulture("es-MX")).toBe(true);
  });
});
