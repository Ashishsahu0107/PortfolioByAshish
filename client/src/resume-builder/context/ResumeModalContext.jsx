import { createContext, useContext, useState, useEffect, useCallback } from "react";
import ResumeDownloadConfirmModal from "../components/ResumeDownloadConfirmModal";
import { resumeApi } from "../../services/api";
import { usePortfolioSync } from "../../hooks/usePortfolioSync";

const ResumeModalContext = createContext(null);

export function ResumeModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [approvedResume, setApprovedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch approved resume from backend API
  const fetchApprovedResume = useCallback(async () => {
    try {
      setLoading(true);
      const data = await resumeApi.getApproved();
      if (data) {
        setApprovedResume(data);
        setError(null);
      } else {
        setApprovedResume(null);
        setError("No approved resume found.");
      }
    } catch (err) {
      console.warn(
        "[ResumeModalContext] Failed to load approved resume:",
        err.message
      );
      setError(err.message || "Failed to load approved resume from server.");
      setApprovedResume(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedResume();
  }, [fetchApprovedResume]);

  // Real-time synchronization: automatically updates when approval changes on backend without page refresh
  usePortfolioSync(fetchApprovedResume, "resume");

  const openResumeModal = useCallback(() => {
    setIsOpen(true);
    // Re-verify latest approved state on open
    fetchApprovedResume();
  }, [fetchApprovedResume]);

  const closeResumeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ResumeModalContext.Provider
      value={{
        isOpen,
        openResumeModal,
        closeResumeModal,
        approvedResume,
        loading,
        error,
        refreshApprovedResume: fetchApprovedResume,
      }}
    >
      {children}
      <ResumeDownloadConfirmModal
        isOpen={isOpen}
        onClose={closeResumeModal}
        approvedResume={approvedResume}
        loading={loading}
        error={error}
        onRetry={fetchApprovedResume}
      />
    </ResumeModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useResumeModal() {
  const context = useContext(ResumeModalContext);
  if (!context) {
    throw new Error("useResumeModal must be used within a ResumeModalProvider");
  }
  return context;
}

