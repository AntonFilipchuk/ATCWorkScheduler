export class ObjectsComparisonHelper {
    public ifTwoObjectsAreEqual(firstObject: any, secondObject: any): boolean {
        return JSON.stringify(firstObject) == JSON.stringify(secondObject);
    }

    public ifArrayHasAnObject(array: any[], obj: any) {
        return array.filter(o => this.ifTwoObjectsAreEqual(o, obj)).length > 0;
    }
}