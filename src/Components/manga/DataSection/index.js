import {
    AppBar, Paper, Tab, Tabs
} from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import ChapterTab from './ChapterTab';
import PropTypes from 'prop-types';
import InfoTab from './InfoTab';


/** @param {DataSection.propTypes} props */
function DataSection(props) {
    const [tabIndex, setTabIndex] = useState(1);

    const handleTabChange = (e, idx) => {
        setTabIndex(idx);
    }

    const getTabPanel = () => {
        switch (tabIndex) {
            case 0: return <InfoTab {...props.manga} />;
            case 1: return <ChapterTab chapters={props.chapters} />;
            default: break;
        }
    }

    return (
        <Container square>
            <AppBar position="sticky" color="default" >
                <Tabs
                    value={tabIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabChange}
                >
                    <Tab label="Info" />
                    <Tab label="Chapters" />
                    <Tab label="Gallery" />
                </Tabs>
            </AppBar>
            <div className='tab-panel' >
                {getTabPanel()}
            </div>
        </Container>
    )
}


const Container = styled(Paper)`
    .tab-panel {
        min-height: 50vh;
        /* max-height: 100vh;
        overflow-y: auto; */
        margin-bottom: 4.8rem;
    }
`;



DataSection.propTypes = {
    chapters: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        chapter: PropTypes.string,
        uploaderName: PropTypes.string,
        uploaderId: PropTypes.string,
        updatedAt: PropTypes.string,
    })),
    manga: PropTypes.shape({
        altTitles: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
}

export default DataSection;

