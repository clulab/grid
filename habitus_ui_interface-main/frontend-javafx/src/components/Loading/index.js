import { StyledLoading } from "./styles";

import { Icon } from "@iconify/react";
import React from "react";

export const Loading = () => {
  return (
    <StyledLoading>
      <Icon icon="line-md:loading-twotone-loop" width="50" height="50" color='#283B62' />
    </StyledLoading>

  );
};
