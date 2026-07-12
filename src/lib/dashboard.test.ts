import { describe, expect, it } from "vitest";
import { getFeaturedGoalProgress } from "@/lib/dashboard";

describe("getFeaturedGoalProgress", () => {
  it("returns a safe value before a goal has loaded", () => {
    expect(getFeaturedGoalProgress()).toBe(0);
  });

  it("calculates and bounds a valid goal percentage", () => {
    expect(getFeaturedGoalProgress({ current: 250, target: 1000 })).toBe(25);
    expect(getFeaturedGoalProgress({ current: 1200, target: 1000 })).toBe(100);
    expect(getFeaturedGoalProgress({ current: -10, target: 1000 })).toBe(0);
  });
});
