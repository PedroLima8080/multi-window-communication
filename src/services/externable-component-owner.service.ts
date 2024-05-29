import { inject, Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, interval, Subject, takeUntil } from "rxjs";

export interface IExternalWindow {
    owner: {
        window: Window;
        singletons: {
            externableComponentOwnerService: ExternableComponentOwnerService
        },
        ngZone: NgZone,
        relatedZones: NgZone[]
    }
}

@Injectable({ providedIn: 'root' })
export class ExternableComponentOwnerService {
    private _ngZone: NgZone = inject(NgZone);
    private _outsourcedWindow: Window | null = null;
    private _intervalLifeCycle: Subject<void> | null = null;
    private _outsourced: BehaviorSubject<boolean> = new BehaviorSubject(false);
    currentValue: number = 0;

    get outsourced(): boolean {
        return this._outsourced.value;
    }

    private updateRelatedWindows() {
        const owner = (this._outsourcedWindow as unknown as IExternalWindow)?.owner
        if(owner) {
            owner.ngZone.run(() => {});
            owner.relatedZones.forEach(ngZone => ngZone.run(() => {}));
        }
    }

    increase() {
        this.currentValue++;
        this.updateRelatedWindows();
    }

    decrease() {
        this.currentValue--;
        this.updateRelatedWindows();
    }

    private stopListenWindowClose() {
        this._intervalLifeCycle?.next();
        this._intervalLifeCycle?.complete();
        this._intervalLifeCycle = null;
    }

    private startListenWindowClose() {
        this._intervalLifeCycle = new Subject();

        this._ngZone.runOutsideAngular(() => {
            interval(1000)
                .pipe(takeUntil(this._intervalLifeCycle!))
                .subscribe(() => {
                    if(this._outsourcedWindow?.closed) {
                        this._ngZone.run(() => {
                            this.closeWindow();
                        })
                    }
                });
        })
    }

    openWindow(ngZone: NgZone, externableComponentOwnerService: ExternableComponentOwnerService) {
        this._outsourcedWindow = window.open('http://localhost:4300/externable', '', 'popup=true,left=50,top=150,width=250,height=100');
        (this._outsourcedWindow as unknown as IExternalWindow).owner = {
            window,
            ngZone,
            relatedZones: [],
            singletons: {
                externableComponentOwnerService
            }
        }

        this._outsourced.next(true);
        this.startListenWindowClose();
    }

    closeWindow() {
        this._outsourcedWindow?.close();
        this._outsourcedWindow = null;
        this._outsourced.next(false);
        this.stopListenWindowClose();
    }
}