import { Typography } from '@material-ui/core';
import { 
    StarBorderOutlined, StarHalfOutlined, StarOutlined, VisibilityOutlined 
} from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { abbreviateNumber } from 'Utils';
import PropTypes from 'prop-types';


/** @param {PopularityDetails.propTypes} props */
function PopularityDetails(props) {
    const getStars = (rating) => {
        const stars = [];
        const ct = Number(rating);
        if(Number.isNaN(ct)) return stars;

        const full = Math.min(5, Number.parseInt(ct));
        const hasHalf = ct % 1 !== 0;
        const empty = Math.max(0,
            5 - (Number.parseInt(ct) + Number(hasHalf))
        );
        for (let i = 0; i < full; i++) {
            stars.push(<StarOutlined key={`f${i}`} />);
        }
        if (hasHalf) stars.push(<StarHalfOutlined key={`h`} />);
        for (let i = 0; i < empty; i++) {
            stars.push(<StarBorderOutlined key={`e${i}`} />);
        }
        return stars;
    }

    return (
        <Container >
            <div className='views' >
                <VisibilityOutlined />
                <Typography variant='subtitle2' >
                    {abbreviateNumber(Number.parseInt(props.views) || 0)}
                </Typography>
            </div>
            <div className='rating' >
                {getStars(props.rating)}
            </div>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    svg {
        font-size: 1.2rem;
    }
    >.views {
        display: flex;
        align-items: center;
        gap: .1rem;
    }
    >.rating {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        svg {
            fill: ${({theme}) => theme.palette.primary.main};
        }
    }
`;


PopularityDetails.propTypes = {
    views: PropTypes.number,
    rating: PropTypes.number,
}

export default PopularityDetails

