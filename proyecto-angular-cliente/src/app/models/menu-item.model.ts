export interface MenuItem {
    code: string;
    literal: string;
    label: string;
    cntCommentsSubPath: number;
    link?: string;
    icon?: string;
    items?: MenuItem[];
}
