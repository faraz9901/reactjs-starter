import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AsyncState } from "./async-state";

describe("AsyncState", () => {
  it("renders the skeleton while loading — never the content", () => {
    render(
      <AsyncState isLoading skeleton={<p>loading…</p>}>
        <p>content</p>
      </AsyncState>,
    );

    expect(screen.getByText("loading…")).toBeInTheDocument();
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("renders a retry affordance on error — never the empty state", () => {
    const onRetry = vi.fn();
    render(
      <AsyncState isError isEmpty onRetry={onRetry} empty={<p>nothing here</p>}>
        <p>content</p>
      </AsyncState>,
    );

    expect(screen.queryByText("nothing here")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("calls onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    render(
      <AsyncState isError onRetry={onRetry}>
        <p>content</p>
      </AsyncState>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders the empty node when the request succeeded with zero items", () => {
    render(
      <AsyncState isEmpty empty={<p>nothing here</p>}>
        <p>content</p>
      </AsyncState>,
    );

    expect(screen.getByText("nothing here")).toBeInTheDocument();
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("renders the idle node while disabled", () => {
    render(
      <AsyncState enabled={false} idle={<p>pick something first</p>} isLoading>
        <p>content</p>
      </AsyncState>,
    );

    expect(screen.getByText("pick something first")).toBeInTheDocument();
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("renders content when none of the states apply", () => {
    render(
      <AsyncState>
        <p>content</p>
      </AsyncState>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
