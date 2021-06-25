// @ts-nocheck
import React, { CSSProperties, useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputBase } from '@material-ui/core';

import TokenSymbol from '../TokenSymbol';
import CustomDropDown from '../CustomDropDown';
import DownArrow from '../../assets/img/ArrowDown.svg';
import { Link } from 'react-router-dom';
import { checkForAfterDecimalDigits, correctString, ValidateNumber } from './RegexValidation';
import Loader from 'react-spinners/BeatLoader';

type props = {
  ILabelValue: string;
  IBalanceValue: string;
  showBalance?: boolean;
  ILabelInfoValue?: string;
  value?: string;
  DefaultValue: string;
  LogoSymbol: string;
  hasDropDown?: boolean;
  disabled?: boolean;
  SymbolText: string;
  setText?: (val: string) => void;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  tagText?: string;
  onTagTextClick?: () => void;
  dropDownValues?: string[];
  ondropDownValueChange?: (data: string) => void;
  multiIcons?: boolean;
  symbols?: string[];
  dontShowBackgroundContainer?: boolean;
  href?: string;
  to?: string;
  Istate?: 'default' | 'error';
  IWarningstate?: 'default' | 'warning';
  msg?: string;
  DisableMsg?: string;
  errorCallback?: (flag: boolean) => void;
  isBalanceLoading?: boolean;
};

interface ICStatesInterface {
  IState: 'default' | 'error' | 'warning';
  IMsg: string;
}

const CustomInputContainer: React.FC<props> = (props) => {
  const {
    ILabelValue,
    IBalanceValue,
    showBalance = true,
    ILabelInfoValue,
    DefaultValue,
    LogoSymbol,
    hasDropDown = false,
    SymbolText,
    tagText = '',
    dropDownValues,
    ondropDownValueChange,
    multiIcons = false,
    symbols,
    disabled = false,
    Istate = 'default',
    msg = '',
    DisableMsg = '',
    IWarningstate = 'default',
    warningMsg = '',
    isBalanceLoading = false,
  } = props;

  const [ICStates, setICStates] = useState<ICStatesInterface>({ IState: Istate, IMsg: msg });
  const [ICWarningStates, setICWarningStates] = useState<ICStatesInterface>({ IWarningstate: IWarningstate, IMsg: warningMsg });
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let temp = { IState: Istate, IMsg: msg };
    setICStates(temp);
  }, [Istate, msg]);

  useEffect(() => {
    checkForErrorAndWarning(DefaultValue);
  }, [DefaultValue, LogoSymbol, IBalanceValue])

  const Redirection = () => {
    if (props?.href) {
      return (
        <HrefLink href={props.href} target="__blank">
          <ILabelInfo>{ILabelInfoValue}</ILabelInfo>
        </HrefLink>
      );
    } else if (props?.to) {
      return (
        <ToLink to={'/mint'}>
          <ILabelInfo>{ILabelInfoValue}</ILabelInfo>
        </ToLink>
      );
    } else {
      return <ILabelInfo>{ILabelInfoValue}</ILabelInfo>;
    }
  };

  const checkForErrorAndWarning = async (val: string) => {
    const Default: ICStatesInterface = {
      IState: 'default',
      IMsg: '',
    };

    if (props.errorCallback) {
      if (Number(val) > Number(IBalanceValue)) {
        const temp: ICStatesInterface = {
          IState: 'error',
          IMsg: 'Amount cannot be more than your balance.',
        };
        setICStates(temp);
        props.errorCallback(true);
      } else {
        props.errorCallback(false);
        setICStates(Default);
      }
    }

    let DigitsStatus = true
    if (!checkForAfterDecimalDigits(val)) {
      const temp: ICStatesInterface = {
        IWarningState: 'warning',
        IMsg: 'Only 7 digits before decimal and 6 digits after decimal is allowed.',
      };
      setICWarningStates(temp);
      DigitsStatus = false
    } else {
      setICWarningStates(Default);
    }

    return DigitsStatus
  }

  const IConatinerStyle = () => {
    let returnObj: CSSProperties = {}
    if (props.dontShowBackgroundContainer) {
      returnObj['padding'] = '0px';
      returnObj['backgroundColor'] = 'transparent';
    }
    if (DisableMsg !== "") {
      returnObj['opacity'] = "0.32";
    }
    return returnObj;
  }

  return (
    <div style={{ position: 'relative' }}>
      {DisableMsg !== '' && <TotalDisable><DMsg>{DisableMsg}</DMsg></TotalDisable>}
      <IConatiner style={IConatinerStyle()}>
        <ILabelContainer>
          <ILabelLeft>
            <ILabel>{ILabelValue}</ILabel>
            {ILabelInfoValue !== '' && Redirection()}
          </ILabelLeft>
          <ILabelRight>
            { isBalanceLoading
                ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                : showBalance && <ILabelBalance>{`Balance  ${Number(IBalanceValue).toLocaleString()}`}</ILabelBalance>
            }
          </ILabelRight>
        </ILabelContainer>
        <IFieldConatiner className={`input-${ICStates.IState}`}>
          <InputBase
            inputMode={props?.inputMode}
            placeholder={DefaultValue || '0'}
            value={DefaultValue}
            inputProps={{ 'aria-label': 'naked' }}
            style={{
              padding: '8px 12px',
              color: '#FFFFFF',
              flex: 1,
              fontFamily: 'Inter !important',
            }}
            disabled={disabled}
            type={'string'}
            onChange={(event) => {
              const value = event.target.value;
              if (value === '') {
              } else {
                if (!ValidateNumber(value)) return
              }

              if (Number(value) && Number(value) <= 0) return;
              checkForErrorAndWarning(value).then((data) => {
                if (data) props?.setText(value.length > 1 ? correctString(value) : value);
              })
            }}
          />
          {tagText !== '' && (
            <MaxTagConatiner
              onClick={() => {
                checkForErrorAndWarning(IBalanceValue.toString()).then((data) => {
                  if (data) props?.setText(IBalanceValue.toString());
                });
              }}
            >
              {tagText}
            </MaxTagConatiner>
          )}
          <IFieldRightContainer
            onClick={() => {
              if (hasDropDown) setModalOpen(!modalOpen);
            }}
          >
            {/*<Select
              width='500px'
              style={{
                background: 'red'
              }}
              options={options}
              defaultValue={options[0]}
              components={{ Option: IconOption, Menu }}
              menuColor='red'
            />*/}
            <IFieldRightContainerLogo>
              {multiIcons && symbols ? (
                <LLabel>
                  {symbols.map((s, index) => (
                    <TokenSymbol key={s} symbol={s} size={25} style={index === 1 ? { zIndex: 2, marginLeft: -5 } : { zIndex: 2 }} />
                  ))}
                </LLabel>
              ) : (
                <TokenSymbol symbol={LogoSymbol} size={25} />
              )}
            </IFieldRightContainerLogo>
            <IFieldRightContainerText>{SymbolText}</IFieldRightContainerText>
            {hasDropDown && (
              <IFieldRightContainerDropDown>
                {/*<KeyboardArrowDown fontSize='default' />*/}
                <img alt="arrow" src={DownArrow} height={20} style={{ marginLeft: 10 }} />
              </IFieldRightContainerDropDown>
            )}
            {modalOpen && hasDropDown && ondropDownValueChange && (
              <BackgroundAbsolute
                onClick={() => {
                  setModalOpen(!modalOpen);
                }}
              />
            )}
            {modalOpen && hasDropDown && ondropDownValueChange && (
              <CustomDropDown
                dropDownValues={dropDownValues}
                ondropDownValueChange={ondropDownValueChange}
              />
            )}
          </IFieldRightContainer>
        </IFieldConatiner>
        {ICStates.IMsg !== '' && (
          <p className={`input-font-${ICStates.IState}`}>{ICStates.IMsg}</p>
        )}
        {ICWarningStates.IMsg !== '' && (
          <p className={`input-font-warning`}>{ICWarningStates.IMsg}</p>
        )}
      </IConatiner>
    </div>
  );
};

