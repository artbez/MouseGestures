module gestures {
    export class Gesture {
        name: string;
        key: string[];
        
        constructor(public newName : string, public newKey : string[])
        {
            this.name = newName;
            this.key = newKey;
        }
    }
}
