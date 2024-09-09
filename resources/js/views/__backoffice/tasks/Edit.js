import React, { useState, useEffect } from 'react';

import {
    CircularProgress,
    Grid,
    Paper,
    Typography,
    withStyles,
    Tooltip,
    IconButton,
} from '@material-ui/core';

import {
    Delete as DeleteIcon,
} from '@material-ui/icons';

import { Task } from '../../../models';
import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';

import * as NavigationUtils from '../../../helpers/Navigation';

import { TaskForm } from './Forms';

function Edit(props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});
    const [task, setTask] = useState({});
    const [alert, setAlert] = useState({});

    /**
     * Fetch the task.
     *
     * @param {number} id
     *
     * @return {undefined}
     */
    const fetchTask = async id => {
        setLoading(true);

        try {
            const data = await Task.show(id);

            if (!data) {
                props.history.push(NavigationUtils.route(
                    'backoffice.resources.tasks.index',
                ));
            }

            setTask(data);
        } catch (error) {
            props.history.push(NavigationUtils.route(
                'backoffice.resources.tasks.index',
            ));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Event listener that is triggered when a resource delete button is clicked.
     * This should prompt for confirmation.
     *
     * @param {string} id
     *
     * @return {undefined}
     */
    const handleDeleteClick = id => {
        setAlert({
            type: 'confirmation',
            title: Lang.get('resources.delete_confirmation_title', {
                name: 'Task',
            }),
            body: Lang.get('resources.delete_confirmation_body', {
                name: 'Task',
            }),
            confirmText: Lang.get('actions.continue'),
            confirmed: async () => await deleteTask(id),
            cancelled: () => setAlert({}),
        });
    };

    /**
     * This should send an API request to delete a resource.
     *
     * @param {string} id
     *
     * @return {undefined}
     */
    const deleteTask = async id => {
        try {
            const response = await Task.delete(id);

            if (response) {
                setMessage({
                    type: 'success',
                    body: Lang.get('resources.deleted', {
                        name: 'Task',
                    }),
                    closed: () => setMessage({}),
                });

                props.history.push(NavigationUtils.route(
                    'backoffice.resources.tasks.index',
                ));
            }
        } catch (error) {
            setMessage({
                type: 'error',
                body: Lang.get('resources.not_deleted', {
                    name: 'Task',
                }),
                closed: () => setMessage({}),
            });
        } finally {
            setAlert({});
        }
    };

    /**
     * Handle form submit, this should send an API response
     * to update a task.
     *
     * @param {object} values
     *
     * @param {object} form
     *
     * @return {undefined}
     */
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);

        setLoading(true);

        try {
            const data = await Task.update(task.id, values);

            if (data && data.id) {
                setMessage({
                    type: 'success',
                    body: Lang.get('resources.updated', {
                        name: 'Task',
                    }),
                    closed: () => setMessage({}),
                });

                setTask(data);
            } else {
                throw new Error('Unknown error');
            }
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;

            setErrors(errors);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Object.keys(task).length < 1) {
            fetchTask(props.match.params.id);
        }
    }, []);

    const { classes, ...other } = props;

    const renderLoading = (
        <Grid
            container
            className={classes.loadingContainer}
            justify="center"
            alignItems="center"
        >
            <Grid item>
                <CircularProgress color="primary" />
            </Grid>
        </Grid>
    );

    const renderForm = () => {
        if (loading) {
            return renderLoading;
        }

        const defaultTaskFormValues = {
            is_drop: false,
            user_id: task.user_id === null ? '' : task.user_id,
            status: task.status === null ? '' : task.status,
            title: task.title === null ? '' : task.title,
            description: task.description === null ? '' : task.description,
        };

        return (
            <TaskForm
                {...other}
                values={defaultTaskFormValues}
                handleSubmit={handleSubmit}
            />
        );
    };

    return (
        <MasterLayout
            {...other}
            pageTitle="Edit task"
            tabs={[]}
            message={message}
            alert={alert}
        >
            <div className={classes.pageContentWrapper}>
                {loading && <LinearIndeterminate />}

                <Paper>
                    <div className={classes.pageContent}>
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            gutterBottom
                        >
                            Task Modification
                        </Typography>

                        {renderForm()}

                        <Tooltip
                            title={Lang.get('resources.delete', {
                                name: 'Task',
                            })}
                        >
                            <IconButton
                                color="secondary"
                                onClick={() => handleDeleteClick(task.id)}
                                style={{ borderRadius: '2rem' }}
                            >
                                <DeleteIcon />
                                <small style={{ marginLeft: '0.25rem', marginRight: '0.375rem' }}>
                                    Delete
                                </small>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Paper>
            </div>
        </MasterLayout>
    );
}

const styles = theme => ({
    pageContentWrapper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        minHeight: '75vh',
        overflowX: 'auto',
    },

    pageContent: {
        padding: theme.spacing.unit * 3,
    },

    loadingContainer: {
        minHeight: 200,
    },
});

export default withStyles(styles)(Edit);