export default CustomInputContainer;

const TotalDisable = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.16);
  box-sizing: border-box;
  border-radius: 12px;
  z-index: 12;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #FFFFFF29;
`;

const DMsg = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #FFFFFF;
  margin-bottom: 0;
`

const HrefLink = styled.a`
  z-index: 1;
`;
const ToLink = styled(Link)`
  z-index: 1;
`;
const BackgroundAbsolute = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
  z-index: 11;
`;
const IConatiner = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
`;
const ILabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;
const ILabelLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;
const ILabelRight = styled.div``;
const ILabel = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 0;
`;
const ILabelInfo = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 20px;
  color: #f7653b;
  margin-left: 5px;
  margin-bottom: 0;
  cursor: pointer;
`;
const ILabelBalance = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 0;
`;
const LLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IFieldConatiner = styled.div`
  display: flex;
  flex-direction: row;
  background: #151414;
  border-radius: 6px;
  max-height: 44px;
`;
const IFieldRightContainer = styled.div`
  padding: 10px 12px;
  background: #1f1e1e;
  border-radius: 0px 6px 6px 0px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
`;
const MaxTagConatiner = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: #f7653b;
  padding: 10px 12px;
  background: transparent;
  border-radius: 0px 6px 6px 0px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
`;
const IFieldRightContainerLogo = styled.span``;
const IFieldRightContainerText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
  margin-left: 5px;
`;
const IFieldRightContainerDropDown = styled.span`
  margin-left: 5px;
`;
