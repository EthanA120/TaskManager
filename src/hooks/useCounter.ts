import { useState, useCallback } from "react";

function useCounter(initialValue = 0, initialStep = 1) {
  const [count, setCount] = useState(initialValue);
  const [step, setStep] = useState(initialStep);

  const handleInc = useCallback(() => {
    setCount((prev) => prev + step);
  }, [step]);

  const handleDec = useCallback(() => {
    setCount((prev) => prev - step);
  }, [step]);

  return { count, step, handleInc, handleDec, setStep };
}

export default useCounter;
