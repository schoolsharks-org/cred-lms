import { Box, styled } from "@mui/material";
import React, { ChangeEvent, ClipboardEvent, KeyboardEvent, FocusEvent } from "react";
import { Input as BaseInput } from "@mui/base/Input";


const InputElement = styled("input")(
  () => `
    width: 32px;
    height:40px;
    font-family: sans-serif;
    font-size: 1.5rem;
    font-weight: 900;
    padding: 12px 5px;
    color:#800000;
    text-align: center;
    border:none;
    background: transparent;
    background:#F9E1E2;
    aspect-ratio:1/1;
    height:70px;
    width:70px;
    &:hover {
      border: none;
    }
      
    &:focus {
        border:none;
    }
  
    &:focus-visible {
      outline: 0;
    }
  `
);

interface PINProps {
  separator?: React.ReactNode;
  length: number;
  value: string;
  onChange: (value: string) => void;
}

export function PIN({ separator, length, value, onChange }: PINProps) {
  const [displayedValue, setDisplayedValue] = React.useState<string[]>(
    new Array(length).fill("")
  );

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(new Array(length).fill(null));

  const focusInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput?.focus();
  };

  const selectInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput?.select();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case " ":
        event.preventDefault();
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case "Delete":
      case "Backspace":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        onChange(
          value.slice(0, currentIndex) + value.slice(currentIndex + 1)
        );
        setDisplayedValue((prev) =>
          prev.map((val, idx) => (idx === currentIndex ? "" : val))
        );
        break;
      default:
        break;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>, currentIndex: number) => {
    const currentValue = event.target.value;
    const indexToEnter = Math.min(currentIndex, length - 1);

    onChange(
      value.substring(0, indexToEnter) + currentValue.slice(-1) + value.substring(indexToEnter + 1)
    );
    setDisplayedValue((prev) =>
      prev.map((val, idx) => (idx === currentIndex ? "." : val))
    );
    if (currentValue !== "" && currentIndex < length - 1) {
      focusInput(currentIndex + 1);
    }
  };

  const handleClick = (event: FocusEvent<HTMLInputElement>, currentIndex: number) => {
    event;
    selectInput(currentIndex);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>, currentIndex: number) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text/plain").substring(0, length);

    const otpArray = value.split("");
    const displayedArray = displayedValue.slice();

    for (let i = currentIndex; i < length; i++) {
      const lastValue = pastedText[i - currentIndex] ?? " ";
      otpArray[i] = lastValue;
      displayedArray[i] = ".";
    }

    onChange(otpArray.join(""));
    setDisplayedValue(displayedArray);
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {new Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <BaseInput
            slots={{
              input: InputElement,
            }}
            aria-label={`Digit ${index + 1} of OTP`}
            slotProps={{
              input: {
                ref: (ele: HTMLInputElement | null) => {
                  inputRefs.current[index] = ele;
                },
                onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => handleKeyDown(event, index),
                onChange: (event: ChangeEvent<HTMLInputElement>) => handleChange(event, index),
                onClick: (event: any) => handleClick(event, index),
                onPaste: (event: ClipboardEvent<HTMLInputElement>) => handlePaste(event, index),
                value: value[index] ? "*" : "",
              },
            }}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}
