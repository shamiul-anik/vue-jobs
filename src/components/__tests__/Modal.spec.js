import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Modal from '../Modal.vue';
import { resetMocks } from '../../../vitest.setup.js';

describe('Modal.vue', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('renders the modal component', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        message: 'Test message',
        type: 'alert',
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('shows modal title', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        message: 'Test message',
        type: 'alert',
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: true,
        },
      },
    });
    expect(wrapper.text()).toContain('Test Modal');
    expect(wrapper.text()).toContain('Test message');
  });

  it('does not render when show is false', () => {
    const wrapper = mount(Modal, {
      props: {
        show: false,
        title: 'Test Modal',
        message: 'Test message',
        type: 'alert',
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: true,
        },
      },
    });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });
});
