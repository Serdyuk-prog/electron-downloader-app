import { TextField, Button, Box, Divider } from "@mui/material";
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

function Download() {
    return (
        <Box sx={{mb: 3}} >
            <Box
                sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}
            >
                <TextField
                    id="outlined-basic"
                    label="URL"
                    variant="outlined"
                    sx={{ width: "40%" }}
                />
                <Button sx={{ alignSelf: "center" }} variant="contained">
                    Button
                </Button>
                <Box
                    sx={{
                        width: "20%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <span>100%</span>
                </Box>
                <Box
                    sx={{
                        
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <IconButton>
                        <Icon>cancel</Icon>
                    </IconButton>
                    
                </Box>
            </Box>
            <Divider />
        </Box>
    );
}

export default Download;
