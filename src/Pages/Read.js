import React from 'react';

function Read() {
    return (
        <Wrapper className='page fill-screen' >
            
        </Wrapper>
    )
}


const Wrapper = styled.div`
    #hero-img {
        height: 170px;
        background-image: linear-gradient(#0004, #0009), url(${coverSample});
        background-size: cover;
        background-position: 0 25%;
        background-attachment: fixed;
    }
    .content {
        padding: 3rem;
        padding-top: 1rem;
    }
`;

export default Read;
