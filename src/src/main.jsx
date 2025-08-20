import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
// import React from "react"
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { IsLoginAuthenticateProvider } from "./Contexts/LoginContext";
import { IsToastProvider } from "./Contexts/ToastContext";
import { API_BASE_URL } from "./Url/Url";
import "./index.css";
import global_en from "../translation/en/global.json";

import global_th from "../translation/th/global.json";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";

i18next.init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem("lang_code") === "2" ? "th" : "en", // 👈 Use stored lang_code ("1" or "2")
  resources: {
    en: {
      global: global_en,
    },
    th: {
      global: global_th,
    },
  },
});

function fallbackRender({ error, resetErrorBoundary }) {
  return (
    <div
      role="alert"
      className="bg-blue-50 w-full h-screen flex gap-3 items-center  justify-center flex-col p-4 py-12"
    >
      <i className="mdi mdi-truck-alert text-8xl" />

      <p>Something went wrong</p>
      <pre className="bg-black p-3 rounded text-white max-w-2xl w-full whitespace-normal font-bold">
        {error.message}
      </pre>
      <button
        onClick={() => resetErrorBoundary()}
        type="button"
        className="px-4 rounded py-2 bg-black text-white font-bold"
      >
        Refresh
      </button>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(`${API_BASE_URL}${queryKey[0]}`);
  return data?.data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: false,
      refetchInterval: 30000,
    },
  },
});

root.render(
  <ErrorBoundary
    fallbackRender={fallbackRender}
    onReset={(details) => {
      location.reload();
    }}
  >
    <QueryClientProvider client={queryClient}>
      <IsLoginAuthenticateProvider>
        <IsToastProvider>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </I18nextProvider>
        </IsToastProvider>
      </IsLoginAuthenticateProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
