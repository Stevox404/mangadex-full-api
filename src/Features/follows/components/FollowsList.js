import { Divider, ListItem, Typography, Button } from '@material-ui/core';
import { Chapter } from 'mangadex-full-api';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useRouter } from 'flitlib';
import { OpenInNew } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { SkeletonListItem } from './SkeletonListItem';



/**@param {FollowsList.propTypes} props */
function FollowsList(props) {
    const { changePage } = useRouter();

    const getUpdatesList = () => {
        let currentTitleId;
        let currentTitleCoverEl;
        let titleChapters = [];
        const list = props.feed.reduce((acc, title) => {
            if (currentTitleId !== title.manga.id) {
                if (currentTitleId) {
                    acc.push(
                        <>
                            <TitleItem
                                id={currentTitleId + title.chapter}
                                cover={currentTitleCoverEl}
                                chapters={titleChapters}
                            />
                            <Divider key={currentTitleId + title.chapter + 'divider'} />
                        </>
                    );
                }

                currentTitleId = title.manga.id;
                currentTitleCoverEl = (
                    <div className="cover">
                        <img src={title.manga.mainCover.image256} alt={title.manga.title + ' cover'} />
                        <Typography variant='body1' component={Link} to={`/title/${title.manga.id}`} >
                            {title.manga.title}
                        </Typography>
                    </div>
                );
                titleChapters = [<ChapterItem title={title} />];
            } else {
                titleChapters.push(<ChapterItem title={title} />);
            }

            return acc;
        }, []);

        list.push(
            <TitleItem
                id={currentTitleId}
                cover={currentTitleCoverEl}
                chapters={titleChapters}
            />
        );

        return list;
    }

    const handleChapterClick = (e, chapter) => {
        if (chapter.isExternal && !chapter.externalUrl) {
            e.preventDefault();
            window.alert('Chapter is hosted externally but no link provided');
        }
    }

    const TitleItem = ({ id, cover, chapters }) => (
        <div className='titleUpdate' key={id} >
            {cover}
            <div className="chapters">
                {chapters}
            </div>
        </div>
    );

    const ChapterItem = ({ title }) => (
        <ListItem
            button className='chapter' key={title.chapter}
            component={Link} onClick={e => handleChapterClick(e, title)}
            to={title.isExternal ? title.externalUrl : `/chapter/${title.id}/1`}
            target={title.isExternal ? '_blank' : ''}
        >
            <Typography className='name' variant='body2' >
                {title.isExternal &&
                    <OpenInNew />
                }
                {title.volume ? `Vol. ${title.volume} ` : ''}
                {title.chapter ? `Ch. ${title.chapter} ` : ''}
                {title.title ? ` - ${title.title}` : ''}
            </Typography>
            <Typography variant='body2' >
                {title.groups[0]?.name || ''}
            </Typography>
            <Typography variant='body2' >
                {title.uploader.name || ''}
            </Typography>
            <Typography className='update' variant='body2' >
                {moment(title.updatedAt).fromNow() || ''}
            </Typography>
        </ListItem>
    );

    return (
        <Wrapper>
            <div>
                {props.fetching ? (
                    Array.from(Array(3)).map(i => (
                        <SkeletonListItem key={i} />
                    ))
                ) : getUpdatesList()
                }
            </div>
        </Wrapper>
    )
}


const Wrapper = styled.div`    
    .titleUpdate {
        display: grid;
        grid-template-columns: 200px 1fr;
        padding: 0.8rem 0;
        .cover {
            display: grid;
            justify-content: center;
            justify-items: center;
            text-align: center;
            img{
                height: 180px;
                margin-bottom: .8rem;
            }
            .MuiTypography-root {
                font-size: 1.2rem;
            }
        }
        .chapters {
            display: grid;
            align-content: flex-start;
            align-items: flex-start;
            .chapter {
                display: grid;
                grid-template-columns: 2fr 1fr .5fr .5fr;
                .name {
                    display: flex;
                    align-items: center;
                    svg {
                        font-size: 1.2rem;
                        margin-right: .2rem;
                    }
                }
                .update {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
        }
    }
`;



FollowsList.propTypes = {
    /**@type {Chapter[]} */
    feed: PropTypes.arrayOf(Chapter),
    fetching: PropTypes.bool,
}

export default memo(FollowsList);


