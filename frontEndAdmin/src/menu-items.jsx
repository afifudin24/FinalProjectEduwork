const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        },
        {
          id: 'categories',
          title: 'Categories',
          type: 'item',
          icon: 'feather icon-folder',
          url: '/categories'
        },
        {
          id: 'tags',
          title: 'Tags',
          type: 'item',
          icon: 'feather icon-tag',
          url: '/tags'
        },
        {
          id: 'deliveryPrice',
          title: 'Delivery Price',
          type: 'item',
          icon: 'feather icon-map',
          url: '/deliveryPrice'
        },
        {
          id: 'products',
          title: 'Products',
          type: 'item',
          icon: 'feather icon-package',
          url: '/products'
        },
        {
          id: 'orders',
          title: 'Orders',
          type: 'item',
          icon: 'feather icon-shopping-cart',
          url: '/orders'
        },
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          icon: 'feather icon-users',
          url: '/users'
        },
        {
          id: 'report',
          title: 'Report',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/report'
        }
      ]
    }
  ]
};

export default menuItems;
