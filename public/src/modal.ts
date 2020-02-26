export default class Modal<ReturnType extends object> {
    handlers: {
        click: ((e: Event, parsed: ReturnType) => any)[],
        dismiss: ((e: Event) => any)[],
        postRun: (() => any)[]
    };

    title: string;
    body: string;

    visible: boolean;

    container: HTMLDivElement;

    allowMultiple: boolean = false;

    constructor(title: string, body: string, allowMultiple: boolean = false) {
        this.title = title;
        this.body = body;
        this.allowMultiple = allowMultiple;

        this.handlers = {
            click: [],
            dismiss: [],
            postRun: []
        }
    }

    static fetchModalContainer(): HTMLDivElement {
        const container: HTMLDivElement = document.querySelector("#modal-container");

        if (container)
            return container;

        const newContainer = document.createElement('div');
        newContainer.id = "modal-container";
        document.body.appendChild(newContainer);

        return newContainer;
    }

    init(postCreate: () => any): Modal<ReturnType> {
        const _this = this;
        this.handlers.postRun.push(() => postCreate.bind(_this)());
        return this;
    }

    onClick(callback: (e: Event, parsed: ReturnType) => any) {
        this.handlers.click.push(callback);
    }

    onDismiss(callback: (e: Event) => any) {
        this.handlers.dismiss.push(callback);
    }

    extractData(): ReturnType {
        const content: HTMLInputElement[] = this.container.querySelector(".box-body input") as any;

        const data: any = {};

        for (const input of content)
            if (input.name && !(input.name in data))
                data[input.name] = input.value;

        return data as ReturnType;
    }

    click(e: Event) {
        this.visible = false;

        const body: ReturnType = this.extractData();

        this.handlers.click.forEach(i => i(e, body));

        this.container.remove();
    }

    dismiss(e: Event) {
        this.visible = false;
        this.handlers.dismiss.forEach(i => i(e));

        this.container.remove();
    }

    render(): HTMLDivElement {
        this.container = document.createElement('div');
        this.container.classList.add('modal');

        this.container.innerHTML = `<div class="box-container">
                <h1>${this.title}</h1>
                <div class="box-body">${this.body}</div>
            </div>
            <div class="form-controls">
                <button class="box-dismiss-btn">Cancel</button>
                <button class="box-confirm-btn">Okay</button>
            </div>`;

        this.container.querySelector(".box-confirm-btn").addEventListener("click", (e: Event) => this.click(e));
        this.container.querySelector(".box-dismiss-btn").addEventListener("click", (e: Event) => this.dismiss(e));

        for (const i of this.handlers.postRun) {
            const that = this;
            i.bind(that)();
        }

        return this.container;
    }

    show() {
        const container: HTMLDivElement = Modal.fetchModalContainer();

        if (!this.visible || this.allowMultiple) {
            container.appendChild(this.render());
            this.visible = true;
        }
    }

    move(parent: HTMLDivElement): HTMLDivElement {
        this.container.remove();
        parent.appendChild(this.container);

        return parent;
    }
}