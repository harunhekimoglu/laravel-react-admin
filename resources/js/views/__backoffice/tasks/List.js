import React, { useState, useEffect, useContext } from 'react';

import * as NavigationUtils from '../../../helpers/Navigation';
import { Board } from '../../../ui';
import { Master as MasterLayout } from '../layouts';
import { Task } from '../../../models';
import { AppContext } from '../../../AppContext';

function List(props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});
    const [alert, setAlert] = useState({});
    const [tasks, setTasks] = useState({});

    /**
     * This should send an API request to fetch all resource.
     *
     * @param {object} params
     *
     * @return {undefined}
     */
    const fetchTasks = async () => {
        setLoading(true);

        try {
            const data = await Task.get();

            setTasks(data);
            setMessage({});
        } catch (error) {
            //
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch data on initialize.
     */
    useEffect(() => {
        if (Object.keys(tasks).length < 1) {
            fetchTasks();
        }
    }, []);

    const { user: authUser } = useContext(AppContext);
    const { ...childProps } = props;
    const { history } = props;

    const primaryAction = {
        text: Lang.get('resources.create', {
            name: 'Task',
        }),
        clicked: () =>
            history.push(
                NavigationUtils.route('backoffice.resources.tasks.create'),
            ),
    };

    const tabs = [
        {
            name: 'List',
            active: true,
        },
    ];

    return (
        <MasterLayout
            {...childProps}
            loading={loading}
            pageTitle="Tasks"
            primaryAction={primaryAction}
            tabs={tabs}
            message={message}
            alert={alert}
        >
            {!loading && tasks && (
                <Board
                    history={history}
                    tasks={tasks}
                    fetchTasks={fetchTasks}
                />
            )}
        </MasterLayout>
    );
}

export default List;
