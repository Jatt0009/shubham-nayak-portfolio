"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { hasError: boolean; message: string };

/**
 * Catches client render/lifecycle errors so a failed chunk or hook does not yield a silent white screen.
 */
export default class ClientRootBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "Unknown error" };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ClientRootBoundary]", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
          <h1 className="font-heading text-2xl font-bold tracking-tight">This page couldn&apos;t render</h1>
          <p className="max-w-md text-sm text-secondary">{this.state.message}</p>
          <button
            type="button"
            className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
