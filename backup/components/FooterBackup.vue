<template>
	<div class="bg-slate-50 dark:bg-slate-950 py-16 border-t border-slate-200 dark:border-slate-900 transition-colors" v-reveal>
		<div class="container mx-auto px-4 md:px-6">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
				<div class="col-span-1 md:col-span-1">
					<div class="flex items-center space-x-2 mb-6">
						<svg class="w-6 h-6" viewBox="0 0 128 128">
							<path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" />
							<path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76.5L102.4,10H78.8z" />
						</svg>
						<span class="font-bold text-xl tracking-tight">Vue Jobs</span>
					</div>
					<p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
						The #1 job board for Vue.js developers and companies looking to hire talent.
					</p>
					<div class="flex space-x-4 mt-6">
						<a v-for="social in socialLinks" :key="social.icon" :href="social.url" class="text-slate-400 hover:text-vue-green transition-colors text-lg">
							<i :class="social.icon"></i>
						</a>
					</div>
				</div>

				<div>
					<h4 class="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">For Candidates</h4>
					<ul class="space-y-4 text-sm">
						<li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Browse Jobs</a></li>
						<li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Remote Jobs</a></li>
						<li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Create Alerts</a></li>
						<li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Candidate Login</a></li>
					</ul>
				</div>

				<div>
					<h4 class="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">For Employers</h4>
					<ul class="space-y-4 text-sm">
						<li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Post a Job</a></li>
						<li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Pricing</a></li>
						<li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Hiring Solutions</a></li>
						<li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Company Login</a></li>
					</ul>
				</div>

				<div>
					<h4 class="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">Newsletter</h4>
					<p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Get the latest Vue.js jobs delivered weekly.</p>
					<div class="flex">
						<input type="email" placeholder="Email" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-l-lg px-3 py-2 text-sm focus:outline-none">
						<button class="bg-vue-green text-white px-4 py-2 rounded-r-lg hover:bg-[#3aa675] transition-colors"><i class="fas fa-paper-plane"></i></button>
					</div>
				</div>
			</div>

			<div class="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-500">
				<p class="mb-4 md:mb-0">&copy; {{ new Date().getFullYear() }} VueJobs.com. Built by the community.</p>
				<div class="flex space-x-6">
					<a href="#" class="hover:text-vue-green transition-colors">Privacy</a>
					<a href="#" class="hover:text-vue-green transition-colors">Terms</a>
					<a href="#" class="hover:text-vue-green transition-colors">Cookies</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const socialLinks = [
	{ icon: 'fab fa-twitter', url: '#' },
	{ icon: 'fab fa-github', url: 'https://github.com/shamiul-anik/vue-jobs' },
	{ icon: 'fab fa-slack', url: '#' },
	{ icon: 'fab fa-linkedin', url: '#' }
];

const vReveal = {
	mounted(el) {
		el.classList.add('reveal-hidden');
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					el.classList.add('reveal-visible');
					observer.unobserve(el);
				}
			});
		}, { threshold: 0.1 });
		observer.observe(el);
	}
};
</script>

<style scoped>
.reveal-hidden {
	opacity: 0;
	transform: translateY(20px);
	transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-visible {
	opacity: 1;
	transform: translateY(0);
}
</style>
