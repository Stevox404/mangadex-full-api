import { List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useRouter } from 'Utils/shared/flitlib';


/** @param {ChapterList.propTypes} props */
function ChapterList(props) {
    const {changePage} = useRouter();
    
    const handleChapterClick = e => {
        changePage('/read');
    }
    
    return (
        <Container>
            {props.chapters.map((c, idx) => (
                <ListItem key={c.id} button onClick={handleChapterClick} >
                    <ListItemText
                        primary={`Chapter ${c.chapter}: ${c.title}`}
                        primaryTypographyProps={idx > 2 && {
                            color: 'textSecondary',
                        }}
                        secondary={c.uploaderName}
                        />
                    <ListItemText
                        primary={moment(c.updatedAt).fromNow()}
                        primaryTypographyProps={{
                            variant: 'subtitle1',
                            color: idx > 2 ? 'textSecondary': '',
                        }}
                    />
                </ListItem>
            ))}
        </Container>
    )
}


const Container = styled(List)`
    .MuiListItem-root {
        display: grid;
        grid-template-columns: 1fr auto;
    }
`;



ChapterList.propTypes = {
    chapters: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      chapter: PropTypes.string,
      uploaderName: PropTypes.string,
      uploaderId: PropTypes.string,
      updatedAt: PropTypes.string,
    }))
}

export default ChapterList

