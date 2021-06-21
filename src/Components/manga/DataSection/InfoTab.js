import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';
import { ButtonBase, Chip, Icon, IconButton, Typography } from '@material-ui/core';
import {
    LibraryBooksOutlined, StarOutlined, BarChartOutlined, VisibilityOutlined, BookmarkOutlined, OpenInNewOutlined, AddCircleOutline, EditOutlined,
} from '@material-ui/icons';
import bookwalker from 'Assets/images/sites/bookwalker.png';
import mal from 'Assets/images/sites/mal.png';
import novelUpdates from 'Assets/images/sites/novel-updates.png';
import animePlanet from 'Assets/images/sites/anime-planet.png';

function InfoTab(props) {
    return (
        <Container>
            <InfoItem title='Alt Names' >
                {props.altTitles.map(t =>
                    <AltName>{t}</AltName>
                )}
            </InfoItem>
            <InfoItem title='Author' >
                {props.authors.map(a =>
                    <Typography className='listing' >
                        <a href='#' >{a}</a>
                    </Typography>
                )}
            </InfoItem>
            <InfoItem title='Artist' >
                {props.artists.map(a =>
                    <Typography className='listing' >
                        <a href='#' >{a}</a>
                    </Typography>
                )}
            </InfoItem>
            <InfoItem title='Demographic' >
                <Chip clickable variant='outlined' label={props.publicationDemographic} />
            </InfoItem>
            <InfoItem title='Genre' >
                {props.tags.map(t =>
                    <Chip clickable variant='outlined' label={t} />
                )}
            </InfoItem>
            <InfoItem title='Rating' >
                <IconTextItem clickable icon={StarOutlined} iconProps={{ color: 'primary' }} >
                    {props.userRating || '--'}
                </IconTextItem>
                <IconTextItem icon={StarOutlined} >
                    {props.rating}
                </IconTextItem>
                <IconButton>
                    <BarChartOutlined />
                </IconButton>
            </InfoItem>
            <InfoItem title='Pub Status' >
                <Typography>{props.status}</Typography>
            </InfoItem>
            <InfoItem title='Stats' >
                <IconTextItem icon={VisibilityOutlined} >375,476</IconTextItem>
                <IconTextItem icon={BookmarkOutlined} >23,965</IconTextItem>
            </InfoItem>
            <InfoItem title='Official' >
                <IconTextItem icon={OpenInNewOutlined} >
                    <a href='#' >Raw</a>
                </IconTextItem>
            </InfoItem>
            <InfoItem title='Retail' >
                <ExtLink img={bookwalker} >
                    <a href='#' >Bookwalker</a>
                </ExtLink>
            </InfoItem>
            <InfoItem title='Info' >
                <ExtLink img={novelUpdates} >
                    <a href='#' >NovelUpdates</a>
                </ExtLink>
                <ExtLink img={animePlanet} >
                    <a href='#' >Anime-Planet</a>
                </ExtLink>
                <ExtLink img={mal} >
                    <a href='#' >MyAnimeList</a>
                </ExtLink>
            </InfoItem>
            <InfoItem title='Reading Progress' >
                <ProgressItem>
                    Volume 0/?
                </ProgressItem>
                <ProgressItem>
                    Chapter 0/?
                </ProgressItem>
                <IconButton size='small' ><EditOutlined /> </IconButton>
            </InfoItem>
            <InfoItem title='Reading Status' >
                <Typography>
                    {props.readingStatus}
                </Typography>
                <IconButton size='small' ><EditOutlined /> </IconButton>
            </InfoItem>
        </Container>
    )
}



const InfoItem = props => (
    <>
        <Typography variant='body2' >{props.title}</Typography>
        <div>
            {props.children}
        </div>
    </>
);

const IconTextItem = ({ icon: IconProp, ...props }) => {
    const Container = (props.clickable || props.onClick) ? ButtonBase : 'div';

    return (
        <Container className='icon-text' >
            <IconProp fontSize='small' {...props.iconProps} />
            <Typography>{props.children}</Typography>
        </Container>
    );
}

const AltName = props => (
    <IconTextItem icon={LibraryBooksOutlined} {...props} />
);

const ExtLink = props => (
    <div className='ext-link icon-text' >
        <img src={props.img} />
        <Typography>{props.children}</Typography>
    </div>
);

const ProgressItem = props => (
    <div className='icon-text' >
        <Typography>{props.children}</Typography>
        <IconButton size='small' color='secondary' onClick={props.onClick} >
            <AddCircleOutline />
        </IconButton>
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
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        >* {
            margin-right: 1.2rem;
        }

        >.listing:not(:last-child)::after {
            content: ',';
        }
        
        .icon-text {
            margin-right: 2.4rem;
            display: flex;
            white-space: nowrap;
            align-items: center;
            gap: .4rem;
        }

        >.MuiButtonBase-root {
            padding-left: .8rem;
            padding-right: .8rem;
        }

        .ext-link {
            img {
                width: 16px;
                height: 16px;
                border-radius: 3px;
                border: 1px solid ${({ theme }) => theme.palette.text.primary};
            }
        }
    }
`;

InfoTab.propTypes = {
    altTitles: PropTypes.arrayOf(PropTypes.string),
    authors: PropTypes.arrayOf(PropTypes.string),
    artists: PropTypes.arrayOf(PropTypes.string),
    publicationDemographic: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    userRating: PropTypes.string,
    rating: PropTypes.string,
    links: PropTypes.shape({
        bw: PropTypes.string,
        mal: PropTypes.string,
        nu: PropTypes.string,
        mu: PropTypes.string,
        ap: PropTypes.string,
        availableLinks: PropTypes.arrayOf(PropTypes.string),
    }),
    readingStatus: PropTypes.string,
}

export default InfoTab

