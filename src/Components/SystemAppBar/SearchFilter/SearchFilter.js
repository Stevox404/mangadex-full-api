import React, { useState } from 'react';
import MuiXDialog from 'Components/shared/mui-x/GenericDialog';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FiltersButton from './FiltersButton';
import { Chip, Typography } from '@material-ui/core';


function SearchFilter(props) {
    const [filters, setFilters] = useState(FILTERS);

    function updateFilters(opts, idx) {
        setFilters(filters => {
            return filters.map((filter, i) => {
                if(i !== idx) return filter;
                const f = {...filter};
                f.options = opts;
                return f;
            });
        });
    }

    function getSelectedFilters() {
        filters.map(filter => {
            const selFilter = filter.options.reduce((acc, opt) => {
            }, {});
        })
    }

    function deselectFilter(idx) {
        setFilters(filters => {
            return filters.map((filter, i) => {
                if(i !== idx) return filter;
                const f = {...filter};
                f.options = f.options.map(opt => {
                    opt.status = '';
                    return opt;
                });
                return f;
            });
        });
    }
    
    function getSelectedFiltersTags() {
        return filters.map((filter, idx) => {
            const f = filter.options.reduce((acc, opt) => {
                if(opt.status === 'include') {
                    acc.include = (acc.include || 0) + 1; 
                } else if(opt.status === 'exclude') {
                    acc.exclude = (acc.exclude || 0) + 1; 
                }
                return acc;
            }, {});
            let text = '';
            if(f.include) text += `+${f.include}`;
            if(f.exclude) {
                if (text) text += `, `
                text += `-${f.exclude}`
            };
            if(!text) return null;
            text = `(${text}) ${filter.label}`;


            return (
                <Chip label={text} variant='outlined' onDelete={_ => deselectFilter(idx)} />
            );
        })
    }

    return (
        <Dialog
            open={props.open} breakpoint='sm' maxWidth='sm' fullWidth
            hideDialogActions showCloseButton onClose={props.onClose}
            disableBackdropClick={false} title='Search Filters'
        >
            <div id='sel-filters' >
                {getSelectedFiltersTags()}
            </div>

            {filters.map((filter, idx) => (
                <FiltersButton
                    key={filter.name}
                    options={filter.options}
                    onChange={(e, opts) => {
                        updateFilters(opts, idx);
                    }}
                >
                    {filter.label}
                </FiltersButton>
            ))}
        </Dialog>
    )
}

const FILTERS = [{
    name: 'demography',
    label: 'Demography',
    options: [
        {
            label: 'Shounen', value: 'shounen', status: ''
        }, {
            label: 'Shoujo', value: 'shoujo', status: ''
        }, {
            label: 'Josei', value: 'josei', status: ''
        }, {
            label: 'Seinen', value: 'seinen', status: ''
        }, {
            label: 'None', value: 'none', status: ''
        }
    ],
}, {
    name: 'status',
    label: 'Status',
    options: [
        {
            label: 'Ongoing', value: 'ongoing', status: ''
        }, {
            label: 'Completed', value: 'completed', status: ''
        }, {
            label: 'Hiatus', value: 'hiatus', status: ''
        }, {
            label: 'Cancelled', value: 'cancelled', status: ''
        }
    ],
}, {
    name: 'contentRating',
    label: 'Content Rating',
    options: [
        {
            label: 'Safe', value: 'safe', status: ''
        }, {
            label: 'Suggestive', value: 'suggestive', status: ''
        }, {
            label: 'Erotica', value: 'erotica', status: ''
        }, {
            label: 'Pornographic', value: 'pornographic', status: 'exclude'
        }
    ]
}];

/**@type {MuiXDialog} */
const Dialog = styled(MuiXDialog)`
    .MuiDialogTitle-root {
        display: flex;
        align-items: center;
    }
    .MuiDialogContent-root {
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: space-between;
        align-content: flex-start;
        row-gap: 1rem;
        column-gap: 1rem;
        #sel-filters {
            grid-column: 1 / -1;
            display: flex;
            gap: .4rem;
            overflow-x: auto;
            padding: 0 .8rem .8rem;
            .MuiChip-root {
                margin: .2rem;
            }
        }
        .full-width {
            grid-column: 1/3;
        }
        .MuiFormControlLabel-root {
            margin: 0;
            justify-self: flex-start;
        }
    }

    ${({ theme }) => theme.breakpoints.down('sm')}{
        .MuiDialogContent-root {
            grid-template-columns: 1fr;
        }
    }
`;


SearchFilter.propTypes = {
    open: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    readerSettings: PropTypes.shape({
        displayMode: PropTypes.string,
        imageSize: PropTypes.string,
        readingDir: PropTypes.string,
        arrowScrollSize: PropTypes.number,
        preloadPages: PropTypes.number,
    }),
}


export default SearchFilter;