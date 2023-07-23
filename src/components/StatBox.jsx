import { Box, Typography } from "@mui/material";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {

    return (
        <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Typography
                        variant="h6"
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography variant="h4">
                    {title}
                </Typography>
                <Typography
                    variant="h5"
                    fontStyle="italic"
                >
                    {icon}
                </Typography>
            </Box>
        </Box>
    );
};

export default StatBox;