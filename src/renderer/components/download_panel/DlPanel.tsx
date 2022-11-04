import { Box } from '@mui/material';

type DlPanelProps = {
  children: JSX.Element;
};

function DlPanel({ children }: DlPanelProps) {
  const panelStyle = {
    m: 3,
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
  };
  return <Box sx={panelStyle}>{children}</Box>;
}

export default DlPanel;
