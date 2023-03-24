export var TaskItemStatus;
(function (TaskItemStatus) {
    TaskItemStatus[TaskItemStatus["Open"] = 0] = "Open";
    TaskItemStatus[TaskItemStatus["Closed"] = 1] = "Closed";
})(TaskItemStatus || (TaskItemStatus = {}));
export var TaskBoardType;
(function (TaskBoardType) {
    TaskBoardType[TaskBoardType["List"] = 1] = "List";
    TaskBoardType[TaskBoardType["Kanban"] = 2] = "Kanban";
})(TaskBoardType || (TaskBoardType = {}));
export var StorageViewType;
(function (StorageViewType) {
    StorageViewType[StorageViewType["List"] = 1] = "List";
    StorageViewType[StorageViewType["Grid"] = 2] = "Grid";
})(StorageViewType || (StorageViewType = {}));
var DocAccessType;
(function (DocAccessType) {
    DocAccessType["open"] = "open";
    DocAccessType["private"] = "private";
    DocAccessType["restricted"] = "restricted";
})(DocAccessType || (DocAccessType = {}));
//# sourceMappingURL=resource.js.map