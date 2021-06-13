import { createMuiTheme } from "@material-ui/core";

const breakpointValues = {
    xs: 480,
    sm: 640,
    md: 960,
    lg: 1280,
    xl: 1920,
};

const theme = createMuiTheme({
    breakpoints: {
        values: breakpointValues,
    },
    typography: {
        h1: {
            fontSize: '3.3rem',
            fontWeight: 700,
            [`@media (max-width: ${breakpointValues.sm}px)`]: {
                fontSize: '2.2rem',
            }
        },
        h4: {
            fontSize: '2.125rem',
            [`@media (max-width: ${breakpointValues.sm}px)`]: {
                fontSize: '1.6rem',
            }
        },
        body1: {
            fontSize: '1.2rem',
        }
    },
    props: {
        MuiTextField: {
            variant: 'outlined',
        },
        MuiTooltip: {
            PopperProps: {
                disablePortal: true,
            },
        },
    }
});


console.log(theme);

export default theme;