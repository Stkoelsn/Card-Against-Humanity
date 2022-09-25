const MaxItemsPerPage = 8;

export type Page = {
    indices: number[]
};

export type PageContainer = {
    pages: Page[],
    page: number,
};

export function useMapping<T>(elements: T[]): number[] {
    return elements.map((val, i) => i);
}

type SortType = "default" | "binary" | "string" | "function";
/**
 * comparison utility to help with sorting 
 */
export function useCompareDevice(column: any, reverse: boolean = false, type: SortType = "default") {
    const greater = reverse ? -1 : 1;

    switch (type) {
        case "binary":
            return (a: any, b: any) => {
                if (column(a) === false && column(b) === true)
                    return -greater;
                if (column(a) === true && column(b) === false)
                    return greater;
                return 0;
            };
        default:
        case "default":
            return column instanceof Function ? (a: any, b: any) => {
                if (column(a) < column(b))
                    return -greater;
                if (column(a) > column(b))
                    return greater;
                return 0;
            } : (a: any, b: any) => {
                if (a[column] < b[column])
                    return -greater;
                if (a[column] > b[column])
                    return greater;
                return 0;
            };
        case "function":
            console.assert(column instanceof Function);
            return (a: any, b: any) => {
                return greater * column(a).localeCompare(column(b));
            };
        case "string":
            return (a: any, b: any) => {
                return greater * a[column].localeCompare(b[column]);
            };
    }
}

export function useSortedMapping<T>(elements: T[], callback: (a: T, b: T) => number) {
    const unsortedMapping = useMapping(elements);
    const unwrap = (a: number, b: number) => callback(elements[a], elements[b]);
    const sortedMapping = unsortedMapping.sort(unwrap);
    return sortedMapping;
}

export function usePages<T>(indices: number[], step: number = MaxItemsPerPage): Page[] {
    const size = indices.length;
    const pageCount = Math.floor(size / step) + (size % step > 0 ? 1 : 0);
    var pages: Page[] = [];
    for (var i = 0; i < pageCount; i++) {
        const startIndex = i * step;
        const items = indices.slice(startIndex, Math.min(size, startIndex + step));
        pages.push({
            indices: items
        });
    }
    return pages;
}

export function useMapper<T, T2 = any>(content: T[], pc: PageContainer, mapper: (e: T, i: number) => T2): any {
    if (pc.pages.length > 0 && pc.page >= 0 && pc.page < pc.pages.length) {
        return pc.pages[pc.page].indices.map(i => mapper(content[i], i));
    }
}

export function useUnmapper<T, T2>(content: T2[]) {
    return (i: number) => ({ index: i, ...content[i] });
}

export function useTargetUnmapper<T>(content: any[], accessor: T) {
    const unmap = useUnmapper(content);
    return (i: number) => {
        return {
            originalRow: accessor instanceof Function ? accessor(unmap(i)) : unmap(i)[accessor],
            index: i,
            sub: { subRows: [], depth: 0, data: [] }
        }
    }
}

export class PageContext {

    _container: PageContainer;

    constructor(pc: PageContainer) {
        this._container = pc;
    }

    unwrap(): PageContainer {
        return this._container;
    }

    next(): PageContext {
        this._container.page = Math.min(this._container.page + 1, this._container.pages.length - 1);
        return this;
    }

    previous(): PageContext {
        this._container.page = Math.max(this._container.page - 1, 0);
        return this;
    }

    begin(): PageContext {
        this._container.page = 0;
        return this;
    }

    end(): PageContext {
        this._container.page = Math.max(0, this._container.pages.length - 1);
        return this;
    }
};

export default function usePageContext(pc: PageContainer): PageContext {
    return new PageContext(pc);
}