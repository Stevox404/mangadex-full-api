import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
    Button as MuiButton, lighten, ListItemIcon, Menu as MuiMenu, MenuItem, Typography
} from '@material-ui/core';
import { BlockOutlined, CheckCircleOutlineOutlined } from '@material-ui/icons';

/**
 * 
 * @param {FiltersButton.propTypes} props 
 * @returns 
 */
function FiltersButton(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorWidth, setAnchorWidth] = useState(0);

    const updateOptStatus = (e, idx) => {
        const opts = props.options.map((opt, i) => {
            if(idx !== i) return opt;
            const newOpt = {...opt};
            switch (opt.status) {
                case 'include': newOpt.status = 'exclude'; break;
                case 'exclude': newOpt.status = null; break;
                default: newOpt.status = 'include'; break;
            }
            return newOpt;
        });
        props.onChange(e, opts);
    }
    
    function getMenuItemIcon(opt) {
        switch (opt.status) {
            case 'include': return (
                <CheckCircleOutlineOutlined color='primary' />
            );
            case 'exclude': return (
                <BlockOutlined color='error' />
            );
            default: return null;
        }
    }
    
    return (
        <>
            <Button variant='outlined' onClick={e => {
                const target = e.currentTarget;
                setAnchorWidth(target.getBoundingClientRect().width);
                setAnchorEl(target);
            }} >
                {props.children}
            </Button>
            <Menu
                open={!!anchorEl} onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl} style={{ width: anchorWidth }}
                transformOrigin={{
                    // horizontal: 'center', 
                    vertical: 'top'
                }}
                anchorOrigin={{
                    vertical: 'bottom', horizontal: 'left'
                }}
                getContentAnchorEl={null} width={anchorWidth}
            >
                {props.options.map((opt, i) => (
                    <MenuItem
                        index={i} key={opt.value}
                        onClick={e => updateOptStatus(e, i)}
                    >
                        <ListItemIcon>
                            {getMenuItemIcon(opt)}
                        </ListItemIcon>
                        <Typography>
                            {opt.label}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

const Button = styled(MuiButton)`
    && {
        justify-content: start;
    }
`;
const Menu = styled(MuiMenu)`
    .MuiMenu-paper {
        width: ${({ width }) => width}px;
        max-width: unset;
        background-color: ${({ theme }) => lighten(theme.palette.background.paper, .08)};
        .MuiListItemIcon-root {
            min-width: 36px;
        }
    }
`;

FiltersButton.defaultProps = {
    options: [],
    onChange: () => {},
}

FiltersButton.propTypes = {    
    children: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['include', 'exclude', null])
    })),
    onChange: PropTypes.func,
}

export default FiltersButton;