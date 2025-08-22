import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from '../../../src/components/Dialog';

// Security: Mock Icon component to prevent external dependencies
vi.mock('../../../src/components/Icon', () => ({
  default: ({ icon, className }: { icon: string; className?: string }) => (
    <div data-testid={`icon-${icon}`} className={className}>
      {icon}
    </div>
  ),
}));

describe('Dialog Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Dialog
        isOpen={false}
        onClose={mockOnClose}
        title="Test Dialog"
        message="Dialog content"
        type="info"
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        title="Test Dialog"
        message="Dialog content"
        type="info"
      />
    );

    // Use text-based queries since jsdom dialog role may not work properly
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        title="Test Dialog"
        message="Dialog content"
        type="info"
      />
    );

    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when ESC key is pressed', async () => {
    const user = userEvent.setup();

    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        title="Test Dialog"
        message="Dialog content"
        type="info"
      />
    );

    // Security: Test keyboard navigation
    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render different types with appropriate styling', () => {
    const types = ['info', 'warning', 'error', 'success'] as const;

    types.forEach((type) => {
      const { unmount } = render(
        <Dialog
          isOpen={true}
          onClose={mockOnClose}
          title={`${type} Dialog`}
          message={`${type} content`}
          type={type}
        />
      );

      const dialog = document.querySelector('dialog');
      expect(dialog).toBeInTheDocument();

      // Check for type-specific icon
      expect(
        screen.getByTestId(
          `icon-${
            type === 'info'
              ? 'info-circle'
              : type === 'warning'
                ? 'alert-triangle'
                : type === 'error'
                  ? 'x-circle'
                  : 'check-circle'
          }`
        )
      ).toBeInTheDocument();
      unmount();
    });
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        title="Accessible Dialog"
        message="Accessible content"
        type="info"
      />
    );

    const dialog = document.querySelector('dialog');

    // Security: Verify accessibility attributes
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');

    const closeButton = screen.getByLabelText('Close dialog');
    expect(closeButton).toHaveAttribute('aria-label', 'Close dialog');
  });

  it('should prevent backdrop click from closing dialog', async () => {
    const user = userEvent.setup();

    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        title="Test Dialog"
        message="Dialog content"
        type="info"
      />
    );

    const dialog = document.querySelector('dialog');

    // Security: Click on backdrop should not close dialog (prevents accidental closure)
    if (dialog) {
      await user.click(dialog);
    }

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
