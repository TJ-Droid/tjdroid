import React from "react";
import { Container, StyledActivityIndicator } from "./styles";

export type LoadingSpinnerPropsType = {
  size?: number;
};

export default function LoadingSpinner({ size = 80 }: LoadingSpinnerPropsType) {
  return (
    <Container>
      <StyledActivityIndicator size={size} />
    </Container>
  );
}
