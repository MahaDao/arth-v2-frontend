import React, { useContext, useMemo } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  to?: string;
  theme?: 'default' | 'secondary' | 'tertiary';
  variant?: 'default' | 'transparent' | 'outlined' | 'rounded';
}

function variantToStyle(variant: string = 'default', color: any) {
  if (variant === 'transparent') {
    return {
      fg: {
        normal: color.white,
      },
      bg: {
        normal: color.transparent,
        hover: color.dark[400],
        selected: color.dark[200]
      },
      border: {
        normal: `1px solid ${color.alpha[88]}`,
        hover: `1px solid ${color.white}`,
        radius: '8px',
        radiusHover: '6px'
      }
    }
  } else if (variant === 'outlined') {
    return {
      fg: {normal: '#F5F5F5', hover: '#F5F5F5'},
      bg: {normal: color.transparent, hover: color.transparent, disabled: color.transparent},
      border: {
        normal: `1px solid ${color.alpha[32]}`,
        hover: `1px solid ${color.alpha[64]}`,
      }
    }
  } else if (variant === 'rounded') {
    return {
      fg: {normal: color.pink[300]},
      bg: {normal: color.alpha[8], disabled: color.transparent},
      border: {radius: '19px', radiusHover: '19px'}
    }
  } else {
    return {
      fg: {},
      bg: {},
      border: {}
    }
  }
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
  theme,
  variant,
}) => {
  const { color, spacing } = useContext(ThemeContext);

  const variantStyle = variantToStyle(variant, color);
  let fg = {
    normal: theme === 'secondary' ? color.teal[200] : color.white, 
    hover: color.white, 
    selected: 'rgba(255, 255, 255, 0.32)', 
    disabled: '',
    ...variantStyle.fg
  };
  let bg = {
    normal: `linear-gradient(38.44deg, ${color.pink[200]} 15.81%, ${color.pink[400]} 87.57%)`, 
    hover: color.pink[300], 
    selected: `linear-gradient(180deg, ${color.pink[200]} -11.33%, ${color.pink[400]} 100%)`, 
    disabled: color.alpha[32],
    ...variantStyle.bg
  };
  let border = {
    normal: '0',
    hover: '0',
    radius: '6px',
    radiusHover: variantStyle.border.radiusHover || '6px',
    ...variantStyle.border
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

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>;
    } else if (href) {
      return (
        <StyledExternalLink href={href} target="__blank">
          {text}
        </StyledExternalLink>
      );
    } else {
      return text;
    }
  }, [href, text, to]);

  return (
    <StyledButton
      boxShadow={boxShadow}
      fg={fg}
      bg={bg}
      border={border}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
    >
      {children}
      {ButtonChild}
    </StyledButton>
  );
};

interface StyledButtonProps {
  fg: {normal: string, hover: string, selected: string, disabled: string}
  bg: {normal: string, hover: string, selected: string, disabled: string}
  border: {normal: string, hover: string, radius: string, radiusHover: string}
  boxShadow: string;
  disabled?: boolean;
  fontSize: number;
  padding: number;
  size: number;
}

const StyledButton = styled.button<StyledButtonProps>`
  color: ${({fg}) => fg.normal};
  background: ${({bg}) => bg.normal};
  border: ${({border}) => border.normal};
  border-radius: ${({border}) => border.radius};
  box-shadow: ${(props) => props.boxShadow};
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};

  align-items: center;  
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  height: 38px;
  justify-content: center;
  outline: none !important;
  padding: 10px 22px;
  width: 100%;

  &:hover {
    color: ${({fg}) => fg.hover};
    background: ${({bg}) => bg.hover};
    border: ${({border}) => border.hover};
    border-radius: ${({border}) => border.radiusHover}
  }
  &:selected {
    color: ${({fg}) => fg.selected};
    background: ${({bg}) => bg.selected};
  }
  &:focus: {
    outline: none;
  }
  &:disabled {
    color: ${({fg}) => fg.disabled};
    background: ${({bg}) => bg.disabled};
    cursor: not-allowed;
  }
`;

const StyledLink = styled(Link)`
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

export default Button;
