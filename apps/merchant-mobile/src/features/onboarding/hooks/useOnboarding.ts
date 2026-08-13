import { useState } from "react";
import { Currency, OnboardingScreenStep } from "../../../types";

export function useOnboarding() {
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingScreenStep>("welcome");
  const [storeName, setStoreName] = useState("Café del Parque");
  const [category, setCategory] = useState("Gastronomía");
  const [preference, setPreference] = useState<Currency>("ARS");
  const [username, setUsername] = useState("Café del Parque");
  const [password, setPassword] = useState("");

  const goToStep = (step: OnboardingScreenStep) => {
    setOnboardingStep(step);
  };

  return {
    onboardingStep,
    storeName,
    setStoreName,
    category,
    setCategory,
    preference,
    setPreference,
    username,
    setUsername,
    password,
    setPassword,
    goToStep,
  };
}
