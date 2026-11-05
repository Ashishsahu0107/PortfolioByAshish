import { createContext, useContext, useMemo } from "react";
import { usePortfolioData } from "./PortfolioDataContext";

const DeveloperContext = createContext(null);

function formatDeveloper(data) {
  if (!data) return null;
  return {
    ...data,
    firstName: data.firstName || data.name?.trim().split(/\s+/)[0] || "",
    lastName: data.lastName || data.name?.trim().split(/\s+/).slice(1).join(" ") || "",
    locationShort: data.locationShort || data.location?.split(",")[0].trim() || data.location || "",
  };
}

export function DeveloperProvider({ children }) {
  const { developer: rawDeveloper, refreshBundle } = usePortfolioData();
  const developer = useMemo(() => formatDeveloper(rawDeveloper), [rawDeveloper]);

  return (
    <DeveloperContext.Provider
      value={{
        developer,
        loading: !developer,
        error: null,
        refreshDeveloper: refreshBundle,
      }}
    >
      {children}
    </DeveloperContext.Provider>
  );
}

export function useDeveloper() {
  const context = useContext(DeveloperContext);
  return context || { developer: null, loading: false, error: null };
}
