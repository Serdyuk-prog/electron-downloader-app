import { AppBar, Toolbar, Typography } from '@mui/material';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div">
          File download
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
