import pageImg from 'Assets/images/manga-sample.jpg';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

function ReadingPane(props) {
    return (
        <Wrapper {...props} >
            {props.pages.map(p => 
                <img src={p} />
            )}
        </Wrapper>
    )
}



const Wrapper = styled.div`
    width: 100%;
    display: grid;
    justify-items: center;
    margin: 0 auto;
    overflow: auto;
    height: 100%;
    /* transition: width 50ms ease-out 0ms; */
    gap: .8rem;
    img {
    }
`;



ReadingPane.defaultProps = {
    pages: [
        pageImg, pageImg, pageImg
    ]
}


ReadingPane.propTypes = {
    pages: PropTypes.arrayOf(PropTypes.string),
}

export default ReadingPane;

