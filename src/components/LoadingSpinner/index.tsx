import React from "react";
import { Container, StyuledActivityIndicator } from "./styles";

export default function LoadingSpinner() {
  return (
    <Container>
      <StyuledActivityIndicator size={80} />
    </Container>
  );
}
