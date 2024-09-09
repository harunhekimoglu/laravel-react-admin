import React, { useState } from 'react';

import {
    Paper,
    Typography,
    withStyles,
} from '@material-ui/core';

import { Task } from '../../../models';
import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';

import * as NavigationUtils from '../../../helpers/Navigation';

import { TaskForm } from './Forms';

function Create(props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});

    /**
     * Handle form submit, this should send an API response
     * to create a task.
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
            const data = await Task.store(values);

            if (data && data.id) {
                setMessage({
                    type: 'success',
                    body: Lang.get('resources.created', {
                        name: 'Task',
                    }),
                    closed: () => setMessage({}),
                });

                props.history.push(NavigationUtils.route(
                    'backoffice.resources.tasks.index',
                ));
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

    const { classes, ...other } = props;

    const renderForm = () => {
        const defaultTaskFormValues = {
            user_id: '',
            title: '',
            description: '',
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
            pageTitle="Create a task"
            tabs={[]}
            message={message}
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
                            Task Creation
                        </Typography>

                        {renderForm()}
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
});

export default withStyles(styles)(Create);
