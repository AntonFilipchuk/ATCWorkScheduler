export class ObjectsComparisonHelper {
    public ifTwoObjectsAreEqual(firstObject: object, secondObject: object): boolean {
        return JSON.stringify(firstObject) == JSON.stringify(secondObject);
    }

    public ifArrayHasAnObject(array: any[], obj: any) {
        return array.filter(o => this.ifTwoObjectsAreEqual(o, obj)).length > 0;
    }
}