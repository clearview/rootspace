export var Client = window.Primus;
export var PrimusClient = window.Primus;
var Primus = /** @class */ (function () {
    function Primus(token) {
        var url = process.env.VUE_APP_API_URL + '?token=' + token;
        this.client = new Client(url);
    }
    Primus.connect = function (token) {
        return new Primus(token);
    };
    Primus.prototype.disconnect = function () {
        this.client.end();
    };
    Primus.prototype.on = function (event, callback) {
        this.client.on(event, callback);
    };
    Primus.prototype.broadcast = function (room, payload) {
        this.client.write({ room: room, payload: payload });
    };
    Primus.prototype.join = function (room) {
        this.client.write({ action: 'join', room: room });
    };
    Primus.prototype.leave = function (room) {
        this.client.write({ action: 'leave', room: room });
    };
    return Primus;
}());
export default Primus;
//# sourceMappingURL=primus.js.map