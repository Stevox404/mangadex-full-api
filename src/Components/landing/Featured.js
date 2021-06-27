import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
    AppBar, Button, Card, CardContent, IconButton, Toolbar, Typography,
    useMediaQuery, Hidden
} from '@material-ui/core';
import { KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined } from '@material-ui/icons';

function Featured(props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const ftCount = 3;

    const shiftSelectedIndex = (dir = 1) => {
        // Handle wrap-around
        setSelectedIndex(i => (i + dir + (ftCount * Math.ceil(i+dir/ftCount))) % ftCount);
    }
    
    const isUnderMdSize = useMediaQuery(theme => theme.breakpoints.down('md'));
    
    return (
        <Container selectedIndex={selectedIndex} >
            <IconButton onClick={_ => shiftSelectedIndex(-1)} >
                <KeyboardArrowLeftOutlined />
            </IconButton>
            <div id='card-box' >
                <Card variant='outlined' >
                    <CardContent>
                        <div id='pos'>
                            <div />
                            <div />
                            <div />
                        </div>
                        <Typography variant='subtitle1' >Featured Manga</Typography>
                        <Typography variant='h3' gutterBottom >How my overly cautious classmate became OP in another world!</Typography>
                        {!isUnderMdSize &&
                            <Typography variant='body2' gutterBottom >
                                This is the story of Naruto Uzumaki,
                                a young ninja who seeks recognition from
                                his peers and dreams of becoming the Hokage,
                                the leader of his village. The story is
                                told in two parts – the first set in Naruto's
                                pre-teen years, and the second in his teens.
                            </Typography>
                        }
                        <Button variant='contained' color='primary' size={isUnderMdSize ? 'small' : 'medium'} >
                            Read Now
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <IconButton onClick={_ => shiftSelectedIndex(1)} >
                <KeyboardArrowRightOutlined />
            </IconButton>
        </Container>
    )
}


const Container = styled.div`
    height: 45vh;
    min-height: 420px;
    width: 100%;
    background-image: url(${'https://upload.wikimedia.org/wikipedia/en/c/c9/Nabarinoo.jpg'});
    background-size: cover;
    background-position: right 20%;
    display: grid;
    align-items: center;
    padding: 1rem 1.6rem;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-content: center;
    position: relative;
    .MuiIconButton-root {
        background-color: ${({theme}) => theme.palette.primary.main};
        z-index: 1;
        &:hover {
            background-color: ${({theme}) => theme.palette.primary.dark};
        }
    }
    #card-box {
        flex: 1;
        display: grid;
        justify-content: flex-start;
        .MuiCard-root {
            background-color: ${({theme}) => theme.palette.background.paper}cc;
            width: 40%;
            .MuiCardContent-root{
                display: grid;
                #pos {
                    justify-self: flex-end;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: .4rem;
                    div{
                        width: .5rem;
                        height: .5rem;
                        border: 1px solid ${({theme}) => theme.palette.primary.main};
                        /* border: 1px solid #fff; */
                        border-radius: 50%;
                        &:nth-child(${({selectedIndex}) => selectedIndex + 1}) {
                            background-color: ${({theme}) => theme.palette.primary.main};
                        }
                    }
                }
                .MuiTypography-h3 {
                    font-size: 2rem;
                }
                .MuiTypography-subtitle1 {
                    margin-bottom: -.4rem;
                }
                .MuiButton-root {
                    justify-self: flex-end;
                }
            }
        }
    }

    ${({theme}) => theme.breakpoints.down('md')}{
        grid-template-columns: auto auto;
        justify-content: space-between;
        #card-box {
            position: absolute;
            bottom: 0;
            width: 100%;
            justify-content: stretch;
            .MuiCard-root {
                width: 100%;
                .MuiCardContent-root .MuiTypography-h3 {
                    font-size: 1.5rem;
                }
            }
        }
    }
`;

Featured.propTypes = {

}

export default Featured;
