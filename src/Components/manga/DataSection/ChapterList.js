import { List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';


/** @param {ChapterList.propTypes} props */
function ChapterList(props) {
    return (
        <Container>
            {props.chapters.map(c => (
                <ListItem key={c.id} button>
                    <ListItemText
                        primary={`Chapter ${c.chapter}: ${c.title}`}
                        secondary={c.uploaderName}
                    />
                    <ListItemText
                        primary={moment(c.updatedAt).fromNow()}
                        primaryTypographyProps={{
                            variant: 'subtitle1'
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

