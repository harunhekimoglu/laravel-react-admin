import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
    withStyles,
    Paper,
    Typography,
} from '@material-ui/core';

import { Task } from '../models';

import BoardItem from './BoardItem';

const Board = props => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});
    const [alert, setAlert] = useState({});

    const {
        history,
        classes,
        tasks,
        fetchTasks,
    } = props;

    const onDragEnd = async result => {
        if (!result.destination) {
            return;
        }

        const { draggableId, source, destination } = result;

        if (source.droppableId != destination.droppableId) {
            setLoading(true);

            try {
                const status = result.destination.droppableId === 'in_progress'
                    ? 'in-progress'
                    : result.destination.droppableId;

                const data = await Task.update(draggableId, {
                    is_drop: true,
                    status: status,
                });

                if (data && data.id) {
                    setMessage({
                        type: 'success',
                        body: Lang.get('resources.updated', {
                            name: 'Task',
                        }),
                        closed: () => setMessage({}),
                    });

                    fetchTasks();
                } else {
                    throw new Error('Unknown error');
                }
            } catch (error) {
                if (!error.response) {
                    throw new Error('Unknown error');
                }
                location.reload();
            } finally {
                setLoading(false);
                setAlert({});
            }
        }
    };

    return (
        <div className={classes.root}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Paper className={classes.board}>
                    <Typography variant="h6" className={classes.boardHead}>
                        Todo
                    </Typography>

                    <Droppable droppableId="todo">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={classes.boardBody}
                            >
                                {tasks && tasks.todo && tasks.todo.map((todo) => (
                                    <Draggable
                                        key={todo.id}
                                        draggableId={`${todo.id}`}
                                        index={todo.id}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    opacity: snapshot.isDragging ? '0.5' : '1'
                                                }}
                                            >
                                                <BoardItem
                                                    history={history}
                                                    task={todo}
                                                >
                                                </BoardItem>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Paper>

                <Paper className={classes.board}>
                    <Typography variant="h6" className={classes.boardHead}>
                        In Progress
                    </Typography>

                    <Droppable droppableId="in_progress">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={classes.boardBody}
                            >
                                {tasks && tasks.in_progress && tasks.in_progress.map((in_progress) => (
                                    <Draggable
                                        key={in_progress.id}
                                        draggableId={`${in_progress.id}`}
                                        index={in_progress.id}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    opacity: snapshot.isDragging ? '0.5' : '1'
                                                }}
                                            >
                                                <BoardItem
                                                    history={history}
                                                    task={in_progress}
                                                >
                                                </BoardItem>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Paper>
                <Paper className={classes.board}>
                    <Typography variant="h6" className={classes.boardHead}>
                        Done
                    </Typography>

                    <Droppable droppableId="done">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={classes.boardBody}
                            >
                                {tasks && tasks.done && tasks.done.map((done) => (
                                    <Draggable
                                        key={done.id}
                                        draggableId={`${done.id}`}
                                        index={done.id}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    opacity: snapshot.isDragging ? '0.5' : '1'
                                                }}
                                            >
                                                <BoardItem
                                                    history={history}
                                                    task={done}
                                                >
                                                </BoardItem>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Paper>
            </DragDropContext>
        </div>
    );
};

Board.propTypes = {
    tasks: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        width: '100%',
        minHeight: '75vh',
        display: 'flex',
        gap: '1rem',
    },

    board: {
        width: '100%',
        height: '100%',
    },

    boardHead: {
        flex: '0 0 auto',
        marginTop: '0.375rem',
        marginLeft: '0.75rem',
    },

    boardBody: {
        height: '100%',
    },

    boardItem: {
        minHeight: '100px',
        margin: '0.625rem',
        padding: '0.5rem',
        border: '1px solid gray',
        borderRadius: '0.625rem',
        cursor: 'pointer',
    },
});

export default withStyles(styles)(Board);
