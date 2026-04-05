import { Component } from "react";
import { Icon } from "@iconify/react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-500 dark:text-gray-400 px-6 text-center">
          <Icon icon="mdi:alert-circle-outline" className="text-6xl text-red-400" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Algo salió mal
          </h1>
          <p className="text-sm max-w-sm">
            Ocurrió un error inesperado. Intenta recargar la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
