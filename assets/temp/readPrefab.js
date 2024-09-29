function parsePrefab(data) {
    let m1 = {};
    for (let i = 1; i < data.length; i++) {
        let item = {
            name: data[i]._name,
            type: data[i].__type__,
            parent: data[i]._parent?.__id__,
            chilren: data[i]._children?.__id__,
        };
        m1[i + 1] = item;
    }
}
