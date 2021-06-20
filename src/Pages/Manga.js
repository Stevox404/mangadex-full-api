import coverSample from 'Assets/images/manga-cover.jpg';
import DataSection from 'Components/manga/DataSection';
import MainSection from 'Components/manga/MainSection';
import React from 'react';
import styled from 'styled-components';

function Manga() {
    // sample data
    const getChapters = () => {
        const arr = [];
        let i = 10;
        while (--i > -1) {
            const d = 11 - i;
            arr.push({
                id: String(i),
                title: 'One-shot',
                chapter: String(i),
                uploaderName: 'Fairyland Scans',
                updatedAt: Date.now() - (Math.random() * (86400000 * d - 86400000 * (d - 1)) + 86400000 * (d - 1)),
            });
        }
        return arr;
    }

    return (
        <Wrapper className='page fill-screen' >
            <div id='hero-img' />
            <div className='content' >
                <MainSection
                    title="Naruto"
                    chaptersNum={635}
                    rating={9.5}
                    views={5370000}
                    authorName="Masashi Kishimoto"
                    genres={[
                        'Comedy', 'Action', 'Adventure'
                    ]}
                    description={
                        'This is the story of Naruto Uzumaki, a young ninja\
                        who seeks recognition from his peers and\
                        dreams of becoming the Hokage, the leader\
                        of his village. The story is told in two\
                        parts – the first set in Naruto\'s pre-teen\
                        years, and the second in his teens.'
                    }
                />
                <DataSection
                    chapters={getChapters()}
                />
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    #hero-img {
        /* height: 170px; */
        height: 240px;
        background-image: linear-gradient(#000a, #0005), url(${coverSample});
        background-size: cover;
        background-position: 0 25%;
        background-attachment: fixed;
    }
    .content {
        padding: 3rem;
        padding-top: 1rem;
    }
`;

export default Manga;
