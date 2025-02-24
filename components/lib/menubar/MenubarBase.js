import { ComponentBase } from '../componentbase/ComponentBase';
import { classNames } from '../utils/Utils';

const classes = {
    start: 'p-menubar-start',
    end: 'p-menubar-end',
    button: 'p-menubar-button',
    root: ({ mobileActiveState }) =>
        classNames('p-menubar p-component', {
            'p-menubar-mobile-active': mobileActiveState
        }),
    separator: 'p-menu-separator',
    icon: 'p-menuitem-icon',
    label: 'p-menuitem-text',
    submenuIcon: 'p-submenu-icon',
    menuitem: ({ item, activeItemState }) => classNames('p-menuitem', { 'p-menuitem-active': activeItemState === item }),
    menu: 'p-menubar-root-list',
    submenu: 'p-submenu-list',
    action: ({ item }) => classNames('p-menuitem-link', { 'p-disabled': item.disabled })
};

const styles = `
.p-menubar {
    display: flex;
    align-items: center;
}

.p-menubar ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.p-menubar .p-menuitem-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    text-decoration: none;
    overflow: hidden;
    position: relative;
}

.p-menubar .p-menuitem-text {
    line-height: 1;
}

.p-menubar .p-menuitem {
    position: relative;
}

.p-menubar-root-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.p-menubar-root-list > li ul {
    display: none;
    z-index: 1;
}

.p-menubar-root-list > .p-menuitem-active > .p-submenu-list {
    display: block;
}

.p-menubar .p-submenu-list {
    display: none;
    position: absolute;
    z-index: 1;
}

.p-menubar .p-submenu-list > .p-menuitem-active > .p-submenu-list {
    display: block;
    left: 100%;
    top: 0;
}

.p-menubar .p-submenu-list .p-menuitem-link .p-submenu-icon {
    margin-left: auto;
}

.p-menubar .p-menubar-custom,
.p-menubar .p-menubar-end {
    margin-left: auto;
    align-self: center;
}

.p-menubar-button {
    display: none;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}
`;

export const MenubarBase = ComponentBase.extend({
    defaultProps: {
        __TYPE: 'Menubar',
        id: null,
        model: null,
        style: null,
        className: null,
        start: null,
        submenuIcon: null,
        menuIcon: null,
        end: null,
        children: undefined
    },
    css: {
        classes,
        styles
    }
});
