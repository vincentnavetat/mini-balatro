import { useCallback } from "react";
import { useNavigate, type NavigateOptions, type To } from "react-router";

/**
 * Wraps useNavigate and always enables the View Transitions API for route changes.
 */
export function useNavigateWithTransition() {
  const navigate = useNavigate();
  return useCallback(
    (to: To, options?: NavigateOptions) => {
      navigate(to, { ...options, viewTransition: true });
    },
    [navigate]
  );
}
