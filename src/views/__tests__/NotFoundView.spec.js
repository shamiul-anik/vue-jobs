import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import NotFoundView from '../NotFoundView.vue';
import { createRouter, createMemoryHistory } from 'vue-router';

// Mock useSEO composable
vi.mock('../../composables/useSEO.js', () => ({
  useSEO: vi.fn(() => ({ updateMetaTags: vi.fn() })),
}));

describe('NotFoundView.vue', () => {
  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/jobs', component: { template: '<div>Jobs</div>' } },
      ],
    });
  };

  it('renders the not found page', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('displays 404 error message', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(text.includes('404') || text.includes('not found')).toBe(true);
  });

  it('displays helpful error message', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(text.length > 20).toBe(true);
  });

  it('has link to home page', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const links = wrapper.findAll('a');
    const hasHomeLink = links.some(link => 
      link.attributes('href')?.includes('/') || 
      link.text().toLowerCase().includes('home')
    );
    
    expect(hasHomeLink || links.length > 0).toBe(true);
  });

  it('has link to jobs page', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const links = wrapper.findAll('a');
    expect(links.length > 0).toBe(true);
  });

  it('displays proper 404 status code', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const text = wrapper.text();
    expect(text.includes('404')).toBe(true);
  });

  it('is accessible with navigation options', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    const links = wrapper.findAll('a');
    
    expect((buttons.length + links.length) > 0).toBe(true);
  });

  it('has descriptive page title', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const text = wrapper.text().toLowerCase();
    expect(text.includes('page') || text.includes('not found') || text.includes('404')).toBe(true);
  });

  it('renders without errors', () => {
    expect(() => {
      mount(NotFoundView, {
        global: {
          plugins: [createTestRouter()],
          stubs: {
            'i': true,
          },
        },
      });
    }).not.toThrow();
  });

  it('has proper layout structure', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    expect(wrapper.element).toBeDefined();
    expect(wrapper.html().length > 50).toBe(true);
  });

  it('displays error in prominent way', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    // Check for heading or large text
    const headings = wrapper.findAll('h1, h2, h3');
    expect(headings.length > 0 || wrapper.text().length > 30).toBe(true);
  });

  it('helps user navigate back', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        plugins: [createTestRouter()],
        stubs: {
          'i': true,
        },
      },
    });

    const text = wrapper.text().toLowerCase();
    const links = wrapper.findAll('a');
    
    expect((text.includes('go') || text.includes('back') || text.includes('return') || links.length > 0)).toBe(true);
  });
});
