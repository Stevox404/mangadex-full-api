import { Divider, ListItem, Typography, Icon } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Chapter } from 'mangadex-full-api';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useRouter } from 'flitlib';
import { OpenInNew } from '@material-ui/icons';



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
                        <Typography variant='body2'>
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
        if(chapter.isExternal){
            if(!chapter.externalUrl) {
                return window.alert('Chapter is hosted externally but no link provided');
            }
            const a = document.createElement('a');
            a.href = chapter.externalUrl;
            a.target = '_blank';
            document.append(a);
            a.click();
            document.removeChild(a);
        } else {
            changePage(`/chapter/${chapter.id}/1`);
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
            onClick={e => handleChapterClick(e, title)}
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
            {props.fetching ? (
                Array.from(Array(3)).map(i => (
                    <div className='titleUpdate' key={i} >
                        <div className="cover">
                            <Skeleton className='img-sk' variant="rect" />
                            <Skeleton className='title-sk' variant="rect" />
                        </div>
                        <div className="chapters">
                            <Skeleton className='chapter-sk' variant="rect" height={32} />
                            <Skeleton className='chapter-sk' variant="rect" height={32} />
                            <Skeleton className='chapter-sk' variant="rect" height={32} />
                        </div>
                    </div>
                ))
            ) : getUpdatesList()
            }
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
            .img-sk {
                height: 180px;
                width: 160px;
                margin-bottom: .8rem;
            }
            .title-sk {
                height: 32px;
                width: 124px;
            }
        }
        .chapters {
            display: grid;
            align-content: flex-start;
            align-items: flex-start;
            .chapter-sk {
                width: 100%;
                margin-bottom: .8rem;
            }
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

export default FollowsList

