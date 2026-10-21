import { createContext, useContext, useState, useCallback } from "react";
import ResumeTemplateModal from "../components/ResumeTemplateModal";

const ResumeModalContext = createContext(null);

export function ResumeModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialTemplate, setInitialTemplate] = useState("modern");

  const openResumeModal = useCallback((templateId = "modern") => {
    setInitialTemplate(templateId);
    setIsOpen(true);
  }, []);

  const closeResumeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ResumeModalContext.Provider value={{ isOpen, openResumeModal, closeResumeModal }}>
      {children}
      <ResumeTemplateModal
        isOpen={isOpen}
        onClose={closeResumeModal}
        defaultTemplate={initialTemplate}
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
