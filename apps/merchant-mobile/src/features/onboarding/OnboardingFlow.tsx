import React from "react";
import { useOnboarding } from "./hooks/useOnboarding";
import {
  WelcomeStep,
  SignInStep,
  AccountStep,
  WalletReadyStep,
  StoreStep,
  PreferenceStep,
  SummaryStep,
  ReadyStep,
} from "./components/index";

interface OnboardingFlowProps {
  onCompleteOnboarding: () => void;
}

export function OnboardingFlow({ onCompleteOnboarding }: OnboardingFlowProps) {
  const {
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
  } = useOnboarding();

  switch (onboardingStep) {
    case "welcome":
      return <WelcomeStep onStart={() => goToStep("signin")} />;
    case "signin":
      return (
        <SignInStep
          onBack={() => goToStep("welcome")}
          onGoogle={() => goToStep("account")}
        />
      );
    case "account":
      return (
        <AccountStep
          username={username}
          password={password}
          onUsername={setUsername}
          onPassword={setPassword}
          onBack={() => goToStep("signin")}
          onContinue={() => goToStep("wallet")}
        />
      );
    case "wallet":
      return (
        <WalletReadyStep
          username={username}
          onBack={() => goToStep("account")}
          onContinue={() => goToStep("store")}
        />
      );
    case "store":
      return (
        <StoreStep
          storeName={storeName}
          category={category}
          onStoreName={setStoreName}
          onCategory={setCategory}
          onBack={() => goToStep("wallet")}
          onContinue={() => goToStep("preference")}
        />
      );
    case "preference":
      return (
        <PreferenceStep
          preference={preference}
          onPreference={setPreference}
          onBack={() => goToStep("store")}
          onContinue={() => goToStep("summary")}
        />
      );
    case "summary":
      return (
        <SummaryStep
          storeName={storeName}
          category={category}
          preference={preference}
          onBack={() => goToStep("preference")}
          onConfirm={() => goToStep("ready")}
        />
      );
    case "ready":
      return (
        <ReadyStep
          storeName={storeName}
          onGoToCharge={onCompleteOnboarding}
        />
      );
    default:
      return null;
  }
}
