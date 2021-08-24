import {
    Typography, AppBar, Tabs, Tab, IconButton, MenuItem, ListItemIcon,
    useMediaQuery
} from '@material-ui/core';
import {
    Menu, Person
} from '@material-ui/icons';
import { SystemAppBar } from 'Components';
import SideDrawer from 'Components/shared/mui-x/SideDrawer';
import React, { useState } from 'react';
import styled from 'styled-components';
import { CloudDownload } from '../../node_modules/@material-ui/icons/index';


function Settings() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (e, idx) => {
        setTabIndex(idx);
    }

    const isUnderSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const isUnderXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
    
    return (
        <>
            <SystemAppBar />
            <Wrapper className='page fill-screen clear-appBar' >
                <SideDrawer
                    className='clear-appBar'
                    open={isUnderSm ? sidebarOpen: true} anchor='left' 
                    onClose={_ => setSidebarOpen(false)}
                    variant={isUnderSm ? 'temporary': 'permanent'} 
                    maxWidth={isUnderXs ? '75%': 300}
                >
                    <MenuItem>
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon> 
                        Profile
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <CloudDownload />
                        </ListItemIcon> 
                        Download Manager
                    </MenuItem>
                </SideDrawer>
                <div id="page" >
                    <AppBar position="sticky" color="default" >
                        <Typography variant='h5' component='h1' > 
                            {isUnderSm &&
                                <IconButton onClick={_ => setSidebarOpen(s => !s)} >
                                    <Menu />
                                </IconButton> 
                            }
                            Download Manager
                        </Typography>
                    </AppBar>

                    <AppBar position="sticky" color="default" >
                        <Tabs
                            value={tabIndex}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleTabChange}
                        >
                            <Tab label="Saved" />
                            <Tab label="Queued" />
                        </Tabs>
                    </AppBar>
                    <div id="content" >
                        <Typography>
                            Reprehenderit fugiat laborum ex ullamco ex ullamco. Amet culpa deserunt do ea nisi officia amet tempor. Esse tempor culpa consectetur ullamco cupidatat consectetur enim id. Commodo pariatur excepteur non voluptate magna mollit officia excepteur pariatur ipsum ullamco sit.

    Exercitation est tempor adipisicing magna ut anim eu pariatur. Lorem fugiat tempor quis nostrud commodo ipsum culpa. Ea excepteur incididunt laboris et minim laboris ea non laborum minim id qui. Laborum incididunt labore commodo sit quis aliqua.

    Sit amet enim elit proident. Ad dolore ipsum eiusmod do non nulla id nulla ipsum eiusmod et. Nisi Lorem nulla et labore.

    Tempor incididunt incididunt esse nostrud culpa fugiat est voluptate cupidatat. Dolor commodo cillum dolor fugiat deserunt labore exercitation anim proident amet. Ad qui id eiusmod occaecat sunt deserunt. Aute sint voluptate culpa consequat id eiusmod incididunt eiusmod anim pariatur eiusmod do nisi quis.

    Irure eiusmod est quis eiusmod elit excepteur Lorem duis laborum esse. Dolor enim minim exercitation qui ad do ipsum laboris nostrud tempor. Consequat aliquip enim nulla officia ad occaecat ipsum reprehenderit culpa ullamco quis. Labore voluptate non tempor commodo velit nulla minim anim. Mollit voluptate sint veniam voluptate mollit. Velit sit aliquip velit deserunt aute culpa quis Lorem consequat sint ut laboris fugiat.

    Sint deserunt pariatur officia ut exercitation aliqua mollit. Exercitation ad veniam consectetur labore laborum sunt aliquip dolore exercitation amet cupidatat laboris consectetur dolor. Sunt aliqua nulla anim adipisicing labore eu in Lorem esse officia officia est. Voluptate commodo sit irure aliquip et ea ullamco labore excepteur adipisicing incididunt magna minim. Do anim mollit culpa ut adipisicing Lorem voluptate commodo mollit ullamco sit pariatur elit. Excepteur velit in labore dolore amet eiusmod.

    Sint sit ipsum adipisicing pariatur ullamco esse incididunt fugiat amet fugiat veniam ea est veniam. Sunt proident Lorem sint esse dolore. Anim ullamco Lorem nostrud mollit magna nisi eu. Enim cillum reprehenderit do nulla proident laboris ad.

    Velit ex occaecat do irure. Aute sit veniam enim ullamco laboris ullamco. Ullamco eu qui adipisicing aliquip fugiat proident aliqua aliqua proident quis non fugiat mollit minim. Pariatur fugiat incididunt eiusmod deserunt laborum elit dolor deserunt non.

    Ad ad ipsum fugiat labore ad do qui duis. Enim nulla eu ut aute tempor magna aliquip dolor eiusmod. Est in sunt in pariatur enim elit exercitation reprehenderit labore occaecat et aliquip.

    Id in tempor sunt officia aliquip officia tempor. Culpa est qui non elit Lorem. Ex est nisi tempor et quis deserunt nulla occaecat reprehenderit do. Labore eu dolore enim dolore.
                        </Typography>
                    </div>
                </div>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    #page {
        overflow-y: hidden;
        .MuiAppBar-root {
            padding-left: 1rem;
            .MuiTabs-root {
                padding-left: 2rem;
            }
        }
        #content {
            height: 100%;
            overflow-y: auto;
            padding: 1rem;
        }
    }
    .uiSideDrawer-paper {
        padding-top: 1rem;
    }
`;

export default Settings;
