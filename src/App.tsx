import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ClientPreviewMockLayout from "./components/layout/ClientPreviewMockLayout";
import { PageLoader } from "./components/ui/Spinner";

const ClientPreviewMockTestsPage = lazy(
  () => import("./pages/tests/ClientPreviewMockTestsPage"),
);
const ClientPreviewMockSetupPage = lazy(
  () => import("./pages/tests/ClientPreviewMockSetupPage"),
);
const ClientPreviewSubscriptionPage = lazy(
  () => import("./pages/payment/ClientPreviewSubscriptionPage"),
);
const ClientPreviewListeningPage = lazy(
  () => import("./pages/tests/ClientPreviewListeningPage"),
);
const ClientPreviewListeningPreTestPage = lazy(
  () => import("./pages/tests/ClientPreviewListeningPreTestPage"),
);
const ClientPreviewListeningResultPage = lazy(
  () => import("./pages/tests/ClientPreviewListeningResultPage"),
);
const IELTSExamPage = lazy(() => import("./pages/tests/IELTSExamPage"));
const ClientPreviewReadingResultPage = lazy(
  () => import("./pages/tests/ClientPreviewReadingResultPage"),
);
const ClientPreviewWritingPage = lazy(
  () => import("./pages/tests/ClientPreviewWritingPage"),
);
const WritingResultPage = lazy(
  () => import("./pages/tests/WritingResultPage"),
);
const ClientPreviewSpeakingBookingPage = lazy(
  () => import("./pages/tests/ClientPreviewSpeakingBookingPage"),
);
const ClientPreviewSpeakingPreTestPage = lazy(
  () => import("./pages/tests/ClientPreviewSpeakingPreTestPage"),
);
const ClientPreviewSpeakingPage = lazy(
  () => import("./pages/tests/ClientPreviewSpeakingPage"),
);
const ClientPreviewSpeakingResultPage = lazy(
  () => import("./pages/tests/ClientPreviewSpeakingResultPage"),
);
const ClientPreviewMockResultPage = lazy(
  () => import("./pages/tests/ClientPreviewMockResultPage"),
);

const App: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/client-preview/mock-tests" replace />}
      />
      <Route
        path="/client-preview"
        element={<Navigate to="/client-preview/mock-tests" replace />}
      />

      <Route element={<ClientPreviewMockLayout />}>
        <Route
          path="/client-preview/mock-tests"
          element={<ClientPreviewMockTestsPage />}
        />
        <Route
          path="/client-preview/subscription"
          element={<ClientPreviewSubscriptionPage />}
        />
        <Route
          path="/client-preview/writing/result"
          element={<WritingResultPage preview />}
        />
        <Route
          path="/client-preview/speaking/result"
          element={<ClientPreviewSpeakingResultPage />}
        />
        <Route
          path="/client-preview/results"
          element={<ClientPreviewMockResultPage />}
        />
        <Route
          path="/client-preview/speaking/booking"
          element={<ClientPreviewSpeakingBookingPage />}
        />
      </Route>

      <Route
        path="/client-preview/mock-test/setup"
        element={<ClientPreviewMockSetupPage />}
      />
      <Route
        path="/client-preview/listening/pre-test"
        element={<ClientPreviewListeningPreTestPage />}
      />
      <Route
        path="/client-preview/listening"
        element={<ClientPreviewListeningPage />}
      />
      <Route
        path="/client-preview/listening/result"
        element={<ClientPreviewListeningResultPage />}
      />
      <Route
        path="/client-preview/reading-part-1"
        element={<IELTSExamPage showcase />}
      />
      <Route
        path="/client-preview/reading/result"
        element={<ClientPreviewReadingResultPage />}
      />
      <Route
        path="/client-preview/writing"
        element={<ClientPreviewWritingPage />}
      />
      <Route
        path="/client-preview/speaking/pre-test"
        element={<ClientPreviewSpeakingPreTestPage />}
      />
      <Route
        path="/client-preview/speaking"
        element={<ClientPreviewSpeakingPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/client-preview/mock-tests" replace />}
      />
    </Routes>
  </Suspense>
);

export default App;
