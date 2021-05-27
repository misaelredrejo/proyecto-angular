export interface MenuItem {
    code: string;
    literal: string;
    label: string;
    link?: string;
    icon?: string;
    items?: MenuItem[];
}
