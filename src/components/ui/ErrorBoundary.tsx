'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <span className="text-neutral-600 text-2xs font-mono tracking-widest uppercase">
            LOAD FAILED — {this.props.label ?? 'COMPONENT'}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
