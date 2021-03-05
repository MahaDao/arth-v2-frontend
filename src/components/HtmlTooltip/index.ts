import { withStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import theme from '../../theme';


const HtmlTooltip = withStyles((theme1: Theme) => ({
  tooltip: {
    backgroundColor: theme.color.dark[200],
    color: 'white',
    fontWeight: 300,
    fontSize: '13px',
    borderRadius: '6px',
    padding: '20px',
  },
}))(Tooltip);

export default HtmlTooltip;