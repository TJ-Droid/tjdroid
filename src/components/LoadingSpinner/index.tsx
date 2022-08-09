import React from "react";
import { Container, StyledActivityIndicator } from "./styles";

export default function LoadingSpinner() {
  return (
    <Container>
      <StyledActivityIndicator size={80} />
    </Container>
  );
}
