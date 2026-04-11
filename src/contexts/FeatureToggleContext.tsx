import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { getFeatureToggles } from "../api/feature_toggles_interface/getFeatureToggles";
import type { FeatureToggles } from "../types";
import LoadingSpinner from "../components/common/LoadingSpinner";

/** Defaults match plantpass-backend FeatureTogglesHandler DEFAULT_FEATURES */
const DEFAULT_FEATURES: FeatureToggles = {
  collectEmailAddresses: true,
  passwordProtectAdmin: true,
  protectPlantPassAccess: false,
};

interface FeatureToggleContextValue {
  features: FeatureToggles;
  /** False once the provider has finished the first fetch (the app gates rendering until then). */
  loading: boolean;
  refreshFeatureToggles: () => void;
}

const FeatureToggleContext = createContext<FeatureToggleContextValue | undefined>(undefined);

export function useFeatureToggles(): FeatureToggleContextValue {
  const context = useContext(FeatureToggleContext);
  if (!context) {
    throw new Error("useFeatureToggles must be used within a FeatureToggleProvider");
  }
  return context;
}

interface FeatureToggleProviderProps {
  children: ReactNode;
}

export function FeatureToggleProvider({ children }: FeatureToggleProviderProps): React.ReactElement {
  const [features, setFeatures] = useState<FeatureToggles>(DEFAULT_FEATURES);
  const [ready, setReady] = useState(false);
  const isFirstLoadRef = useRef(true);

  const loadFeatureToggles = useCallback(async (): Promise<void> => {
    const bootstrap = isFirstLoadRef.current;
    try {
      const response = await getFeatureToggles();
      setFeatures(response);
      localStorage.setItem("featureToggles", JSON.stringify(response));
    } catch {
      if (bootstrap) {
        let fallback = DEFAULT_FEATURES;
        try {
          const stored = localStorage.getItem("featureToggles");
          if (stored) {
            fallback = JSON.parse(stored) as FeatureToggles;
          }
        } catch {
          // keep DEFAULT_FEATURES
        }
        setFeatures(fallback);
      }
    } finally {
      if (bootstrap) {
        isFirstLoadRef.current = false;
        setReady(true);
      }
    }
  }, []);

  useEffect(() => {
    void loadFeatureToggles();

    const handleStorageChange = (): void => {
      void loadFeatureToggles();
    };

    const handleFeatureTogglesUpdated = (): void => {
      void loadFeatureToggles();
    };

    const handleVisibilityChange = (): void => {
      if (!document.hidden) {
        void loadFeatureToggles();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("featureTogglesUpdated", handleFeatureTogglesUpdated);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("featureTogglesUpdated", handleFeatureTogglesUpdated);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadFeatureToggles]);

  const refreshFeatureToggles = useCallback((): void => {
    void loadFeatureToggles();
  }, [loadFeatureToggles]);

  if (!ready) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <FeatureToggleContext.Provider
      value={{ features, loading: false, refreshFeatureToggles }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
}
