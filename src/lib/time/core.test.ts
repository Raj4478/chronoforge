import { describe, expect, it } from "vitest";
import {
  durationBetween,
  formatClock,
  formatHhMm,
  formatHoursMinutesLabel,
  minutesToDecimal,
  parseTimeToMinutes,
  roundTo,
} from "./core";

describe("parseTimeToMinutes", () => {
  it("parses valid times", () => {
    expect(parseTimeToMinutes("00:00")).toBe(0);
    expect(parseTimeToMinutes("09:30")).toBe(570);
    expect(parseTimeToMinutes("23:59")).toBe(1439);
    expect(parseTimeToMinutes("9:05")).toBe(545);
  });
  it("rejects invalid input", () => {
    expect(parseTimeToMinutes("")).toBeNull();
    expect(parseTimeToMinutes(null)).toBeNull();
    expect(parseTimeToMinutes("24:00")).toBeNull();
    expect(parseTimeToMinutes("12:60")).toBeNull();
    expect(parseTimeToMinutes("noon")).toBeNull();
  });
});

describe("durationBetween", () => {
  it("computes same-day durations", () => {
    expect(durationBetween(540, 1020)).toBe(480); // 9:00 -> 17:00
  });
  it("wraps overnight in auto mode", () => {
    expect(durationBetween(1320, 360)).toBe(480); // 22:00 -> 06:00
  });
  it("respects explicit crossesMidnight=false", () => {
    expect(durationBetween(1320, 360, false)).toBe(0);
  });
  it("forces a wrap when crossesMidnight=true even if end > start", () => {
    expect(durationBetween(540, 600, true)).toBe(1440 - 60 + 120); // 09:00->10:00 next day
  });
});

describe("formatters", () => {
  it("formats hh:mm", () => {
    expect(formatHhMm(95)).toBe("1:35");
    expect(formatHhMm(2550)).toBe("42:30");
    expect(formatHhMm(0)).toBe("0:00");
  });
  it("formats friendly label", () => {
    expect(formatHoursMinutesLabel(95)).toBe("1h 35m");
    expect(formatHoursMinutesLabel(60)).toBe("1h");
    expect(formatHoursMinutesLabel(0)).toBe("0m");
  });
  it("formats clock 12h/24h", () => {
    expect(formatClock(0, "12h")).toBe("12:00 AM");
    expect(formatClock(780, "12h")).toBe("1:00 PM");
    expect(formatClock(780, "24h")).toBe("13:00");
    expect(formatClock(1439, "12h")).toBe("11:59 PM");
  });
});

describe("numeric helpers", () => {
  it("converts minutes to decimal", () => {
    expect(minutesToDecimal(90)).toBe(1.5);
    expect(minutesToDecimal(15)).toBe(0.25);
  });
  it("rounds without float drift", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(0.1 + 0.2, 2)).toBe(0.3);
    expect(roundTo(42.499, 2)).toBe(42.5);
  });
});
