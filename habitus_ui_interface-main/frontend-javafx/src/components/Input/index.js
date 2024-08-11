import { IconContainer, InputContainer,StyledInput  } from "./styles";

import { Icon } from "@iconify/react";
import React from "react";

export const Input = ({ icon, placeholder, onKeyPress, onInput }) => {
  return (
    <InputContainer>
      <StyledInput placeholder={placeholder} onKeyPress={onKeyPress} onInput={onInput} />
      <IconContainer>
        <Icon icon={icon} width="24" height="24" color="#007BFF" style={{ cursor: 'pointer' }}/>
      </IconContainer>
    </InputContainer>
  );
};
