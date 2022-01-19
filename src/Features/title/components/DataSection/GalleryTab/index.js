import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ImageCard from './ImageCard';

function GalleryTab(props) {
    
    
    return (
        <Container>
            {props.manga.covers.map(c => 
                <ImageCard key={c.id} cover={c} />
            )}
        </Container>
    )
}



const Container = styled.div`
    display: grid;
    align-items: left;
    /* grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); */
    grid-template-columns: repeat(auto-fit, 16rem);
    gap: 1rem;
`;


GalleryTab.propTypes = {
    manga: PropTypes.object,
}

export default GalleryTab
