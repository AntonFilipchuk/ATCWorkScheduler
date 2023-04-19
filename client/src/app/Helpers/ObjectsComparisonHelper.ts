export class ObjectsComparisonHelper {
    public ifTwoObjectsAreEqual(firstObject: object, secondObject: object): boolean {
        return JSON.stringify(firstObject) == JSON.stringify(secondObject);
    }

    public ifArrayHasDuplicateObject(array: any[], obj: any) {
        return array.filter(o => this.ifTwoObjectsAreEqual(o, obj)).length > 0;
    }
}