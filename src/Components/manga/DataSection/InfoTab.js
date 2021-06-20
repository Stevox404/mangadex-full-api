import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';
import { Icon, Typography } from '@material-ui/core';
import { LibraryBooksOutlined } from '@material-ui/icons';

function InfoTab(props) {
    return (
        <Container>
            <InfoItem title='Alt Names' >
                <AltName>Summoned to a Parallel Fantasy World Many Times</AltName>
                <AltName>Mecha Shoukan</AltName>
            </InfoItem>
            <InfoItem title='Author' >
                <Typography>Masashi Kishimoto</Typography>
            </InfoItem>
            <InfoItem title='Artist' >
                <Typography>Masashi Kishimoto</Typography>
            </InfoItem>
            <InfoItem title='Demographic' >
                <Typography>Shounen</Typography>
            </InfoItem>
            <InfoItem title='Genre' >
                <Typography>Comedy</Typography>
                <Typography>Action</Typography>
                <Typography>Adventure</Typography>
            </InfoItem>
            <InfoItem title='Rating' >
            </InfoItem>
            <InfoItem title='Pub Status' >
                <Typography>Completed</Typography>
            </InfoItem>
            <InfoItem title='Official' >
            </InfoItem>
            <InfoItem title='Retail' >
            </InfoItem>
            <InfoItem title='Info' >
            </InfoItem>
            <InfoItem title='Reading Progress' >
            </InfoItem>
        </Container>
    )
}



const InfoItem = (props) => (
    <>
        <Typography variant='body2' >{props.title}</Typography>
        <div>
            {props.children}
        </div>
    </>
);

const AltName = ({ children: name }) => (
    <div className='alt-name' >
        <LibraryBooksOutlined fontSize='small' />
        <Typography>{name}</Typography>
    </div>
);



const Container = styled.div`
    padding: 1rem 2rem;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 2rem;
    row-gap: 1.4rem;
    align-items: baseline;
    >:nth-child(odd){
        font-weight: bold;
    }
    >:nth-child(even){
        display: flex;
        flex-wrap: wrap;
        >* {
            margin-right: 1.2rem;
        }

        .alt-name {
            margin-right: 2.4rem;
            display: flex;
            white-space: nowrap;
            align-items: baseline;
            gap: .4rem;
        }
    }
`;

InfoTab.propTypes = {

}

export default InfoTab

