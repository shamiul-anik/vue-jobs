import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/jobs",
      name: "jobs",
      component: () => import("../views/JobsView.vue"),
    },
    {
      path: "/jobs/:id",
      name: "job",
      component: () => import("../views/JobView.vue"),
    },
    {
      path: "/add-job",
      name: "add-job",
      component: () => import("../views/AddJobView.vue"),
    },
    {
      path: "/edit-job/:id",
      name: "edit-job",
      component: () => import("../views/EditJobView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
