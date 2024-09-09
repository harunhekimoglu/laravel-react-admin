<?php

namespace App\Http\Controllers\Api\V1;

use App\Task;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TasksController extends Controller
{
    /**
     * List all resource.
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function index() : JsonResponse
    {
        $tasks = Task::select([
            'id',
            'user_id',
            'status',
            'title',
            'description',
            'created_at',
        ])->get();

        $data = [
            'todo' => [],
            'in_progress' => [],
            'done' => [],
        ];

        foreach ($tasks as $task) {
            $item = [
                'id' => $task->id,
                'status' => $task->status,
                'title' => $task->title,
                'description' => $task->description,
                'created_at' => $task->created_at->format('H:i:s d/m/Y'),
                'assignee_firstname' => $task->assignee->firstname,
                'assignee_lastname' => $task->assignee->lastname,
                'assignee_name' => $task->assignee->name,
                'assignee_thumbnail_url' => $task->assignee->thumbnail_url,
                'assignee_created_at' => $task->assignee->created_at,
            ];

            if ($item['status'] === 'todo') {
                $data['todo'][] = $item;
            } else if ($item['status'] === 'in-progress') {
                $data['in_progress'][] = $item;
            } else if ($item['status'] === 'done') {
                $data['done'][] = $item;
            }
        }

        return response()->json($data);
    }

    /**
     * Store a new resource.
     *
     * @param Illuminate\Http\Request $request
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function store(Request $request) : JsonResponse
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:510',
        ]);

        $task = Task::create([
            'user_id' => $request->input('user_id'),
            'title' => $request->input('title'),
            'description' => $request->input('description'),
        ]);

        return response()->json($task, 201);
    }

    /**
     * Show a resource.
     *
     * @param Illuminate\Http\Request $request
     * @param App\Task $task
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function show(Request $request, Task $task) : JsonResponse
    {
        return response()->json($task);
    }

    /**
     * Update a resource.
     *
     * @param Illuminate\Http\Request $request
     * @param App\Task $task
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Task $task) : JsonResponse
    {
        $request->validate([
            'is_drop' => 'required|boolean',
            'user_id' => 'nullable|exists:users,id',
            'status' => 'required|in:todo,in-progress,done',
            'title' => 'required_if:is_drop,0,false|string|max:255',
            'description' => 'nullable|string|max:510',
        ]);

        $isDrop = !! $request->input('is_drop');

        if ($isDrop) {
            $task->update([
                'status' => $request->input('status'),
            ]);
        } else {
            $task->update([
                'user_id' => $request->input('user_id'),
                'status' => $request->input('status'),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
            ]);
        }

        return response()->json($task);
    }

    /**
     * Destroy a resource.
     *
     * @param Illuminate\Http\Request $request
     * @param App\Task $task
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Task $task) : JsonResponse
    {
        $status = $task->delete();

        return response()->json(!! $status);
    }
}
