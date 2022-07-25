import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { useDockerDesktopClient } from "../dockerDesktopClient";
import { BuilderStep } from "./BuilderStep";
import { ImageBuilderContextProvider } from "./ImageBuilderContext";
import { SpecifyBaseImageStep } from "./SpecifyBaseImageStep";
import { StartBaseImageStep } from "./StartBaseImageStep";

export const BuildImageWizard = () => {
  const [step, setStep] = useState(0);

  const onStepOneCompletion = useCallback(() => {
    setStep((step) => step + 1);
  }, [setStep]);

  const onBaseImageStartCompletion = useCallback(() => {
    setStep((step) => step + 1);
  }, [setStep])

  return (
    <ImageBuilderContextProvider>
      { step === 0 && (
        <SpecifyBaseImageStep onCompletion={onStepOneCompletion} />
      )}
      { step === 1 && (
        <StartBaseImageStep onCompletion={onBaseImageStartCompletion} />
      )}
      { step === 2 && (
        <BuilderStep />
      )}
    </ImageBuilderContextProvider>
  );
}