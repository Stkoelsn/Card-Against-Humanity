import React, { useRef } from 'react'
import "../assets/table.css"
import {
    mergeProps,
    useFocusRing,
    useTable,
    useTableRowGroup,
    useTableHeaderRow,
    useTableColumnHeader,
    useTableRow,
    useTableSelectionCheckbox,
    useTableSelectAllCheckbox,
    VisuallyHidden,
    useTableCell
} from 'react-aria';
import {
    Cell,
    Column,
    Row,
    TableBody,
    TableHeader,
    useTableState
} from 'react-stately';
import {
    Checkbox
} from './Common';
import { Left } from 'react-bootstrap/lib/Media';

export function TableRowGroup(props: any) {
    let { type, style, children } = props;
    let _ = type;
    let { rowGroupProps } = useTableRowGroup();
    return (
        <tbody {...rowGroupProps} style={style}>
            {children}
        </tbody>
    );
}

export function TableHeaderRow(props: any) {
    let { item, state, children } = props;
    let ref = useRef<HTMLTableRowElement>(null);
    let { rowProps } = useTableHeaderRow(
        { node: item },
        state,
        ref
    );

    return (
        <tr {...rowProps} ref={ref}
        >

            {children}
        </tr>
        
    );
}

export function TableColumnHeader(props: any) {
    let { column, state, style } = props;
    let ref = useRef<HTMLTableCellElement>(null);
    let { columnHeaderProps } = useTableColumnHeader(
        { node: column },
        state,
        ref
    );
    let { isFocusVisible, focusProps } = useFocusRing();
    let arrowIcon = "no";
    /*

    let arrowIcon =
        state.sortDescriptor?.direction === 'ascending'
            //? '▲'
            //: '▼';
            ? "up" : "down";
            */
    let vis: "visible" | "hidden" = "visible"; // = state.sortDescriptor?.column === column.key ? 'visible' : 'hidden';

    return (
        <th
            {...mergeProps(columnHeaderProps, focusProps)}
            colSpan={column.colspan}
            style={style}
            ref={ref}
        >
            {column.rendered}
            {column.props.allowsSorting &&
                (
                    <span
                        aria-hidden="true"
                        style={{
                            padding: '0 2px',
                            visibility: vis
                        }}
                    >
                        {arrowIcon}
                    </span>
                )}
        </th>
    );
}

export function TableRow(props: any) {
    let { item, children, state } = props;
    let ref = useRef<HTMLTableRowElement>(null);
    let isSelected = state.selectionManager.isSelected(
        item.key
    );
    let { rowProps, isPressed } = useTableRow(
        {
            node: item
        },
        state,
        ref
    );
    let { isFocusVisible, focusProps } = useFocusRing();

    return (
        <tr

            {...mergeProps(rowProps, focusProps)}
            ref={ref}
        >
            {children}
        </tr>
    );
}

export function TableCell(props: any) {
    let { cell, state} = props;
    let ref = useRef<HTMLTableCellElement>(null);
    let { gridCellProps } = useTableCell(
        { node: cell },
        state,
        ref
        
    );
   
    let { isFocusVisible, focusProps } = useFocusRing();

    return (
        <td
            {...mergeProps(gridCellProps, focusProps)}

            ref={ref}
        >
            {cell.rendered}
        </td>
    );
}

export function TableCheckboxCell(props: any) {
  let { cell, state } = props;
  let ref = useRef<HTMLTableCellElement>(null);
  let { gridCellProps } = useTableCell(
    { node: cell },
    state,
    ref
  );
  let { checkboxProps } = useTableSelectionCheckbox({
    key: cell.parentKey
  }, state);

  return (
    <td
      {...gridCellProps}
      ref={ref}
    >

      <Checkbox {...checkboxProps} />
    </td>
  );
}

export function TableSelectAllCell(props: any) {
  let { column, state } = props;
  let ref = useRef<HTMLTableCellElement>(null);
  let isSingleSelectionMode =
    state.selectionManager.selectionMode === 'single';
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );
  let { checkboxProps } = useTableSelectAllCheckbox(state);

  return (
    <th
      {...columnHeaderProps}
      ref={ref}
    >
      {state.selectionManager.selectionMode === 'single'
        ? (
          <VisuallyHidden>
            {props['aria-label']}
          </VisuallyHidden>
        )
        : <Checkbox {...checkboxProps} />}
    </th>
  );
}

export function Table(props: any) {
    let { selectionMode, selectionBehavior } = props;
    let state = useTableState({
        ...props,
        showSelectionCheckboxes: selectionMode === 'multiple' &&
            selectionBehavior !== 'replace'
    });

    let ref = useRef<HTMLTableElement>(null);
    let { collection } = state;
    let { gridProps } = useTable(props, state, ref);

    return (
        <table
            {...gridProps}
            ref={ref}
            style={{ borderCollapse: 'collapse' }}
        >
            <TableRowGroup
                type="thead"

            >
                {collection.headerRows.map((headerRow:any) => (
                    <TableHeaderRow
                        key={headerRow.key}
                        item={headerRow}
                        state={state}
                    >
                        {[...headerRow.childNodes].map((column) =>
                            column.props.isSelectionCell
                                ? (
                                    <TableSelectAllCell
                                        key={column.key}
                                        column={column}
                                        state={state}
                                    />
                                )
                                : (
                                    <TableColumnHeader
                                        key={column.key}
                                        column={column}
                                        state={state}
                                  
                                    />
                                )
                        )}
                    </TableHeaderRow>
                ))}
            </TableRowGroup>
            <TableRowGroup type="tbody">
                {[...collection.body.childNodes].map((row) => (
                    <TableRow key={row.key} item={row} state={state}>
                        {[...row.childNodes].map((cell) =>
                            cell.props.isSelectionCell
                                ? (
                                    <TableCheckboxCell
                                        key={cell.key}
                                        cell={cell}
                                        state={state}
                                    />
                                )
                                : (
                                    <TableCell
                                        key={cell.key}
                                        cell={cell}
                                        state={state}
                                    />
                                )
                        )}
                    </TableRow>
                ))}
            </TableRowGroup>
        </table>
    );
}
