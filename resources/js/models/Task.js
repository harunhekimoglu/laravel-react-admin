import axios from 'axios';

export default class Task {
    /**
     * Fetch tasks list.
     *
     * @param {object} params
     *
     * @return {object}
     */
    static async get() {
        const response = await axios.get('/api/v1/tasks');

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Store a new task.
     *
     * @param {object} attributes
     *
     * @return {object}
     */
    static async store(attributes) {
        const response = await axios.post('/api/v1/tasks', attributes);

        if (response.status !== 201) {
            return {};
        }

        return response.data;
    }

    /**
     * Show a task.
     *
     * @param {number} id
     *
     * @return {object}
     */
    static async show(id) {
        const response = await axios.get(`/api/v1/tasks/${id}`);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Update a task.
     *
     * @param {number} id
     * @param {object} attributes
     *
     * @return {object}
     */
    static async update(id, attributes) {
        const response = await axios.patch(`/api/v1/tasks/${id}`, attributes);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Delete a task.
     *
     * @param {number} id
     *
     * @return {object}
     */
    static async delete(id) {
        const response = await axios.delete(`/api/v1/tasks/${id}`);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Restore a task.
     *
     * @param {number} id
     *
     * @return {object}
     */
    static async restore(id) {
        const response = await axios.patch(`/api/v1/tasks/${id}/restore`);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }
}
