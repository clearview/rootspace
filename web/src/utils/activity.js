var _a;
export var ActivityEntity;
(function (ActivityEntity) {
    ActivityEntity["Doc"] = "Doc";
    ActivityEntity["Embed"] = "Embed";
    ActivityEntity["Folder"] = "Folder";
    ActivityEntity["Link"] = "Link";
    ActivityEntity["Task"] = "Task";
    ActivityEntity["TaskBoard"] = "TaskBoard";
    ActivityEntity["Storage"] = "Storage";
})(ActivityEntity || (ActivityEntity = {}));
export var ActivityRouteName = (_a = {},
    _a[ActivityEntity.Doc] = 'Document',
    _a[ActivityEntity.Embed] = 'Embed',
    _a[ActivityEntity.Folder] = '',
    _a[ActivityEntity.Link] = 'Link',
    _a[ActivityEntity.Task] = 'TaskPageWithItem',
    _a[ActivityEntity.TaskBoard] = 'TaskPage',
    _a[ActivityEntity.Storage] = 'Storage',
    _a);
export var getEntityLink = function (data) {
    var name = ActivityRouteName[data.entity];
    var params = {};
    if (!(name && data.entityId))
        return '';
    switch (data.entity) {
        case ActivityEntity.Task:
            params.id = data.context.entity.boardId.toString();
            params.item = data.entityId.toString();
            break;
        default:
            params.id = data.entityId.toString();
    }
    return { name: name, params: params };
};
//# sourceMappingURL=activity.js.map