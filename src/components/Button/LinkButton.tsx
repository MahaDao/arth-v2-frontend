import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';


interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  to?: string;
  variant?: 'default' | 'secondary' | 'tertiary' | 'outlined' | 'rounded';
}

const LinkButton: React.FC<ButtonProps> = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
  variant,
}) => {
  const { color, spacing } = useContext(ThemeContext);

  let buttonColor: string;
  switch (variant) {
    case 'secondary':
      buttonColor = color.teal[200];
      break;
    case 'default':
    default:
      buttonColor = color.primary.main;
  }

  let boxShadow: string;
  let buttonSize: number;
  let buttonPadding: number;
  let fontSize: number;
  switch (size) {
    case 'sm':
      buttonPadding = spacing[3];
      buttonSize = 36;
      fontSize = 14;
      break;
    case 'lg':
      buttonPadding = spacing[4];
      buttonSize = 72;
      fontSize = 16;
      break;
    case 'md':
    default:
      buttonPadding = spacing[4];
      buttonSize = 56;
      fontSize = 16;
  }


  return (
    <StyledExternalLink href={href} target="__blank">
      <StyledButton
        boxShadow={boxShadow}
        color={buttonColor}
        disabled={disabled}
        fontSize={fontSize}
        onClick={onClick}
        padding={buttonPadding}
        size={buttonSize}
        outlined={variant === 'outlined'}
        rounded={variant === 'rounded'}
      >
        {children}
      </StyledButton>
    </StyledExternalLink>

  );
};

interface StyledButtonProps {
  boxShadow: string;
  color: string;
  disabled?: boolean;
  fontSize: number;
  padding: number;
  size: number;
  outlined: boolean;
  rounded: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  white-space: nowrap;
  background: ${(props) => props.rounded ? 'rgba(255, 255, 255, 0.08)' : (props.outlined ? 'transparent' : 'linear-gradient(38.44deg, #F47F57 15.81%, #FD5656 87.57%)')};
  border: ${(props) => props.outlined ? '1px solid rgba(255, 255, 255, 0.32)' : '0'};
  border-radius: ${(props) => props.rounded ? '19px' : '6px'};
  box-shadow: ${(props) => props.boxShadow};
  color: ${(props) => props.rounded ? '#FF7F57' : (props.outlined ? '#F5F5F5' : '#fff')};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  height: 38px;
  justify-content: center;
  outline: none !important;
  padding: 10px 22px;
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
  width: 100%;
  &:hover {
    background: ${(props) => props.outlined ? 'transparent' : '#FF7F57'};
    border: ${(props) => props.outlined ? '1px solid rgba(255, 255, 255, 0.64)' : '0'};
    color: ${(props) => props.outlined ? '#F5F5F5' : '#fff'};
  }
  &:selected {
    background: linear-gradient(180deg, #F47F57 -11.33%, #FD5656 100%);
  }
  &:focus: {
    outline: none;
  }
  &:disabled {
    background: ${(props) => props.outlined ? 'transparent' : 'rgba(255,255,255,0.32)'};
    color: rgba(255, 255, 255, 0.32);
    cursor: not-allowed;
  }
`;

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 38px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`;

export default LinkButton;
