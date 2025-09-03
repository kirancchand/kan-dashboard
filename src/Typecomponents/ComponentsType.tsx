import { ApexOptions } from "apexcharts";
//******Chart Js Start *********/
import type { ChartData, ChartOptions } from 'chart.js';
import { CSSProperties, Dispatch, MouseEventHandler, ReactNode, SetStateAction } from "react";
import { AccordionItemProps, AccordionProps, CollapseProps } from "reactstrap";
import { CSSModule } from "reactstrap/types/lib/utils";
/***************************************Button Types and InterFaces *****************************************************/
type ButtonStyle = 'defaultButtons' | 'roundedButtons' | 'softButtons' | 'ghostButtons' | 'gradientButtons' | 'borderButtons';
type ButtonContent = 'iconButton' | 'labelButton';
type ButtonType = 'submit' | 'button' | 'reset';
type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'dark' | 'link' | 'light';
type LoadingType = 'rotate' | 'grow'


export interface ButtonProps {
    buttonStyle?: ButtonStyle;
    buttonContent?: ButtonContent;
    buttonType?: ButtonType;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    key?: string;
    disabled?: boolean;
    outline?: boolean;
}
export interface CustomButtonProps {
    buttonStyle?: ButtonStyle;
    buttonContent?: ButtonContent;
    buttonType?: ButtonType;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    onMouseOver?: MouseEventHandler<HTMLButtonElement>;
    key?: string;
    disabled?: boolean;
    outline?: boolean;
    text?: string;
    color?: Color;
    icon?: string;
    iconSide?: 'left' | 'right'
    style?: CSSProperties
}
export interface LoadingButtonProps {
    color?: string
    onClick?: MouseEventHandler<HTMLButtonElement>;
    onMouseOver?: MouseEventHandler<HTMLButtonElement>;
    key?: string;
    disabled?: boolean;
    loadingType?: LoadingType;
    text?: string;
    outline?: boolean;
}

/********************************************************************************************************************************/

/**************************************************Chart types and interfaces*************************************************/






type AxisChartType = "line" | "area" | "bar" | "scatter" | "bubble" | "candlestick" | "heatmap";
type NonAxisChartType = "pie" | "donut" | "radialBar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";
type ApexAxisChartSeries = {
    name?: string
    type?: string
    color?: string
    group?: string
    hidden?: boolean
    zIndex?: number
    data:
    | (number | null)[]
    | {
        x: any;
        y: any;
        fill?: ApexFill;
        fillColor?: string;
        strokeColor?: string;
        meta?: any;
        goals?: any;
        barHeightOffset?: number;
        columnWidthOffset?: number;
    }[]
    | [number, number | null][]
    | [number, (number | null)[]][]
    | number[][];
}[]

type ApexNonAxisChartSeries = number[]


export type ChartType = AxisChartType | NonAxisChartType;
export interface ApexChartProps<T extends ChartType> {
    type: T;
    dir?: 'ltr' | 'rtl'
    height?: number;
    width?: number;
    color?: Array<'--vz-primary' | '--vz-secondary' | '--vz-success' | '--vz-info' | '--vz-warning' | '--vz-danger' | '--vz-dark' | '--vz-link' | '--vz-light'>;
    option?: ApexOptions;
    seriesData: T extends AxisChartType ? ApexAxisChartSeries : ApexNonAxisChartSeries;
    key?: string
    // id: string;
    // name: string


}

//**************Apex End *******/


type ChartJsType = 'line' | 'bar' | 'radar' | 'doughnut' | 'polarArea' | 'pie'
export interface ChartJsProps {
    type: ChartJsType;
    data: ChartData;
    option: ChartOptions;
    width?: number;
    height?: number;
    // colors?: Array<'--vz-primary' | '--vz-secondary' | '--vz-success' | '--vz-info' | '--vz-warning' | '--vz-danger' | '--vz-dark' | '--vz-link' | '--vz-light'>;


}
//******Chart Js Ends *********/

/**********************Alerts */

export interface AlertsPros {
    color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'dark' | 'link' | 'light';
    children: ReactNode;
    // clickEvent?: MouseEventHandler<HTMLDivElement>; 
    fade?: boolean;
}




export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
    [key: string]: any;
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'dark' | 'link' | 'light';
    pill?: boolean;
    tag?: React.ElementType;
    innerRef?: React.Ref<HTMLElement>;
    cssModule?: CSSModule;
    type: 'default' | 'soft' | 'outline' | 'softBorder' | 'label' | 'gradient'
    style?: CSSProperties

}

export interface CommonCarouselProps extends React.HTMLAttributes<HTMLElement> {
    [key: string]: any;
    activeIndex?: number;
    keyboard?: boolean;
    pause?: 'hover' | false;
    ride?: 'carousel';
    interval?: number | string | boolean;
    mouseEnter?: () => void;
    mouseExit?: () => void;
    slide?: boolean;
    dark?: boolean;
    fade?: boolean;
    cssModule?: CSSModule;
    enableTouch?: boolean;
}
export interface Carouselitems {

    altText: string,
    caption: string,
    key: number,
    src: string,

}

export interface CarouselProps {
    items: Carouselitems[];
    controls?: boolean;
    indicators?: boolean;
    interval?: number
}


export interface Dropdownprops {
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'dark' | 'link' | 'light';
    label?: string,
    data: string[]
    onClick: (x: string) => void
}

export interface ModalProps {

    size?: 'sm' | 'md' | 'lg' | 'xl';
    isOpen: boolean;
    toggle: Dispatch<SetStateAction<boolean>>;
    backdrop?: boolean;
    scrollable?: boolean;
    centered?: boolean
    modalHeading?: ReactNode;
    modalBody?: ReactNode;
    modalFooter?: ReactNode

}

export interface TabProps {
    type?: 'default' | 'cardHeader' | 'customborder' | 'arrownav' | 'customNav' | 'coloredNav'
    justify?: boolean
    navItem: string[]
    tabcontent: ReactNode[]
    pills?: boolean
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'dark' | 'link' | 'light';

}

export interface AccordionProp extends AccordionProps { }

export interface AccordionItemProp extends AccordionItemProps { }
export interface CollapseProp extends CollapseProps { }



export interface TableContainerProps {
    columns?: any;
    data?: any;
    isGlobalFilter?: any;
    handleTaskClick?: any;
    customPageSize?: any;
    tableClass?: any;
    theadClass?: any;
    trClass?: any;
    thClass?: any;
    divClass?: any;
    page?: any;
    sizePerPage?: any;
    totalCount?: any;
    sorting?: any;
    setSorting?: any;
    loading?: any;
    stripped?: boolean;
    bordered?: boolean;
    tableProps?: any;
    SearchPlaceholder?: any;
    handleLeadClick?: any;
    handleCompanyClick?: any;
    handleContactClick?: any;
    handleTicketClick?: any;
    handleTableChange?: any;
    rowColor?: any;
    openRow?:boolean;
    clickable?: any;
    getRowData?: any;
    useExpand?:boolean;
    expandedRowIds?: any;
    renderExpandedRow?: any;
}

export interface SortInterface {
    columnName: string;
    sortOrder: string;
}

export interface SortTanstackInterface {
    id: any;
    desc: boolean;
}
export interface AnalyticsLoader {
    vHeight: any;
    fontColor: string;
    fontSize: number;
    text1: string;
    text2: string;
}
