export class ObjectsComparisonHelper {
    public ifTwoObjectsAreEqual(firstObject: any, secondObject: any): boolean {
        return JSON.stringify(firstObject) == JSON.stringify(secondObject);
    }

    public ifTwoObjectsAreEqualByProperty(firstObject: any, secondObject: any, property: any): boolean {
        return firstObject.property === secondObject.property;
    }

    public ifArrayHasAnObject(array: any[], obj: any): boolean {
        return array.filter(o => this.ifTwoObjectsAreEqual(o, obj)).length > 0;
    }

    public ifArrayHasAnObjectByProperty(array: any[], obj: any, property: any): boolean {
        return array.filter(o => this.ifTwoObjectsAreEqualByProperty(o, obj, property)).length > 0;
    }
}