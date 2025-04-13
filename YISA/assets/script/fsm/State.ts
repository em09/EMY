export interface IState<Tkey>{
    id:Tkey
    onEnter():void;
    onExit():void;
    update(deltaTime:number):void;
    onDestory():void;
    canTransit(to:Tkey):boolean;
}

export interface IMachine<Tkey> {
    add(state:IState<Tkey>);
    remove(id:Tkey);
    update(dt:number);
}

export interface ITransible<Tkey>{
    canTreasitTo(name:Tkey);
}

export class SubMachine<Tkey> implements IMachine<Tkey>, IState <Tkey>, ITransible<Tkey>{
    id:Tkey;
    states:Map<Tkey, IState<Tkey>> = new Map();
    currState:IState<Tkey>;
    defaultState:Tkey;


    add(state: IState<Tkey>) {
        this.states.set(state.id, state);
    }
    remove(id: Tkey) {
        this.states.delete(id);
    }
    update(dt: number) {
       this.currState?.update(dt);
    }
    
    onEnter(): void {
        if(this.defaultState){
            this.canTreasitTo(this.defaultState);
        }
    }
    onExit(): void {
        this.currState?.onExit();
    }
    onDestory(): void {
        this.currState = null;
        this.states.clear();
    }
    canTransit(to: Tkey): boolean {
        return this.currState?.canTransit(to);
    }
    canTreasitTo(name: Tkey) {
        if (this.currState && this.currState.canTransit(name)) {
            return;
        }

        this.currState?.onEnter();
        this.currState = this.states.get(name);
        this.currState?.onEnter();
    }

}

