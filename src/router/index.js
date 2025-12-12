import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import JobsView from "../views/JobsView.vue";
import JobView from "../views/JobView.vue";
import AddJobView from "../views/AddJobView.vue";
import EditJobView from "../views/EditJobView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/jobs",
      name: "jobs",
      component: JobsView,
    },
    {
      path: "/jobs/:id",
      name: "job",
      component: JobView,
    },
    {
      path: "/add-job",
      name: "add-job",
      component: AddJobView,
    },
    {
      path: "/edit-job/:id",
      name: "edit-job",
      component: EditJobView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

export default router;
