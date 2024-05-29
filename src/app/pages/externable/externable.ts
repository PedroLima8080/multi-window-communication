import { Directive, inject, NgZone } from "@angular/core";
import { interval } from "rxjs";
import { ExternableComponentOwnerService, IExternalWindow } from "../../../services/externable-component-owner.service";

@Directive()
export abstract class Externable {
    protected readonly _ngZone = inject(NgZone);
    protected _externableComponentOwnerService!: ExternableComponentOwnerService;
    protected _owner = (window as unknown as IExternalWindow).owner;

    constructor() {
        this._externableComponentOwnerService = this._owner?.singletons
            ? this._owner.singletons.externableComponentOwnerService
            : inject(ExternableComponentOwnerService);

        if (this._owner) {
            this.listenOwnerClose();
            this.registerInRelatedZones();
        }
    }

    private registerInRelatedZones() {
        this._owner.relatedZones.push(this._ngZone);
    }

    private listenOwnerClose() {
        this._ngZone.runOutsideAngular(() => {
            interval(1000).subscribe(() => {
                if (this._owner.window.closed)
                    window.close();
            })
        })
    }

    outsource() {
        this._externableComponentOwnerService.openWindow(this._ngZone, this._externableComponentOwnerService);
    }

    close() {
        window.close();
    }

}