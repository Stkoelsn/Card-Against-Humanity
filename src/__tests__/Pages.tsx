import "@testing-library/jest-dom";
import "../core/Pages"
import { useCompareDevice, useMapping, useUnmapper, useSortedMapping } from "../core/Pages";

test("testing sorted mapping with accessors", async () => {
    const names = ["hello", "world", "foo", "bar"].map((name, index) => ({a: name, b: index, index: index}));

    const namesByA = [...names].sort((a, b) => a.a.localeCompare(b.a));
    const namesByB = [...names].sort((a, b) => {
        if(a.b < b.b)
            return -1;
        if(a.b > b.b)
            return 1;
        return 0;
    });
    const namesByRA = [...namesByA].reverse();
    const namesByRB = [...namesByB].reverse();

    const sort_functions = {
        "a": useCompareDevice("a"),
        "ra": useCompareDevice("a", true),
        "b": useCompareDevice("b"),
        "rb": useCompareDevice("b", true),
    };

    const mappedA = useSortedMapping(names, sort_functions["a"]).map(useUnmapper(names));
    const mappedB = useSortedMapping(names, sort_functions["b"]).map(useUnmapper(names));
    const mappedRA = useSortedMapping(names, sort_functions["ra"]).map(useUnmapper(names));
    const mappedRB = useSortedMapping(names, sort_functions["rb"]).map(useUnmapper(names));

    expect(mappedA).toEqual(namesByA);
    expect(mappedB).toEqual(namesByB);
    expect(mappedRA).toEqual(namesByRA);
    expect(mappedRB).toEqual(namesByRB);
});
