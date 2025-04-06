import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/todo/today' },
      {
        path: 'todo',
        component: () => import('layouts/TodoListLayout.vue'),
        children: [
          { path: 'all', component: () => import('pages/TodoAll.vue') },
          { path: 'today', component: () => import('pages/TodoToday.vue') },
          { path: 'todos', component: () => import('pages/TodoUncompleted.vue') },
        ],
      },
    ],
  },
  {
    path: '/NotFound',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
