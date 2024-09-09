import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { User } from '../../../../models';

import {
    Button,
    FormControl,
    FormHelperText,
    Input,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    withStyles,
} from '@material-ui/core';

const TaskForm = props => {
    const [assignees, setAssignees] = useState([]);

    const { classes, values, handleSubmit } = props;

    /**
     * This should send an API request to fetch all resource.
     *
     * @param {object} params
     *
     * @return {undefined}
     */
    const fetchAssignees = async () => {
        try {
            let data = await User.pluck();

            data = data ? Object.entries(data) : [];

            setAssignees(data);
        } catch (error) {
            setAssignees([]);
        }
    };

    useEffect(() => {
        if (Object.keys(assignees).length < 1) {
            fetchAssignees();
        }
    }, []);

    return (
        <Formik
            initialValues={values}
            validationSchema={Yup.object().shape({
                status: values.status ? Yup.string().required(
                    Lang.get('validation.required', {
                        attribute: 'status',
                    }),
                ) : Yup.object().nullable(),

                title: Yup.string().required(
                    Lang.get('validation.required', {
                        attribute: 'title',
                    }),
                ),
            })}
            onSubmit={async (values, form) => {
                let mappedValues = {};
                let valuesArray = Object.values(values);

                // Format values specially the object ones (i.e Moment)
                Object.keys(values).forEach((filter, key) => {
                    if (
                        valuesArray[key] !== null &&
                        typeof valuesArray[key] === 'object' &&
                        valuesArray[key].hasOwnProperty('_isAMomentObject')
                    ) {
                        mappedValues[filter] = moment(valuesArray[key]).format(
                            'YYYY-MM-DD',
                        );

                        return;
                    }

                    mappedValues[filter] = valuesArray[key];
                });

                await handleSubmit(mappedValues, form);
            }}
            validateOnBlur={false}
        >
            {({
                values,
                errors,
                submitCount,
                isSubmitting,
                handleChange,
                setFieldValue,
            }) => (
                <Form>
                    <Input id="is_drop" type="hidden" name="is_drop" value={values.is_drop} />
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={12}>
                            <FormControl
                                className={classes.formControl}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('user_id')
                                }
                            >
                                <InputLabel htmlFor="user_id">
                                    Assignee
                                </InputLabel>

                                <Select
                                    id="user_id"
                                    name="user_id"
                                    value={values.user_id}
                                    onChange={handleChange}
                                    input={<Input fullWidth />}
                                    autoWidth
                                >
                                    <MenuItem value="">
                                        Please select the assignee
                                    </MenuItem>

                                    {assignees && assignees.length > 0 && assignees.map((assignee) => (
                                        <MenuItem key={assignee[0]} value={assignee[0]}>
                                            {assignee[1]}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('user_id') && (
                                        <FormHelperText>
                                            {errors.user_id}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                    </Grid>

                    {values.status && (
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                <FormControl
                                    className={classes.formControl}
                                    error={
                                        submitCount > 0 &&
                                        errors.hasOwnProperty('status')
                                    }
                                >
                                    <InputLabel htmlFor="status">
                                        Status{' '}
                                        <span className={classes.required}>*</span>
                                    </InputLabel>

                                    <Select
                                        id="status"
                                        name="status"
                                        value={values.status}
                                        onChange={handleChange}
                                        input={<Input fullWidth />}
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            Please select the status
                                        </MenuItem>

                                        <MenuItem value="todo">
                                            Todo
                                        </MenuItem>

                                        <MenuItem value="in-progress">
                                            In Progress
                                        </MenuItem>

                                        <MenuItem value="done">
                                            Done
                                        </MenuItem>
                                    </Select>

                                    {submitCount > 0 &&
                                        errors.hasOwnProperty('status') && (
                                            <FormHelperText>
                                                {errors.status}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}

                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={12}>
                            <FormControl
                                className={classes.formControl}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('title')
                                }
                            >
                                <InputLabel htmlFor="title">
                                    Title{' '}
                                    <span className={classes.required}>*</span>
                                </InputLabel>

                                <Input
                                    id="title"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    fullWidth
                                />

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('title') && (
                                        <FormHelperText>
                                            {errors.title}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={12}>
                            <FormControl
                                className={classes.formControl}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('description')
                                }
                            >
                                <InputLabel htmlFor="description">
                                    Description
                                </InputLabel>

                                <Input
                                    id="description"
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('description') && (
                                        <FormHelperText>
                                            {errors.description}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>
                    </Grid>

                    <div className={classes.sectionSpacer} />

                    <Grid container spacing={24} justify="flex-end">
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={
                                    (errors &&
                                        Object.keys(errors).length > 0 &&
                                        submitCount > 0) ||
                                    isSubmitting
                                }
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

TaskForm.propTypes = {
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

const styles = theme => ({
    formControl: {
        minWidth: '100%',
    },

    required: {
        color: theme.palette.error.main,
    },
});

export default withStyles(styles)(TaskForm);
