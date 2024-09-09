import React from 'react';
import PropTypes from 'prop-types';

import {
    Avatar,
    Grid,
    withStyles,
    Typography,
} from '@material-ui/core';

import * as RandomUtils from '../helpers/Random';
import * as NavigationUtils from '../helpers/Navigation';

const BoardItem = props => {
    const {
        history,
        classes,
        task,
    } = props;

    return (
        <div
            className={classes.boardItem}
            onClick={() =>
                history.push(
                    NavigationUtils.route(
                        'backoffice.resources.tasks.edit',
                        { id: task.id },
                    ),
                )
            }
        >
            <div>
                <strong>
                    {task.title}
                </strong>
            </div>
            <div style={{ marginTop: '0.25rem' }}>
                {task.description}
            </div>
            <div style={{ marginTop: '0.25rem' }}>
                <small>
                    {task.created_at}
                </small>
            </div>
            <div style={{ marginTop: '0.375rem' }}>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    wrap="nowrap"
                >
                    <Grid item style={{ marginRight: '0.5rem' }}>
                        {task.hasOwnProperty('assignee_thumbnail_url') && (
                            task.assignee_thumbnail_url !== null ? (
                                <Avatar
                                    alt={task.assignee_name}
                                    src={task.assignee_thumbnail_url}
                                />
                            ) : (
                                <Avatar
                                    style={{
                                        fontSize: 17,
                                        backgroundColor: RandomUtils.color(
                                            task.assignee_firstname.length -
                                                task.assignee_created_at.charAt(
                                                    task.assignee_created_at.length - 2,
                                                ),
                                        ),
                                    }}
                                >
                                    <Typography>
                                        {`${task.assignee_firstname.charAt(
                                            0,
                                        )}${task.assignee_lastname.charAt(0)}`}
                                    </Typography>
                                </Avatar>
                            )
                        )}
                    </Grid>

                    <Grid item>{task.assignee_name}</Grid>
                </Grid>
            </div>
        </div>
    );
};

BoardItem.propTypes = {
    task: PropTypes.object.isRequired,
};

const styles = theme => ({
    boardItem: {
        minHeight: '100px',
        margin: '0.625rem',
        padding: '0.5rem',
        border: '1px solid gray',
        borderRadius: '0.625rem',
        cursor: 'pointer',
    },
});

export default withStyles(styles)(BoardItem);
