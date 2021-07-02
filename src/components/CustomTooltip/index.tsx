import React  from 'react';
import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/Info';
import HtmlTooltip from '../HtmlTooltip';

type props = {
  toolTipText?: string;
  iconStyle?: object;
};

const CustomToolTip: React.FC<props> = (props) => {
  const { toolTipText } = props;

  if (toolTipText?.toLowerCase() === 'loreum ipsum') return <></>;

  if (!toolTipText) {
    return <InfoIcon fontSize="default" style={{ transform: 'scale(0.6)' }} />;
  }

  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <ToolTipFont>{toolTipText}</ToolTipFont>
        </React.Fragment>
      }
    >
      <InfoIcon
        fontSize="default"
        style={{ transform: 'scale(0.6)', cursor: 'pointer', marginBottom: '2px' }}
      />
    </HtmlTooltip>
  );
};

export default CustomToolTip;

const ToolTipFont = styled.p`
  padding: 0;
  margin: 0;
`;
