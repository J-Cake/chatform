"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Modal = /** @class */ (function () {
    function Modal(title, body, allowMultiple) {
        if (allowMultiple === void 0) { allowMultiple = false; }
        this.allowMultiple = false;
        this.title = title;
        this.body = body;
        this.allowMultiple = allowMultiple;
        this.handlers = {
            click: [],
            dismiss: [],
            postRun: []
        };
    }
    Modal.fetchModalContainer = function () {
        var container = document.querySelector("#modal-container");
        if (container)
            return container;
        var newContainer = document.createElement('div');
        newContainer.id = "modal-container";
        document.body.appendChild(newContainer);
        return newContainer;
    };
    Modal.prototype.init = function (postCreate) {
        var _this = this;
        this.handlers.postRun.push(function () { return postCreate.bind(_this)(); });
        return this;
    };
    Modal.prototype.onClick = function (callback) {
        this.handlers.click.push(callback);
    };
    Modal.prototype.onDismiss = function (callback) {
        this.handlers.dismiss.push(callback);
    };
    Modal.prototype.extractData = function () {
        var content = this.container.querySelector(".box-body input");
        var data = {};
        for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
            var input = content_1[_i];
            if (input.name && !(input.name in data))
                data[input.name] = input.value;
        }
        return data;
    };
    Modal.prototype.click = function (e) {
        this.visible = false;
        var body = this.extractData();
        this.handlers.click.forEach(function (i) { return i(e, body); });
        this.container.remove();
    };
    Modal.prototype.dismiss = function (e) {
        this.visible = false;
        this.handlers.dismiss.forEach(function (i) { return i(e); });
        this.container.remove();
    };
    Modal.prototype.render = function () {
        var _this_1 = this;
        this.container = document.createElement('div');
        this.container.classList.add('modal');
        this.container.innerHTML = "<div class=\"box-container\">\n                <h1>" + this.title + "</h1>\n                <div class=\"box-body\">" + this.body + "</div>\n            </div>\n            <div class=\"form-controls\">\n                <button class=\"box-dismiss-btn\">Cancel</button>\n                <button class=\"box-confirm-btn\">Okay</button>\n            </div>";
        this.container.querySelector(".box-confirm-btn").addEventListener("click", function (e) { return _this_1.click(e); });
        this.container.querySelector(".box-dismiss-btn").addEventListener("click", function (e) { return _this_1.dismiss(e); });
        for (var _i = 0, _a = this.handlers.postRun; _i < _a.length; _i++) {
            var i = _a[_i];
            var that = this;
            i.bind(that)();
        }
        return this.container;
    };
    Modal.prototype.show = function () {
        var container = Modal.fetchModalContainer();
        if (!this.visible || this.allowMultiple) {
            container.appendChild(this.render());
            this.visible = true;
        }
    };
    Modal.prototype.move = function (parent) {
        this.container.remove();
        parent.appendChild(this.container);
        return parent;
    };
    return Modal;
}());
exports.default = Modal;
//# sourceMappingURL=modal.js.map