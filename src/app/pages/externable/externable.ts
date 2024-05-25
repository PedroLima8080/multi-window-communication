import { Directive, inject, NgZone } from "@angular/core";
import { ExternableComponentOwnerService, IExternalWindow } from "../../../services/externable-component-owner.service";
import { interval } from "rxjs";

@Directive()
export abstract class Externable {
    protected readonly _ngZone = inject(NgZone);
    protected _externableComponentOwnerService!: ExternableComponentOwnerService;
    protected _owner = (window as unknown as IExternalWindow).owner;

    constructor() {
        this._externableComponentOwnerService = this._owner?.singletons
            ? this._owner.singletons.externableComponentOwnerService
            : inject(ExternableComponentOwnerService);

        if (this._owner)
            this.listenOwnerClose();
    }

    private listenOwnerClose() {
        interval(1000).subscribe(() => {
            if (this._owner.window.closed)
                window.close();
        })
    }

    protected updateOwner() {
        if (this._owner)
            this._owner.ngZone.run(() => { })
    }

    outsource() {
        this._externableComponentOwnerService.openWindow(this._ngZone, this._externableComponentOwnerService);
    }

    close() {
        window.close();
    }

}