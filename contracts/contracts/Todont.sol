// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Todont {
    struct Task {
        uint32 id;
        string text;
        uint32 count;
    }

    mapping(address => uint32) currentId;

    mapping(address => uint32[]) taskIds;

    mapping(address => mapping(uint32 => Task)) tasks;

    function addTask(string calldata text) external {
        requireString(text, "Text cannot be empty");

        uint32 id = ++currentId[msg.sender];

        tasks[msg.sender][id] = Task(id, text, 0);

        taskIds[msg.sender].push(id);
    }

    function deleteTask(uint32 id) external {
        delete tasks[msg.sender][id];

        bool found = false;
        uint32 index = 0;
        for (uint32 i = 0; i < taskIds[msg.sender].length; i++) {
            if (taskIds[msg.sender][i] == id) {
                index = i;
                found = true;
                break;
            }
        }

        if (!found) return;

        for (uint32 i = index; i < taskIds[msg.sender].length - 1; i++) {
            taskIds[msg.sender][i] = taskIds[msg.sender][i + 1];
        }

        taskIds[msg.sender].pop();
    }

    function incrementTask(uint32 id) external {
        tasks[msg.sender][id].count++;
    }

    function getTask(uint32 id) external view returns (Task memory) {
        return tasks[msg.sender][id];
    }

    function getTasks() external view returns (Task[] memory) {
        Task[] memory tasksView = new Task[](taskIds[msg.sender].length);

        for (uint32 i = 0; i < taskIds[msg.sender].length; i++) {
            tasksView[i] = tasks[msg.sender][taskIds[msg.sender][i]];
        }

        return tasksView;
    }

    function requireString(
        string calldata text,
        string memory errorMessage
    ) internal pure {
        require(bytes(text).length > 0, errorMessage);
    }

    function isEmptyString(string memory text) internal pure returns (bool) {
        return bytes(text).length == 0;
    }
}
