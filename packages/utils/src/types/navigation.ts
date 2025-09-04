export type NavigationUserRole = 'admin' | 'manager' | 'staff' | 'stylist' | 'customer' | 'client' | 'guest';

export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  badge?: string | number;
  external?: boolean;
  roles?: NavigationUserRole[];
  children?: NavigationItem[];
  disabled?: boolean;
}

export interface NavigationGroup {
  name: string;
  items: NavigationItem[];
  roles?: NavigationUserRole[];
  collapsible?: boolean;
}

export interface UserNavigation {
  main: NavigationItem[];
  secondary?: NavigationItem[];
  user?: NavigationItem[];
  admin?: NavigationItem[];
}

export interface NavigationBreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

export interface NavigationConfig {
  [key: string]: {
    navigation: UserNavigation;
    breadcrumbs?: NavigationBreadcrumbItem[];
  };
}
