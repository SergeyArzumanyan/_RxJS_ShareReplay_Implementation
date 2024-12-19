import { map, of, MonoTypeOperatorFunction, Observable, ReplaySubject, Subscriber } from "rxjs";

function _shareReplay<T>(buffer: number): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => {
        const connector: ReplaySubject<T> = new ReplaySubject<T>(buffer);
        const subscriberSub = source.subscribe(value => connector.next(value));
        let refCount = 0;

        return new Observable((subscriber: Subscriber<T>) => {
            refCount++;
            subscriber.add(() => {
                refCount--;
                if (refCount === 0) {
                    subscriberSub.unsubscribe();
                }
            });

            return connector.subscribe(value => subscriber.next(value));
        });
    }
}

const test$ = of([1, 2, 3, 4])
    .pipe(
        map(v => [...v, 555]),
        _shareReplay(1),
    );

test$.subscribe((res) => console.log('res 1111 ---', res));
test$.subscribe((res) => console.log('res 2222222 ---', res));
